//src/app/dashboard/admin/page.tsx
"use client";
import NavBarClient from "@/components/NavBarClient";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
export default function DashboardPage() {
    const { session, isLoading: sessionLoading } = authClient.useSession();
  return (
    <div className="p-6 space-y-8">
        <NavBarClient session={session} />
      <h1 className="text-3xl font-bold">Addmin page</h1>
    </div>
  );
}
