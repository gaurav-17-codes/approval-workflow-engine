"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Hide this global navbar if the user is inside the dashboard layout
  // (Because the dashboard layout has its own header and sidebar!)
  if (pathname?.startsWith("/approvals")) return null;

  const user = session?.user as { name?: string; role?: string } | undefined;

  return (
    <nav className="h-16 border-b border-white/10 bg-[#111] flex items-center justify-between px-8 w-full z-50">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
          Approval Engine
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {/* <Link href="/approvals" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Requests
          </Link> */}
          {user?.role==="TEACHER" && (
            <Link href="/approvals/new" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              New Request
            </Link>
          )}
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-6">
        {session ? (
          <>
            <span className="text-sm text-gray-400">
              <span className="text-white font-medium">{user?.name}</span> • {user?.role}
            </span>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 text-sm font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <Link 
            href="/login" 
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}