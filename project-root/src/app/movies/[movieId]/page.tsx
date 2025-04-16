// src/app/movies/[movieId]/page.tsx ✅ 推荐改名
import { getMovieById } from "@/lib/admin-dashboard-actions";
import Image from "next/image";
import NavBar from "@/components/NavBar";

interface PageProps {
  params: {
    movieId: string;
  };
}

export default async function MovieDetailPage({ params }: PageProps) {
  const movie = await getMovieById(params.movieId);

  if (!movie) {
    return <div className="p-6 text-red-600 text-xl">❌ 未找到该电影</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <NavBar />
      {/* 🎬 电影详情区域 */}
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
          <h1 className="text-3xl font-bold mb-4">🎬 《{movie.name}》</h1>
          <p className="mb-2"><strong>评分：</strong>{movie.rate}</p>
          <p className="mb-2"><strong>时长：</strong>{Math.round(movie.length / 60)} 分钟</p>
          <p className="mb-2"><strong>简介：</strong>{movie.description}</p>
        </div>
      </div>

      {/* 🎟️ 排片展示区域 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">🎟️ 当前排片</h2>
        {movie.shows.length > 0 ? (
          <ul className="space-y-2">
            {movie.shows
              .filter((s) => s.status === "PUBLISHED" && !s.cancelled)
              .sort((a, b) => new Date(a.beginTime).getTime() - new Date(b.beginTime).getTime())
              .map((show) => (
                <li key={show.id} className="border p-4 rounded shadow-sm flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <p className="text-gray-700">
                      🕒 {new Date(show.beginTime).toLocaleString()} — {new Date(show.endTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">状态: {show.status}</p>
                  </div>
                  <a
                    href={`/tickets/${show.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
                  >
                    🎫 购票
                  </a>
                </li>
              ))
            }
          </ul>
        ) : (
          <p className="text-gray-600">暂无排片信息</p>
        )}
      </div>
    </div>
  );
}
