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
      setMessage("❗ Please select the start time.");
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setMessage("❗ Please provide a valid price.");
      return;
    }

    startTransition(async () => {
      try {
        await createShow({
          movieID: movieId,
          beginTime,
          price: parsedPrice,
        });
        setMessage("✅ Successfully add a show.");
        setBeginTime("");
        setPrice("");
        setComputedEndTime(null);
        router.refresh();
      } catch (err: any) {
        setMessage(`❌ Fail to add a show：${err.message}`);
      }
    });
  };

  return (
    <div className="border p-4 rounded mb-6">
      <h3 className="text-xl font-semibold mb-2">➕ Add new show</h3>

      <label className="block mb-1">Start time:</label>
      <input
        type="datetime-local"
        value={beginTime}
        onChange={(e) => handleBeginTimeChange(e.target.value)}
        className="border p-2 rounded w-64 mb-2"
      />

      {computedEndTime && (
        <p className="text-sm text-green-700 mb-2">
          🕓 End time of automatic calculation: <strong>{computedEndTime}</strong>
        </p>
      )}

      <label className="block mb-1">Ticket peice ($)：</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0.01"
        step="0.01"
        placeholder="Please enter the ticket price"
        className="border p-2 rounded w-64 mb-4"
      />

      <p className="text-sm text-gray-500 mb-4">
        Duration: {length} seconds (about {Math.round(length / 60)} mintues)
      </p>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isPending ? "Submitting..." : "add show"}
      </button>

      {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
    </div>
  );
}