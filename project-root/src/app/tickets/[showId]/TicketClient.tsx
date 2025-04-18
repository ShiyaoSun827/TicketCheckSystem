"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SeatPicker from "./SeatPicker";
import { addToCart, deleteCartItem, createAndPayOrder, getWalletInfo } from "@/lib/user-dashboard-actions";
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
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const router = useRouter();
  const { session } = authClient.useSession();

  const totalPrice = cartSeats.length * show.price;

  useEffect(() => {
    async function fetchWallet() {
      const wallet = await getWalletInfo();
      setWalletBalance(wallet.balance);
    }
    fetchWallet();
  }, [cartSeats]);

  const handleAddToCart = async () => {
    if (selectedSeats.length === 0) {
      alert("请先选择座位");
      return;
    }

    try {
      await addToCart(show.id, selectedSeats);
      setCartSeats([...cartSeats, ...selectedSeats]);
      setSelectedSeats([]);
      setRefreshKey((k) => k + 1);
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

  const handleCheckout = async () => {
    try {
      const result = await createAndPayOrder(show.id, cartSeats);
      if (result.success) {
        alert("✅ 订单已生成并完成结算");
        router.push("/dashboard/user/orders");
      } else {
        alert("❌ " + result.message);
      }
    } catch (err) {
      console.error("结算失败:", err);
      alert("结算失败");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-6">
        {show.movie.image && (
          <Image src={show.movie.image} alt={show.movie.name} width={200} height={300} className="rounded shadow" />
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
            key={refreshKey}
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
            className="bg-gray-400 text-white px-6 py-2 rounded text-lg hover:bg-gray-500 mt-4"
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
          <div className="text-sm text-gray-800 space-y-1">
            <p>🧮 总价：¥{totalPrice.toFixed(2)}</p>
            <p>💰 余额：¥{walletBalance.toFixed(2)}</p>
          </div>

          <button
            onClick={handleCheckout}
            disabled={walletBalance < totalPrice || cartSeats.length === 0}
            className={`mt-4 w-full py-2 rounded text-white text-center text-lg
              ${walletBalance < totalPrice || cartSeats.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"}
            `}
          >
            💳 立即结算
          </button>
          {walletBalance < totalPrice && cartSeats.length > 0 && (
            <p className="text-sm text-red-600 mt-1 text-center">
              ❌ 余额不足，请先前往{" "}
              <a
                href="/dashboard/user/wallet"
                className="text-blue-600 underline hover:text-blue-800"
              >
                My Wallet
              </a>{" "}
              充值
            </p>
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