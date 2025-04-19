// src/app/dashboard/user/cart/CartClient.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getCartItems,
  deleteCartItem,
  deleteCartItems,
  createOrderFromCart,
} from "@/lib/user-dashboard-actions";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchCart() {
      const result = await getCartItems();
      setItems(result);
    }
    fetchCart();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteCartItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    await deleteCartItems(Array.from(selectedIds));
    setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
    setSelectAll(false);
  };

  const handleCreateOrder = async () => {
    if (selectedIds.size === 0) {
      alert("Please select items to create an order.");
      return;
    }
    try {
      await createOrderFromCart(Array.from(selectedIds));
      router.push("/dashboard/user/orders");
    } catch (err) {
      console.error("Failed to create order", err);
      alert("Failed to create order");
    }
  };

  const total = items.reduce(
    (sum, item) => (selectedIds.has(item.id) ? sum + item.price : sum),
    0
  );

  return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🛒 My Cart</h1>

        {items.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
        ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-right text-lg font-semibold">
                    Total: ¥{total.toFixed(2)}
                  </div>

                  <div className="text-right">
                    <button
                        onClick={handleCreateOrder}
                        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
                    >
                      Create Order
                    </button>
                  </div>
                </div>
                <label className="flex items-center">
                  <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="mr-2"
                  />
                  Select All
                </label>
                <button
                    onClick={handleBatchDelete}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete Selected
                </button>
              </div>

              <ul className="space-y-4">
                {items.map((item) => (
                    <li
                        key={item.id}
                        className="border p-4 rounded shadow-sm flex gap-4"
                    >
                      {item.image && (
                          <Image
                              src={item.image}
                              alt={item.movieTitle}
                              width={100}
                              height={150}
                              className="rounded"
                          />
                      )}
                      <div className="flex-1 space-y-1">
                        <label className="flex items-center">
                          <input
                              type="checkbox"
                              checked={selectedIds.has(item.id)}
                              onChange={() => toggleSelect(item.id)}
                              className="mr-2"
                          />
                          <span className="font-semibold">🎬 {item.movieTitle}</span>
                        </label>
                        <p>📅 {new Date(item.showTime).toLocaleString()}</p>
                        <p>💺 Seat: {item.seat}</p>
                        <p>🕒 Added at: {new Date(item.addedAt).toLocaleString()}</p>
                        <p>💰 Price: ¥{item.price.toFixed(2)}</p>
                      </div>
                      <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </li>
                ))}
              </ul>
            </>
        )}
      </div>
  );
}