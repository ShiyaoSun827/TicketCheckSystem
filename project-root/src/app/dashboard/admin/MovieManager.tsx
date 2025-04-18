//src/app/dashboard/admin/ShowManager.tsx
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
          <h2 className="text-2xl font-semibold">🎞️ All Movies</h2>
          <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="text-sm text-blue-600 hover:underline"
          >
            {isExpanded ? "🔽 Collapse" : "▶️ Expand"}
          </button>
        </div>

        {isExpanded && (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <label>
                  🔍 Name:
                  <input
                      type="text"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="border p-2 rounded ml-2"
                  />
                </label>

                <label>
                  🎭 Type:
                  <input
                      type="text"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="border p-2 rounded ml-2"
                  />
                </label>

                <label>
                  📊 Sort by:
                  <select
                      value={sortKey}
                      onChange={(e) => setSortKey(e.target.value)}
                      className="border p-2 rounded ml-2"
                  >
                    <option value="name">By Name</option>
                    <option value="time">By Showtime</option>
                  </select>
                </label>

                <button
                    onClick={() => {
                      setSearchName("");
                      setTypeFilter("");
                    }}
                    className="text-sm text-blue-600 hover:underline"
                >
                  🔄 Reset Filters
                </button>
              </div>

              {/* Total Count & Pagination */}
              <div className="text-sm text-gray-600 text-center flex flex-wrap justify-center items-center gap-4">
            <span>
              Total: {filtered.length} movies, Page {currentPage} of {totalPages}
            </span>
                <div className="flex gap-2">
                  <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className={`px-3 py-1 rounded border ${
                          currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-white"
                      }`}
                  >
                    ⬅️ Previous
                  </button>
                  <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className={`px-3 py-1 rounded border ${
                          currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-white"
                      }`}
                  >
                    Next ➡️
                  </button>
                </div>
              </div>

              {/* Movie List - One per row, with separate description section */}
              <div className="space-y-4">
                {paginated.map((movie) => (
                    <div
                        key={movie.id}
                        className="flex justify-between items-start border p-4 rounded shadow hover:shadow-md transition"
                    >
                      {/* Left Column: Movie Info */}
                      <div className="flex gap-4 w-2/3">
                        {movie.image && (
                            <img
                                src={movie.image}
                                alt={movie.name}
                                className="w-24 h-32 object-cover rounded"
                            />
                        )}
                        <div>
                          <h3 className="text-xl font-semibold">{movie.name}</h3>
                          <p className="text-sm text-gray-700 mt-1">
                            ⏰ Showtime: {new Date(movie.showTime).toLocaleString() || "N/A"}
                          </p>
                          <p className="text-sm text-gray-700">🎬 Type: {movie.type}</p>
                          <p className="text-sm text-gray-700">⌛ Duration: {movie.length} seconds</p>
                        </div>
                      </div>

                      {/* Center Column: Description */}
                      <div className="w-full max-w-[500px] text-sm text-gray-600 px-4 line-clamp-6">
                        📖 Description: {movie.description}
                      </div>

                      {/* Right Column: Details Button */}
                      <div className="flex items-center">
                        <button
                            onClick={() => router.push(`/dashboard/admin/manageMovie/${movie.id}/shows`)}
                            className="text-blue-600 hover:underline whitespace-nowrap"
                        >
                          🔍 Details
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
