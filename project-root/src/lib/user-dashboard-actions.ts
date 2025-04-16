"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Ticket, Show, Movie } from "@prisma/client";
import { headers } from "next/headers";

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


// Custom type that includes nested show and movie
type TicketWithShowMovie = Ticket & {
    show: Show & {
      movie: Movie;
    };
  };
  
  export async function getMyTickets() {
    const session = await auth.api.getSession({
    headers: new Headers(await headers()),
    });
  
    // console.log("🎫 Logged-in user (from session):", session?.user);
    // console.log("Session object:", session);
  
    if (!session?.user) return [];
  
    const rawTickets = await prisma.ticket.findMany({
        where: { userID: session.user.id },
        include: {
          show: {
            include: {
              movie: true,
            },
          },
        },
      });
  
    const tickets: TicketWithShowMovie[] = rawTickets;
  
    return tickets.map((t) => ({
      id: t.id,
      eventTitle: t.show.movie.name,
      date: t.show.beginTime.toISOString().slice(0, 10),
      seat: t.seat,
      qrCodeUrl: t.qrCode || "/placeholder-qr.png",
    }));
  }


// Define a type for the waitlist item
type WaitlistItem = {
  show: {
    movie: {
      name: string;
    };
  };
  status: string; // Adjust this type based on your actual status type
};

export async function getWaitlistStatus() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  if (!session?.user) return [];

  const waitlist: WaitlistItem[] = await prisma.waitList.findMany({
    where: { userID: session.user.id },
    include: {
      show: {
        include: {
          movie: true,
        },
      },
    },
  });

  return waitlist.map((item: WaitlistItem) => ({
    eventTitle: item.show.movie.name,
    status: capitalize(item.status), // optional helper formatting
  }));
}

// Optional: Capitalize status values
function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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