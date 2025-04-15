// src/lib/admin-dashboard-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
    role: user.role, // 可选择返回角色信息
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
    orderBy: { beginTime: "asc" },
  });
}

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


/**
 * 创建电影
 * 传入参数：name、length（电影时长，单位：秒）、rate（评分，0-10 的小数）、image（图片 URL，可选）、description（电影介绍，可选）
 */
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

/**
 * 更新电影记录
 * 接受参数：id、name（可选）、length（可选）、rate（可选）、image（可选）、description（可选）
 */
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

export async function deleteShow(id: string) {
  await prisma.show.delete({ where: { id } });
}

export async function createShow({
  movieID,
  beginTime,
  endTime,
}: {
  movieID: string;
  beginTime: string;
  endTime: string;
}) {
  await prisma.show.create({
    data: {
      movieID,
      beginTime: new Date(beginTime),
      endTime: new Date(endTime),
    },
  });
}