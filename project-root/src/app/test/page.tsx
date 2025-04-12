// src/app/test/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Welcome</h1>
      <div className="flex space-x-4">
        <Link href="/signup">
          <button className="bg-green-500 text-white p-2 rounded">
            Sign Up
          </button>
        </Link>
        <Link href="/signin">
          <button className="bg-blue-500 text-white p-2 rounded">
            Sign In
          </button>
        </Link>
      </div>
    </>
  );
}
