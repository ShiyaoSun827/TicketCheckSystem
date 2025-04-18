//src/app/dashboard/admin/MovieManager.tsx
"use client";

import { useEffect, useState } from "react";
import { getMovies } from "@/lib/admin-dashboard-actions";
import { useRouter } from "next/navigation";

interface Movie {
  id: string;
  name: string;
  type: string;
  description: string;
  showTime: string;
  length: number;
  image: string | null;
  rate?: number;
  shows: { status: string }[];
  favorites?: any[];
}

const ITEMS_PER_PAGE = 10;

export default function MovieManager() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchName, setSearchName] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getMovies().then(setMovies);
  }, []);

  const filtered = movies.filter((movie) => {
    const matchName = movie.name.toLowerCase().includes(searchName.toLowerCase());
    const matchType = !typeFilter || movie.type === typeFilter;
    return matchName && matchType;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "time") {
      return new Date(a.showTime).getTime() - new Date(b.showTime).getTime();
    }
    return a.name.localeCompare(b.name);
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <section className="bg-white p-4 rounded-lg shadow space-y-4">
    <div className="flex justify-between items-center flex-wrap gap-4">
    {/* 左侧：标题 + 管理按钮 */}
    <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">🎞️ All Movies</h2>
        <button
        onClick={() => router.push("/dashboard/admin/manageMovie")}
        className="bg-yellow-600 text-white px-4 py-2 rounded text-sm"
        >
        Add and delete movies
        </button>
    </div>

    {/* 右侧：折叠按钮 */}
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
              🔍 名称：
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="border p-2 rounded ml-2"
              />
            </label>

            <label>
              📊 排序：
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="border p-2 rounded ml-2"
              >
                <option value="name">按名称</option>
                <option value="time">按上映时间</option>
              </select>
            </label>

            <button
              onClick={() => {
                setSearchName("");
                setTypeFilter("");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              🔄 清除筛选
            </button>
          </div>

          {/* 总条数 & 分页 */}
          <div className="text-sm text-gray-600 text-center flex flex-wrap justify-center items-center gap-4">
            <span>
              共 {filtered.length} 部电影，当前第 {currentPage} 页 / 共 {totalPages} 页
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

          {/* Movie 列表 */}
          <div className="space-y-4">
            {paginated.map((movie) => (
              <div
                key={movie.id}
                className="flex justify-between border p-4 rounded shadow hover:shadow-md transition"
              >
                {/* 左侧：图片 + 信息 */}
                <div className="flex gap-4 w-1/3">
                  {movie.image && (
                    <img
                      src={movie.image}
                      alt={movie.name}
                      className="w-24 h-32 object-cover rounded"
                    />
                  )}
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{movie.name}</h3>
                    <p className="text-sm text-gray-700">⭐️ 评分：{movie.rate ?? "暂无"}</p>
                    <p className="text-sm text-gray-700">🎬 排片总数：{movie.shows.length}</p>
                      

                    <p className="text-sm text-gray-700">
                    🎬 发布: {movie.shows.filter((s) => s.status === "PUBLISHED").length} 
                    {"  "}草稿: {movie.shows.filter((s) => s.status === "DRAFT").length} 
                    {"  "}已取消: {movie.shows.filter((s) => s.status === "CANCELLED").length} 
                    </p>
                    <p className="text-sm text-gray-700">❤️ 收藏数：{movie.favorites?.length ?? 0}</p>
                    <p className="text-sm text-gray-700">⌛ 时长：{movie.length} 秒</p>
                  </div>
                </div>

                {/* 中间：简介 */}
                <div className="flex-1 px-4 text-sm text-gray-600 text-left line-clamp-6">
                    📖 简介：{movie.description}
                </div>

                {/* 右侧：详情按钮 */}
                <div className="flex items-center">
                  <button
                    onClick={() => router.push(`/dashboard/admin/manageMovie/${movie.id}/shows`)}
                    className="text-blue-600 hover:underline whitespace-nowrap"
                  >
                    🔍 详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}