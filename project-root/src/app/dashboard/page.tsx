// src/app/dashboard/page.tsx
import NavBar from "../../components/NavBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Page() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  console.log("🍪 Cookie header:", cookieHeader);

  const session = await auth.api.getSession({ headers: headersList });

  console.log("✅ Session object:", session);

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NavBar />

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">
          Welcome {session.user.name}
        </h1>
      </header>

      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Movie Ticket System. All rights reserved.
      </footer>
    </div>
  );
}
