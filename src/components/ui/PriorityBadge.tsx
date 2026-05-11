type Props = { priority: string }

const config: Record<string, { label: string; className: string }> = {
  LOW:    { label: "Low",    className: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  MEDIUM: { label: "Medium", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  HIGH:   { label: "High",   className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  URGENT: { label: "Urgent", className: "bg-red-500/10 text-red-400 border-red-500/20" },
}

export function PriorityBadge({ priority }: Props) {
  const { label, className } = config[priority] ?? { label: priority, className: "bg-gray-500/10 text-gray-400 border-gray-500/20" }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  )
}