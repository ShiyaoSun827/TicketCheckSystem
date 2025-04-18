"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import { getMovies } from "@/lib/admin-dashboard-actions";

export default function MovieBrowserClient() {
    const searchParams = useSearchParams();
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const searchQuery = (searchParams.get("search") || "").toLowerCase();

    useEffect(() => {
        async function fetchData() {
            const allMovies = await getMovies(); // ✅ 注意这里要支持 client 调用（或通过 API proxy）
            setMovies(allMovies);
            setLoading(false);
        }
        fetchData();
    }, []);

    const itemsPerPage = 9;
    const filtered = movies.filter((m) =>
        m.name.toLowerCase().includes(searchQuery)
    );
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="max-w-screen-lg mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold text-center">🎬 Now Showing</h1>

            <form className="flex flex-col sm:flex-row gap-2 sm:items-center" method="GET">
                <input
                    type="text"
                    name="search"
                    placeholder="Search movies..."
                    defaultValue={searchQuery}
                    className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {paginated.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-4">
                    <a
                        href={`/?page=${page - 1}&search=${searchQuery}`}
                        className={`px-4 py-2 rounded ${
                            page === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        style={{ pointerEvents: page === 1 ? "none" : "auto" }}
                    >
                        ◀ Previous
                    </a>
                    <span className="font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>
                    <a
                        href={`/?page=${page + 1}&search=${searchQuery}`}
                        className={`px-4 py-2 rounded ${
                            page === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        style={{ pointerEvents: page === totalPages ? "none" : "auto" }}
                    >
                        Next ▶
                    </a>
                </div>
            )}
        </div>
    );
}
