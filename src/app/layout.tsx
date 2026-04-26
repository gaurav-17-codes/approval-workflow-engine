import "./globals.css";
import Cursor from "@/components/cursor"; 



export const metadata = {
  title: "WEBX UI",
  description: "Modern SaaS UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white" suppressHydrationWarning={true}> 
        <Cursor />
        {children}
      </body>
    </html>
  );
}