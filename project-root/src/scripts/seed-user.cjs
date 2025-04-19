"use strict";

const fetch = require("node-fetch"); // npm install node-fetch@2
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const users = [
  { email: "seed1@example.com", password: "password123", name: "SeedUser1" },
  { email: "seed2@example.com", password: "password123", name: "SeedUser2" },
  { email: "seed3@example.com", password: "password123", name: "SeedUser3" },
];

async function seedUsers() {
  for (const user of users) {
    const formData = new URLSearchParams();
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("name", user.name);

    try {
      const res = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        await prisma.user.update({
          where: { email: user.email },
          data: { emailVerified: true },
        });

        console.log(`✅ Registered + Verified: ${user.email}`);
      } else {
        console.log(`⚠️ Skipped ${user.email}: ${result.message}`);
      }
    } catch (err) {
      console.error(`❌ Error registering ${user.email}:`, err.message);
    }
  }

  await prisma.$disconnect();
}

seedUsers()
  .then(() => {
    console.log("🎉 User seeding complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Script failed:", err);
    process.exit(1);
  });
