// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import { useSession } from "next-auth/react"
// import Link from "next/link"
// import { StatusBadge } from "@/components/ui/StatusBadge"
// import { PriorityBadge } from "@/components/ui/PriorityBadge"
// import { StepTracker } from "@/components/ui/StepTracker"

// type Step = {
//   id:          string
//   stepOrder:   number
//   approverRole: string
//   status:      string
//   comment:     string | null
//   actionedAt:  string | null
//   actionedBy:  { name: string } | null
// }

// type ApprovalDetail = {
//   id:          string
//   title:       string
//   category:    string
//   description: string
//   priority:    string
//   status:      string
//   createdAt:   string
//   submittedBy: { name: string; email: string }
//   steps:       Step[]
// }

// export default function ApprovalDetailPage() {
//   const { id }  = useParams<{ id: string }>()
//   const { data: session } = useSession()

//   const [request, setRequest] = useState<ApprovalDetail | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [comment, setComment] = useState("")
//   const [acting,  setActing]  = useState(false)
//   const [error,   setError]   = useState("")

//   const user = session?.user as { id?: string; role?: string; name?: string } | undefined

//   useEffect(() => {
//     fetchRequest()
//   }, [id])

//   async function fetchRequest() {
//     setLoading(true)
//     try {
//       const res  = await fetch(`/api/approvals/${id}`)
//       if (!res.ok) {
//         throw new Error(`Error: ${res.status} ${res.statusText}`)
//       }
//       const json = await res.json()
//       if (json.success) setRequest(json.data)
//     } catch (err) {
//       console.error("Failed to fetch request:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleAction(action: "approve" | "reject") {
//     setError("")
//     setActing(true)
//     try {
//       const res  = await fetch(`/api/approvals/${id}`, {
//         method:  "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify({ action: action.toUpperCase(), comment }),
//       })
//       if (!res.ok) {
//         throw new Error(`Error: ${res.status} ${res.statusText}`)
//       }
//       const json = await res.json()
//       if (!json.success) {
//         setError(json.message)
//       } else {
//         setRequest(json.data)
//         setComment("")
//       }
//     } catch {
//       setError("Something went wrong. Please try again.")
//     } finally {
//       setActing(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <p className="text-gray-400 text-sm">Loading…</p>
//       </div>
//     )
//   }

//   if (!request) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-700 font-medium">Request not found.</p>
//           <Link href="/approvals" className="mt-2 block text-blue-600 text-sm hover:underline">← Back to list</Link>
//         </div>
//       </div>
//     )
//   }

//   const activeStep = request.steps.find((s) => s.status === "ACTIVE")
//   const canAction  = user?.role === activeStep?.approverRole && request.status === "PENDING"

//   return (
//     <div className="min-h-screen bg-black">
//       <div className="max-w-6xl mx-auto px-6 py-8">
//         <div className="mb-6">
//           <Link href="/approvals" className="text-sm text-gray-500 hover:text-gray-700">
//             ← Back to requests
//           </Link>
//         </div>

//         {/* Header card   border-gray-200*/}
//         <div className="bg-black border border-[#673AB7] rounded-2xl p-6 mb-4">
//           <div className="flex items-start justify-between gap-4 mb-4">
//             <h1 className="text-xl font-bold text-blue-900">{request.title}</h1>
//             <div className="flex items-center gap-2 flex-shrink-0">
//               <PriorityBadge priority={request.priority} />
//               <StatusBadge status={request.status} />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Category</p>
//               <p className="font-medium text-white">{request.category}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Submitted by</p>
//               <p className="font-medium text-white">{request.submittedBy.name}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Date</p>
//               <p className="font-medium text-white">{new Date(request.createdAt).toLocaleDateString()}</p>
//             </div>
//           </div>

//           <div>
//             <p className="text-xs text-gray-400 mb-1">Description</p>
//             <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{request.description}</p>
//           </div>
//         </div>

//         {/* Step tracker */}
//         <div className="bg-black border border-[#673AB7] rounded-2xl p-6 mb-4">
//           <h2 className="text-sm font-semibold text-[#673AB7] mb-4">Approval Progress</h2>
//           <StepTracker steps={request.steps} />
//         </div>

//         {/* Action panel — only shown to the current active approver */}
//         {canAction && (
//           <div className="bg-black border border-[#673AB7] rounded-2xl p-6">
//             <h2 className="text-sm font-semibold text-[#673AB7] mb-4">Your Decision</h2>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-400 mb-1">
//                 Comment <span className="text-gray-500 font-normal">(optional for approval, recommended for rejection)</span>
//               </label>
//               <textarea
//                 rows={3}
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}//ring-blue-500
//                 placeholder="Add a comment…"
//                 className="w-full px-4 py-2.5 border border-[#673AB7] rounded-lg text-sm text-white bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//               />
//             </div>

