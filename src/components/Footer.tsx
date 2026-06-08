import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 mt-32 py-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-xl font-bold text-white tracking-tight">KALNET</span>
          <span className="text-sm text-gray-400 mt-1">Approval Workflow Engine</span>
        </div>
        
        <div className="flex gap-6 text-sm font-medium text-gray-400">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/support" className="hover:text-white transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 text-center mt-12 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} KALNET. All rights reserved. Intern work by FS-1
      </div>
    </footer>


//     <footer className="mt-32 px-4 pb-8 w-full max-w-6xl mx-auto z-10">
//   <div className="relative w-full rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center md:items-stretch justify-between gap-12 md:gap-0 min-h-[280px] shadow-2xl">
    
//     {/* Subtle Center Glow (mimics the light bleed in the reference image) */}
//     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[50%] bg-white/5 blur-[80px] pointer-events-none rounded-full"></div>

//     {/* Left Column: Social Icons (Top) & Copyright (Bottom) */}
//     <div className="flex flex-col justify-between items-center md:items-start z-10 w-full md:w-1/3">
//       <div className="flex flex-col gap-4 text-gray-400">
//         {/* Globe / Web Icon */}
//         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="hover:text-white cursor-pointer transition-colors">
//           <circle cx="12" cy="12" r="10" />
//           <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
//           <path d="M2 12h20" />
//         </svg>
//         {/* X / Twitter Icon */}
//         <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="hover:text-white cursor-pointer transition-colors">
//           <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
//         </svg>
//       </div>
//       <p className="text-xs text-gray-500 mt-12 md:mt-0 font-medium tracking-wide">
//         © 2026 KALNET digital. All rights reserved.
//       </p>
//     </div>

//     {/* Center Column: Main Logo & Tagline */}
//     <div className="flex flex-col items-center justify-center z-10 w-full md:w-1/3 text-center">
//       <div className="flex items-center gap-3 mb-4">
//         {/* Abstract KALNET Icon (Mimicking the glowing moon) */}
//         {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div> */}
//         <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
//           KALNET
//         </h2>
//       </div>
//       <p className="text-sm text-gray-400 font-medium">
//         Streamlining academic administration.
//       </p>
//     </div>

//     {/* Right Column: Links (Top) & Email (Bottom) */}
//     <div className="flex flex-col justify-between items-center md:items-end z-10 w-full md:w-1/3">
//       <div className="flex flex-col gap-3 md:text-right">
//         <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
//         <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Term of Service</a>
//       </div>
//       <p className="text-xs text-gray-500 mt-12 md:mt-0 font-medium tracking-wide hover:text-white cursor-pointer transition-colors">
//         support@kalnet.com
//       </p>
//     </div>

//   </div>
// </footer>
  );
}