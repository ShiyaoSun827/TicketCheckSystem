// src/app/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getStaffProfile,
  getAllUsers,
  updateUserRole,
} from "@/lib/admin-dashboard-actions";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import NavBarClient from "@/components/NavBarClient";
import MovieManager from "./MovieManager";
import ShowManager from "./ShowManager";

export default function AdminDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [users, setUsers] = useState([]);
  const [userMsg, setUserMsg] = useState("");
  const router = useRouter();
  const { session } = authClient.useSession();

  useEffect(() => {
    async function loadData() {
      const [profile, users] = await Promise.all([
        getStaffProfile(),
        getAllUsers(),
      ]);
      setProfile(profile);
      setUsers(users);
    }
    loadData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateUserRole(userId, newRole);
    setUsers(await getAllUsers());
    setUserMsg(`✅ Role updated to ${newRole}`);
  };

  async function handleRoleChange(userId: string, newRole: string) {
    await updateUserRole(userId, newRole);
    const updated = await getAllUsers();
    setUsers(updated);
    setUserMsg(`✅ Role updated to ${newRole}`);
  }

  return (

    <div className="p-6 space-y-10">
      <NavBarClient session={session} />
      <h1 className="text-3xl font-bold">🧑‍💼 Admin Dashboard</h1>

      {/* 🎬 Manage Movies 按钮 */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push("/dashboard/admin/manageMovie")}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          🎬 Manage Movies
        </button>
      </div>

      {/* 🧾 Profile */}
      {profile && (
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">🧾 Profile</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </section>
      )}

      {/* 🎞️ All movie */}
      <MovieManager />

      {/* 🎥 All session row */}
      <ShowManager />

      {/* 👥 User Management */}
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