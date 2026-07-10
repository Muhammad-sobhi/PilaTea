"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/40 p-2.5 text-dark/70 shadow-sm backdrop-blur-sm transition-all hover:bg-white/70 hover:text-dark hover:scale-105 active:scale-95 mb-6"
      aria-label="Go back"
      style={{ cursor: "pointer" }}
    >
      <ArrowLeft size={18} strokeWidth={2} />
    </button>
  );
}
