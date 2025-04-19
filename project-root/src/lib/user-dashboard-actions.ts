//src/lib/user-dashboard-actions.ts
"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Ticket, Show, Movie } from "@prisma/client";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";
import QRCode from "qrcode";


// src/lib/user-dashboard-actions.ts

import { getSession } from "@/hooks/getSession";



export async function refundTicket(ticketId: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, message: "用户未登录" };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      show: true,
      user: true,
    },
  });

  if (!ticket) {
    return { success: false, message: "未找到该票" };
  }

  if (ticket.userID !== session.user.id) {
    return { success: false, message: "无权退票" };
  }

  if (ticket.status !== "VALID") {
    return { success: false, message: "该票不可退" };
  }

  // 修改票状态为 REFUNDED
  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "REFUNDED",
      refundedAt: new Date(),
    },
  });

  // 将该座位的 reserved 状态设为 false
  await prisma.seat.updateMany({
    where: {
      ticketId: ticketId,
    },
    data: {
      reserved: false,
      ticketId: null,
    },
  });

  // 钱包退款
  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
  });

  if (wallet) {
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: ticket.show.price },
      },
    });

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "REFUND",
        amount: ticket.show.price,
        note: `退票：${ticket.show.movieID} 场次`,
      },
    });
  }

  return { success: true, message: "退票成功" };
}



export async function createAndPayOrder(showId: string) {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, message: "请先登录" };
  }

  const userId = session.user.id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId, showId },
  });

  if (cartItems.length === 0) {
    return { success: false, message: "购物车为空" };
  }

  const show = await prisma.show.findUnique({
    where: { id: showId },
    include: { movie: true },
  });

  if (!show || show.status === "CANCELLED") {
    return { success: false, message: "无效的场次" };
  }

  const total = cartItems.length * show.price;

  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet || wallet.balance < total) {
    return { success: false, message: "余额不足" };
  }

  // ✅ 使用事务确保原子性
  await prisma.$transaction(async (tx) => {
    // 1. 创建订单
    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: "PAID",
        items: {
          create: cartItems.map((item) => ({
            seat: item.seat,
            price: show.price,
            showId,
          })),
        },
      },
    });

    // 2. 钱包扣款并记录交易
    await tx.wallet.update({
      where: { userId },
      data: {
        balance: { decrement: total },
        transactions: {
          create: {
            type: "PAYMENT",
            amount: total,
            note: `订单 ${order.id} 支付`,
          },
        },
      },
    });

    // 3. 为每个 CartItem 创建 Ticket，并更新对应 Seat
    for (const item of cartItems) {
      const match = item.seat.match(/^([A-Z])(\d+)$/);
      if (!match) {
        throw new Error(`无效座位格式：${item.seat}`);
      }
      const [, row, col] = match;
    
      const ticket = await tx.ticket.create({
        data: {
          userID: userId,
          showId,
          seatRow: row,
          seatCol: parseInt(col),
          status: "VALID",
          qrCode: `TICKET-${order.id}-${item.seat}`,
        },
      });
    
      await tx.seat.updateMany({
        where: {
          showId,
          row,
          col: parseInt(col),
        },
        data: {
          reserved: true,
          ticketId: ticket.id,
        },
      });
    }
    

    // 4. 清空购物车
    await tx.cartItem.deleteMany({
      where: { userId, showId },
    });
  });

  return { success: true };
}

export async function isFavorite(movieId: string) {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  if (!session?.user) return false;

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_movieId: {
        userId: session.user.id,
        movieId,
      },
    },
  });

  return !!favorite;
}

export async function toggleFavorite(movieId: string) {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  if (!session?.user) return { success: false, message: "未登录" };

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_movieId: {
        userId: session.user.id,
        movieId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: { userId_movieId: { userId: session.user.id, movieId } },
    });
    return { success: true, action: "removed" };
  } else {
    await prisma.favorite.create({
      data: { userId: session.user.id, movieId },
    });
    return { success: true, action: "added" };
  }
}

export async function getMyFavorites() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  if (!session?.user) return [];

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      movie: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return favorites.map((f) => f.movie);
}

export async function getMovieById(movieId: string) {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      shows: {
        include: {
          Seat: true,
        },
      },
    },
  });

  if (!movie) return null;

  return movie;
}

