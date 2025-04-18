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
        <div className="flex flex-col sm:flex-row items-start gap-4 border p-4 rounded bg-white shadow-sm">
            {/* 图片区域 */}
            <div className="flex-shrink-0 self-center sm:self-start">
                {movie.image ? (
                    <img
                        src={movie.image}
                        alt={movie.name}
                        className="w-32 h-48 object-cover rounded"
                    />
                ) : (
                    <div className="w-32 h-48 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                )}
            </div>

            {/* 文字 + 按钮区域 */}
            <div className="flex-1 flex flex-col gap-2">
                {/* 电影信息 */}
                <div>
                    <h3 className="text-xl font-semibold">{movie.name}</h3>
                    <p className="text-sm text-gray-600">
                        <strong>Duration:</strong> {Math.round(movie.length / 60)} min
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Rating:</strong> {movie.rate}
                    </p>
                </div>

                {/* 描述 */}
                <p className="text-sm text-gray-500">
                    {movie.description || <i className="text-gray-400">No description available</i>}
                </p>

                {/* 按钮 */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {isAdmin ? (
                        <>
                            <button
                                onClick={() => onEdit && onEdit(movie.id)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => onDelete && onDelete(movie.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Delete
                            </button>
                            <Link
                                href={`/dashboard/admin/manageMovie/${movie.id}/shows`}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm text-center"
                            >
                                Manage Show
                            </Link>
                        </>
                    ) : (
                        <Link
                            href={`/movies/${movie.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm text-center"
                        >
                            View Details
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
