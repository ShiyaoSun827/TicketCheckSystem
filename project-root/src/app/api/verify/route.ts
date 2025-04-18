// src/app/api/verify/route.ts (or /pages/api/verify.ts if using pages router)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const user = await prisma.user.updateMany({
    where: { email },
    data: { emailVerified: true },
  });

  return new Response(`
    <html>
      <head>
        <meta http-equiv="refresh" content="3; url=/" />
      </head>
      <body>
        <h1>  Email Verified!</h1>
        <p>You can now sign in. Redirecting to homepage...</p>
      </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html" },
  });
}

