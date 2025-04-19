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

  const [movies, setMovies] = useState<MovieType[]>([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(""); 
  const [rating, setRating] = useState("");     
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);


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


  async function handleAddMovie() {
    if (!name || !duration || !rating) return;


    const parsedDuration = parseInt(duration, 10);
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      alert("Duration must be a positive integer (in seconds).");
      return;
    }
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 10) {
      alert("Rating must be between 0 and 10.");
      return;
    }

    const fixedRating = parseFloat(parsedRating.toFixed(1));

    let imageUrl: string | undefined = undefined;
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error("Image upload failed:", error);
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


  async function handleUpdateMovie(id: string) {
    const parsedEditingDuration = parseInt(editingDuration, 10);
    const parsedEditingRating = parseFloat(editingRating);
    if (isNaN(parsedEditingDuration) || parsedEditingDuration <= 0) {
      alert("Duration must be a positive integer (in seconds).");
      return;
    }
    if (isNaN(parsedEditingRating) || parsedEditingRating < 0 || parsedEditingRating > 10) {
      alert("Rating must be between 0 and 10.");
      return;
    }
    const fixedEditingRating = parseFloat(parsedEditingRating.toFixed(1));

    let imageUrl: string | undefined = undefined;
    if (editingImageFile) {
      try {
        imageUrl = await uploadImage(editingImageFile);
      } catch (error) {
        console.error("Image upload failed during update:", error);
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

        {/* Add Movie Form */}
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
                placeholder="Duration (seconds)"
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
          {/* File Upload Area */}
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
              Choose File
            </button>
            <span className="text-gray-600">
            {selectedFileName || "No file chosen"}
          </span>
          </div>
          <button
              onClick={handleAddMovie}
              className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Add Movie
          </button>
        </div>

        {/* Movie List */}
        <ul className="space-y-4">
          {movies.map((movie) => (
              <li key={movie.id}>
                {editingMovieId === movie.id ? (
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
                            placeholder="Duration (seconds)"
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
