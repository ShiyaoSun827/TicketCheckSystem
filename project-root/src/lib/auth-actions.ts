//src/app/api/auth/actions.ts
"use server";

import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";


export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const { data, error } = await authClient.signUp.email({
    email,
    password,
    name,
  });

  if (error) {
    return {
      success: false,
      message: `Error: ${error.message || "Sign-up failed"}`,
    };
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // ✅ Construct verification link
  const verificationUrl = `${baseUrl}/api/verify?email=${encodeURIComponent(email)}`;
  // ✅ Send email
  await sendVerificationEmail(
    email,
    "Verify your email",
    `
      <p>Hello ${name},</p>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `
  );

  return {
    success: true,
    message: "Sign-up successful! Please check your email to verify your account.",
    redirectTo: "/",
  };
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await auth.api.signInEmail({
    body: { email, password },
  });

  console.log("Sign-in result:", result);

  if (!result || !result.token) {
    return {
      success: false,
      message: "Sign-in failed or invalid credentials",
    };
  }

  const userData = await prisma.user.findUnique({
    where: { id: result.user.id },
  });

  if (!userData) {
    return {
      success: false,
      message: "❌ User not found.",
    };
  }

  const role = userData.role || "user";

  // ✅ Only users with role 'user' must verify email
  if (role === "user" && !userData.emailVerified) {
    return {
      success: false,
      message: "❌ Please verify your email before signing in.",
    };
  }

  let targetUrl = "/dashboard/user";
  if (role === "admin") {
    targetUrl = "/dashboard/admin";
  } else if (role === "staff") {
    targetUrl = "/dashboard/staff";
  }

  return {
    success: true,
    message: "Sign-in successful!",
    redirectTo: targetUrl,
  };
}

