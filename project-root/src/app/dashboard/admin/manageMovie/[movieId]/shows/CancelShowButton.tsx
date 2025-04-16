// src/app/dashboard/admin/manageMovies/[movieId]/shows/CancelShowButton.tsx
"use client";

import { useTransition } from "react";
import { cancelShow } from "@/lib/admin-dashboard-actions";
import { useRouter } from "next/navigation";

interface Props {
  showId: string;
}

export default function CancelShowButton({ showId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    const confirmed = confirm("确定要取消此排片吗？");
    if (!confirmed) return;

    startTransition(async () => {
      await cancelShow(showId);
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
    >
      取消
    </button>
  );
}
