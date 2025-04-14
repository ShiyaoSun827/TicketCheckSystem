// src/hooks/useSession.ts
"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });
  return session;
}
