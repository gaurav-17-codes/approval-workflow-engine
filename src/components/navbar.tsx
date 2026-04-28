// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.85; // 85vh
      setIsScrolled(window.scrollY >= heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`flex justify-between items-center px-8 py-4 bg-white/5 backdrop-blur-md border-b border-white/10 sticky z-50 transition-all duration-300 ${
      isScrolled ? "w-[80%] mx-auto rounded-full top-6" : "w-full top-0"
    }`}>

      <h1 className="text-xl font-semibold tracking-wide">
        Approval Engine
      </h1>

      <div className="flex gap-6 items-center">
        <Link href="/">Home</Link>
        <Link href="/careers">Careers</Link>
        <Link href="/faq">FAQ</Link>

        <Link
          href="/login"
          className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}