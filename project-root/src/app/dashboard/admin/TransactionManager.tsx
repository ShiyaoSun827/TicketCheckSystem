// src/app/dashboard/admin/TransactionManager.tsx
"use client";

import { useEffect, useState } from "react";
import { getAllTransactions } from "@/lib/admin-dashboard-actions";

interface Transaction {
  id: string;
  walletId: string;
  type: "RECHARGE" | "PAYMENT" | "REFUND";
  amount: number;
  note?: string | null;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  show?: {
    movie?: {
      name: string;
    };
  };
}

const ITEMS_PER_PAGE = 10;

export default function TransactionManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [movieFilter, setMovieFilter] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    getAllTransactions().then(setTransactions);
  }, []);

  const filtered = transactions.filter((tx) => {
    const matchType = !typeFilter || tx.type === typeFilter;
    const matchEmail =
      !emailFilter || tx.user?.email.toLowerCase().includes(emailFilter.toLowerCase());
    const matchMovie =
      !movieFilter || tx.show?.movie?.name?.toLowerCase().includes(movieFilter.toLowerCase());
    const matchPriceMin = !priceMin || tx.amount >= parseFloat(priceMin);
    const matchPriceMax = !priceMax || tx.amount <= parseFloat(priceMax);
    const matchStartDate = !startDate || new Date(tx.createdAt) >= new Date(startDate);
    const matchEndDate = !endDate || new Date(tx.createdAt) <= new Date(endDate);
    return matchType && matchEmail && matchMovie && matchPriceMin && matchPriceMax && matchStartDate && matchEndDate;
  });

  const totalIncome = filtered
    .filter((tx) => tx.type === "RECHARGE")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOut = filtered
    .filter((tx) => tx.type === "PAYMENT" || tx.type === "REFUND")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <section className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">💰 Wallet Transactions</h2>
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
              placeholder="💰 最低金额"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              type="number"
              className="border p-2 rounded"
            />
            <input
              placeholder="💰 最高金额"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              type="number"
              className="border p-2 rounded"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">全部类型</option>
              <option value="RECHARGE">RECHARGE</option>
              <option value="PAYMENT">PAYMENT</option>
              <option value="REFUND">REFUND</option>
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
                setTypeFilter("");
                setPriceMin("");
                setPriceMax("");
                setStartDate("");
                setEndDate("");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              🔄 清除筛选
            </button>
          </div>

          {/* 汇总 */}
          <div className="text-sm text-gray-700 font-medium space-x-4">
            <span>🔼 总充值：¥{totalIncome.toFixed(2)}</span>
            <span>🔽 总支出：¥{totalOut.toFixed(2)}</span>
            <span>📄 共 {filtered.length} 条记录</span>
          </div>

          {/* 分页 */}
          <div className="text-sm text-gray-600 text-center flex justify-center items-center gap-4">
            <span>
              当前第 {currentPage} 页 / 共 {totalPages} 页
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

          {/* 列表 */}
          {paginated.map((tx) => (
            <div key={tx.id} className="border p-3 rounded space-y-1 text-sm">
              <div>
                <span className="font-semibold">🧾 {tx.type}</span> — ¥
                {tx.amount.toFixed(2)}
              </div>
              {tx.show?.movie?.name && (
                <div>🎬 关联电影：{tx.show.movie.name}</div>
              )}
              {tx.note && <div>📋 {tx.note}</div>}
              <div>📅 {new Date(tx.createdAt).toLocaleString()}</div>
              <div className="text-gray-600">
                👤 {tx.user?.name ?? "匿名用户"} ({tx.user?.email ?? "未知邮箱"})
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
