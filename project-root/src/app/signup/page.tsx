"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUpWithEmail } from "@/lib/auth-actions";
import NavBarClient from "@/components/NavBarClient";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const router = useRouter();

  async function handleSignUp(formData: FormData) {
    setEmailError("");
    setPasswordError("");
    setFormMessage("");

    if (!email.includes("@") || !email.includes(".com")) {
      setEmailError("❌ 请输入有效邮箱（需包含 @ 和 .com）");
      return;
    }

    if (password.length < 8) {
      setPasswordError("❌ 密码至少需要 8 位字符");
      return;
    }

    const result = await signUpWithEmail(formData);
    setFormMessage(result.message);

    if (result.success && result.redirectTo) {
      setTimeout(() => {
        router.push(result.redirectTo!);
      }, 2000);
    }
  }

  return (
    <>
      <NavBarClient />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold text-center">📝 注册新账号</h1>

          <form action={handleSignUp} className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">邮箱</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                required
              />
              {emailError && (
                <p className="text-sm text-red-600 mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">密码（至少8位）</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                required
              />
              {passwordError && (
                <p className="text-sm text-red-600 mt-1">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">昵称</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              注册
            </button>
          </form>

          {formMessage && (
            <p className="text-center text-sm text-green-600">{formMessage}</p>
          )}

          <p className="text-center text-sm text-gray-600">
            已有账号？
            <Link href="/signin" className="text-blue-600 hover:underline ml-1">
              去登录
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
