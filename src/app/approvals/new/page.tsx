
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
              <option value="BUDGET">Expense / Budget</option> 
              <option value="INFRASTRUCTURE">Infrastructure</option>
              <option value="ACADEMIC">Academic</option>
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
              <option value="URGENT">Urgent </option>
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