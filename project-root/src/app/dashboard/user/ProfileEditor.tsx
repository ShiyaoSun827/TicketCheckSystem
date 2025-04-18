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
      setMessage("没有需要更新的字段");
      return;
    }

    try {
      const result = await authClient.updateUser(updateData);

      if (result?.error) {
        setMessage("❌ 更新失败：" + result.error.message);
      } else {
        await authClient.session.refresh(); // ✅ 刷新全局 session
        setDisplayName(newName);
        setDisplayEmail(newEmail);
        setEditingProfile(false);
        setMessage("✅ 用户信息已更新");
      }
    } catch (err: any) {
      setMessage("❌ 更新失败：" + (err.message || "未知错误"));
    }
  }

  async function handleChangePassword() {
    setMessage(""); // 清空旧信息

    const result = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    if (result?.error) {
      const msg = result.error.message;
      const userFriendlyMessage =
        msg.includes("Password is too short")
          ? "❌ 新密码太短，请输入至少 8 位字符"
          : msg.includes("Invalid credentials")
          ? "❌ 当前密码错误"
          : "❌ 修改失败：" + msg;

      setMessage(userFriendlyMessage);
      return;
    }

    setMessage("✅ 密码修改成功！");
    setCurrentPassword("");
    setNewPassword("");
    setEditingPassword(false);
  }

  return (
    <div className="space-y-4 border p-4 rounded">
      <h3 className="text-xl font-semibold mb-2">🧾 用户资料</h3>

      <div className="space-y-2">
        <p><strong>用户名：</strong> {displayName}</p>
        <p><strong>邮箱：</strong> {displayEmail}</p>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setEditingProfile((prev) => !prev);
              setEditingPassword(false);
              setMessage("");
            }}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            修改资料
          </button>

          <button
            onClick={() => {
              setEditingPassword((prev) => !prev);
              setEditingProfile(false);
              setMessage("");
            }}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            修改密码
          </button>
        </div>
      </div>

      {editingProfile && (
        <div className="space-y-2 pt-2 border-t">
          <input
            placeholder="新用户名"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <input
            placeholder="新邮箱"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={handleUpdateUser}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            确认更新资料
          </button>
        </div>
      )}

      {editingPassword && (
        <div className="space-y-2 pt-2 border-t">
          <input
            type="password"
            placeholder="当前密码"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <input
            type="password"
            placeholder="新密码（至少8位）"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={handleChangePassword}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            确认修改密码
          </button>
        </div>
      )}

      {message && (
        <p className="text-sm text-center text-gray-700 mt-2">{message}</p>
      )}
    </div>
  );
}
