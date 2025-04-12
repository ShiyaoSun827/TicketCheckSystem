// lib/auth-actions.ts
"use server";

import { authClient } from "@/lib/auth-client";

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/dashboard"
  });

  console.log("Sign-in response:", { data, error });

  if (error || !data) {
    return {
      success: false,
      message: error?.message || "An unexpected error occurred",
    };
  }

  // 明确返回成功标记
  return {
    success: true,
    message: "Sign-in successful!",
    redirectTo: "/dashboard" // 推荐显式指定跳转路径
  };
}
