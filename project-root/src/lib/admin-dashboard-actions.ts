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

export async function cancelShowAndRefundTickets(showId: string) {
  try {
    // 更新该场排片为 CANCELLED 状态
    await prisma.show.update({
      where: { id: showId },
      data: { status: "CANCELLED" },
    });

    // 查询所有 VALID 状态的票（已购买未使用）
    const tickets = await prisma.ticket.findMany({
      where: {
        showId,
        status: "VALID",
      },
      include: {
        user: { include: { Wallet: true } },
      },
    });

    // 获取价格信息
    const show = await prisma.show.findUnique({
      where: { id: showId },
    });
    const price = show?.price ?? 0;

    // 为每张票退款并修改状态
    for (const ticket of tickets) {
      const wallet = ticket.user.Wallet;
      if (!wallet) continue;

      // 1. 修改票状态为 CANCELLED
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
          status: "CANCELLED",
          refundedAt: new Date(),
        },
      });

      // 2. 给钱包退款
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: wallet.balance + price,
        },
      });

      // 3. 添加退款记录
      await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "REFUND",
          amount: price,
          note: `排片取消自动退款（票号: ${ticket.id}）`,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("取消排片失败:", error);
    return { success: false, message: error.message };
  }
}

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
          note: `🎫 退票退款 (票号: ${ticketId})`,
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

// === 🎬 Movie 管理 ===
export async function getMovies() {
  return await prisma.movie.findMany({
    include: {
      shows: true,
      Favorite: true, // ✅ 这里改成大写 F
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
    totalSeats: 80, // 或者从 room 信息中读取（如果你的系统支持多放映厅）
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
    data: { status: "CANCELLED" },
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
                                   price, // ✅ 记得传入票价
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
      beginTime: { lt: end },
      endTime: { gt: begin },
    },
  });

  if (conflict) {
    throw new Error("该时间段已有排片");
  }

  const newShow = await prisma.show.create({
    data: {
      movieID,
      beginTime: begin,
      endTime: end,
      price,
    },
  });

  // ✅ 初始化座位（8行 x 10列）
  await prisma.seat.createMany({
    data: Array.from({ length: 8 * 10 }, (_, i) => {
      const row = String.fromCharCode(65 + Math.floor(i / 10)); // A-H
      const col = (i % 10) + 1;
      return { showId: newShow.id, row, col };
    }),
  });

  return newShow;
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