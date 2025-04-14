"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// export async function getStaffProfile() {
//   const session = await auth.api.getSession({ headers: new Headers(await headers()) });
//   if (!session?.user || session.user.role !== "staff") return null;
//   return {
//     name: session.user.name,
//     email: session.user.email,
//     role: session.user.role,
//   };
// }

export async function getStaffProfile() {
    const session = await auth.api.getSession({
        headers: new Headers(await headers()),
    });
  
    const user = session?.user;
  
    if (!user) {
      return null;
    }
  
    return {
      name: user.name,
      email: user.email,
    };
  }

export async function getMovies() {
  return await prisma.movie.findMany({ orderBy: { createdAt: "desc" } });
}
export async function getAllShows() {
    return await prisma.show.findMany({
      include: {
        movie: true,
      },
      orderBy: { beginTime: 'asc' },
    });
}

export async function createMovie({ name, type}: { name: string; type: string }) {
  await prisma.movie.create({
    data: { name, type},
  });
}

export async function deleteMovie(id: string) {
  await prisma.movie.delete({ where: { id } });

}
export async function deleteShow(id: string) {
    await prisma.show.delete({ where: { id } });
  }

export async function createShow({ movieID, beginTime,endTime }: { movieID: string; beginTime: string; endTime:string }) {
    await prisma.show.create({
        data: {
          movieID,
          beginTime: new Date(beginTime),
          endTime: new Date(endTime),
        },
      });
}