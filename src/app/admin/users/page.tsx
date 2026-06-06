"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchUsers();
    }
  }, [status, session]);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole })
      });
      const json = await res.json();
      
      if (json.success) {
        // Update the UI instantly without reloading the page
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (error) {
      console.error("Failed to update role", error);
    } finally {
      setUpdatingId(null);
    }
  }

  if (status === "loading" || loading) return <div className="p-8 text-gray-400 text-center">Loading User Database...</div>;
  if (session?.user?.role !== "ADMIN") return <div className="p-8 text-red-400 text-center text-xl font-bold">🚨 Access Denied: Administrators Only</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors mb-2 block">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
        </div>
      </div>

      {/* Glassmorphism Table */}
      <div className="bg-transparent border border-[#673AB7] rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-[#673AB7]/50">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Role Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#673AB7]/30">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                  <td className="px-6 py-4 text-gray-400">{user.email}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {/* Role Selector Dropdown */}
                    <select
                      value={user.role}
                      disabled={updatingId === user.id || user.role === "ADMIN"}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`px-3 py-2 bg-[#111] border rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#673AB7] transition-all
                        ${updatingId === user.id ? "opacity-50 cursor-wait border-gray-600" : "border-[#673AB7] cursor-pointer"}
                        ${user.role === "ADMIN" ? "opacity-50 cursor-not-allowed border-red-900 text-red-400" : ""}
                      `}
                    >
                      <option value="TEACHER">TEACHER</option>
                      <option value="HOD">HOD</option>
                      <option value="PRINCIPAL">PRINCIPAL</option>
                      <option value="ADMIN" disabled>ADMIN</option>
                    </select>
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