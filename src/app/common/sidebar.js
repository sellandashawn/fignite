"use client";

import React from 'react';
import { LayoutDashboard, Calendar, CreditCard, Users } from 'lucide-react';

export default function Sidebar({ activeMenu, setActiveMenu }) {

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'eventDetails', label: 'Event Details', icon: Calendar },
    { id: 'paymentDetails', label: 'Payment Details', icon: CreditCard },
    { id: 'registrationDetails', label: 'Registration Details', icon: Users },
  ];

  return (
    <div className="w-[70] min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-2xl border-r border-slate-700">
      <div className="mb-8">
        <div className="relative">
          <img
            src="https://tse2.mm.bing.net/th/id/OIP.eOhGjcSYqkkJ7O_7rzNWXwHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3&o=7&rm=3"
            alt="logo"
            className="relative w-24 h-24 mx-auto rounded-full object-cover border-2 border-slate-700"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        <h1 className='font-bold text-lg text-center my-8'>Admin Panel</h1>
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveMenu(id)}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 ${activeMenu === id
              ? 'bg-primary/90 text-white shadow-lg shadow-primary/40 scale-105'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
          >
            <Icon size={20} />
            <span className="font-medium ">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}