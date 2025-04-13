"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/auth-actions";

export default function SignInPage() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSignIn(formData: FormData) {
    const result = await signInWithEmail(formData);
    setMessage(result.message);
    console.log("Detailed Sign-in Result:", result);

    if (result.success) {
      setTimeout(() => router.push("/dashboard"), 3000);
    }
  }

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Sign In</h1>
      <form action={handleSignIn} className="flex flex-col space-y-4">
        <label>Email:</label>
        <input type="email" name="email" className="border p-2" required />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          className="border p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Sign In
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </>
  );
}
