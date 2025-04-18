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

        if (!email.includes("@") &&(!email.includes(".com")||!email.includes(".ca")) ) {
            setEmailError("❌ Please enter a valid email (must contain @, .com or .ca)");
            return;
        }

        if (password.length < 8) {
            setPasswordError("❌ Password must be at least 8 characters long");
            return;
        }

        const result = await signUpWithEmail(formData);
        setFormMessage(result.message);



        if (result.success && result.redirectTo) {
            setFormMessage("✅ Signup successful! Please check your email to verify your account.");
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
                    <h1 className="text-3xl font-bold text-center">📝 Create a New Account</h1>

                    <form action={handleSignUp} className="flex flex-col space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
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
                            <label className="block text-sm font-medium text-gray-700">Password (at least 8 characters)</label>
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
                            <label className="block text-sm font-medium text-gray-700">Display Name</label>
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
                            Sign Up
                        </button>
                    </form>

                    {formMessage && (
                        <p className="text-center text-sm text-green-600">{formMessage}</p>
                    )}

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?
                        <Link href="/signin" className="text-blue-600 hover:underline ml-1">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}