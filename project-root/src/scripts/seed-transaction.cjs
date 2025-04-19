// src/scripts/seed-user.cjs
"use strict";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedTransactions() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { not: "ADMIN" },
      },
      include: {
        Wallet: true,
      },
    });

    if (users.length === 0) {
      console.log("❌ No non-admin users found. Please register some users first.");
      return;
    }

    for (const user of users) {
      // Create a wallet if not exists
      let wallet = user.Wallet;

      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            userId: user.id,
            balance: 0,
          },
        });
        console.log(`💼 Created new wallet for user ${user.email}`);
      }

      const baseNote = `User ${user.email}`;

      await prisma.walletTransaction.createMany({
        data: [
          {
            walletId: wallet.id,
            type: "RECHARGE",
            amount: 100.0,
            note: `${baseNote} manual recharge`,
          },
          {
            walletId: wallet.id,
            type: "PAYMENT",
            amount: -45.0,
            note: `${baseNote} movie ticket payment`,
          },
          {
            walletId: wallet.id,
            type: "REFUND",
            amount: 30.0,
            note: `${baseNote} ticket refund`,
          },
        ],
        skipDuplicates: true,
      });

      console.log(`✅ Inserted 3 transactions for ${user.email}`);
    }

    console.log("🎉 WalletTransaction seeding completed.");
  } catch (err) {
    console.error("❌ Error occurred:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedTransactions();
