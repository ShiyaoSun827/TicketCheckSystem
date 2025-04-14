// src/components/NavBar.tsx
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function NavBar() {
  // 注意：必须 await headers()，然后构造普通对象
  const hdrsInstance = await headers();
  const cookie = hdrsInstance.get("cookie") || "";
  const session = await auth.api.getSession({ headers: { cookie } });
  console.log("session", session);

  return (
    <nav className="flex justify-end gap-4 p-4 border-b">
      <Link href="/" className="text-blue-600 hover:text-blue-800">Main Page</Link>
      <Link href="/movies" className="text-blue-600 hover:text-blue-800">On Show</Link>
      <Link href="/contact" className="text-blue-600 hover:text-blue-800">Contact Us</Link>
      <Link href="/signup" className="text-blue-600 hover:text-blue-800">Sign up</Link>

      {session?.user ? (
        <div className="flex items-center gap-4">
          <span>{session.user.name}</span>
          <form action="/api/auth/signout" method="post">
            <button type="submit">Sign Out</button>
          </form>
        </div>
      ) : (
        <Link href="/signin" className="text-blue-600 hover:text-blue-800">Sign In</Link>
      )}
    </nav>
  );
}
