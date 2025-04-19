"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteShow } from "@/lib/admin-dashboard-actions";

interface Props {
  showId: string;
}

export default function DeleteShowButton({ showId }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    const confirmed = confirm("Are you sure you want to delete this show? This operation is irreversible and cannot be undone!");
    if (!confirmed) return;

    startTransition(async () => {
      await deleteShow(showId);
      router.refresh(); 
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
