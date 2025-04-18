// src/app/movies/[movieId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import MovieDetailClient from "./MovieDetailClient";

export default function MovieDetailPage() {
    const params = useParams();
    const movieId = typeof params?.movieId === "string" ? params.movieId : "";

    return <MovieDetailClient movieId={movieId} />;
}
