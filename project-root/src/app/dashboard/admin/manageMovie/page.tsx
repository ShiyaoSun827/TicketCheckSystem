// src/app/dashboard/admin/manageMovie/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  getMovies,
  createMovie,
  deleteMovie,
  updateMovie,
} from "@/lib/admin-dashboard-actions";
import { useRouter } from "next/navigation";
import NavBarClient from "@/components/NavBarClient";
import { authClient } from "@/lib/auth-client";
import MovieCard, { Movie as MovieType } from "@/components/MovieCard";

export default function ManageMoviesPage() {
  // 新增电影的状态
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(""); // 电影时长输入（字符串）
  const [rating, setRating] = useState("");     // 电影评分输入（字符串）
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 编辑（更新）电影的状态
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDuration, setEditingDuration] = useState("");
  const [editingRating, setEditingRating] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingImageFile, setEditingImageFile] = useState<File | null>(null);
  const [editingSelectedFileName, setEditingSelectedFileName] = useState("");
  const editingFileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    async function loadMovies() {
      const movies = await getMovies();
      setMovies(movies);
    }
    loadMovies();
  }, []);

  // 上传图片函数（适用于新增/更新）
  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }
    return data.url;
  }

  // 新增电影处理
  async function handleAddMovie() {
    if (!name || !duration || !rating) return;

    // 转换并校验时长和评分
    const parsedDuration = parseInt(duration, 10);
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      alert("时长必须为正整数（单位：秒）");
      return;
    }
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 10) {
      alert("评分必须介于 0 到 10 之间");
      return;
    }
    // 格式化评分为一位小数
    const fixedRating = parseFloat(parsedRating.toFixed(1));

    let imageUrl: string | undefined = undefined;
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error("图片上传失败:", error);
        return;
      }
    }

    await createMovie({
      name,
      length: parsedDuration,
      rate: fixedRating,
      image: imageUrl,
      description,
    });

    // 清空新增表单状态
    setName("");
    setDuration("");
    setRating("");
    setDescription("");
    setImageFile(null);
    setSelectedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    const movies = await getMovies();
    setMovies(movies);
    router.push("/dashboard/admin/manageMovie");
  }

  async function handleDeleteMovie(id: string) {
    await deleteMovie(id);
    const movies = await getMovies();
    setMovies(movies);
  }

  // 更新电影处理
  async function handleUpdateMovie(id: string) {
    const parsedEditingDuration = parseInt(editingDuration, 10);
    const parsedEditingRating = parseFloat(editingRating);
    if (isNaN(parsedEditingDuration) || parsedEditingDuration <= 0) {
      alert("时长必须为正整数（单位：秒）");
      return;
    }
    if (isNaN(parsedEditingRating) || parsedEditingRating < 0 || parsedEditingRating > 10) {
      alert("评分必须介于 0 到 10 之间");
      return;
    }
    const fixedEditingRating = parseFloat(parsedEditingRating.toFixed(1));

    let imageUrl: string | undefined = undefined;
    if (editingImageFile) {
      try {
        imageUrl = await uploadImage(editingImageFile);
      } catch (error) {
        console.error("更新图片上传失败:", error);
        return;
      }
    }
    const dataToUpdate: any = {
      name: editingName,
      length: parsedEditingDuration,
      rate: fixedEditingRating,
      description: editingDescription,
    };
    if (imageUrl !== undefined) {
      dataToUpdate.image = imageUrl;
    }
    await updateMovie({ id, ...dataToUpdate });
    setEditingMovieId(null);
    const movies = await getMovies();
    setMovies(movies);
  }

  const { session } = authClient.useSession();

  return (
    <div className="p-6">
      <NavBarClient session={session} />
      <h1 className="text-3xl font-bold mb-6">🎬 Manage Movies</h1>

      {/* 添加电影表单 */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Movie Name"
            className="border px-2 py-1 rounded w-1/3"
          />
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (秒)"
            type="number"
            min="1"
            className="border px-2 py-1 rounded w-1/3"
          />
          <input
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Rating (0-10)"
            type="number"
            min="0"
            max="10"
            step="0.1"
            className="border px-2 py-1 rounded w-1/3"
          />
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Movie Description"
          className="border px-2 py-1 rounded w-full"
        />
        {/* 自定义文件上传区域（新增） */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setImageFile(file);
                setSelectedFileName(file.name);
                e.target.value = "";
              }
            }}
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => fileInputRef.current?.click()}
          >
            选择文件
          </button>
          <span className="text-gray-600">
            {selectedFileName || "未选择文件"}
          </span>
        </div>
        <button
          onClick={handleAddMovie}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Add Movie
        </button>
      </div>

      {/* 显示电影列表 */}
      <ul className="space-y-4">
        {movies.map((movie) => (
          <li key={movie.id}>
            {editingMovieId === movie.id ? (
              // 显示更新表单
              <div className="mt-4 p-4 border rounded bg-gray-50">
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    placeholder="Movie Name"
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    value={editingDuration}
                    onChange={(e) => setEditingDuration(e.target.value)}
                    placeholder="Duration (秒)"
                    min="1"
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    value={editingRating}
                    onChange={(e) => setEditingRating(e.target.value)}
                    placeholder="Rating (0-10)"
                    min="0"
                    max="10"
                    step="0.1"
                    className="border px-2 py-1 rounded"
                  />
                  <textarea
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    placeholder="Movie Description"
                    className="border px-2 py-1 rounded"
                  />
                  {/* 更新图片上传区域 */}
                  <div className="flex items-center gap-2">
                    <input
                      ref={editingFileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setEditingImageFile(file);
                          setEditingSelectedFileName(file.name);
                          e.target.value = "";
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => editingFileInputRef.current?.click()}
                    >
                      Choose Image
                    </button>
                    <span className="text-gray-600">
                      {editingSelectedFileName || "No file chosen"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateMovie(movie.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingMovieId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // 调用 MovieCard 组件
              <MovieCard
                movie={movie}
                isAdmin={true}
                onDelete={handleDeleteMovie}
                onEdit={(id) => {
                  setEditingMovieId(id);
                  setEditingName(movie.name);
                  setEditingDuration(movie.length.toString());
                  setEditingRating(movie.rate.toString());
                  setEditingDescription(movie.description || "");
                  setEditingImageFile(null);
                  setEditingSelectedFileName("");
                  if (editingFileInputRef.current) {
                    editingFileInputRef.current.value = "";
                  }
                }}
              />
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={() => router.push("/dashboard/admin")}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-6"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
