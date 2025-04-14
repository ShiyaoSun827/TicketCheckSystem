//src/app/signin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/auth-actions";
import { auth } from "@/lib/auth";

// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

export default function SignInPage() {

  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSignIn(formData: FormData) {
    const result = await signInWithEmail(formData);

    setMessage(result.message);
    console.log("Detailed Sign-in Result:", result);
    if (result.success) {
      try {
        // // 把 token 保存到浏览器 cookie中
        // Cookies.set("auth_token", result.token, {
        //   path: "/",
        //   secure: true,
        //   sameSite: "Strict",
        //   expires: 1, // 单位是天
        // });
        // // 设置 session
        // await authClient.setSession(result.token);
        // console.log("Setting session...");
        console.log("✅ Session set successfully");
      } catch (err) {
        console.error("Error setting session:", err);
      }
      router.push("/dashboard/user");
    }
  }

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Sign In</h1>
      <form action={handleSignIn} className="flex flex-col space-y-4">
        <label>Email:</label>
        <input type="email" name="email" className="border p-2" required />
        <label>Password:</label>
        <input type="password" name="password" className="border p-2" required />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Sign In
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </>
  );
}