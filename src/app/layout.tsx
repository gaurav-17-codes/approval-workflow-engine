// app/layout.tsx
import "./globals.css";
import CursorGlow from "@/components/cursorglow";

export const metadata = {
  title: "Approval Engine",
  description: "Digital Approval Workflow System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body  
      suppressHydrationWarning 
      className="bg-black text-white font-sans"
      >
      <div className="grid-bg"/>
      {/* Glow Orbs */}
      <div className="fixed top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] -z-10" />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}