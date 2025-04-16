// src/components/NavBarClient.tsx
"use client";
import { getSession} from "@/hooks/getSession";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


export default function NavBarClient() {
    const router = useRouter();
    const handleSignOut = async () => {
        console.log("🚪 Signing out...");
        await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                if (window.location.pathname === "/") {     //refresh or direct to home page
                    router.refresh();
                  } else {
                    router.push("/");
                  }
              },
            },
          });
          setSession(null);
      };
      
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
      async function fetchSession() {
        const result = await getSession();
        console.log("✅ Session loaded:", result);
        setSession(result);
      }
  
      fetchSession();
    }, []);

  console.log("Session object in NavBarClient:", session);
  return (
    <nav className="flex justify-between items-center p-4 border-b">
  {/* 左边：蓝色链接 */}
  <div className="flex gap-4">
    <Link href="/" className="text-blue-600 hover:text-blue-800">Main Page</Link>
    <Link href="/movies" className="text-blue-600 hover:text-blue-800">On Show</Link>
    <Link href="/contact" className="text-blue-600 hover:text-blue-800">Contact Us</Link>
    <Link href="/dashboard/user" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
    <Link href="/dashboard/user/cart" className="text-blue-600 hover:text-blue-800">购物车</Link>
    <Link href="/dashboard/user/orders" className="text-blue-600 hover:text-blue-800">订单</Link>
    <Link href="/dashboard/user/myTickets" className="text-blue-600 hover:text-blue-800">MyTickets</Link>
    <Link href="/dashboard/user/wallet" className="text-blue-600 hover:text-blue-800">Wallet</Link>
    {!session?.user && (
    <Link href="/signup" className="text-blue-600 hover:text-blue-800">Sign up</Link>
  )}
    
  </div>

  {/* 右边：Sign up + 用户信息 */}
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
