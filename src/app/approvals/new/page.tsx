// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"

// const CATEGORIES = ["LEAVE", "BUDGET", "INFRASTRUCTURE", "ACADEMIC", "OTHER"]
// const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"]

// export default function NewApprovalPage() {
//   const router = useRouter()

//   const [form, setForm] = useState({
//     title:       "",
//     category:    "LEAVE",
//     description: "",
//     priority:    "MEDIUM",
//   })
//   const [error,   setError]   = useState("")
//   const [loading, setLoading] = useState(false)

//   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setError("")

//     if (form.description.trim().length < 10) {
//       setError("Description must be at least 10 characters.")
//       return
//     }

//     setLoading(true)
//     try {
//       const res  = await fetch("/api/approvals", {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(form),
//       })
//       const json = await res.json()

//       if (!json.success) {
//         setError(json.message)
//       } else {
//         router.push(`/approvals/${json.data.id}`)
//       }
//     } catch {
//       setError("Something went wrong. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-2xl mx-auto px-4 py-8">
//         <div className="mb-6">
//           <Link href="/approvals" className="text-sm text-gray-500 hover:text-gray-700">
//             ← Back to requests
//           </Link>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-2xl p-8">
//           <h1 className="text-xl font-bold text-gray-900 mb-6">New Approval Request</h1>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Title */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 required
//                 value={form.title}
//                 onChange={handleChange}
//                 placeholder="e.g. Requesting leave for conference"
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Category + Priority row */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="category"
//                   value={form.category}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                 >
//                   {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
//                 <select
//                   name="priority"
//                   value={form.priority}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                 >
//                   {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
//                 </select>
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description <span className="text-red-500">*</span>
//                 <span className="text-gray-400 font-normal ml-1">(min 10 chars)</span>
//               </label>
//               <textarea
//                 name="description"
//                 required
//                 rows={5}
//                 value={form.description}
//                 onChange={handleChange}
//                 placeholder="Describe the purpose and details of your request…"
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//               />
//               <p className="text-xs text-gray-400 mt-1">{form.description.length} characters</p>
//             </div>

//             {error && (
//               <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
//                 {error}
//               </div>
//             )}

//             <div className="flex gap-3 pt-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors"
//               >
//                 {loading ? "Submitting…" : "Submit Request"}
//               </button>
//               <Link
//                 href="/approvals"
//                 className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }















// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function NewRequestPage() {
//   const router = useRouter();
//   const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
//   const [message, setMessage] = useState("");

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("LEAVE");
//   const [priority, setPriority] = useState("MEDIUM");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Strict Validation
//     if (description.trim().length < 10) {
//       setStatus("error");
//       setMessage("Description must be at least 10 characters long.");
//       return;
//     }

//     setStatus("loading");

//     try {
//       const res = await fetch("/api/approvals", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title, description, category, priority }),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || "Failed to submit request.");
//       }

//       setStatus("success");
//       setMessage("Request submitted successfully! Redirecting...");
      
//       setTimeout(() => {
//         router.push("/approvals");
//         router.refresh();
//       }, 1500);

//     } catch (err: any) {
//       setStatus("error");
//       setMessage(err.message || "An unexpected error occurred.");
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-[#111] border border-white/10 rounded-xl p-8">
//       <h1 className="text-2xl font-bold text-white mb-6">New Approval Request</h1>
//       {status === "error" && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{message}</div>}
//       {status === "success" && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">{message}</div>}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">Request Title</label>
//           <input
//             type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">Description (Min 10 chars)</label>
//           <textarea
//             required rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
//             className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
//             placeholder="Describe the purpose and details of your request..."
//           />
//         </div>

//         <div className="flex justify-end pt-4 border-t border-white/10">
//           <button
//             type="submit" disabled={status === "loading" || status === "success"}
//             className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50 transition-colors"
//           >
//             {status === "loading" ? "Submitting..." : "Submit Request"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRequestPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("LEAVE");
  const [priority, setPriority] = useState("MEDIUM");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict Validation
    if (description.trim().length < 10) {
      setStatus("error");
      setMessage("Description must be at least 10 characters long.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, priority }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit request.");
      }

      setStatus("success");
      setMessage("Request submitted successfully! Redirecting...");
      
      setTimeout(() => {
        router.push("/approvals");
        router.refresh();
      }, 1500);

    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#111] border border-white/10 rounded-xl p-8">
      <h1 className="text-2xl font-bold text-white mb-6">New Approval Request</h1>
      {status === "error" && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{message}</div>}
      {status === "success" && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Request Title</label>
          <input
            type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description (Min 10 chars)</label>
          <textarea
            required rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
            placeholder="Describe the purpose and details of your request..."
          />
        </div>

        {/* --- ADDED: Category and Priority Dropdowns --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none appearance-none"
            >
              <option value="LEAVE">Leave / Absence</option>
              <option value="EXPENSE">Expense / Budget</option>
              <option value="ACADEMIC">Academic / Lab</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none appearance-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent 🚨</option>
            </select>
          </div>
        </div>
        {/* ---------------------------------------------- */}

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            type="submit" disabled={status === "loading" || status === "success"}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50 transition-colors"
          >
            {status === "loading" ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}