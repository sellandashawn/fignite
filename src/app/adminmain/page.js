"use client";

import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../common/sidebar";
import EventDetails from "../Admin/event_details/page";
import PaymentDetails from "../Admin/payment_details/page";
import DashBoard from "../Admin/dashboard/page";
import RegistrationsDetails from "../Admin/registration_details/page";
import CategoryDetails from "../Admin/category_details/page";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { isAdminFromToken } from "../utils/tokenUtils";

export default function AdminMain() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const token = localStorage.getItem("token");

    if (!user || !token || !isAdminFromToken(token)) {
      console.log("Unauthorized access attempt");
      router.push("/login");
      return;
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1">
        {activeMenu === "eventDetails" && <EventDetails />}
        {activeMenu === "categoryDetails" && <CategoryDetails />}
        {activeMenu === "paymentDetails" && <PaymentDetails />}
        {activeMenu === "dashboard" && <DashBoard />}
        {activeMenu === "registrationDetails" && <RegistrationsDetails />}
      </div>
    </div>
  );
}
