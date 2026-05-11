// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { useSession } from "next-auth/react"
// import { StatusBadge } from "@/components/ui/StatusBadge"
// import { PriorityBadge } from "@/components/ui/PriorityBadge"

// type ApprovalRequest = {
//   id:          string
//   title:       string
//   category:    string
//   priority:    string
//   status:      string
//   createdAt:   string
//   submittedBy: { name: string; email: string }
//   steps:       { stepOrder: number; approverRole: string; status: string }[]
// }

// const CATEGORIES = ["ALL", "LEAVE", "BUDGET", "INFRASTRUCTURE", "ACADEMIC", "OTHER"]
// const STATUSES   = ["ALL", "PENDING", "APPROVED", "REJECTED"]

// export default function ApprovalsPage() {
//   const { data: session } = useSession()
//   const [requests,  setRequests]  = useState<ApprovalRequest[]>([])
//   const [loading,   setLoading]   = useState(true)
//   const [status,    setStatus]    = useState("ALL")
//   const [category,  setCategory]  = useState("ALL")

//   useEffect(() => {
//     fetchRequests()
//   }, [status, category])

//   async function fetchRequests() {
//     setLoading(true)
//     const params = new URLSearchParams()
//     if (status   !== "ALL") params.set("status",   status)
//     if (category !== "ALL") params.set("category", category)

//     const res  = await fetch(`/api/approvals?${params.toString()}`)
//     const json = await res.json()
//     if (json.success) setRequests(json.data)
//     setLoading(false)
//   }

//   const user = session?.user as { role?: string } | undefined

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Approval Requests</h1>
//             <p className="text-sm text-gray-500 mt-0.5">
//               {user?.role === "TEACHER" ? "Your submitted requests" : "Requests awaiting your action"}
//             </p>
//           </div>
//           {user?.role === "TEACHER" && (
//             <Link
//               href="/approvals/new"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//             >
//               + New Request
//             </Link>
//           )}
//         </div>

//         {/* Filters */}
//         <div className="flex gap-3 mb-6 flex-wrap">
//           <div>
//             <label className="text-xs font-medium text-gray-500 block mb-1">Status</label>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {STATUSES.map((s) => <option key={s}>{s}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="text-xs font-medium text-gray-500 block mb-1">Category</label>
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//             </select>
//           </div>
//         </div>

//         {/* List */}
//         {loading ? (
//           <div className="text-center py-16 text-gray-400 text-sm">Loading…</div>
//         ) : requests.length === 0 ? (
//           <div className="text-center py-16">
//             <p className="text-gray-400 text-sm">No requests found.</p>
//             {user?.role === "TEACHER" && (
//               <Link href="/approvals/new" className="mt-3 inline-block text-blue-600 text-sm hover:underline">
//                 Create your first request →
//               </Link>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {requests.map((r) => {
//               const activeStep = r.steps.find((s) => s.status === "ACTIVE")
//               return (
//                 <Link
//                   key={r.id}
//                   href={`/approvals/${r.id}`}
//                   className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all"
//                 >
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex-1 min-w-0">
//                       <h2 className="font-semibold text-gray-900 truncate">{r.title}</h2>
//                       <p className="text-sm text-gray-500 mt-0.5">
//                         {r.category} · Submitted by {r.submittedBy.name} · {new Date(r.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2 flex-shrink-0">
//                       <PriorityBadge priority={r.priority} />
//                       <StatusBadge status={r.status} />
//                     </div>
//                   </div>
//                   {activeStep && (
//                     <p className="mt-2 text-xs text-blue-600 font-medium">
//                       Awaiting: {activeStep.approverRole}
//                     </p>
//                   )}
//                 </Link>
//               )
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }












import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

//new
import { Role } from "@prisma/client";


export default async function ApprovalsPage({ searchParams }: { searchParams: { status?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  // const user = session.user as any;

  //new
  const user = session.user as { id: string; role: Role; name: string };




  // 1. Build the filter query based on URL params
  const filterStatus = searchParams.status ? searchParams.status.toUpperCase() : undefined;
  
  const queryWhere: any = {};
  if (user.role === "TEACHER") queryWhere.submittedById = user.id;
  if (filterStatus && filterStatus !== "ALL") queryWhere.status = filterStatus;

  // 2. Fetch Data
  const requests = await prisma.approvalRequest.findMany({
    where: queryWhere,
    include: { submittedBy: { select: { name: true } }, steps: { orderBy: { stepOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 pb-4 border-b border-white/10">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
          <Link
            key={status}
            href={`/approvals${status === "ALL" ? "" : `?status=${status}`}`}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
              (searchParams.status?.toUpperCase() === status) || (!searchParams.status && status === "ALL")
                ? "bg-white/10 border-white/20 text-white" 
                : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {status}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/[0.02] border-b border-white/10 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Created Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No requests found.</td></tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/approvals/${req.id}`} className="text-blue-400 hover:underline font-medium">
                      {req.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      req.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      req.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}