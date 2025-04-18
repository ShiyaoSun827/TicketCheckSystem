// src/app/signin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/auth-actions";
import NavBarClient from "@/components/NavBarClient";
import Link from "next/link";

export default function SignInPage() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSignIn(formData: FormData) {
    try {
      const result = await signInWithEmail(formData);
      setMessage(result.message);
      console.log("Detailed Sign-in Result:", result);
      if (result.success) {
        console.log("✅ Session set successfully");
        router.push(result.redirectTo);
      } else {
        console.error("Sign-in failed:", result.message);
        router.push("/signin");
      }
    } catch (error: any) {
      setMessage("Login failed, Reason: " + error.message);
      router.push("/signin");
    }
  }

  return (
    <>
      <NavBarClient />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold text-center">🔐 Sign In</h1>

          <form action={handleSignIn} className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" required className="w-full border p-2 rounded mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" required className="w-full border p-2 rounded mt-1" />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
              Sign In
            </button>
          </form>

          {message && <p className="text-center text-red-600 text-sm">{message}</p>}

          <p className="text-center text-sm text-gray-600">
            没有账号？
            <Link href="/signup" className="text-blue-600 hover:underline ml-1">
              注册一个新账号
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
