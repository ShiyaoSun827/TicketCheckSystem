// src/lib/session.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type AuthUser = {
  id: string;
  role: string;
  email?: string;
};

export async function getUserFromSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}
