// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: `${baseURL}/api/auth`,
  paths: {
    signUpEmail: "/signup/email",
    signInEmail: "/signin/email"
  }
});
