//src/app/dashboard/admin/ShowManager.tsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 默认的每场的座位布局：8 行 × 10 列
const NUM_ROWS = 8;
const NUM_COLS = 10;

/**
 * 创建一场排片，并自动生成座位。
 * @param {{
 *   movieID: string,
 *   beginTime: Date,
 *   price: number,
 *   status: "DRAFT" | "PUBLISHED" | "CANCELLED"
 * }} options
 */
export async function createShowWithSeats({
  movieID,
  beginTime,
  price,
  status = "DRAFT",
}) {
  const movie = await prisma.movie.findUnique({ where: { id: movieID } });
  if (!movie) throw new Error("Movie not found");

  const endTime = new Date(beginTime.getTime() + movie.length * 60 * 1000); // 以电影时长推算结束时间

  // 创建 Show 及其 Seat（事务处理）
  const result = await prisma.$transaction(async (tx) => {
    const show = await tx.show.create({
      data: {
        movieID,
        beginTime,
        endTime,
        price,
        status,
      },
    });

    const seatData = [];

    for (let r = 0; r < NUM_ROWS; r++) {
      const row = String.fromCharCode(65 + r); // A, B, C...
      for (let c = 1; c <= NUM_COLS; c++) {
        seatData.push({
          showId: show.id,
          row,
          col: c,
        });
      }
    }

    await tx.seat.createMany({ data: seatData });

    return show;
  });

  return result;
}
