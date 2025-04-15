// src/app/dashboard/admin/manageMovies/[movieId]/shows/page.tsx

import AddShowForm from "@/components/AddShowForm"; 
import Image from "next/image";
import * as adminAction from "@/lib/admin-dashboard-actions";
import NavBar from "@/components/NavBar";
import SubmitShowButton from "./SubmitShowButton";
import DeleteShowButton from "./DeleteShowButton";

interface PageProps {
  params: {
    movieId: string;
  };
}

export default async function ShowManagementPage({ params }: PageProps) {
  const movieId = params.movieId;
  const movie = await adminAction.getMovieById(movieId);

  if (!movie) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600">❌ 未找到该电影</h1>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <NavBar />

      {/* 上方区域：展示电影详情 */}
      <div className="flex flex-col md:flex-row gap-6 border p-4 rounded-lg shadow-sm">
        {movie.image && (
          <div className="flex-shrink-0">
            <Image
              src={movie.image}
              alt={movie.name}
              width={300}
              height={450}
              className="rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-4">🎬 《{movie.name}》</h1>
          <p className="mb-2"><strong>类型：</strong>{movie.type}</p>
          <p className="mb-2"><strong>上映时间：</strong>{new Date(movie.showTime).toLocaleString()}</p>
          <p className="mb-2"><strong>时长：</strong>{movie.length} 秒</p>
          <p className="mb-2"><strong>图片路径：</strong>{movie.image}</p>
          <p className="mb-2"><strong>简介：</strong>{movie.description}</p>
        </div>
      </div>

      {/* 下方区域：Show 管理功能 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">🎟️ 排片管理</h2>

        {/* 添加排片表单（客户端组件） */}
        <AddShowForm movieId={movie.id} length={movie.length} />

        {/* 当前所有排片列表 */}
        {movie.shows.length > 0 ? (
        <ul className="space-y-2">
          {movie.shows.map((show) => (
            <li key={show.id} className="border p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="font-semibold whitespace-nowrap">🎬 《{movie.name}》</p>
                  <p className="text-sm text-gray-700 ml-8">
                    🎞 {new Date(show.beginTime).toLocaleString()} — {new Date(show.endTime).toLocaleString()}
                  </p>
                  <span className="text-xs text-gray-500">[{show.status}]</span>
                </div>
                <div className="flex gap-2">
                  {show.status === "DRAFT" && (
                    <>
                      <SubmitShowButton showId={show.id} />
                      <DeleteShowButton showId={show.id} />
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>暂无排片信息</p>
      )}
      </div>
    </div>
  );
}
