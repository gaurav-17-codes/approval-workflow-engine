"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cursorRef.current) return;
cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed w-40 h-40 pointer-events-none rounded-full blur-3xl z-50"
      style={{
        background:
          "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}