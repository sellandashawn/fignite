"use client"

import { Navbar } from "@/components/navbar"
import {EventsPage} from "@/components/events-page"
import { SportsPage } from "@/components/sports-page";
import { useNavbar } from "@/context/navbar-context"

export default function Home() {
  const { activeTab } = useNavbar()

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />
      {activeTab === "events" ? <EventsPage /> : <SportsPage />}
    </main>
  )
}
