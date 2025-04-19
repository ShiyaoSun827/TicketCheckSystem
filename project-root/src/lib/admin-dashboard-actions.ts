//src/app/lib/admin-dashboard-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getAllTransactions() {
  return await prisma.walletTransaction.findMany({
    include: {
      wallet: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// Cancel a show and refund all valid tickets
export async function cancelShowAndRefundTickets(showId: string) {
  try {
    await prisma.show.update({
      where: { id: showId },
      data: { status: "CANCELLED" },
    });

    const tickets = await prisma.ticket.findMany({
      where: {
        showId,
        status: "VALID",
      },
      include: {
        user: { include: { Wallet: true } },
      },
    });

    const show = await prisma.show.findUnique({
      where: { id: showId },
    });
    const price = show?.price ?? 0;

    for (const ticket of tickets) {
      const wallet = ticket.user.Wallet;
      if (!wallet) continue;

      await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
          status: "CANCELLED",
          refundedAt: new Date(),
        },
      });

      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: wallet.balance + price,
        },
      });

      await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "REFUND",
          amount: price,
          note: `Auto refund due to show cancellation (Ticket ID: ${ticket.id})`,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel show:", error);
    return { success: false, message: error.message };
  }
}

// Cancel individual tickets and issue refund
export async function cancelTickets(ticketIds: string[]) {
  for (const ticketId of ticketIds) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: { include: { Wallet: true } },
        show: true,
      },
    });

    if (!ticket || ticket.status !== "VALID") continue;

    const wallet = ticket.user.Wallet;
    const price = ticket.show.price;
    if (!wallet || price == null) continue;

    await prisma.$transaction([
      prisma.ticket.update({
        where: { id: ticketId },
        data: {
          status: "CANCELLED",
          refundedAt: new Date(),
        },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: price },
        },
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "REFUND",
          amount: price,
          note: `🎫 Ticket refund (Ticket ID: ${ticketId})`,
        },
      }),
    ]);
  }

  return { success: true };
}

export async function getAllTickets() {
  return await prisma.ticket.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      show: {
        select: {
          beginTime: true,
          movie: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getSeatsByShowId(showId: string) {
  const seats = await prisma.seat.findMany({
    where: { showId: showId },
    orderBy: [{ row: "asc" }, { col: "asc" }],
  });
  return seats;
}

// === 🎬 Movie Management ===
export async function getMovies() {
  return await prisma.movie.findMany({
    include: {
      shows: true,
      Favorite: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getMovieById(id: string) {
  return await prisma.movie.findUnique({
    where: { id },
    include: {
      shows: true,
    },
  });
}

export async function createMovie({
                                    name,
                                    length,
                                    rate,
                                    image,
                                    description,
                                  }: {
  name: string;
  length: number;
  rate: number;
  image?: string;
  description?: string;
}) {
  await prisma.movie.create({
    data: { name, length, rate, image, description },
  });
}

export async function updateMovie({
                                    id,
                                    name,
                                    length,
                                    rate,
                                    image,
                                    description,
                                  }: {
  id: string;
  name?: string;
  length?: number;
  rate?: number;
  image?: string;
  description?: string;
}) {
  await prisma.movie.update({
    where: { id },
    data: { name, length, rate, image, description },
  });
}

export async function deleteMovie(id: string) {
  await prisma.movie.delete({ where: { id } });
}

// === 🎟️ Show Management ===
export async function getAllShows() {
  const rawShows = await prisma.show.findMany({
    include: {
      movie: true,
      _count: {
        select: {
          tickets: true,
        },
      },
    },
    orderBy: { beginTime: "asc" },
  });

  return rawShows.map((show) => ({
    id: show.id,
    movie: show.movie,
    beginTime: show.beginTime,
    endTime: show.endTime,
    price: show.price,
    status: show.status,
    soldTickets: show._count.tickets,
    totalSeats: 80,
  }));
}

export async function getShowById(id: string) {
  return await prisma.show.findUnique({
    where: { id },
    include: { movie: true },
  });
}

export async function deleteShow(id: string) {
  await prisma.show.delete({ where: { id } });
}

export async function submitShow(showId: string) {
  await prisma.show.update({
    where: { id: showId },
    data: { status: "PUBLISHED" },
  });
}

export async function updateShow({
                                   showId,
                                   beginTime,
                                   endTime,
                                   price,
                                 }: {
  showId: string;
  beginTime: string;
  endTime: string;
  price?: number;
}) {
  const begin = new Date(beginTime);
  const end = new Date(endTime);

  const existing = await prisma.show.findFirst({
    where: {
      id: { not: showId },
      movieID: (
          await prisma.show.findUnique({ where: { id: showId } })
      )?.movieID ?? "",
      beginTime: { lt: end },
      endTime: { gt: begin },
    },
  });

  if (existing) throw new Error("The updated time conflicts with another show.");

  return await prisma.show.update({
    where: { id: showId },
    data: {
      beginTime: begin,
      endTime: end,
      ...(price !== undefined && { price }),
    },
  });
}

export async function updateShowPrice(showId: string, price: number) {
  if (price <= 0) throw new Error("Price must be greater than zero");

  return await prisma.show.update({
    where: { id: showId },
    data: { price },
  });
}


export async function cancelShow(showId: string) {
  await prisma.show.update({
    where: { id: showId },
    data: { status: "CANCELLED" },
  });
}

/**
 * Create a new show
 * Calculates endTime based on movie duration
 * Checks for time conflicts within same movie (excluding cancelled shows)
 */
export async function createShow({
                                   movieID,
                                   beginTime,
                                   price,
                                 }: {
  movieID: string;
  beginTime: string;
  price: number;
}) {
  const movie = await prisma.movie.findUnique({ where: { id: movieID } });
  if (!movie) throw new Error("Movie not found");

  const begin = new Date(beginTime);
  const end = new Date(begin.getTime() + (movie.length ?? 120) * 1000);

  const conflict = await prisma.show.findFirst({
    where: {
      movieID,
      beginTime: { lt: end },
      endTime: { gt: begin },
    },
  });

  if (conflict) throw new Error("This time slot is already taken by another show.");

  const newShow = await prisma.show.create({
    data: {
      movieID,
      beginTime: begin,
      endTime: end,
      price,
    },
  });

// Initialize seats (8 rows x 10 columns)
  await prisma.seat.createMany({
    data: Array.from({ length: 8 * 10 }, (_, i) => {
      const row = String.fromCharCode(65 + Math.floor(i / 10)); // A-H
      const col = (i % 10) + 1;
      return { showId: newShow.id, row, col };
    }),
  });

  return newShow;
}

// === 👤 User Management ===

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function updateUserRole(userId: string, role: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

// === 🔐 Staff Authentication Info ===

export async function getStaffProfile() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  const user = session?.user;

  if (!user) return null;

  return {
    name: user.name,
    email: user.email,
    role: user.role,
  };
}