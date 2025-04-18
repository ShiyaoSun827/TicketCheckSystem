// src/app/dashboard/admin/manageMovie/[movieId]/shows/page.tsx
export const dynamic = "force-dynamic";

import AddShowForm from "@/app/dashboard/admin/manageMovie/[movieId]/shows/AddShowForm"; 
import Image from "next/image";
import * as adminAction from "@/lib/admin-dashboard-actions";
import NavBar from "@/components/NavBar";
import SubmitShowButton from "./SubmitShowButton";
import DeleteShowButton from "./DeleteShowButton";
import EditShowButton from "./EditShowButton";
import CancelShowButton from "./CancelShowButton";
import EditPriceButton from "./EditPriceButton";

interface PageProps {
  params: {
    movieId: string;
  };
}

export default async function ShowManagementPage(props: PageProps) {
  const { movieId } = props.params;
  const movie = await adminAction.getMovieById(movieId);

  if (!movie) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600">❌ 未找到该电影</h1>
      </div>
    );
  }

  const draftShows = movie.shows.filter((show) => show.status === "DRAFT");
  const publishedShows = movie.shows.filter((show) => show.status === "PUBLISHED");
  const cancelledShows = movie.shows.filter((show) => show.status === "CANCELLED");

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

        <AddShowForm movieId={movie.id} length={movie.length} />

        {/* 未提交排片 */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">📝 待提交排片</h3>
          {draftShows.length > 0 ? (
            <ul className="space-y-2">
              {draftShows.map((show) => (
                <li key={show.id} className="border p-2 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <p className="font-semibold whitespace-nowrap">🎬 《{movie.name}》</p>
                      <p className="text-sm text-gray-700 ml-8">
                        🎞 {new Date(show.beginTime).toLocaleString()} — {new Date(show.endTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-600 ml-4">💰 ¥{show.price?.toFixed(2)}</p>
                      <span className="text-xs text-gray-500">[{show.status}]</span>
                    </div>
                    <div className="flex gap-2">
                      <EditShowButton showId={show.id} beginTime={show.beginTime} length={movie.length} />
                      <EditPriceButton showId={show.id} currentPrice={show.price || 0} />
                      <SubmitShowButton showId={show.id} />
                      <DeleteShowButton showId={show.id} />
                      <CancelShowButton showId={show.id} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">暂无待提交排片</p>
          )}
        </div>

        {/* ✅ 已提交排片 */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">✅ 已提交排片</h3>
          {publishedShows.length > 0 ? (
            <ul className="space-y-2">
              {publishedShows.map((show) => (
                <li key={show.id} className="border p-2 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <p className="font-semibold whitespace-nowrap">🎬 《{movie.name}》</p>
                      <p className="text-sm text-gray-700 ml-8">
                        🎞 {new Date(show.beginTime).toLocaleString()} — {new Date(show.endTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-600 ml-4">💰 ¥{show.price?.toFixed(2)}</p>
                      <span className="text-xs text-gray-500">[{show.status}]</span>
                    </div>
                    <CancelShowButton showId={show.id} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">暂无已提交排片</p>
          )}
        </div>

        {/* ❌ 已取消排片 */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">❌ 已取消排片</h3>
          {cancelledShows.length > 0 ? (
            <ul className="space-y-2">
              {cancelledShows.map((show) => (
                <li key={show.id} className="border p-2 rounded bg-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-gray-500">🎬 《{movie.name}》</p>
                      <p className="text-sm text-gray-500">
                        🎞 {new Date(show.beginTime).toLocaleString()} — {new Date(show.endTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 ml-4">💰 ¥{show.price?.toFixed(2)}</p>
                      <span className="text-xs text-red-500 font-semibold">[CANCELLED]</span>
                    </div>
                    <DeleteShowButton showId={show.id} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">暂无已取消排片</p>
          )}
        </div>
      </div>
    </div>
  );
}
