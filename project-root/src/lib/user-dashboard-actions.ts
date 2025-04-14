"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Ticket, Show, Movie } from "@prisma/client";
import { headers } from "next/headers";

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