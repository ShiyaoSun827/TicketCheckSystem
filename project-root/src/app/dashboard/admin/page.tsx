//src/app/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getStaffProfile,
  getAllShows,
  createShow,
  deleteShow, getMovies,
} from "@/lib/admin-dashboard-actions";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import NavBarClient from "@/components/NavBarClient";
import { getAllUsers, updateUserRole } from "@/lib/admin-dashboard-actions";


interface Show {
  id: string;
  movie: {
    id: string;
    name: string;
    type: string;
  };
  beginTime: string;
  endTime: string;
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default function StaffDashboardPage() {
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    role?: string;
  } | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [beginTime, setBeginTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [movies, setMovies] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [userMsg, setUserMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      const profile = await getStaffProfile();
      const shows = await getAllShows();
      const movies = await getMovies();
      const users = await getAllUsers();
      setProfile(profile);
      setShows(shows);
      setMovies(movies);
      setUsers(users);
    }
    loadData();
  }, []);


  async function handleDeleteShow(id: string) {
    await deleteShow(id);
    const updatedShows = await getAllShows();
    setShows(updatedShows);
  }

  async function handleRoleChange(userId: string, newRole: string) {
    await updateUserRole(userId, newRole);
    const updated = await getAllUsers();
    setUsers(updated);
    setUserMsg(`✅ Role updated to ${newRole}`);
  }

  async function handleAddShow() {
    if (!selectedMovie || !beginTime || !endTime) return;
    await createShow({ movieID: selectedMovie, beginTime, endTime });
    const shows = await getAllShows();
    setShows(shows);
    setSelectedMovie("");
    setBeginTime("");
    setEndTime("");
  }

  const { session } = authClient.useSession();

  return (
      <div className="p-6 space-y-10">
        <NavBarClient session={session} />
        <h1 className="text-3xl font-bold">🧑‍💼 Admin Dashboard</h1>

        {/* Grid 左右布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 左侧：Profile + Create Showtimes */}
          <div className="space-y-8">

            {/* 🧾 Profile 区块 */}
            {profile && (
                <section className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-2xl font-semibold mb-2">🧾 Profile</h2>
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Role:</strong> {profile.role}</p>
                </section>
            )}

            {/* 🎭 Create Showtimes */}
            <section className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">🎭 Create Showtimes</h2>
              <div className="flex flex-wrap gap-2 items-center mb-4">
                <select className="border p-2 rounded" value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)}>
                  <option value="">Select Movie</option>
                  {movies.map((movie) => (
                      <option key={movie.id} value={movie.id}>{movie.name}</option>
                  ))}
                </select>

                <input type="datetime-local" value={beginTime} onChange={(e) => setBeginTime(e.target.value)} className="border p-2 rounded" />
                <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded" />

                <button onClick={handleAddShow} className="bg-blue-600 text-white px-4 py-2 rounded">Add Show</button>
              </div>

              {shows.map((show) => (
                  <div key={show.id} className="flex justify-between border p-2 rounded mb-2">
                    <div>
                      <p><strong>Movie:</strong> {show.movie.name}</p>
                      <p><strong>Time:</strong> {formatDate(show.beginTime)} - {formatDate(show.endTime)}</p>
                    </div>
                    <button onClick={() => handleDeleteShow(show.id)} className="text-red-500 hover:underline">Delete</button>
                  </div>
              ))}

              <button onClick={() => router.push("/dashboard/admin/manageMovie")} className="bg-yellow-600 text-white px-4 py-2 rounded mt-4 mr-2">
                Manage Movies
              </button>
              <button onClick={() => router.push("/")} className="bg-red-600 text-white px-4 py-2 rounded mt-4">
                🔐 Logout
              </button>
            </section>
          </div>

          {/* 右侧：🎥 All Shows */}
          <div className="bg-white p-4 rounded-lg shadow h-fit">
            <h2 className="text-2xl font-semibold mb-4 text-center">🎥 All Shows</h2>
            {shows.map((show) => (
                <div key={show.id} className="mb-2">
                  <p><strong>{show.movie.name}</strong>: {formatDate(show.beginTime)} - {formatDate(show.endTime)}</p>
                </div>
            ))}
          </div>
        </div>

        {/* 👥 Manage User Roles：独立展示 */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">👥 Manage User Roles</h2>
          {userMsg && <p className="text-green-600">{userMsg}</p>}
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-center">Action</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user: any) => (
                <tr key={user.id} className="border-t">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <select
                        className="border p-1"
                        value={user.role ?? "attendee"}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="attendee">Attendee</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">✅</td>
                </tr>
            ))}
            </tbody>
          </table>
        </section>
      </div>

  );
}
