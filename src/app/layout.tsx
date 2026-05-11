import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/shared/Providers"
import CursorBlob from "@/components/CursorBlob"
import { Navbar } from "@/components/shared/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title:       "Approval Workflow Engine",
  description: "Digital approval system for institutions",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CursorBlob />
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}








