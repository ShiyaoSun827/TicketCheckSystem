// src/components/MovieCard.tsx
"use client";

import Link from "next/link";

export interface Movie {
  id: string;
  name: string;
  length: number; // 电影时长（秒）
  rate: number;   // 电影评分（0～10 的一位小数）
  image?: string;
  description?: string;
}

interface MovieCardProps {
  movie: Movie;
  isAdmin?: boolean; // 如果为 true，则显示管理员操作按钮
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function MovieCard({ movie, isAdmin = false, onDelete, onEdit }: MovieCardProps) {
  return (
    <div className="flex items-center gap-4 border p-4 rounded">
      {/* 图片区域 */}
      <div className="flex-shrink-0">
        {movie.image ? (
          <img
            src={movie.image}
            alt={movie.name}
            className="w-20 h-20 object-cover rounded"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
      </div>

      {/* 电影信息区域 */}
      <div className="w-1/4">
        <h3 className="font-bold">{movie.name}</h3>
        <p className="text-sm text-gray-500">Duration: {movie.length} 秒</p>
        <p className="text-sm text-gray-500">Rating: {movie.rate}</p>
      </div>

      {/* 描述区域 */}
      <div className="flex-1">
        {movie.description ? (
          <p className="text-sm text-gray-600">{movie.description}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No description available
          </p>
        )}
      </div>

      {/* 操作按钮区域 */}
      <div className="flex flex-col gap-2">
        {isAdmin ? (
          <>
            <button
              onClick={() => onEdit && onEdit(movie.id)}
              className="bg-yellow-500 text-white px-2 py-1 rounded"
            >
              Update
            </button>
            <button
              onClick={() => onDelete && onDelete(movie.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
            <Link
              href={`/dashboard/admin/manageMovie/${movie.id}/shows`}
              className="bg-blue-500 text-white px-2 py-1 rounded text-center"
            >
              Manage Show
            </Link>
          </>
        ) : (
          <Link
            href={`/movies/${movie.id}`}
            className="bg-blue-500 text-white px-2 py-1 rounded text-center"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
