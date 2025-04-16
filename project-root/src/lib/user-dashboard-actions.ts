//src/lib/user-dashboard-actions.ts
"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Ticket, Show, Movie } from "@prisma/client";
import { headers } from "next/headers";

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


// // Define a type for the waitlist item
// type WaitlistItem = {
//   show: {
//     movie: {
//       name: string;
//     };
//   };
//   status: string; // Adjust this type based on your actual status type
// };

// export async function getWaitlistStatus() {
//   const session = await auth.api.getSession({
//     headers: new Headers(await headers()),
//   });

//   if (!session?.user) return [];

//   const waitlist: WaitlistItem[] = await prisma.waitList.findMany({
//     where: { userID: session.user.id },
//     include: {
//       show: {
//         include: {
//           movie: true,
//         },
//       },
//     },
//   });

//   return waitlist.map((item: WaitlistItem) => ({
//     eventTitle: item.show.movie.name,
//     status: capitalize(item.status), // optional helper formatting
//   }));
// }

// // Optional: Capitalize status values
// function capitalize(str: string) {
//     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//   }


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