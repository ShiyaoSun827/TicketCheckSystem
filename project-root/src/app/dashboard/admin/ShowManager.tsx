//src/app/dashboard/admin/ShowManager.tsx
"use client";

import { useEffect, useState } from "react";
import { getAllShows, getMovies, deleteShow } from "@/lib/admin-dashboard-actions";
import { useRouter } from "next/navigation";

interface Show {
  id: string;
  movie: { id: string; name: string; type: string };
  beginTime: string;
  endTime: string;
  price: number;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
  totalSeats?: number;
  soldTickets?: number;
}

interface Movie {
  id: string;
  name: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ITEMS_PER_PAGE = 10;

export default function ShowManager() {
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filterMovieId, setFilterMovieId] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortKey, setSortKey] = useState("time");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const [showList, movieList] = await Promise.all([getAllShows(), getMovies()]);
      setShows(showList);
      setMovies(movieList);
    }
    load();
  }, []);

  const handleDeleteShow = async (id: string) => {
    await deleteShow(id);
    setShows(await getAllShows());
  };

  const filtered = shows.filter((show) => {
    const matchesMovie = !filterMovieId || show.movie.id === filterMovieId;
    const showDate = new Date(show.beginTime);
    const matchesStart = !filterStartDate || showDate >= new Date(filterStartDate);
    const matchesEnd = !filterEndDate || showDate <= new Date(filterEndDate);
    const matchesStatus = !filterStatus || show.status === filterStatus;
    return matchesMovie && matchesStart && matchesEnd && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "name") return a.movie.name.localeCompare(b.movie.name);
    return new Date(a.beginTime).getTime() - new Date(b.beginTime).getTime();
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <section className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">🎥 All Shows</h2>
          <button
            onClick={() => router.push("/dashboard/admin/manageShow")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 text-sm rounded"
          >
            ➕ 添加新场次
          </button>
        </div>
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
            <label>
              🎞️ 电影：
              <select
                value={filterMovieId}
                onChange={(e) => setFilterMovieId(e.target.value)}
                className="border p-2 rounded ml-2"
              >
                <option value="">全部</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>{movie.name}</option>
                ))}
              </select>
            </label>

            <label>
              📅 起始日期：
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="border p-2 rounded ml-2"
              />
            </label>

            <label>
              📅 结束日期：
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="border p-2 rounded ml-2"
              />
            </label>

            <label>
              📦 状态：
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border p-2 rounded ml-2"
              >
                <option value="">全部</option>
                <option value="DRAFT">待提交</option>
                <option value="PUBLISHED">已提交</option>
                <option value="CANCELLED">已取消</option>
              </select>
            </label>

            <label>
              📊 排序：
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="border p-2 rounded ml-2"
              >
                <option value="time">按时间</option>
                <option value="name">按电影名称</option>
              </select>
            </label>

            <button
              onClick={() => {
                setFilterMovieId("");
                setFilterStartDate("");
                setFilterEndDate("");
                setFilterStatus("");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              🔄 清除筛选
            </button>
          </div>

          {/* 总条数 & 分页 */}
          <div className="text-sm text-gray-600 text-center flex flex-wrap justify-center items-center gap-4">
            <span>
              共 {filtered.length} 条记录，当前第 {currentPage} 页 / 共 {totalPages} 页
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white"}`}
              >
                ⬅️ 上一页
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={`px-3 py-1 rounded border ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white"}`}
              >
                下一页 ➡️
              </button>
            </div>
          </div>

          {/* Show 列表 */}
          {paginated.length === 0 ? (
            <p className="text-gray-500 text-center">暂无符合条件的排片</p>
          ) : (
            paginated.map((show) => (
              <div key={show.id} className="flex justify-between items-center border p-2 rounded mb-2">
                <div className="space-y-1">
                  <p className="text-lg font-semibold">{show.movie.name}</p>
                  <p className="text-sm text-gray-700">⏰ {formatDate(show.beginTime)} - {formatDate(show.endTime)}</p>
                  <p className="text-sm text-gray-600">💰 票价：¥{show.price?.toFixed(2) ?? "未设定"}</p>
                  <p className="text-sm text-gray-600">
                    📦 状态：
                    {show.status === "DRAFT" && <span className="text-yellow-600 font-medium">待提交</span>}
                    {show.status === "PUBLISHED" && <span className="text-green-600 font-medium">已提交</span>}
                    {show.status === "CANCELLED" && <span className="text-gray-500 line-through">已取消</span>}
                  </p>
                  <p className="text-sm text-gray-600">
                    🎟️ 售票：{show.soldTickets} / {show.totalSeats ?? "?"} 张
                  </p>
                </div>
                <button

                  onClick={() => router.push(`/dashboard/admin/manageShow/${show.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  🔍 详情
                </button>
              </div>
            ))
          )}

          {/* 分页页码按钮 */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

