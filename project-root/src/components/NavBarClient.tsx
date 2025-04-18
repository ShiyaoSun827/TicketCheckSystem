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
    <nav className="flex justify-between items-center p-4 border-b">
      {/* 左边链接 */}
      <div className="flex gap-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800">Main Page</Link>
        <Link href="/dashboard/user" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
        <Link href="/dashboard/user/cart" className="text-blue-600 hover:text-blue-800">
          🛒 My Cart（{cartCount}）
        </Link>
        <Link href="/dashboard/user/orders" className="text-blue-600 hover:text-blue-800">
          📦 My Orders（{orderCount}）
        </Link>
        <Link href="/dashboard/user/myTickets" className="text-blue-600 hover:text-blue-800">
          🎫 My tickets（{ticketCount}）
        </Link>
        <Link href="/dashboard/user/wallet" className="text-blue-600 hover:text-blue-800">
          💰 My Wallet（¥{walletBalance.toFixed(2)}）
        </Link>
        {!session?.user && (
          <Link href="/signup" className="text-blue-600 hover:text-blue-800">Sign up</Link>
        )}
      </div>

      {/* 右边用户信息 */}
      <div className="flex items-center gap-4">
        {session?.user ? (
          <div className="flex items-center gap-4">
            <span>Welcome: {session.user.name}</span>
            <button
              onClick={handleSignOut}
              className="text-red-600 hover:underline"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/signin" className="text-blue-600 hover:text-blue-800">Sign In</Link>
        )}
      </div>
    </nav>
  );
}