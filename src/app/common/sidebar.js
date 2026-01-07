"use client";

import React, { useContext } from "react";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Users,
  LogOut,
  Tags,
  Dumbbell,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "eventDetails", label: "Event Details", icon: Calendar },
    { id: "sports", label: "Sports Details", icon: Dumbbell },
    { id: "categoryDetails", label: "Category Details", icon: Tags },
    { id: "paymentDetails", label: "Payment Details", icon: CreditCard },
    { id: "registrationDetails", label: "Registration Details", icon: Users },
  ];

  return (
    <div className="w-[70] min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-2xl border-r border-slate-700">
      <div className="my-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white font-bold text-sm">GS</span>
          </div>
          <span className="font-bold text-xl text-white">GoSports</span>
        </div>
        <p className="text-center text-slate-400 text-sm">Admin Portal</p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveMenu(id)}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 ${
              activeMenu === id
                ? "bg-primary/90 text-white shadow-lg shadow-primary/40 scale-105"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <Icon size={20} />
            <span className="font-medium ">{label}</span>
          </button>
        ))}

        {/* Logout Button - Only show if user is logged in */}
        {user && (
          <button
            onClick={logout}
            className="w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 text-slate-300 hover:text-white hover:bg-slate-700/50 mt-5"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        )}
      </nav>
    </div>
  );
}
