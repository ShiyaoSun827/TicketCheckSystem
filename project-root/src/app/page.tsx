// src/app/page.tsx
// "use client";

import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import MovieCard from "@/components/MovieCard";
import { getMovies } from "@/lib/admin-dashboard-actions";

async function MoviesSection() {
  const movies = await getMovies();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} isAdmin={false} />
      ))}
    </div>
  );
}

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <NavBar />
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">Movie Ticket System</h1>
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
          <h2 className="text-2xl font-semibold mb-4">==Movies==</h2>
          <Suspense fallback={<p>Loading movies...</p>}>
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
