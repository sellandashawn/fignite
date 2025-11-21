"use client";

import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../common/sidebar';
import EventDetails from '../Admin/event_details/page';
import PaymentDetails from '../Admin/payment_details/page';
import DashBoard from '../Admin/dashboard/page';
import RegistrationsDetails from '../Admin/registration_details/page';
import { AuthContext } from "../context/AuthContext";
import { useRouter } from 'next/navigation';

export default function AdminMain() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!(user && user.userType === 'admin')) {
      console.log("sssa");
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  console.log(user);

  return (
    <div className="flex min-h-screen">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1">
        {activeMenu === 'eventDetails' && <EventDetails />}
        {activeMenu === 'paymentDetails' && <PaymentDetails />}
        {activeMenu === 'dashboard' && <DashBoard />}
        {activeMenu === 'registrationDetails' && <RegistrationsDetails />}
      </div>
    </div>
  );
}