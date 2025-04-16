//src/scripts/seed-show.cjs
"use strict";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedShows() {
  const movies = await prisma.movie.findMany();

  if (!movies.length) {
    console.error("❌ 没有找到任何电影，请先运行 seed-movie 脚本");
    return;
  }

  const showData = [];

  const baseDate = new Date("2025-04-20T18:00:00");
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];

    const dayOffset = i;
    const baseTime = new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);

    // DRAFT
    showData.push({
      beginTime: new Date(baseTime),
      endTime: new Date(baseTime.getTime() + movie.length * 1000),
      movieID: movie.id,
      status: "DRAFT",
      price: 0,
      cancelled: false,
    });

    // PUBLISHED
    const publishedBegin = new Date(baseTime.getTime() + 3 * 60 * 60 * 1000);
    showData.push({
      beginTime: publishedBegin,
      endTime: new Date(publishedBegin.getTime() + movie.length * 1000),
      movieID: movie.id,
      status: "PUBLISHED",
      price: 0,
      cancelled: false,
    });

    // CANCELLED
    const cancelledBegin = new Date(baseTime.getTime() + 6 * 60 * 60 * 1000);
    showData.push({
      beginTime: cancelledBegin,
      endTime: new Date(cancelledBegin.getTime() + movie.length * 1000),
      movieID: movie.id,
      status: "PUBLISHED",
      price: 0,
      cancelled: true,
    });
  }

  for (const show of showData) {
    try {
      await prisma.show.create({ data: show });
      console.log(`✅ Created show: ${show.status} for movie ${show.movieID}`);
    } catch (err) {
      console.error("❌ Failed to create show:", show, err.message);
    }
  }

  await prisma.$disconnect();
}

seedShows().catch((e) => {
  console.error("❌ Script failed:", e);
  prisma.$disconnect();
  process.exit(1);
});
