import { StatusBadge } from "./StatusBadge"

type Step = {
  id:          string
  stepOrder:   number
  approverRole: string
  status:      string
  comment:     string | null
  actionedAt:  string | null
  actionedBy:  { name: string } | null
}

type Props = { steps: Step[] }

const roleLabels: Record<string, string> = {
  HOD:       "Head of Department (HOD)",
  PRINCIPAL: "Principal",
  ADMIN:     "Admin",
}

export function StepTracker({ steps }: Props) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const isDone = step.status === "APPROVED" || step.status === "REJECTED"

        return (
          <div key={step.id} className="flex gap-4">
            {/* Left: connector line + circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                  step.status === "APPROVED" ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : step.status === "REJECTED" ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : step.status === "ACTIVE"   ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  : "bg-white/5 border-white/10 text-gray-500"
                }`}
              >
                {step.status === "APPROVED" ? "✓"
                 : step.status === "REJECTED" ? "✗"
                 : step.stepOrder}
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 my-1 ${
                    isDone ? "bg-white/20" : "bg-white/5"
                  }`}
                  style={{ minHeight: "24px" }}
                />
              )}
            </div>

            {/* Right: content */}
            <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-gray-200">
                  Step {step.stepOrder}: {roleLabels[step.approverRole] ?? step.approverRole}
                </span>
                <StatusBadge status={step.status} />
              </div>

              {step.actionedBy && (
                <p className="text-xs text-gray-400">
                  {step.status === "APPROVED" ? "Approved" : "Rejected"} by{" "}
                  <strong className="text-gray-300">{step.actionedBy.name}</strong>
                  {step.actionedAt && (
                    <> on {new Date(step.actionedAt).toLocaleDateString()}</>
                  )}
                </p>
              )}

              {step.status === "ACTIVE" && (
                <p className="text-xs text-blue-400 font-medium mt-0.5">Awaiting review</p>
              )}

              {step.status === "PENDING" && (
                <p className="text-xs text-gray-500 mt-0.5">Not started yet</p>
              )}

              {step.comment && (
                <div className="mt-3 text-xs text-gray-300 bg-black/30 border border-white/5 rounded-lg px-3 py-2 leading-relaxed">
                  <span className="font-medium text-gray-400">Comment:</span> {step.comment}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}