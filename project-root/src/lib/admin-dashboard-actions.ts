"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// === 🎬 Movie 管理 ===

export async function getMovies() {
  return await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getMovieById(id: string) {
  return await prisma.movie.findUnique({
    where: { id },
    include: {
      shows: true, // 显示排片信息
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

// === 🎟️ Show 排片管理 ===

export async function getAllShows() {
  return await prisma.show.findMany({
    include: { movie: true },
    orderBy: { beginTime: "asc" },
  });
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
      cancelled: false,
      beginTime: { lt: end },
      endTime: { gt: begin },
    },
  });

  if (existing) throw new Error("修改后的时间段与其他排片冲突");

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
  if (price <= 0) throw new Error("价格必须为正数");

  return await prisma.show.update({
    where: { id: showId },
    data: { price },
  });
}


export async function cancelShow(showId: string) {
  await prisma.show.update({
    where: { id: showId },
    data: { cancelled: true },
  });
}

/**
 * 创建排片
 * 自动根据电影时长推算 endTime
 * 检查同电影是否存在时间冲突（忽略已取消）
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
  if (!movie) throw new Error("电影不存在");

  const begin = new Date(beginTime);
  const end = new Date(begin.getTime() + (movie.length ?? 120) * 1000);

  const conflict = await prisma.show.findFirst({
    where: {
      movieID,
      cancelled: false,
      beginTime: { lt: end },
      endTime: { gt: begin },
    },
  });

  if (conflict) {
    throw new Error("该时间段已有排片");
  }

  await prisma.show.create({
    data: {
      movieID,
      beginTime: begin,
      endTime: end,
      price,
    },
  });
}

// === 👤 用户管理 ===

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

// === 🔐 获取当前登录用户信息（仅 Staff 面板用） ===

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