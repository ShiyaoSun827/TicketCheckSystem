// src/components/NavBar.tsx
"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NavBarClient from "@/components/NavBarClient";

export default async function NavBar() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  return <NavBarClient session={session} />;
}