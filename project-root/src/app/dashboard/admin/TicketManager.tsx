// src/app/dashboard/admin/TicketManager.tsx
"use client";

import { useEffect, useState } from "react";
import { getAllTickets, cancelTickets } from "@/lib/admin-dashboard-actions";
import { useRouter } from "next/navigation";

interface Ticket {
  id: string;
  seatRow: string;
  seatCol: number;
  status: string;
  show: {
    id: string;
    movie: { name: string };
    beginTime: string;
    endTime: string;
    price?: number | null;
  };
  user: {
    name: string;
    email: string;
  };
}

const ITEMS_PER_PAGE = 10;

export default function TicketManager() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [movieFilter, setMovieFilter] = useState("");
  const [seatFilter, setSeatFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getAllTickets().then(setTickets);
  }, []);
  

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleBulkCancel = async () => {
    if (selectedIds.size === 0) return;
    await cancelTickets(Array.from(selectedIds));
    setSelectedIds(new Set());
    setTickets(await getAllTickets());
  };
  

  const filtered = tickets.filter((ticket) => {
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesEmail = !emailFilter || ticket.user.email.toLowerCase().includes(emailFilter.toLowerCase());
    const matchesMovie = !movieFilter || ticket.show.movie.name.toLowerCase().includes(movieFilter.toLowerCase());
    const matchesSeat = !seatFilter || `${ticket.seatRow}${ticket.seatCol + 1}`.includes(seatFilter);
    const matchesPrice = !priceFilter || ticket.show.price?.toFixed(2).includes(priceFilter);
    const beginTime = new Date(ticket.show.beginTime);
    const matchesStart = !startDate || beginTime >= new Date(startDate);
    const matchesEnd = !endDate || beginTime <= new Date(endDate);

    return matchesStatus && matchesEmail && matchesMovie && matchesSeat && matchesPrice && matchesStart && matchesEnd;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <section className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">🎫 All Tickets</h2>
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isExpanded ? "🔽 折叠" : "▶️ 展开"}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* 筛选器 */}
          <div className="flex flex-wrap gap-4 items-center">
            <input
              placeholder="📧 用户邮箱"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              placeholder="🎬 电影名"
              value={movieFilter}
              onChange={(e) => setMovieFilter(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              placeholder="💺 座位"
              value={seatFilter}
              onChange={(e) => setSeatFilter(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              placeholder="💰 票价"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="border p-2 rounded"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">全部状态</option>
              <option value="VALID">VALID</option>
              <option value="CHECKED">CHECKED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={() => {
                setEmailFilter("");
                setMovieFilter("");
                setSeatFilter("");
                setPriceFilter("");
                setStatusFilter("");
                setStartDate("");
                setEndDate("");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              🔄 清除筛选
            </button>
          </div>

          {/* 批量操作按钮 */}
          <div className="flex justify-end">
            <button
              disabled={selectedIds.size === 0}
              onClick={handleBulkCancel}
              className="bg-red-600 text-white px-4 py-1 rounded disabled:bg-gray-400"
            >
              ❌ 批量取消所选票
            </button>
          </div>

          {/* 分页 */}
          <div className="text-sm text-gray-600 text-center flex flex-wrap justify-center items-center gap-4">
            <span>
              共 {filtered.length} 张票，当前第 {currentPage} 页 / 共 {totalPages} 页
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-white"
                }`}
              >
                ⬅️ 上一页
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-white"
                }`}
              >
                下一页 ➡️
              </button>
            </div>
          </div>

          {/* Ticket 列表 */}
          {paginated.map((ticket) => (
            <div
              key={ticket.id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={selectedIds.has(ticket.id)}
                  onChange={() => toggleSelection(ticket.id)}
                />
                <div>
                  <p className="font-semibold">🎬 {ticket.show.movie.name}</p>
                  <p className="text-sm text-gray-700">
                    ⏰ {new Date(ticket.show.beginTime).toLocaleString()} -{" "}
                    {new Date(ticket.show.endTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    💺 座位：{ticket.seatRow}
                    {ticket.seatCol + 1}
                  </p>
                  <p className="text-sm text-gray-700">
                    💰 票价：¥{ticket.show.price?.toFixed?.(2) ?? "未知"}
                  </p>
                  <p className="text-sm text-gray-600">
                    👤 用户：{ticket.user.name} ({ticket.user.email})
                  </p>
                  <p className="text-sm text-gray-600">
                    🎟️ 状态：<span className="font-semibold">{ticket.status}</span>
                  </p>
                </div>
              </label>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
