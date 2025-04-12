import Link from "next/link";
import { Suspense } from "react";
// import MovieList from "@/components/MovieList";
import type { Movie } from "@prisma/client";

// 异步获取电影数据，调用 /api/movies 接口
async function getMovies(): Promise<{
  movies: (Movie & { authors: { name: string }[] })[];
  error: string | null;
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const url = new URL("/api/movies", baseUrl);
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch movies");
    }
    const data = await res.json();
    return { movies: data.movies ?? [], error: null };
  } catch {
    return { movies: [], error: "error loading movies" };
  }
}

async function MoviesSection() {
  const { movies, error } = await getMovies();
  if (error) {
    return (
      <p className="text-center text-red-500" data-testid="movies-error">
        {error}
      </p>
    );
  }
  return <MovieList movies={movies} />;
}

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">Movie Ticket System</h1>
        {/* 导航栏 */}
        <nav className="mt-4 flex justify-center space-x-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Main Page
          </Link>
          <Link href="/bookings" className="text-blue-600 hover:text-blue-800">
            login
          </Link>
          <Link href="/movies" className="text-blue-600 hover:text-blue-800">
            On show
          </Link>
          <Link href="/contact" className="text-blue-600 hover:text-blue-800">
            contract us
          </Link>
        </nav>
        {/* 搜索框 */}
        <div className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </header>

      {/* Main 内容 */}
      <main>
        <section>
          <h2 className="text-2xl font-semibold mb-4">on show</h2>
          <Suspense fallback={<p>loading movie...</p>}>
            <MoviesSection />
          </Suspense>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Movie Ticket System. All rights reserved.
      </footer>
    </div>
  );
}

export const dynamic = "force-dynamic";
