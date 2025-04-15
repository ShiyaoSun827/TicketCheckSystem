"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createShow } from "@/lib/admin-dashboard-actions";

interface AddShowFormProps {
  movieId: string;
  length: number;
}

export default function AddShowForm({ movieId, length }: AddShowFormProps) {
  const [beginTime, setBeginTime] = useState("");
  const [price, setPrice] = useState("");
  const [computedEndTime, setComputedEndTime] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleBeginTimeChange = (value: string) => {
    setBeginTime(value);

    if (value) {
      const begin = new Date(value);
      const end = new Date(begin.getTime() + length * 1000);
      setComputedEndTime(end.toLocaleString());
    } else {
      setComputedEndTime(null);
    }
  };

  const handleSubmit = () => {
    setMessage("");

    const parsedPrice = parseFloat(price);
    if (!beginTime) {
      setMessage("❗ 请选择开始时间");
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setMessage("❗ 请输入有效的价格（正数）");
      return;
    }

    startTransition(async () => {
      try {
        await createShow({
          movieID: movieId,
          beginTime,
          price: parsedPrice,
        });
        setMessage("✅ 排片添加成功");
        setBeginTime("");
        setPrice("");
        setComputedEndTime(null);
        router.refresh();
      } catch (err: any) {
        setMessage(`❌ 添加失败：${err.message}`);
      }
    });
  };

  return (
    <div className="border p-4 rounded mb-6">
      <h3 className="text-xl font-semibold mb-2">➕ 添加新的排片</h3>

      <label className="block mb-1">开始时间：</label>
      <input
        type="datetime-local"
        value={beginTime}
        onChange={(e) => handleBeginTimeChange(e.target.value)}
        className="border p-2 rounded w-64 mb-2"
      />

      {computedEndTime && (
        <p className="text-sm text-green-700 mb-2">
          🕓 自动计算的结束时间：<strong>{computedEndTime}</strong>
        </p>
      )}

      <label className="block mb-1">票价（¥）：</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0.01"
        step="0.01"
        placeholder="请输入票价"
        className="border p-2 rounded w-64 mb-4"
      />

      <p className="text-sm text-gray-500 mb-4">
        时长：{length} 秒（约 {Math.round(length / 60)} 分钟）
      </p>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isPending ? "提交中..." : "添加排片"}
      </button>

      {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
    </div>
  );
}