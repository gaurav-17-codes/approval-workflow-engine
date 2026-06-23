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
          <Link href="/privacy" prefetch={false} className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" prefetch={false} className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/support" prefetch={false} className="hover:text-white transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 text-center mt-12 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} KALNET. All rights reserved. Intern work by FS-1
      </div>
    </footer>



  );
}