export async function getMyOrders() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  if (!session?.user) return [];

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          show: {
            include: {
              movie: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      seat: item.seat,
      price: item.price,
      movieTitle: item.show.movie.name,
      showTime: item.show.beginTime,
    })),
  }));
}

export async function payForOrder(orderId: string) {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });
  if (!session?.user) throw new Error("未登录用户");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.status !== "PENDING") {
    throw new Error("订单不存在或无法支付");
  }

  const total = order.total;

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
  });

  if (!wallet || wallet.balance < total) {
    throw new Error("余额不足");
  }

  await prisma.$transaction([
    // 1. 扣款
    prisma.wallet.update({
      where: { userId: session.user.id },
      data: { balance: { decrement: total } },
    }),

    // 2. 添加交易记录
    prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "PAYMENT",
        amount: -total,
        note: `支付订单 ${orderId}`,
      },
    }),

    // 3. 更新订单状态
    prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    }),

    // 4. 生成电影票
    ...order.items.map((item) =>
      prisma.ticket.create({
        data: {
          userID: session.user.id,
          showId: item.showId,
          seatRow: item.seat[0],
          seatCol: parseInt(item.seat.slice(1), 10),
          qrCode: `TICKET-${item.showId}-${item.seat}`, // ✅ 作为二维码内容
        },
      })
    ),

    // 5. 标记座位为 reserved
    ...order.items.map((item) =>
      prisma.seat.updateMany({
        where: {
          showId: item.showId,
          row: item.seat[0],
          col: parseInt(item.seat.slice(1), 10),
        },
        data: { reserved: true },
      })
    ),
  ]);
}

export async function cancelOrder(orderId: string) {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });
  if (!session?.user) return;

  await prisma.order.update({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    data: {
      status: "CANCELLED",
    },
  });
}

export async function createOrderFromCart(selectedIds: string[]) {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });
  const user = session?.user;
  if (!user) throw new Error("未登录");

  // 获取用户选中的购物车条目
  const cartItems = await prisma.cartItem.findMany({
    where: {
      id: { in: selectedIds },
      userId: user.id,
    },
    include: {
      show: true,
    },
  });

  if (cartItems.length === 0) throw new Error("购物车为空");

  // 计算总价
  const total = cartItems.reduce((sum, item) => sum + item.show.price, 0);

  // 创建订单
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      status: "PENDING",
      items: {
        create: cartItems.map((item) => ({
          showId: item.showId,
          seat: item.seat,
          price: item.show.price,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  // 删除已生成订单的购物车项
  await prisma.cartItem.deleteMany({
    where: {
      id: { in: selectedIds },
      userId: user.id,
    },
  });

  return order;
}

export async function rechargeWallet(amount: number) {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  if (!session?.user) throw new Error("未登录用户无法充值");

  const userId = session.user.id;

  const wallet = await prisma.wallet.upsert({
    where: { userId },
    update: {
      balance: {
        increment: amount,
      },
    },
    create: {
      userId,
      balance: amount,
    },
  });

  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      type: "RECHARGE",
      amount,
      note: "用户充值",
    },
  });

  return wallet;
}

export async function getWalletInfo() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  if (!session?.user) return null;

  // 查询钱包和交易记录
  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // 若钱包尚未初始化（可能用户首次登录），创建新钱包
  if (!wallet) {
    const newWallet = await prisma.wallet.create({
      data: {
        userId: session.user.id,
        balance: 0,
      },
    });

    return {
      balance: newWallet.balance,
      transactions: [],
    };
  }

  return {
    balance: wallet.balance,
    transactions: wallet.transactions,
  };
}

export async function getShowById(showId: string) {
  return await prisma.show.findUnique({
    where: { id: showId },
    include: {
      movie: true, // 包含关联电影信息
    },
  });
}

export async function addToCart(showId: string, seats: string[]) {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  const userId = session?.user?.id;
  if (!userId) throw new Error("用户未登录");

  if (!Array.isArray(seats)) {
    throw new Error("无效的座位格式");
  }

  const data = seats.map((seat) => ({
    userId,
    showId,
    seat,
  }));

  await prisma.cartItem.createMany({ data, skipDuplicates: true });
}

export async function getCartItems() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  if (!session?.user) return [];

  const rawItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      show: {
        include: {
          movie: true,
        },
      },
    },
  });

  return rawItems.map((item) => ({
    id: item.id,
    showId: item.showId, // ✅ 添加 showId 用于页面比对
    movieTitle: item.show.movie.name,
    image: item.show.movie.image,
    showTime: item.show.beginTime,
    seat: item.seat,
    price: item.show.price,
    addedAt: item.addedAt,
  }));
}