//             {error && (
//               <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
//                 {error}
//               </div>
//             )}

//             <div className="flex gap-3">
//               <button
//                 onClick={() => handleAction("approve")}
//                 disabled={acting}
//                 className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 disabled:opacity-60 transition-colors"
//               >
//                 {acting ? "Processing…" : "✓ Approve"}
//               </button>
//               <button
//                 onClick={() => handleAction("reject")}
//                 disabled={acting}
//                 className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 disabled:opacity-60 transition-colors"
//               >
//                 {acting ? "Processing…" : "✗ Reject"}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }







"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { PriorityBadge } from "@/components/ui/PriorityBadge"
import { StepTracker } from "@/components/ui/StepTracker"

type Step = {
  id: string
  stepOrder: number
  approverRole: string
  status: string
  comment: string | null
  actionedAt: string | null
  actionedBy: { name: string } | null
}

type ApprovalDetail = {
  id: string
  title: string
  category: string
  description: string
  priority: string
  status: string
  createdAt: string
  submittedBy: { name: string; email: string }
  steps: Step[]
}

export default function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()

  const [request, setRequest] = useState<ApprovalDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [acting, setActing] = useState(false)
  const [error, setError] = useState("")

  const user = session?.user as
    | { id?: string; role?: string; name?: string }
    | undefined

  useEffect(() => {
    fetchRequest()
  }, [id])

  async function fetchRequest() {
    setLoading(true)

    try {
      const res = await fetch(`/api/approvals/${id}`)

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`)
      }

      const json = await res.json()

      if (json.success) {
        setRequest(json.data)
      }
    } catch (err) {
      console.error("Failed to fetch request:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(action: "approve" | "reject") {
    setError("")
    setActing(true)

    try {
      const res = await fetch(`/api/approvals/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: action.toUpperCase(),
          comment,
        }),
      })

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`)
      }

      const json = await res.json()

      if (!json.success) {
        setError(json.message)
      } else {
        setRequest(json.data)
        setComment("")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setActing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 font-medium">Request not found.</p>

          <Link
            href="/approvals"
            className="mt-2 block text-blue-400 text-sm hover:underline"
          >
            ← Back to list
          </Link>
        </div>
      </div>
    )
  }

  const activeStep = request.steps.find(
    (step) => step.status === "ACTIVE"
  )

  const canAction =
    user?.role === activeStep?.approverRole &&
    request.status === "PENDING"

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/approvals"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to requests
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-transparent border border-[#673AB7] rounded-2xl p-6 mb-4 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-white">
              {request.title}
            </h1>

            <div className="flex items-center gap-2 flex-shrink-0">
              <PriorityBadge priority={request.priority} />
              <StatusBadge status={request.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-5">
            <div>
              <p className="text-xs text-gray-400 mb-1">
                Category
              </p>

              <p className="font-medium text-white">
                {request.category}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">
                Submitted by
              </p>

              <p className="font-medium text-white">
                {request.submittedBy.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">
                Date
              </p>

              <p className="font-medium text-white">
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2">
              Description
            </p>

            <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
              {request.description}
            </p>
          </div>
        </div>

        {/* Step Tracker */}
        <div className="bg-transparent border border-[#673AB7] rounded-2xl p-6 mb-4 backdrop-blur-md">
          <h2 className="text-sm font-semibold text-[#673AB7] mb-4">
            Approval Progress
          </h2>

          <StepTracker steps={request.steps} />
        </div>

        {/* Action Panel */}
        {canAction && (
          <div className="bg-transparent border border-[#673AB7] rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-sm font-semibold text-[#673AB7] mb-4">
              Your Decision
            </h2>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Comment{" "}
                <span className="text-gray-500 font-normal">
                  (optional for approval, recommended for rejection)
                </span>
              </label>

              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-3 border border-[#673AB7] rounded-xl text-sm text-white bg-transparent placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none backdrop-blur-sm transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleAction("approve")}
                disabled={acting}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm disabled:opacity-60 transition-all"
              >
                {acting ? "Processing..." : "✓ Approve"}
              </button>

              <button
                onClick={() => handleAction("reject")}
                disabled={acting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm disabled:opacity-60 transition-all"
              >
                {acting ? "Processing..." : "✗ Reject"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}