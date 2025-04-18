// src/scripts/show-utils.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createShowWithSeats({
  movieID,
  beginTime,
  price,
  status = "DRAFT",
  cancelled = false,
}) {
  const movie = await prisma.movie.findUnique({ where: { id: movieID } });
  if (!movie) throw new Error("电影不存在");

  const endTime = new Date(beginTime.getTime() + movie.length * 1000);

  const newShow = await prisma.show.create({
    data: {
      movieID,
      beginTime,
      endTime,
      price,
      status,
      cancelled,
    },
  });

  await prisma.seat.createMany({
    data: Array.from({ length: 8 * 10 }, (_, i) => {
      const row = String.fromCharCode(65 + Math.floor(i / 10));
      const col = (i % 10) + 1;
      return { showId: newShow.id, row, col };
    }),
  });

  return newShow;
}
