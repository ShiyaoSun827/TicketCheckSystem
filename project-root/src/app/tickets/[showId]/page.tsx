// src/app/tickets/[showId]/page.tsx
import { getShowById } from "@/lib/user-dashboard-actions";
import { prisma } from "@/lib/prisma";
import TicketClient from "./TicketClient";
import { getCartItems } from "@/lib/user-dashboard-actions";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";

export default async function TicketPage({ params }: { params: { showId: string } }) {
  const { showId } = await Promise.resolve(params);

  const show = await getShowById(showId);
  if (!show) {
    return <div className="p-6 text-red-600">❌ Unable to find movie row information</div>;
  }

  const seats = await prisma.seat.findMany({
    where: { showId },
    orderBy: [{ row: "asc" }, { col: "asc" }],
  });

  const cartItems = await getCartItems();
  console.log("🧺 All shopping cart data：", cartItems);

  const inCartSeats = cartItems
    .filter((item) => item.showId === showId)
    .map((item) => item.seat);

  const clearKey = Date.now(); // Used for SeatPicker to clear markers

  return (
    <div className="container mx-auto p-6">
      <NavBar />
      <div className="text-2xl font-bold mb-4">🎟️ Select seats for tickets</div>
      <TicketClient
        show={show}
        seats={seats}
        inCartSeats={inCartSeats}
        clearKey={clearKey}
      />
    </div>
  );
}