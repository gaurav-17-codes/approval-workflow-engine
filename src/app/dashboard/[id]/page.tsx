import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ActionButtons from "./ActionButtons";
import { Role } from "@prisma/client";

export default async function RequestDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const user = session.user as { id: string; role: Role; name: string };

  // Fetch the specific request and its steps
  const request = await prisma.approvalRequest.findUnique({
    where: { id: params.id },
    include: {
      submittedBy: { select: { name: true, email: true } },
      steps: {
        orderBy: { stepOrder: "asc" },
        include: { actionedBy: { select: { name: true } } }
      }
    }
  });

  if (!request) {
    return <div className="text-white p-8 text-center text-xl">Request not found.</div>;
  }

  // Security Logic: Is the current user the one who is supposed to approve this right now?
  const activeStep = request.steps.find((s) => s.status === "ACTIVE");
  const canApprove = activeStep && activeStep.approverRole === user.role;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Request Details</h2>
        <Link href="/approvals" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back to Approvals
        </Link>
      </div>

      {/* Main Info Card */}
      <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white mb-1">{request.title}</h1>
            <p className="text-gray-400 text-sm">Submitted by {request.submittedBy.name}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase">
            {request.category}
          </span>
        </div>

        <div className="p-4 bg-black/30 rounded-lg border border-white/5 mb-8 text-gray-300 whitespace-pre-wrap">
          {request.description}
        </div>

        {/* The Timeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Approval Timeline</h3>
          {request.steps.map((step) => (
            <div key={step.id} className="flex gap-4 items-start">
              <div className="mt-1">
                {step.status === "APPROVED" ? "🟢" : step.status === "REJECTED" ? "🔴" : step.status === "ACTIVE" ? "🟡" : "⚪"}
              </div>
              <div>
                <p className="text-white font-medium">{step.approverRole}</p>
                <p className="text-xs text-gray-500 mb-1">Status: {step.status}</p>
                {step.comment && (
                  <p className="text-sm text-gray-400 italic">"{step.comment}" - {step.actionedBy?.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* If the user is the assigned approver, render the Client Component buttons */}
        {canApprove && (
          <ActionButtons requestId={request.id} />
        )}

      </div>
    </div>
  );
}