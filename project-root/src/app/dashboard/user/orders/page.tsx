//src/app/dashboard/user/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder, payForOrder } from "@/lib/user-dashboard-actions";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import NavBarClient from "@/components/NavBarClient";

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      const result = await getMyOrders();
      setOrders(result);
    }
    fetchOrders();
  }, []);

  const handleCancel = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    await cancelOrder(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handlePay = async (orderId: string) => {
    try {
      await payForOrder(orderId);
      setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "PAID" } : o))
      );
    } catch (err: any) {
      alert(err.message || "Payment failed: insufficient balance!");
    }
  };

  const unpaid = orders.filter((o) => o.status === "PENDING");
  const paid = orders.filter((o) => o.status === "PAID");

  const { session, isLoading: sessionLoading } = authClient.useSession();

  return (
      <div className="p-6 space-y-6">
        <NavBarClient session={session} />
        <h1 className="text-2xl font-bold">📦 My Orders</h1>
        <div className="text-center mt-8">
          <button
              onClick={() => router.push("/dashboard/user/myTickets")}
              className="bg-gray-400 text-white px-6 py-2 rounded text-lg hover:bg-gray-500"
          >
            Go to My Tickets
          </button>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-2">🕒 Unpaid Orders</h2>
          {unpaid.length === 0 ? (
              <p className="text-gray-500">No unpaid orders.</p>
          ) : (
              <ul className="space-y-4">
                {unpaid.map((order) => (
                    <li key={order.id} className="border rounded p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p>🎬 {order.movieTitle}</p>
                          <p>📅 {new Date(order.showTime).toLocaleString()}</p>
                          <p>💰 Total: ¥{order.total.toFixed(2)}</p>
                          <p>🎟️ Seats: {order.items.map((i: any) => i.seat).join(", ")}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                              onClick={() => handlePay(order.id)}
                              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                          >
                            Pay Now
                          </button>
                          <button
                              onClick={() => handleCancel(order.id)}
                              className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                          >
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    </li>
                ))}
              </ul>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">✅ Paid Orders</h2>
          {paid.length === 0 ? (
              <p className="text-gray-500">No paid orders.</p>
          ) : (
              <ul className="space-y-4">
                {paid.map((order) => (
                    <li key={order.id} className="border rounded p-4 space-y-2 bg-gray-50">
                      <p>🎬 {order.movieTitle}</p>
                      <p>📅 {new Date(order.showTime).toLocaleString()}</p>
                      <p>💰 Total: ¥{order.total.toFixed(2)}</p>
                      <p>🎟️ Seats: {order.items.map((i: any) => i.seat).join(", ")}</p>
                      <p className="text-green-600 font-semibold">Paid</p>
                    </li>
                ))}
              </ul>
          )}
        </section>
      </div>
  );
}
