// src/scripts/seed-ticket.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTickets() {
  try {
    // Get a regular user (excluding admin)
    const user = await prisma.user.findFirst({
      where: { role: "user" },
    });

    if (!user) throw new Error("No regular user found");

    // Get a PUBLISHED show
    const show = await prisma.show.findFirst({
      where: { status: "PUBLISHED" },
    });

    if (!show) throw new Error("No valid show found");

    console.log(`🎯 Creating tickets for user ${user.email}, show ${show.id}`);

    const rows = ["A", "B", "C", "D", "E"];
    const cols = [1, 2, 3, 4];

    for (const row of rows) {
      for (const col of cols) {
        const seatString = `${row}${col}`;

        // Skip already reserved seats
        const existingSeat = await prisma.seat.findFirst({
          where: {
            showId: show.id,
            row,
            col,
            reserved: true,
          },
        });

        if (existingSeat) continue;

        const ticket = await prisma.ticket.create({
          data: {
            userID: user.id,
            showId: show.id,
            seatRow: row,
            seatCol: col,
            status: "VALID",
            qrCode: `TICKET-${show.id}-${seatString}`,
          },
        });

        await prisma.seat.updateMany({
          where: {
            showId: show.id,
            row,
            col,
          },
          data: {
            reserved: true,
            ticketId: ticket.id,
          },
        });

        console.log(`✅ Created ticket for seat ${seatString}`);
      }
    }

    console.log("🎉 Ticket seeding completed successfully.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedTickets();
