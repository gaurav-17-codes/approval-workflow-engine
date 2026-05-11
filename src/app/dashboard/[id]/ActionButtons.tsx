"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ActionButtons({ requestId }: { requestId: string }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAction = async (action: "APPROVE" | "REJECT") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/approvals/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to process approval");
      }

      // Go back to approvals list and refresh the data
      router.push("/approvals");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-white/10">
      <h3 className="text-lg font-medium text-white mb-4">Your Decision</h3>
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment (optional but recommended)..."
        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-black focus:outline-none focus:border-blue-500 mb-4 resize-none h-24"
      />
      <div className="flex gap-4">
        <button
          onClick={() => handleAction("APPROVE")}
          disabled={loading}
          className="flex-1 py-3 bg-green-600/20 text-green-400 border border-green-500/50 hover:bg-green-600/30 font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Processing..." : "✅ Approve Request"}
        </button>
        <button
          onClick={() => handleAction("REJECT")}
          disabled={loading}
          className="flex-1 py-3 bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600/30 font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Processing..." : "❌ Reject Request"}
        </button>
      </div>
    </div>
  );
}