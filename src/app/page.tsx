// app/page.tsx

import Navbar from "@/components/navbar";
import Hero from "@/components/hero";

// 👇 ADD IT HERE (top of file)
import { CheckCircle, Layers, Activity } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
     

      <div className="grid md:grid-cols-3 gap-6 px-10 pb-20">
        {[
          { title: "Submit Request", icon: CheckCircle },
          { title: "Multi-Step Approval", icon: Layers },
          { title: "Real-time Tracking", icon: Activity },
        ].map((item, i) => {
          const Icon = item.icon;

           return (
      <div
        key={i}
        className="
          relative p-6 rounded-xl 
          bg-white/5 backdrop-blur-xl 
          border border-white/10 
          hover:border-green-400/40
          hover:bg-white/10 
          hover:-translate-y-1 
          hover:shadow-lg hover:shadow-green-500/10
          transition duration-300
        "
      >
              
              {/* 👇 ICON USED HERE */}
              <Icon className="w-6 h-6 mb-3 text-green-400" />

              <h3 className="text-lg font-semibold mb-2">
                {item.title}
              </h3>

              <p className="text-gray-400 text-sm">
                Efficient workflow management system.
              </p>
            </div>
          );
        })}
      </div>
       <div className="h-screen"></div>
    </>
  );
}