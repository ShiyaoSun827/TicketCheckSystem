// src/components/NavBarClient.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getCartItems, getMyOrders, getMyTickets, getWalletInfo } from "@/lib/user-dashboard-actions";
import { getSession } from "@/hooks/getSession";

export default function NavBarClient() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  // useEffect(() => {
  //   async function fetchSession() {
  //     const result = await getSession();
  //     console.log("✅ Session loaded:", result);
  //     setSession(result);
  //   }

  //   fetchSession();
  // }, []);
  useEffect(() => {
    async function fetchSession() {
      const result = await getSession();
      console.log("✅ Session loaded:", result);
  
      // ❗️Prevent session display for unverified users
      if (result?.user?.role === "user" && !result.user.emailVerified) {
        console.log(" User not verified. Clearing session...");
        setSession(null); // Don't show as signed in
        return;
      }
  
      setSession(result);
    }
  
    fetchSession();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      const [cart, orders, tickets, wallet] = await Promise.all([
        getCartItems(),
        getMyOrders(),
        getMyTickets(),
        getWalletInfo(),
      ]);

      setCartCount(cart.length);
      setOrderCount(orders.filter((o) => o.status === "PENDING").length);
      setTicketCount(tickets.length);
      setWalletBalance(wallet.balance);
    }

    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  const handleSignOut = async () => {
    console.log("🚪 Signing out...");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          if (window.location.pathname === "/") {
            router.refresh();
          } else {
            router.push("/");
          }
        },
      },
    });
    setSession(null);
  };

  return (
      <nav className="w-full border-b bg-white shadow px-4 py-3 space-y-2">
        {/* App Title */}
        <div className="text-xl font-bold text-blue-700">🎬 Ticketing System</div>

        {/* Main Navigation Links */}
        <div className="flex flex-wrap gap-3 text-sm sm:text-base">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          <Link href="/dashboard/user" className="text-blue-600 hover:underline">Dashboard</Link>
          <Link href="/dashboard/user/cart" className="text-blue-600 hover:underline">
            🛒 Cart ({cartCount})
          </Link>
          <Link href="/dashboard/user/orders" className="text-blue-600 hover:underline">
            📦 Orders ({orderCount})
          </Link>
          <Link href="/dashboard/user/myTickets" className="text-blue-600 hover:underline">
            🎫 Tickets ({ticketCount})
          </Link>
          <Link href="/dashboard/user/wallet" className="text-blue-600 hover:underline">
            💰 Wallet (¥{walletBalance.toFixed(2)})
          </Link>
          {!session?.user && (
              <Link href="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
          )}
        </div>

        {/* User Info / Actions */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {session?.user ? (
              <>
                <span className="text-gray-700">Welcome, {session.user.name}</span>
                <button
                    onClick={handleSignOut}
                    className="text-red-600 hover:underline"
                >
                  Sign Out
                </button>
              </>
          ) : (
              <Link href="/signin" className="text-blue-600 hover:underline">Sign In</Link>
          )}
        </div>
      </nav>
  );
}