"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateShowPrice } from "@/lib/admin-dashboard-actions";

interface EditPriceButtonProps {
  showId: string;
  currentPrice: number;
}

export default function EditPriceButton({ showId, currentPrice }: EditPriceButtonProps) {
  const [price, setPrice] = useState(currentPrice.toString());
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    const parsed = parseFloat(price);
    if (isNaN(parsed) || parsed <= 0) {
      setMessage("价格必须为正数");
      return;
    }
    setMessage("");
    startTransition(async () => {
      try {
        await updateShowPrice(showId, parsed);
        setEditing(false);
        router.refresh();
      } catch (err: any) {
        setMessage(`❌ 价格更新失败: ${err.message}`);
      }
    });
  };

  return (
    <div className="relative">
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-20 px-2 py-1 border rounded"
            min="1"
          />
          <button
            className="bg-green-600 text-white px-2 py-1 rounded text-sm"
            onClick={handleSave}
            disabled={isPending}
          >
            保存
          </button>
          <button
            className="text-gray-500 text-sm underline"
            onClick={() => setEditing(false)}
          >
            取消
          </button>
        </div>
      ) : (
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
          onClick={() => setEditing(true)}
        >
          修改价格
        </button>
      )}
      {message && <p className="text-xs text-red-600 mt-1">{message}</p>}
    </div>
  );
}