"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Trophy } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useNavbar } from "@/context/navbar-context"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { activeTab, setActiveTab } = useNavbar()

  const goToHomeWithTab = (tab: "events" | "sports") => {
    setActiveTab(tab)

    // If not already on home, navigate there
    if (pathname !== "/") {
      router.push("/")
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="text-xl font-bold">Ignite</span>
        </Link>

        {/* Tabs */}
        <div className="flex items-center gap-2 rounded-full bg-muted p-1">
          <Button
            variant={activeTab === "events" ? "default" : "ghost"}
            size="sm"
            onClick={() => goToHomeWithTab("events")}
            className="gap-2 rounded-full"
          >
            <Calendar className="h-4 w-4" />
            Events
          </Button>

          <Button
            variant={activeTab === "sports" ? "default" : "ghost"}
            size="sm"
            onClick={() => goToHomeWithTab("sports")}
            className="gap-2 rounded-full"
          >
            <Trophy className="h-4 w-4" />
            Sports
          </Button>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-primary transition">
            About Us
          </Link>
          <Link href="/gallery" className="hover:text-primary transition">
            Gallery
          </Link>
          <Link href="/#contact" className="hover:text-primary transition">
            Contact Us
          </Link>

          <Button>Get Tickets</Button>
        </div>
      </div>
    </nav>
  )
}
