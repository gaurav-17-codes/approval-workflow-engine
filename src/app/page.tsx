import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="max-w-2xl text-center z-10">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Approval Workflow Engine
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
          A digital system that replaces manual approval processes. Submit, track, and manage requests — from Teacher to HOD to Principal.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
          >
            Sign In
          </Link>
          <Link
            href="/approvals"
            className="px-6 py-3 border border-white/20 text-gray-300 rounded-lg font-medium hover:bg-white/5 hover:text-white transition-colors backdrop-blur-sm"
          >
            View Requests
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full px-4 z-10">
        {[
          { icon: "📝", title: "Submit Request", desc: "Teachers submit requests with category and priority." },
          { icon: "✅", title: "Multi-Step Review", desc: "HOD and Principal review and action each request." },
          { icon: "📧", title: "Email Notifications", desc: "Automatic emails keep everyone informed at every step." },
        ].map((f) => (
          <div 
            key={f.title} 
            className="p-6 border border-white/10 rounded-xl bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] transition-colors"
          >
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="font-semibold text-gray-200 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}