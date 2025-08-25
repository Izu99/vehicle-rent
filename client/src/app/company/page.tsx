"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import CompanySidebar from "@/components/Sidebar";
import DashboardTab from "@/components/Companies/DashboardTab";
import CarsTab from "@/components/Companies/CarsTab";
import WebTab from "@/components/Companies/WebTab";
import { useAuth } from "@/contexts/AuthContext";

const tabComponents = {
  dashboard: DashboardTab,
  cars: CarsTab,
  web: WebTab,
  bookings: () => (
    <div className="p-8 bg-white rounded-xl">Bookings Content</div>
  ),
  analytics: () => (
    <div className="p-8 bg-white rounded-xl">Analytics Content</div>
  ),
  settings: () => (
    <div className="p-8 bg-white rounded-xl">Settings Content</div>
  ),
};

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Unauthorized component
const UnauthorizedAccess = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
  <div className="relative max-w-md w-full">
    {/* Floating decoration elements */}
    <div className="absolute -top-8 -left-8 w-16 h-16 bg-red-200 rounded-full opacity-30 animate-bounce animation-delay-1000"></div>
    <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-orange-200 rounded-full opacity-40 animate-bounce animation-delay-500"></div>

    <div className="relative p-8 text-center transform hover:scale-105 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-3xl"></div>

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-3">
          Access Denied
        </h1>

        {/* Subtitle */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6v2m-6 6h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-red-600 font-medium">Admin Access Required</span>
        </div>

        {/* Message */}
        <p className="text-gray-600 leading-relaxed mb-2">
          You don't have permission to access this company dashboard.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Only company owners and administrators can access this area.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => router.push('/')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
          <button 
            onClick={() => router.push('/login')} 
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const ActiveTabComponent =
    tabComponents[activeTab as keyof typeof tabComponents] || DashboardTab;

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/company");
    }
  }, [user, isLoading, router]);

  // Show loading while auth is being checked
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show unauthorized if not logged in
  if (!user) {
    return <UnauthorizedAccess />;
  }

  // Check if user has proper role (this is backup to middleware)
  if (user.role !== "rental-company" && user.role !== "admin") {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CompanySidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 lg:ml-72">
        {/* <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 sticky top-0 z-30"> */}
        {/* <div className="flex items-center justify-between"> */}
        {/* <h1 className="text-2xl font-bold text-gray-900 capitalize bg-blue-100/20 rounded-2xl p-2 w-full text-center ">{activeTab}</h1> */}
        {/* <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                Welcome back, <span className="font-medium text-gray-900">{user.username}</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            // </div> */}
        {/* </div> */}
        {/* </div> */}

        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveTabComponent />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
