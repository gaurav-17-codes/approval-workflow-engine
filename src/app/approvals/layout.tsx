"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function ApprovalsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession(); // Fetch logged-in user details

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#111] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">Approval Engine</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/approvals" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/approvals" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <span>📊</span> <span className="font-medium text-sm">Approvals List</span>
          </Link>
          <Link href="/approvals/new" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/approvals/new" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <span>➕</span> <span className="font-medium text-sm">New Request</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/10 bg-[#111] flex items-center justify-between px-8">
          <h2 className="text-sm font-medium text-gray-400">
            {pathname === "/approvals" ? "Dashboard" : pathname === "/approvals/new" ? "Create Request" : "Request Details"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{session?.user?.name}</p>
              <p className="text-xs text-gray-400">Role: {(session?.user as any)?.role}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="px-4 py-2 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
              Sign Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}