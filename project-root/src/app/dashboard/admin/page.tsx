"use client";

import { useEffect, useState } from "react";
import { getStaffProfile, getMovies,getAllShows, createMovie, deleteMovie, createShow,deleteShow } from "@/lib/admin-dashboard-actions";
import { useRouter } from "next/navigation";

interface Movie {
  id: string;
  name: string;
  type: string;
}

interface Show {
  id: string;
  movie: Movie;
  beginTime: string;
  endTime: string;
}
// Define the formatDate function
function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
export default function StaffDashboardPage() {
  const [profile, setProfile] = useState<{ name: string; email: string; role: string } | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<Show[]>([]); // State for shows
  const [expandedMovieId, setExpandedMovieId] = useState<string | null>(null); // ⬅️ Toggle show view
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [beginTime, setBeginTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const profile = await getStaffProfile();
      const movies = await getMovies();
      const shows = await getAllShows(); // Fetch shows data
      setProfile(profile);
      setMovies(movies);
      setShows(shows); // Set shows data
    }
    loadData();
  }, []);

  async function handleAddMovie() {
    await createMovie({ name, type });
    setName("");
    setType("");
    const movies = await getMovies();
    setMovies(movies);
  }

  async function handleDeleteMovie(id: string) {
    await deleteMovie(id);
    const [movies, shows] = await Promise.all([getMovies(), getAllShows()]);
    setMovies(movies);
    setShows(shows);
  }

  async function handleDeleteShow(id: string) {
    await deleteShow(id); // must be imported from your actions
    const updatedShows = await getAllShows(); // Fetch updated shows
    setShows(updatedShows);
  }

  async function handleAddShow() {
    if (!selectedMovie || !beginTime || !endTime) return;
    await createShow({ movieID: selectedMovie, beginTime, endTime });
     // Refresh shows list after adding a new show
    const shows = await getAllShows();
    setShows(shows);
    setSelectedMovie("");
    setBeginTime("");
    setEndTime("");
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🧑‍💼 Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side */}
        <div className="space-y-8">
          {profile && (
            <section>
              <h2 className="text-2xl font-semibold mb-2">🗂️ Profile</h2>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role}</p>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold mb-2">🎬 Manage Movies</h2>
            <div className="flex gap-2 mb-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="border px-2 py-1 rounded w-1/2"
              />
              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Type"
                className="border px-2 py-1 rounded w-1/2"
              />
              <button onClick={handleAddMovie} className="bg-green-600 text-white px-3 py-1 rounded">
                Add Movie
              </button>
            </div>
            <ul className="space-y-2">
              {movies.map((movie) => (
                <li key={movie.id} className="border p-2 rounded flex justify-between">
                  <span><strong>{movie.name}</strong> ({movie.type})</span>
                  <button onClick={() => handleDeleteMovie(movie.id)} className="text-red-500">Delete</button>
                </li>
              ))}
            </ul>
          </section>

          <section>
        <h2 className="text-2xl font-semibold mb-2 mt-6">🎭 Create Showtimes</h2>
        <div className="flex gap-2 items-center mb-4">
            <select
            className="border p-2 rounded"
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
            >
            <option value="">Select Movie</option>
            {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                {movie.name}
                </option>
            ))}
            </select>

              <label htmlFor="startTime" className="text-sm">Start Time:</label>
              <input
                id="startTime"
                type="datetime-local"
                value={beginTime}
                onChange={(e) => setBeginTime(e.target.value)}
                className="border p-2 rounded"
              />

              <label htmlFor="endTime" className="text-sm">End Time:</label>
              <input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border p-2 rounded"
              />

            <button onClick={handleAddShow} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Show
            </button>
        </div>
            {shows.map((show) => (
        <div key={show.id} className="flex justify-between border p-2">
        <div>
            <p><strong>Movie:</strong> {show.movie.name}</p>
            <p><strong>Time:</strong> {formatDate(show.beginTime)} - {formatDate(show.endTime)}</p>
            </div>
            <button
            onClick={() => handleDeleteShow(show.id)}
            className="text-red-500 hover:underline"
            >
            Delete
            </button>
        </div>
        ))}


        
        
      
            <button
              onClick={() => {
               
                router.push("/");
              }}
              className="bg-red-600 text-white px-4 py-2 rounded mt-6"
            >
              🔐 Logout
            </button>
          </section>
        </div>
        
        <div className="border p-4 rounded-xl shadow-lg h-fit bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-center">🎥 All Movies</h2>
          {movies.map((movie) => (
            <div key={movie.id}>
              <button
                onClick={() =>
                  setExpandedMovieId(expandedMovieId === movie.id ? null : movie.id)
                }
                className="w-full text-left font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
              >
                {movie.name} <span className="text-gray-500">({movie.type})</span>
              </button>
              {expandedMovieId === movie.id && (
                <ul className="ml-4 mt-2 border-t pt-2 space-y-1 text-sm text-gray-700">
                  {shows.filter(show => show.movie.id === movie.id).map((show) => (
                    <li key={show.id} className="flex justify-between">
                      <span>
                        🕒 {new Date(show.beginTime).toLocaleString()} → {new Date(show.endTime).toLocaleString()}
                      </span>
                      
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>


        
      </div>
    </div>
  );
}
