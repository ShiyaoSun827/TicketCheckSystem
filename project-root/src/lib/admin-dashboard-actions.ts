//src/app/lib/admin-dashboard-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// === 🎬 Movie Management ===

export async function getMovies() {
  return await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getMovieById(id: string) {
  return await prisma.movie.findUnique({
    where: { id },
    include: {
      shows: true, // show movie informaion
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

// === 🎟️ Show  ===

// export async function getAllShows() {
//   return await prisma.show.findMany({
//     include: { movie: true },
//     orderBy: { beginTime: "asc" },
//   });
// }

export async function getAllShows() {
  const rawShows = await prisma.show.findMany({
    include: {
      movie: true,
      _count: {
        select: {
          tickets: true, // 用于计算已售票数
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
    totalSeats: 80, // get data from 'room'
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
      movieID: {
        in: (await prisma.show.findUnique({ where: { id: showId } }))?.movieID ?? "",
      },
      beginTime: { lt: end },
      endTime: { gt: begin },
    },
  });

  if (existing) throw new Error("The modified time slots conflict with other");

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
  if (price <= 0) throw new Error("Price must be positive");

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
  if (!movie) throw new Error("Movies don't exist");

  const begin = new Date(beginTime);
  const end = new Date(begin.getTime() + (movie.length ?? 120) * 1000);

  const conflict = await prisma.show.findFirst({
    where: {
      movieID,
      beginTime: { lt: end },
      endTime: { gt: begin },
    },
  });

  if (conflict) {
    throw new Error("This time period has been arranged");
  }

  const newShow = await prisma.show.create({
    data: {
      movieID,
      beginTime: begin,
      endTime: end,
      price,
    },
  });

  // ✅ initialize seat
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

// === 🔐 Get user login information ===

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