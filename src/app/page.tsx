import Link from "next/link";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-24">
      {/* Hero Section */}
      <div className="max-w-5xl text-center z-10">
        {/* <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div> */}
    

        
  

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight text-center flex flex-col items-center">
        <span className="md:whitespace-nowrap">Approval Workflow Engine</span>
         <span className="text-yellow-400 mt-2">for KALNET</span>
        </h1>



        {/* <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
          An intelligent digital platform designed to streamline academic governance. Digitize manual workflows to ensure secure, efficient, and transparent request management across all administrative tiers.
        </p> */}

        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-5xl mx-auto leading-relaxed">
  Streamlining academic administration. An automated workflow engine to effortlessly
  <br className="hidden md:block" />
  route, track, and manage requests from Teachers, to Department Heads, to the Principal.
</p>
         
        

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-8 py-5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 shadow-lg shadow-blue-500/20"
          >
            Sign In
          </Link>
          <Link
            href="/approvals"
            className="px-8 py-5 border border-white/20 text-gray-300 rounded-lg font-medium hover:bg-white/5 hover:text-white transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:shadow-xl hover:shadow-white/10 backdrop-blur-sm"
          >
            View Requests
          </Link>
        </div>
      </div>

      {/* Feature Cards
      <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full px-4 z-10">
        {[
          { icon: "📝", title: "Submit Request", desc: "Teachers submit requests with category and priority." },
          { icon: "✅", title: "Multi-Step Review", desc: "HOD and Principal review and action each request." },
          { icon: "✉️", title: "Email Notifications", desc: "Automatic emails keep everyone informed at every step." },
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
      </div> */}

      {/* Feature Cards */}
<div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4 z-10 mx-auto">
  {[
    { icon: "📝", title: "Submit Request", desc: "Teachers submit requests with category and priority." },
    { icon: "✅", title: "Multi-Step Review", desc: "HOD and Principal review and action each request." },
    { icon: "✉️", title: "Email Notifications", desc: "Automatic emails keep everyone informed at every step." },
  ].map((f) => (
    <div 
      key={f.title} 
      className="flex flex-col text-left p-8 rounded-[2rem] bg-gradient-to-b from-white/[0.08] to-transparent border border-white/[0.08] backdrop-blur-xl hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:shadow-xl hover:shadow-white/10"
    >
      {/* Icon Container (The dark circular well) */}
      <div className="w-14 h-14 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-2xl mb-8 shadow-inner">
        {f.icon}
      </div>

      {/* Text Content */}
      <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">
        {f.title}
      </h3>
      <p className="text-base text-gray-400 leading-relaxed mb-8 flex-grow">
        {f.desc}
      </p>

      {/* The 'Learn more' link to match the reference UI */}
      <div className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer mt-auto">
        Learn more <span className="ml-2 text-yellow-400">&gt;</span>
      </div>
    </div>
  ))}
</div>




     <Footer />
    </main>
  );
}