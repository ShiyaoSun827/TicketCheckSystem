// src/app/api/auth/set-session/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const res = NextResponse.json({ success: true });

  // ✅ 如果你想从服务器设置 cookie（可选）
  res.cookies.set("auth_token", token, {
    httpOnly: false,
    maxAge: 60 * 60, // 1 hour
    path: "/",
    secure: false,
    sameSite: "Strict",
  });

  return res;
}
