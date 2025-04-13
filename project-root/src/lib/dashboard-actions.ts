"use server";

// export async function getMyTickets() {
//   return [
//     {
//       id: "t1",
//       eventTitle: "The Matrix Remastered",
//       date: "2025-05-01",
//       seat: "B12",
//       qrCodeUrl: "/placeholder-qr.png",
//     },
//     {
//       id: "t2",
//       eventTitle: "Dune: Part Two",
//       date: "2025-05-08",
//       seat: "C7",
//       qrCodeUrl: "/placeholder-qr.png",
//     },
//   ];
// }

import prisma from "../lib/prisma";
import { getUserFromSession } from "../lib/session";
import { Ticket, Show, Movie } from "@prisma/client";

// Custom type that includes nested show and movie
type TicketWithShowMovie = Ticket & {
  show: Show & {
    movie: Movie;
  };
};

export async function getMyTickets() {
  const user = await getUserFromSession();
  console.log("🔐 Logged-in user:", user);
  
  if (!user) return [];

  // ✅ Step 1: Fetch the data first
  const rawTickets = await prisma.ticket.findMany({
    where: { userID: user.id },
    include: {
      show: {
        include: {
          movie: true,
        },
      },
    },
  });

  // ✅ Step 2: Cast to proper type (optional but cleaner)
  const tickets: TicketWithShowMovie[] = rawTickets;

  // ✅ Step 3: Map and transform the response
  return tickets.map((t) => ({
    id: t.id,
    eventTitle: t.show.movie.name,
    date: t.show.beginTime.toISOString().slice(0, 10),
    seat: t.seat,
    qrCodeUrl: t.qrCode || "/placeholder-qr.png",
  }));
  
}


export async function getWaitlistStatus() {
  return [
    { eventTitle: "Interstellar IMAX", status: "Pending" },
    { eventTitle: "Oppenheimer Extended", status: "Confirmed" },
  ];
}

export async function getProfile() {
  return {
    name: "Jane Doe",
    email: "jane@example.com",
  };
}