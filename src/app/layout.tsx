import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from './context/AuthContext';
import { NavbarProvider } from "@/context/navbar-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ignite - Sports Event Participation",
  description: "Join and participate in sports events across the globe",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <NavbarProvider>
          <AuthProvider>
            {children}
            <Analytics />
          </AuthProvider>
        </NavbarProvider>
      </body>
    </html>
  );
}