//src/app/dashboard/user/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMyTickets, getMyOrders, getCartItems, getWalletInfo, getProfile, getMyFavorites } from "@/lib/user-dashboard-actions";
import Link from "next/link"; 
import NavBarClient from "@/components/NavBarClient";
import Image from "next/image";
import ProfileEditor from "./ProfileEditor";

interface Ticket {
  id: string;
  eventTitle: string;
  date: string;
  seat: string;
  qrCodeUrl?: string;
}

interface FavoriteMovie {
  id: string;
  name: string;
  image?: string;
}

interface Profile {
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const [tickets, orders, cart, wallet, profileData, favs] = await Promise.all([
        getMyTickets(),
        getMyOrders(),
        getCartItems(),
        getWalletInfo(),
        getProfile(),
        getMyFavorites(),
      ]);

      setTickets(tickets);
      setTicketCount(tickets.length);
      setCartCount(cart.length);
      setPendingOrderCount(orders.filter((o) => o.status === "PENDING").length);
      setTotalSpent(orders.filter((o) => o.status === "PAID").reduce((sum, o) => sum + o.total, 0));
      setBalance(wallet.balance);
      setProfile(profileData);
      setFavorites(favs);
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  return (
      <div className="p-6 space-y-8">
        <NavBarClient />
        <h1 className="text-3xl font-bold">🎫 User Dashboard</h1>

        {profile && (
            <section>
              <h2 className="text-2xl font-semibold mb-2">🧾 Profile Summary</h2>
              <ProfileEditor name={profile.name} email={profile.email} />
            </section>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-4">📊 Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-100 p-4 rounded shadow text-center">
              <p className="text-sm text-gray-600">Cart Items</p>
              <p className="text-xl font-bold">{cartCount}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow text-center">
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-xl font-bold">{pendingOrderCount}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow text-center">
              <p className="text-sm text-gray-600">Tickets Purchased</p>
              <p className="text-xl font-bold">{ticketCount}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow text-center">
              <p className="text-sm text-gray-600">Wallet Balance</p>
              <p className="text-xl font-bold">¥{balance.toFixed(2)}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">⭐ Favorite Movies</h2>
          {favorites.length === 0 ? (
              <p className="text-gray-600">You haven't favorited any movies yet.</p>
          ) : (
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map((movie) => (
                    <Link
                        key={movie.id}
                        href={`/movies/${movie.id}`}
                        className="block hover:shadow-lg transition"
                    >
                      <li className="border p-4 rounded shadow bg-white hover:bg-gray-50">
                        {movie.image && (
                            <Image
                                src={movie.image}
                                alt={movie.name}
                                width={200}
                                height={300}
                                className="rounded"
                            />
                        )}
                        <h3 className="mt-2 font-semibold text-lg text-center">
                          {movie.name}
                        </h3>
                      </li>
                    </Link>
                ))}
              </ul>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">🎟️ My Tickets</h2>
          {loading ? (
              <p>Loading tickets...</p>
          ) : tickets.length === 0 ? (
              <p>You haven’t booked any tickets yet.</p>
          ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((ticket) => (
                    <li key={ticket.id} className="border p-4 rounded-lg shadow-md space-y-2">
                      <h3 className="text-xl font-semibold">{ticket.eventTitle}</h3>
                      <p><strong>Date:</strong> {ticket.date}</p>
                      <p><strong>Seat:</strong> {ticket.seat}</p>
                      {ticket.qrCodeUrl && (
                          <Image src={ticket.qrCodeUrl} alt="QR Code" width={100} height={100} />
                      )}
                    </li>
                ))}
              </ul>
          )}
        </section>
      </div>
  );

}