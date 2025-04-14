// scripts/seed-admin.cjs
const fetch = require("node-fetch");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const API_URL = "http://localhost:3000/api/auth/sign-up/email";

async function seedAdmin() {
  const email = "admin@example.com";
  const password = "admin123";
  const name = "Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("⚠️ Seed admin already exists.");
    return;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ Failed to create seed admin:", data);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });

  console.log("✅ Seed admin account created & promoted via API + Prisma. Name is Admin. Role is admin.");
  await prisma.$disconnect();
}

seedAdmin().catch((err) => {
  console.error("❌ Seed error:", err);
  prisma.$disconnect();
  process.exit(1);
});
