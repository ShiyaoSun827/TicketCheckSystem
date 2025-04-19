// src/scripts/seed-show.mjs
import { PrismaClient } from "@prisma/client";
import { createShowWithSeats } from "./show-utils.mjs";

const prisma = new PrismaClient();

async function seedShows() {
  const movies = await prisma.movie.findMany();
  if (!movies.length) {
    console.error("❌ 没有找到任何电影，请先运行 seed-movie 脚本");
    return;
  }

  const baseDate = new Date("2025-04-20T18:00:00");

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const baseTime = new Date(baseDate.getTime() + i * 86400000); // 每部电影相隔一天

    try {
      // Draft
      await createShowWithSeats({
        movieID: movie.id,
        beginTime: baseTime,
        price: 5,
        status: "DRAFT",
      });

      // Published
      await createShowWithSeats({
        movieID: movie.id,
        beginTime: new Date(baseTime.getTime() + 3 * 3600000),
        price: 6,
        status: "PUBLISHED",
      });

      // Cancelled (now using status)
      await createShowWithSeats({
        movieID: movie.id,
        beginTime: new Date(baseTime.getTime() + 6 * 3600000),
        price: 4,
        status: "CANCELLED", // ✅ 替代 cancelled: true
      });

      console.log(`✅ Done for movie: ${movie.name}`);
    } catch (err) {
      console.error(`❌ Failed for ${movie.name}:`, err.message);
    }
  }

  await prisma.$disconnect();
}

seedShows().catch((err) => {
  console.error("❌ Global fail:", err);
  prisma.$disconnect();
  process.exit(1);
});
