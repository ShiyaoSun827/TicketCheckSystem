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
    const confirmed = confirm("确定要删除该排片吗？此操作不可恢复！");
    if (!confirmed) return;

    startTransition(async () => {
      await deleteShow(showId);
      router.refresh(); // 刷新页面
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
    >
      {isPending ? "删除中..." : "删除"}
    </button>
  );
}