export async function deleteCartItem(
  identifier: string | { showId: string; seat: string }
) {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  if (!session?.user) return;

  if (typeof identifier === "string") {
    // ✅ 添加 userId 限制
    await prisma.cartItem.deleteMany({
      where: {
        id: identifier,
        userId: session.user.id,
      },
    });
  } else {
    // ✅ 传入的是 { showId, seat }
    const { showId, seat } = identifier;
    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
        showId,
        seat,
      },
    });
  }
}

export async function deleteCartItems(cartItemIds: string[]) {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });
  if (!session?.user) return;

  await prisma.cartItem.deleteMany({
    where: {
      id: { in: cartItemIds },
      userId: session.user.id,
    },
  });
}

// ✅ 获取当前登录用户的购物车数量
export async function getCartCount() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });
  if (!session?.user) return 0;

  const count = await prisma.cartItem.count({
    where: { userId: session.user.id },
  });

  return count;
}

// ✅ 获取当前登录用户的订单数量（所有状态）
export async function getOrderCount() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });
  if (!session?.user) return 0;

  const count = await prisma.order.count({
    where: { userId: session.user.id },
  });

  return count;
}

// ✅ 获取当前登录用户的已购票数量
export async function getTicketCount() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });
  if (!session?.user) return 0;

  const count = await prisma.ticket.count({
    where: { userID: session.user.id },
  });

  return count;
}

// ✅ 获取当前登录用户的钱包余额
export async function getWalletBalance() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });
  if (!session?.user) return 0;

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
  });

  return wallet?.balance ?? 0;
}

export async function getMyTickets() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });
  if (!session?.user) return [];

  const tickets = await prisma.ticket.findMany({
    where: { userID: session.user.id },
    include: {
      show: {
        include: {
          movie: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tickets.map((ticket) => ({
    id: ticket.id,
    eventTitle: ticket.show.movie.name,
    image: ticket.show.movie.image ?? undefined,
    date: ticket.show.beginTime.toISOString().split("T")[0],
    seat: `${ticket.seatRow}${ticket.seatCol}`,
    status: ticket.status,
    qrCode: ticket.qrCode ?? `TICKET-${ticket.showId}-${ticket.seatRow}${ticket.seatCol}`,
  }));
}



export async function getProfile() {
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

  export async function emailMyTicket(ticketId: string) {
    const session = await auth.api.getSession({
      headers: new Headers(await headers()),
    });
  
    const user = session?.user;
    if (!user) return { success: false, message: "Not logged in" };
  
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: {
        seatRow: true,
        seatCol: true,
        qrCode: true,
        status: true,
        userID: true,
        show: {
          select: {
            beginTime: true,
            movie: { select: { name: true } },
          },
        },
      },
    });
  
    if (!ticket || ticket.userID !== user.id) {
      return { success: false, message: "Ticket not found or unauthorized" };
    }
  
    const qrImageDataUrl = await QRCode.toDataURL(ticket.qrCode || "Missing QR");
    const base64Data = qrImageDataUrl.split("base64,")[1];
  
    const emailBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #4F46E5;">🎬 Your Movie Ticket Confirmation</h1>
        <p>Hello ${user.name || "Guest"},</p>
        <p>Thanks for booking with us! Here are your ticket details:</p>
        <hr />
        <p><strong>Movie:</strong> ${ticket.show.movie.name}</p>
        <p><strong>Seat:</strong> ${ticket.seatRow}${ticket.seatCol}</p>
        <p><strong>Date:</strong> ${ticket.show.beginTime.toLocaleString()}</p>
        <p><strong>Status:</strong> ${ticket.status}</p>
        <p><strong>QR Code:</strong></p>
        <img src="cid:qrcode.png" alt="QR Code" width="150" />
        <br />
        <p style="color: #888;">Powered by MovieTicketing 🎟️</p>
      </div>
    `;
  
    await sendEmail(
      user.email,
      "🎟️ Your Movie Ticket Confirmation",
      emailBody,
      [
        {
          filename: "qrcode.png",
          content: base64Data,
          encoding: "base64",
          cid: "qrcode.png",
        },
      ]
    );
  
    return { success: true, message: "Email sent" };
  }