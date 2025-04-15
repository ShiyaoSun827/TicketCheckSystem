//src/app/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getStaffProfile,
  getAllShows,
  createShow,
  deleteShow,
} from "@/lib/admin-dashboard-actions";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import NavBarClient from "@/components/NavBarClient";

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
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const profile = await getStaffProfile();
      const shows = await getAllShows();
      setProfile(profile);
      setShows(shows);
    }
    loadData();
  }, []);

  async function handleDeleteShow(id: string) {
    await deleteShow(id);
    const updatedShows = await getAllShows();
    setShows(updatedShows);
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
    <div className="p-6">
      <NavBarClient session={session} />
      <h1 className="text-3xl font-bold mb-6">🧑‍💼 Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左侧区域 */}
        <div className="space-y-8">
          {profile && (
            <section>
              <h2 className="text-2xl font-semibold mb-2">🗂️ Profile</h2>
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Role:</strong> {profile.role}
              </p>
            </section>
          )}

          {/* 创建场次 */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">🎭 Create Showtimes</h2>
            <div className="flex gap-2 items-center mb-4">
              {/* 这里建议在创建场次时选择的电影数据可以从独立的 Manage Movies 页面维护 */}
              <select
                className="border p-2 rounded"
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
              >
                <option value="">Select Movie</option>
                {/* 此处可增加加载电影列表的逻辑，或提示“请前往管理电影维护电影信息” */}
              </select>

              <label htmlFor="startTime" className="text-sm">
                Start Time:
              </label>
              <input
                id="startTime"
                type="datetime-local"
                value={beginTime}
                onChange={(e) => setBeginTime(e.target.value)}
                className="border p-2 rounded"
              />

              <label htmlFor="endTime" className="text-sm">
                End Time:
              </label>
              <input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border p-2 rounded"
              />

              <button
                onClick={handleAddShow}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Show
              </button>
            </div>
            {shows.map((show) => (
              <div key={show.id} className="flex justify-between border p-2">
                <div>
                  <p>
                    <strong>Movie:</strong> {show.movie.name}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatDate(show.beginTime)} -{" "}
                    {formatDate(show.endTime)}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteShow(show.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}

            {/* 管理电影的入口 */}
            <button
              onClick={() => router.push("/dashboard/admin/manageMovie")}
              className="bg-yellow-600 text-white px-4 py-2 rounded mt-6"
            >
              Manage Movies
            </button>

            <button
              onClick={() => router.push("/")}
              className="bg-red-600 text-white px-4 py-2 rounded mt-6"
            >
              🔐 Logout
            </button>
          </section>
        </div>

        {/* 右侧区域：可以显示所有场次汇总 */}
        <div className="border p-4 rounded-xl shadow-lg h-fit bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-center">🎥 All Shows</h2>
          {shows.map((show) => (
            <div key={show.id}>
              <p>
                <strong>{show.movie.name}</strong>:{" "}
                {formatDate(show.beginTime)} - {formatDate(show.endTime)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
