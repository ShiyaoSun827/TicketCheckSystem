//src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { signUpWithEmail } from "@/lib/auth-actions";

export default function SignUpPage() {
  const [message, setMessage] = useState("");

  async function handleSignUp(formData: FormData) {
    const result = await signUpWithEmail(formData);
    setMessage(result.message);
  }

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Sign Up</h1>
      <form action={handleSignUp} className="flex flex-col space-y-4">
        <label>Email:</label>
        <input type="email" name="email" className="border p-2" required />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          className="border p-2"
          required
        />
        <label>Name:</label>
        <input type="text" name="name" className="border p-2" required />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </>
  );
}
