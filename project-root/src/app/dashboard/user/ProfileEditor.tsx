"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ProfileEditor({ name, email }: { name: string; email: string }) {
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [displayName, setDisplayName] = useState(name);
  const [displayEmail, setDisplayEmail] = useState(email);

  async function handleUpdateUser() {
    const updateData: any = {};
    if (newName && newName !== name) updateData.name = newName;
    if (newEmail && newEmail !== email) updateData.email = newEmail;

    if (Object.keys(updateData).length === 0) {
      setMessage("No fields to update.");
      return;
    }

    try {
      const result = await authClient.updateUser(updateData);

      if (result?.error) {
        setMessage("❌ Update failed: " + result.error.message);
      } else {
        await authClient.session.refresh();
        setDisplayName(newName);
        setDisplayEmail(newEmail);
        setEditingProfile(false);
        setMessage("✅ Profile updated successfully.");
      }
    } catch (err: any) {
      setMessage("❌ Update failed: " + (err.message || "Unknown error"));
    }
  }

  async function handleChangePassword() {
    setMessage("");

    const result = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    if (result?.error) {
      const msg = result.error.message;
      const userFriendlyMessage =
          msg.includes("Password is too short")
              ? "❌ New password too short. Please enter at least 8 characters."
              : msg.includes("Invalid credentials")
                  ? "❌ Incorrect current password."
                  : "❌ Password change failed: " + msg;

      setMessage(userFriendlyMessage);
      return;
    }

    setMessage("✅ Password changed successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setEditingPassword(false);
  }

  return (
      <div className="space-y-4 border p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">🧾 Profile Info</h3>

        <div className="space-y-2">
          <p><strong>Username:</strong> {displayName}</p>
          <p><strong>Email:</strong> {displayEmail}</p>

          <div className="flex gap-4">
            <button
                onClick={() => {
                  setEditingProfile((prev) => !prev);
                  setEditingPassword(false);
                  setMessage("");
                }}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>

            <button
                onClick={() => {
                  setEditingPassword((prev) => !prev);
                  setEditingProfile(false);
                  setMessage("");
                }}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Change Password
            </button>
          </div>
        </div>

        {editingProfile && (
            <div className="space-y-2 pt-2 border-t">
              <input
                  placeholder="New username"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
              />
              <input
                  placeholder="New email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
              />
              <button
                  onClick={handleUpdateUser}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Confirm Update
              </button>
            </div>
        )}

        {editingPassword && (
            <div className="space-y-2 pt-2 border-t">
              <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
              />
              <input
                  type="password"
                  placeholder="New password (min 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
              />
              <button
                  onClick={handleChangePassword}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Confirm Password Change
              </button>
            </div>
        )}

        {message && (
            <p className="text-sm text-center text-gray-700 mt-2">{message}</p>
        )}
      </div>
  );
}
