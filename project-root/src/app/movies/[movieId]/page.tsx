// src/app/movies/[movieId]/page.tsx
import MovieDetailClient from "./MovieDetailClient";

export default async function MovieDetailPage({
  params,
}: {
  params: { movieId: string };
}) {
  return <MovieDetailClient movieId={params.movieId} />;
}
