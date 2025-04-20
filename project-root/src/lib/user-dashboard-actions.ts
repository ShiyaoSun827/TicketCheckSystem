//src/lib/user-dashboard-actions.ts
"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Ticket, Show, Movie } from "@prisma/client";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";
import QRCode from "qrcode";
import path from "path";
import fs from "fs/promises";


// src/lib/user-dashboard-actions.ts

import { getSession } from "@/hooks/getSession";



export async function refundTicket(ticketId: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, message: "User not logged in" };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      show: true,
      user: true,
    },
  });

  if (!ticket) {
    return { success: false, message: "Ticket not found" };
  }

  if (ticket.userID !== session.user.id) {
    return { success: false, message: "Unauthorized to refund this ticket" };
  }

  if (ticket.status !== "VALID") {
    return { success: false, message: "Ticket is not refundable" };
  }

  // change status to REFUNDED
  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "REFUNDED",
      refundedAt: new Date(),
    },
  });

  // set reserve to false
  await prisma.seat.updateMany({
    where: {
      ticketId: ticketId,
    },
    data: {
      reserved: false,
      ticketId: null,
    },
  });

  // redfund
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
        note: `Refund for show：${ticket.show.movieID} Number of shows`,
      },
    });
  }

  return { success: true, message: "Ticket refunded successfully" };
}



export async function createAndPayOrder(showId: string) {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, message: "Please log in first" };
  }

  const userId = session.user.id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId, showId },
  });

  if (cartItems.length === 0) {
    return { success: false, message: "Shopping cart is empty" };
  }

  const show = await prisma.show.findUnique({
    where: { id: showId },
    include: { movie: true },
  });

  if (!show || show.status === "CANCELLED") {
    return { success: false, message: "Invalid sessions" };
  }

  const total = cartItems.length * show.price;

  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet || wallet.balance < total) {
    return { success: false, message: "Insufficient balance" };
  }

  // ✅ Use transactions to ensure atomicity
  await prisma.$transaction(async (tx) => {
    // 1. Creating an order
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

    // 2. Wallet debits and records transactions
    await tx.wallet.update({
      where: { userId },
      data: {
        balance: { decrement: total },
        transactions: {
          create: {
            type: "PAYMENT",
            amount: total,
            note: `order ${order.id} payment`,
          },
        },
      },
    });

    // 3. Create a Ticket for each CartItem and update the corresponding Seat
    for (const item of cartItems) {
      const match = item.seat.match(/^([A-Z])(\d+)$/);
      if (!match) {
        throw new Error(`Invalid seat format：${item.seat}`);
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
    

    // 4. Empty the shopping cart
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

  if (!session?.user) return { success: false, message: "Not logged in" };

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
  if (!session?.user) throw new Error("User is not logged in");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.status !== "PENDING") {
    throw new Error("Order does not exist or cannot be paid");
  }

  const total = order.total;

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
  });

  if (!wallet || wallet.balance < total) {
    throw new Error("Insufficient balance");
  }

  await prisma.$transaction([
    prisma.wallet.update({
      where: { userId: session.user.id },
      data: { balance: { decrement: total } },
    }),

    // 2. Adding transaction records
    prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "PAYMENT",
        amount: -total,
        note: `Payment for order ${orderId}`,
      },
    }),

    // 3. Update order status
    prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    }),

    // 4. Generate movie tickets
    ...order.items.map((item) =>
      prisma.ticket.create({
        data: {
          userID: session.user.id,
          showId: item.showId,
          seatRow: item.seat[0],
          seatCol: parseInt(item.seat.slice(1), 10),
          qrCode: `TICKET-${item.showId}-${item.seat}`, // ✅ save qrcode
        },
      })
    ),

    // 5. Mark the seat as reserved
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
  if (!user) throw new Error("not log in");

  // Gets the shopping cart item selected by the user
  const cartItems = await prisma.cartItem.findMany({
    where: {
      id: { in: selectedIds },
      userId: user.id,
    },
    include: {
      show: true,
    },
  });

  if (cartItems.length === 0) throw new Error("Shopping cart is empty");

  const total = cartItems.reduce((sum, item) => sum + item.show.price, 0);

  //  Create order
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

  // Delete cart item for generated order
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

  if (!session?.user) throw new Error("Cannot recharge user if not logged in");

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
      note: "RECHARGE",
    },
  });

  return wallet;
}

export async function getWalletInfo() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  if (!session?.user) return null;

  // Query wallet and transaction history
  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Create a new wallet if the wallet is not initialized yet (maybe the user is logged in for the first time)
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
      movie: true,
    },
  });
}

export async function addToCart(showId: string, seats: string[]) {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  const userId = session?.user?.id;
  if (!userId) throw new Error("User is not logged in");

  if (!Array.isArray(seats)) {
    throw new Error("Invalid seating format");
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
    showId: item.showId,
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

    await prisma.cartItem.deleteMany({
      where: {
        id: identifier,
        userId: session.user.id,
      },
    });
  } else {

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
        id: true,
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
  
    // const qrImageDataUrl = await QRCode.toDataURL(ticket.qrCode || "Missing QR");
    // const base64Data = qrImageDataUrl.split("base64,")[1];
    const qrImagePath = path.join(process.cwd(), "public", "qr", `${ticket.id}.png`);
    await QRCode.toFile(qrImagePath, ticket.qrCode || "Missing QR");
  
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
         <img src="cid:qrcode" alt="QR Code" width="150" />
        <br />
        <p style="color: #888;">Powered by MovieTicketing 🎟️</p>
      </div>
    `;
  
    await sendEmail(
      user.email,
      "🎟️ Your Movie Ticket Confirmation",
      emailBody, // your HTML below
      [
        {
          filename: "qrcode.png",
          path: qrImagePath,       // 👈 MUST use path, not base64
          cid: "qrcode"            // 👈 same as your <img src="cid:qrcode" />
        }
      ]
    );
  
    return { success: true, message: "Email sent" };
  }