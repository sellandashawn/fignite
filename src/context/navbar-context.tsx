"use client"

import { createContext, useContext, useState } from "react"

type Tab = "events" | "sports"

interface NavbarContextType {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

const NavbarContext = createContext<NavbarContextType | null>(null)

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("events")

  return (
    <NavbarContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </NavbarContext.Provider>
  )
}

export function useNavbar() {
  const context = useContext(NavbarContext)
  if (!context) {
    throw new Error("useNavbar must be used inside NavbarProvider")
  }
  return context
}
