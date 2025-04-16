// src/app/dashboard/user/myTickets/page.tsx

import { getMyTickets } from "@/lib/user-dashboard-actions";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

export const dynamic = "force-dynamic";

export default async function MyTicketsPage() {
  const tickets = await getMyTickets();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🎫 我的电影票</h1>

      {tickets.length === 0 ? (
        <p className="text-gray-600">暂无已购票记录</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
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
                    📅 {new Date(ticket.date).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }) + " --Y/M/D"}
                  </p>
                  <p>
                    ⏰ {new Date(ticket.date).toLocaleTimeString("zh-CN", {
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

              {ticket.qrCode && typeof ticket.qrCode === "string" && (
                <div className="flex flex-col items-center mt-2">
                  <QRCodeSVG value={ticket.qrCode} size={100} />
                  <p className="text-sm text-gray-500 mt-1">扫码验票</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
