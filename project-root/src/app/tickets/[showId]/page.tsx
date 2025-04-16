// src/app/tickets/[showId]/page.tsx
import { getShowById } from "@/lib/user-dashboard-actions";
import { prisma } from "@/lib/prisma";
import TicketClient from "./TicketClient";
import { getCartItems } from "@/lib/user-dashboard-actions";

export const dynamic = "force-dynamic";

export default async function TicketPage({ params }: { params: { showId: string } }) {
  const { showId } = await Promise.resolve(params);

  const show = await getShowById(showId);
  if (!show) {
    return <div className="p-6 text-red-600">❌ 无法找到排片信息</div>;
  }

  const seats = await prisma.seat.findMany({
    where: { showId },
    orderBy: [{ row: "asc" }, { col: "asc" }],
  });

  const cartItems = await getCartItems();
  console.log("🧺 所有购物车数据：", cartItems);

  const inCartSeats = cartItems
    .filter((item) => item.showId === showId)
    .map((item) => item.seat);

  return (
    <div className="container mx-auto p-6">
      <TicketClient show={show} seats={seats} inCartSeats={inCartSeats} />
    </div>
  );
}