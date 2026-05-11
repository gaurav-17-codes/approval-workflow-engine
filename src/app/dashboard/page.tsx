import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export default async function DashboardPage() {
  // 1. Secure the page
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = session.user as { id: string; role: Role; name: string };

  // 2. Fetch the data exactly like your API does
  const requests = await prisma.approvalRequest.findMany({
    where: user.role === "TEACHER" ? { submittedById: user.id } : {},
    include: {
      submittedBy: { select: { name: true } },
      steps: { orderBy: { stepOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Requests Overview</h2>
        <p className="text-gray-400 text-sm">Welcome back, {user.name} ({user.role})</p>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/[0.04] border-b border-white/10 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Requester</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Current Step</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => {
                // Find who is currently holding up the approval
                const activeStep = req.steps.find(s => s.status === "ACTIVE");
                
                return (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* <td className="px-6 py-4 font-medium text-white">{req.title}</td> */}
                    <td className="px-6 py-4 font-medium">
                    <Link href={`/approvals/${req.id}`} className="text-blue-400 hover:text-blue-300 hover:underline">
                      {req.title}
                    </Link>
                    </td>
                    <td className="px-6 py-4">{req.category}</td>
                    <td className="px-6 py-4">{req.submittedBy.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        req.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        req.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {activeStep ? `Waiting on ${activeStep.approverRole}` : 'Workflow Complete'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}