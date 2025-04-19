"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitShow } from "@/lib/admin-dashboard-actions";

interface Props {
  showId: string;
}

export default function SubmitShowButton({ showId }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    startTransition(async () => {
      await submitShow(showId);
      router.refresh(); 
    });
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={isPending}
      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
    >
      {isPending ? "Submitting..." : "Submit wshow"}
    </button>
  );
}
