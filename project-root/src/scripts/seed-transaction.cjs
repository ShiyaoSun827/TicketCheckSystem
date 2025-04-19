//src/scripts/seed-user.cjs
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
      console.log("❌ 没有非管理员用户，请先注册一些用户");
      return;
    }

    for (const user of users) {
      // 若无钱包则创建一个
      let wallet = user.Wallet;

      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            userId: user.id,
            balance: 0,
          },
        });
        console.log(`💼 为用户 ${user.email} 创建新钱包`);
      }

      const baseNote = `用户 ${user.email}`;

      await prisma.walletTransaction.createMany({
        data: [
          {
            walletId: wallet.id,
            type: "RECHARGE",
            amount: 100.0,
            note: `${baseNote} 手动充值`,
          },
          {
            walletId: wallet.id,
            type: "PAYMENT",
            amount: -45.0,
            note: `${baseNote} 电影购票`,
          },
          {
            walletId: wallet.id,
            type: "REFUND",
            amount: 30.0,
            note: `${baseNote} 退票退款`,
          },
        ],
        skipDuplicates: true,
      });

      console.log(`✅ 为 ${user.email} 插入了 3 条交易记录`);
    }

    console.log("🎉 WalletTransaction 数据插入完毕！");
  } catch (err) {
    console.error("❌ 出错:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedTransactions();
