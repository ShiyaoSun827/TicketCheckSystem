"use client";

import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "@/lib/admin-dashboard-actions";

interface User {
    id: string;
    name: string;
    email: string;
    role: string | null;
}

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            const result = await getAllUsers();
            setUsers(result);
        }
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        await updateUserRole(userId, newRole);
        setMessage(`✅ Role updated to ${newRole}`);
        // 重新拉取数据
        const updated = await getAllUsers();
        setUsers(updated);
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">🛠 Manage Users</h1>

            {message && <p className="text-green-600">{message}</p>}

            <table className="w-full border">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Role</th>
                    <th className="p-2 text-center">Update</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
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
        </div>
    );
}
