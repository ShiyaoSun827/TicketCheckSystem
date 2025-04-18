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

  async function handleRoleChange(userId: string, newRole: string) {
    await updateUserRole(userId, newRole);
    const updated = await getAllUsers();
    setUsers(updated);
    setUserMsg(`✅ Role updated to ${newRole}`);
  }

  return (
      <div className="p-4 md:p-6 space-y-10 max-w-screen-xl mx-auto">
        <NavBarClient session={session} />
        <h1 className="text-3xl font-bold">🧑‍💼 Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-8">
            {profile && (
                <section className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-2xl font-semibold mb-2">🧾 Profile</h2>
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Role:</strong> {profile.role}</p>
                </section>
            )}

            <section className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">🎭 Create Showtimes</h2>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4">
                <select
                    className="border p-2 rounded-md"
                    value={selectedMovie}
                    onChange={(e) => setSelectedMovie(e.target.value)}
                >
                  <option value="">Select Movie</option>
                  {movies.map((movie) => (
                      <option key={movie.id} value={movie.id}>{movie.name}</option>
                  ))}
                </select>

                <input
                    type="datetime-local"
                    placeholder="Start Time"
                    value={beginTime}
                    onChange={(e) => setBeginTime(e.target.value)}
                    className="border p-2 rounded-md"
                />
                <input
                    type="datetime-local"
                    placeholder="End Time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border p-2 rounded-md"
                />

                <button
                    onClick={handleAddShow}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Add Show
                </button>
              </div>

              {shows.map((show) => (
                  <div key={show.id} className="flex justify-between border p-2 rounded mb-2">
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

              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                    onClick={() => router.push("/dashboard/admin/manageMovie")}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md"
                >
                  Manage Movies
                </button>
                <button
                    onClick={() => router.push("/")}
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  🔐 Logout
                </button>
              </div>
            </section>
          </div>

          <div className="bg-white p-4 rounded-lg shadow h-fit">
            <h2 className="text-2xl font-semibold mb-4 text-center">🎥 All Shows</h2>
            {shows.map((show) => (
                <div key={show.id} className="mb-2">
                  <p><strong>{show.movie.name}</strong>: {formatDate(show.beginTime)} - {formatDate(show.endTime)}</p>
                </div>
            ))}
          </div>
        </div>

        <section className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">👥 Manage User Roles</h2>
          {userMsg && <p className="text-green-600">{userMsg}</p>}
          <table className="w-full min-w-[600px] border text-sm">
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
                        className="border p-1 rounded"
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