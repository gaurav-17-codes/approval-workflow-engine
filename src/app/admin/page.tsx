"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";

type AdminData = {
  stats: { total: number; pending: number; approved: number; rejected: number };
  requests: any[];
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchAdminData();
    }
  }, [status, session]);

  async function fetchAdminData() {
    try {
      const res = await fetch("/api/admin/requests");
      const json = await res.json();
      if (json.success) {
        setData({ stats: json.stats, requests: json.data });
      }
    } catch (error) {
      console.error("Failed to load admin dashboard", error);
    } finally {
      setLoading(false);
    }
  }

  // Security Redirect UI
  if (status === "loading" || loading) return <div className="p-8 text-gray-400 text-center">Loading God Mode...</div>;
  if (session?.user?.role !== "ADMIN") return <div className="p-8 text-red-400 text-center text-xl font-bold">🚨 Access Denied: Administrators Only</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* <h1 className="text-3xl font-bold text-white mb-8">System Overview</h1> */}
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">System Overview</h1>
        
        <Link 
          href="/admin/users" 
          className="px-5 py-2.5 bg-[#673AB7] hover:bg-[#5e35a6] text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-[#673AB7]/20 flex items-center gap-2 w-fit"
        >
          Manage Users →
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Requests" value={data?.stats.total} color="border-blue-500" text="text-blue-400" />
        <StatCard title="Pending" value={data?.stats.pending} color="border-yellow-500" text="text-yellow-400" />
        <StatCard title="Approved" value={data?.stats.approved} color="border-green-500" text="text-green-400" />
        <StatCard title="Rejected" value={data?.stats.rejected} color="border-red-500" text="text-red-400" />
      </div>

      {/* Master Data Table */}
      <div className="bg-transparent border border-[#673AB7] rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="p-6 border-b border-[#673AB7]/50">
          <h2 className="text-xl font-semibold text-white">Global Request Ledger</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5">
              <tr>
                <th className="px-6 py-4">ID / Title</th>
                <th className="px-6 py-4">Submitter</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#673AB7]/30">
              {data?.requests.map((req) => (
                <tr key={req.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-white">
                    {req.title}
                    <div className="text-xs text-gray-500 mt-1 truncate w-32">ID: {req.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{req.submittedBy.name}</div>
                    <div className="text-xs text-gray-400">{req.submittedBy.role}</div>
                  </td>
                  <td className="px-6 py-4"><PriorityBadge priority={req.priority} /></td>
                  <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                  <td className="px-6 py-4 text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/approvals/${req.id}`} className="text-blue-400 hover:text-blue-300 hover:underline">
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Quick helper component for the glass cards
function StatCard({ title, value, color, text }: { title: string, value?: number, color: string, text: string }) {
  return (
    <div className={`bg-transparent border ${color} rounded-2xl p-6 backdrop-blur-md hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
      <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
      <p className={`text-4xl font-bold ${text}`}>{value !== undefined ? value : "-"}</p>
    </div>
  );
}