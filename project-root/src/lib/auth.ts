//lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins"

admin({
  adminRoles: ["admin", "superadmin"],
});

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    verification: {
      enabled: true,
    }
  },
   // ✅ Add the cookie plugin here — LAST!
   plugins: [nextCookies(),admin() ],
   
});



