//src/app/tickets/[showId]/TicketClient.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SeatPicker from "./SeatPicker";
import {
  addToCart,
  deleteCartItem,
  createAndPayOrder,
  getWalletInfo,
} from "@/lib/user-dashboard-actions";
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

export default function TicketClient({
  show,
  seats,
  inCartSeats,
}: TicketClientProps) {
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
      alert("Please choose your seat first");
      return;
    }

    try {
      await addToCart(show.id, selectedSeats);
      setCartSeats([...cartSeats, ...selectedSeats]);
      setSelectedSeats([]);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart");
    }
  };

  const handleRemoveFromCart = async (seat: string) => {
    try {
      await deleteCartItem(show.id, seat);
      setCartSeats((prev) => prev.filter((s) => s !== seat));
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      alert("Failed to remove from cart");
    }
  };

  const handleCheckout = async () => {
    try {
      const result = await createAndPayOrder(show.id);
      if (result.success) {
        alert("✅  Order has been generated and settled");
        window.location.reload();
      } else {
        alert("❌ " + result.message);
      }
    } catch (err) {
      console.error("Order not success:", err);
      alert("Order not success");
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
            <p>🎬 Title: {show.movie.name}</p>
            <p>📅 Time: {new Date(show.beginTime).toLocaleString()}</p>
            <p>⌛ Duration: {Math.round(show.movie.length / 60)} minutes</p>
            <p>💰 Price: ${show.price?.toFixed(2) ?? "N/A"}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">🎟️ Select Your Seats</h2>
            <p className="text-sm text-gray-600 mb-4">
              You can long-press and drag to select or deselect multiple seats.
            </p>
            <SeatPicker
                key={refreshKey}
                seats={seats}
                inCartSeats={cartSeats}
                onSelect={setSelectedSeats}
                clearTrigger={refreshKey}
            />
            <div className="mt-4 text-center text-gray-700">
              Selected: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                  onClick={handleAddToCart}
                  className="bg-green-600 text-white px-6 py-2 rounded text-lg hover:bg-green-700"
              >
                Add to Cart ({selectedSeats.length})
              </button>
              <button
                  onClick={() => {
                    setSelectedSeats([]);
                    setRefreshKey((k) => k + 1);
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded text-lg hover:bg-gray-500"
              >
                Clear Selection
              </button>
            </div>
            <button
                onClick={() => router.push("/dashboard/user/cart")}
                className="bg-gray-400 text-white px-6 py-2 rounded text-lg hover:bg-gray-500 mt-4"
            >
              Go to Cart
            </button>
          </div>

          <div className="w-full md:w-64 p-4 bg-gray-50 border rounded">
            <h3 className="text-lg font-semibold mb-2">🧾 Seats in Cart</h3>
            {cartSeats.length === 0 ? (
                <p className="text-sm text-gray-600">No seats in cart</p>
            ) : (
                <>
                  <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                    {cartSeats.map((seat) => (
                        <li key={seat} className="flex justify-between items-center">
                          <span>{seat}</span>
                          <button
                              onClick={() => handleRemoveFromCart(seat)}
                              className="text-red-500 text-xs hover:underline"
                          >
                            Remove
                          </button>
                        </li>
                    ))}
                  </ul>
                  <button
                      onClick={async () => {
                        const confirmClear = confirm("Are you sure you want to clear all seats from cart?");
                        if (!confirmClear) return;
                        try {
                          await Promise.all(cartSeats.map((seat) => deleteCartItem(show.id, seat)));
                          setCartSeats([]);
                          alert("🗑️ Cart cleared");
                        } catch (err) {
                          console.error("Failed to clear cart:", err);
                          alert("Failed to clear cart");
                        }
                      }}
                      className="mt-2 w-full text-sm text-red-600 hover:underline"
                  >
                    🗑️ Clear All
                  </button>
                </>
            )}

            <hr className="my-4" />
            <div className="text-sm text-gray-800 space-y-1">
              <p>🧮 Total: ${totalPrice.toFixed(2)}</p>
              <p>💰 Wallet Balance: ${walletBalance.toFixed(2)}</p>
            </div>

            <button
                onClick={handleCheckout}
                disabled={walletBalance < totalPrice || cartSeats.length === 0}
                className={`mt-4 w-full py-2 rounded text-white text-lg
            ${
                    walletBalance < totalPrice || cartSeats.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                }
          `}
            >
              💳 Checkout
            </button>
            {walletBalance < totalPrice && cartSeats.length > 0 && (
                <p className="text-sm text-red-600 mt-1 text-center">
                  ❌ Not enough balance. Please go to{" "}
                  <a
                      href="/dashboard/user/wallet"
                      className="text-blue-600 underline hover:text-blue-800"
                  >
                    My Wallet
                  </a>{" "}
                  to recharge.
                </p>
            )}
            <hr className="my-4" />
            <h3 className="text-lg font-semibold mb-2">❓ Legend</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <span className="inline-block w-4 h-4 bg-blue-100 mr-2 rounded border"></span>
                Available
              </li>
              <li>
                <span className="inline-block w-4 h-4 bg-green-500 mr-2 rounded"></span>
                Selected
              </li>
              <li>
                <span className="inline-block w-4 h-4 bg-yellow-300 mr-2 rounded"></span>
                In Cart
              </li>
              <li>
                <span className="inline-block w-4 h-4 bg-gray-400 mr-2 rounded"></span>
                Sold
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
}
