"use client";

import { useState, useTransition } from "react";
import { updateShow } from "@/lib/admin-dashboard-actions";
import { useRouter } from "next/navigation";

interface Props {
  showId: string;
  beginTime: string;
  length: number; // seconds
}

export default function EditShowButton({ showId, beginTime, length }: Props) {
  const [editing, setEditing] = useState(false);
  const [newBegin, setNewBegin] = useState(
    typeof beginTime === "string"
      ? beginTime.slice(0, 16)
      : new Date(beginTime).toISOString().slice(0, 16)
  );
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    const begin = new Date(newBegin);
    const end = new Date(begin.getTime() + length * 1000);

    startTransition(async () => {
      try {
        await updateShow({
          showId,
          beginTime: begin.toISOString(),
          endTime: end.toISOString(),
        });
        setMessage("✅ modify successfully");
        setEditing(false);
        router.refresh();
      } catch (err: any) {
        setMessage(`❌ fail to modify: ${err.message}`);
      }
    });
  };

  return (
    <div className="text-sm">
      {editing ? (
        <div className="flex flex-col gap-2 mt-2">
          <input
            type="datetime-local"
            value={newBegin}
            onChange={(e) => setNewBegin(e.target.value)}
            className="border p-1 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Submit modification
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>
          {message && <p className="text-xs text-gray-700">{message}</p>}
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-4 py-2 rounded"
        >
          ✏️ Edit
        </button>
      )}
    </div>
  );
}
