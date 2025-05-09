//src/app/dashboard/admin/ShowManager.tsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Default seating layout for each performance: 8 rows × 10 columns
const NUM_ROWS = 8;
const NUM_COLS = 10;

/**
 * create session and session seat
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

  const endTime = new Date(beginTime.getTime() + movie.length * 60 * 1000);

  // create Show and Seat
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
