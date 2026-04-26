"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-6">
      <h1 className="text-lg font-bold tracking-wide">Workflow Engine</h1>

      <div className="hidden md:flex gap-8 text-sm text-gray-400">
        {["Home", "Features", "About", "Contact", "Partners", "Careers"].map(
          (item) => (
            <span
              key={item}
              className="cursor-pointer hover:text-white transition"
            >
              {item}
            </span>
          )
        )}
      </div>

      <div className="flex gap-3">
        <Link href="/login">
          <button className="px-4 py-2 text-sm text-white hover:text-gray-300 transition">
            Log in
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-4 py-2 text-sm bg-white text-black rounded-md hover:bg-gray-200 transition">
            Sign up
          </button>
        </Link>
      </div>
    </nav>
  );
}