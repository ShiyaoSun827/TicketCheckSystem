//src/app/tickets/[showId]/TicketClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SeatPicker from "./SeatPicker";
import { addToCart, deleteCartItem } from "@/lib/user-dashboard-actions";
import { authClient } from "@/lib/auth-client";

interface Seat {
  id: string;
  row: string;
  col: number;
  reserved: boolean;
}

interface TicketClientProps {
  show: any;
  seats: Seat[];
  inCartSeats: string[];
}

export default function TicketClient({ show, seats, inCartSeats }: TicketClientProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [cartSeats, setCartSeats] = useState<string[]>(inCartSeats);
  const [refreshKey, setRefreshKey] = useState<number>(0); // ⏮️ SeatPicker 重置 key
  const router = useRouter();
  const { session } = authClient.useSession();

  const handleAddToCart = async () => {
    if (selectedSeats.length === 0) {
      alert("请先选择座位");
      return;
    }

    try {
      await addToCart(show.id, selectedSeats);
      setCartSeats([...cartSeats, ...selectedSeats]);
      setSelectedSeats([]);
      setRefreshKey((k) => k + 1); // ⏮️ 触发 SeatPicker 重置
    } catch (err) {
      console.error("加入购物车失败:", err);
      alert("加入购物车失败");
    }
  };

  const handleRemoveFromCart = async (seat: string) => {
    try {
      await deleteCartItem(show.id, seat);
      setCartSeats((prev) => prev.filter((s) => s !== seat));
    } catch (err) {
      console.error("从购物车移除失败:", err);
      alert("从购物车移除失败");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-6">
        {show.movie.image && (
          <Image
            src={show.movie.image}
            alt={show.movie.name}
            width={200}
            height={300}
            className="rounded shadow"
          />
        )}
        <div className="space-y-1">
          <p>🎬 电影名称：{show.movie.name}</p>
          <p>📅 时间：{new Date(show.beginTime).toLocaleString()}</p>
          <p>⌛ 时长：{Math.round(show.movie.length / 60)} 分钟</p>
          <p>💰 单价：¥{show.price?.toFixed(2) ?? "N/A"}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">🎟️ 选择座位</h2>
          <SeatPicker
            key={refreshKey} // ⏮️ 触发 SeatPicker 重置
            seats={seats}
            inCartSeats={cartSeats}
            onSelect={setSelectedSeats}
          />
          <div className="mt-4 text-center text-gray-700">
            已选择：{selectedSeats.length > 0 ? selectedSeats.join(", ") : "无"}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="bg-green-600 text-white px-6 py-2 rounded text-lg hover:bg-green-700"
            >
              加入购物车（共 {selectedSeats.length} 个）
            </button>
            <button
              onClick={() => setSelectedSeats([])}
              className="bg-gray-400 text-white px-6 py-2 rounded text-lg hover:bg-gray-500"
            >
              取消选择
            </button>
          </div>
            <button
              onClick={() => router.push("/dashboard/user/cart")}
              className="bg-gray-400 text-white px-6 py-2 rounded text-lg hover:bg-gray-500"
            >
              前往购物车页面
            </button>
        </div>

        <div className="w-full md:w-64 p-4 bg-gray-50 border rounded">
          <h3 className="text-lg font-semibold mb-2">🧾 当前购物车座位</h3>
          {cartSeats.length === 0 ? (
            <p className="text-sm text-gray-600">暂无座位加入购物车</p>
          ) : (
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
              {cartSeats.map((seat) => (
                <li key={seat} className="flex justify-between items-center">
                  <span>{seat}</span>
                  <button
                    onClick={() => handleRemoveFromCart(seat)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    移除
                  </button>
                </li>
              ))}
            </ul>
          )}

          <hr className="my-4" />
          <h3 className="text-lg font-semibold mb-2">❓ 说明</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><span className="inline-block w-4 h-4 bg-green-500 mr-2 rounded"></span> 可选座位</li>
            <li><span className="inline-block w-4 h-4 bg-gray-400 mr-2 rounded"></span> 已被购买</li>
            <li><span className="inline-block w-4 h-4 bg-yellow-300 mr-2 rounded"></span> 已加入购物车</li>
          </ul>
        </div>
      </div>
    </div>
  );
}