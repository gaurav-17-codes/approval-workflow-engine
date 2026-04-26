"use client";

import { cn } from "@/lib/utils";

export default function GlowButton({
  children,
  variant = "purple",
}: {
  children: React.ReactNode;
  variant?: "purple" | "blue";
}) {
  return (
    <button
      className={cn(
        "relative px-6 py-3 rounded-full text-sm font-medium border border-gray-700 bg-black",
        "transition-all duration-300 hover:scale-105",
        variant === "purple"
          ? "hover:shadow-[0_0_25px_rgba(124,58,237,0.8)]"
          : "hover:shadow-[0_0_25px_rgba(37,99,235,0.8)]"
      )}
    >
      {children}
    </button>
  );
}