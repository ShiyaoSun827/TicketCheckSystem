// src/app/dashboard/user/myTickets/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { authClient } from "@/lib/auth-client";
import NavBarClient from "@/components/NavBarClient";
import { getMyTickets, refundTicket } from "@/lib/user-dashboard-actions";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const { session } = authClient.useSession();

  useEffect(() => {
    async function fetchTickets() {
      const result = await getMyTickets();
      setTickets(result);
    }
    fetchTickets();
  }, []);

  const handleRefund = async (ticketId: string) => {
    const confirmRefund = confirm("确认要退票吗？");
    if (!confirmRefund) return;

    const result = await refundTicket(ticketId);
    if (result.success) {
      alert("✅ 退票成功");
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, status: "REFUNDED" } : t
        )
      );
    } else {
      alert("❌ 退票失败：" + result.message);
    }
  };

  const renderTicketList = (title: string, list: any[]) => (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {list.length === 0 ? (
        <p className="text-gray-500">暂无记录</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((ticket) => (
            <li
              key={ticket.id}
              className="border rounded shadow p-4 space-y-2 bg-white"
            >
              <div className="flex gap-4">
                {ticket.image && (
                  <Image
                    src={ticket.image}
                    alt={ticket.eventTitle}
                    width={80}
                    height={120}
                    className="rounded"
                  />
                )}
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">🎬 {ticket.eventTitle}</p>
                  <p>
                    📅{" "}
                    {new Date(ticket.date).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                  <p>
                    ⏰{" "}
                    {new Date(ticket.date).toLocaleTimeString("zh-CN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </p>
                  <p>💺 座位：{ticket.seat}</p>
                  <p>🔐 状态：{ticket.status}</p>
                </div>
              </div>

              {ticket.status === "VALID" &&
                ticket.qrCode &&
                typeof ticket.qrCode === "string" && (
                  <div className="flex flex-col items-center mt-2">
                    <QRCodeSVG value={ticket.qrCode} size={100} />
                    <p className="text-sm text-gray-500 mt-1">扫码验票</p>
                  </div>
              )}

              {ticket.status === "VALID" && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => handleRefund(ticket.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    退票
                  </button>
                </div>
              )}

              {ticket.status === "REFUNDED" && (
                <div className="mt-4 text-center text-red-500 font-semibold">
                  ❌ 已退款
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  const validTickets = tickets.filter((t) => t.status === "VALID");
  const refundedTickets = tickets.filter((t) => t.status === "REFUNDED");
  const checkedTickets = tickets.filter((t) => t.status === "CHECKED");

  return (
    <div className="p-6 space-y-8">
      <NavBarClient session={session} />
      <h1 className="text-2xl font-bold">🎫 我的电影票</h1>

      {tickets.length === 0 ? (
        <p className="text-gray-600">暂无已购票记录</p>
      ) : (
        <>
          {renderTicketList("✅ 未使用票", validTickets)}
          {renderTicketList("❌ 已退款票", refundedTickets)}
          {renderTicketList("📭 已使用票", checkedTickets)}
        </>
      )}
    </div>
  );
}

