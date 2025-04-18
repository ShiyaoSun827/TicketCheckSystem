//src/app/movies/[movieId]/MovieDetailClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavBarClient from "@/components/NavBarClient";
import {
  getMovieById,
  isFavorite,
  toggleFavorite,
} from "@/lib/user-dashboard-actions";
import { getSession } from "@/hooks/getSession";

export default function MovieDetailClient({ movieId }: { movieId: string }) {
  const [movie, setMovie] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [message, setMessage] = useState("");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchAll() {
      const m = await getMovieById(movieId);
      setMovie(m);

      const s = await getSession();
      setSession(s);

      if (s?.user) {
        const fav = await isFavorite(movieId);
        setIsFavorited(fav);
      }

      setLoading(false);
    }

    fetchAll();
  }, [movieId]);

  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(movieId);
    if (!result.success) {
      setMessage(result.message || "Operation failed.");
    } else if (result.action === "added") {
      setIsFavorited(true);
      setMessage("✅ Added to favorites. You can view it in your Dashboard.");
    } else {
      setIsFavorited(false);
      setMessage("❎ Removed from favorites.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return <div className="p-6 text-gray-600 text-xl">⌛ Loading movie information...</div>;
  }

  if (!movie) {
    return <div className="p-6 text-red-600 text-xl">❌ Movie not found.</div>;
  }


  return (
      <div className="container mx-auto px-4 py-8 space-y-12">
        <NavBarClient />

        {/* 🎬️ Movie Detail Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {movie.image && (
              <div className="w-full md:w-1/3">
                <Image
                    src={movie.image}
                    alt={movie.name}
                    width={300}
                    height={450}
                    className="rounded-lg shadow-md"
                />
              </div>
          )}
          <div className="flex flex-col justify-start w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">🎬️ {movie.name}</h1>
            <p className="mb-2"><strong>Rating:</strong> {movie.rate}</p>
            <p className="mb-2"><strong>Duration:</strong> {Math.round(movie.length / 60)} minutes</p>
            <p className="mb-2"><strong>Description:</strong> {movie.description}</p>

            {!loading && session?.user ? (
                <>
                  <button
                      onClick={handleToggleFavorite}
                      className={`mt-4 px-4 py-2 rounded text-white ${
                          isFavorited
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {isFavorited ? "❎ Remove from Favorites" : "⭐ Add to Favorites"}
                  </button>
                  {message && <p className="text-sm mt-2 text-green-600">{message}</p>}
                </>
            ) : (
                !loading && <p className="text-sm mt-2 text-gray-500">Please log in to use the favorite feature.</p>
            )}
          </div>
        </div>

        {/* 🎟️ Showtimes Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">🎟️ Showtimes</h2>
          {movie.shows.length > 0 ? (
              <ul className="space-y-2">
                {movie.shows
                    .filter((s: any) => s.status === "PUBLISHED")
                    .sort((a: any, b: any) => new Date(a.beginTime).getTime() - new Date(b.beginTime).getTime())
                    .map((show: any) => {
                      const total = show.Seat.length;
                      const reserved = show.Seat.filter((seat: any) => seat.reserved).length;
                      const remaining = total - reserved;

                      return (
                          <li key={show.id} className="border p-4 rounded shadow-sm flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                              <p className="text-gray-700">
                                🕒 {new Date(show.beginTime).toLocaleString()} — {new Date(show.endTime).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">Status: {show.status}</p>
                              <p className="text-sm text-green-600 font-medium">
                                Remaining seats: {remaining} / {total}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              {remaining === 0 && (
                                  <span className="text-red-600 font-medium">❌ Sold Out</span>
                              )}
                              <a
                                  href={`/tickets/${show.id}`}
                                  className={`px-4 py-2 rounded text-white whitespace-nowrap ${
                                      remaining === 0
                                          ? "bg-gray-400 cursor-not-allowed"
                                          : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                                  style={{ pointerEvents: remaining === 0 ? "none" : "auto" }}
                              >
                                🎛 Buy Ticket
                              </a>
                            </div>
                          </li>
                      );
                    })}
              </ul>
          ) : (
              <p className="text-gray-600">No showtimes available.</p>
          )}
        </div>
      </div>
  );
}



