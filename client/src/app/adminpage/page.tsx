"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyTable } from "@/components/admin/CompanyTable";
import { ShieldAlert, Lock, User, Crown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
          <div className="relative">
            {/* Animated background circles */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-30 animate-pulse animation-delay-200"></div>

            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-2xl border border-white/50">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                <div className="text-lg font-medium text-gray-700">
                  Loading admin panel...
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            {/* Floating decoration elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-red-200 rounded-full opacity-30 animate-bounce animation-delay-1000"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-orange-200 rounded-full opacity-40 animate-bounce animation-delay-500"></div>

            <div className="relative p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-3xl"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <ShieldAlert className="w-10 h-10 text-white drop-shadow-sm" />
                </div>

                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-3">
                  Access Denied
                </h1>

                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Lock className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 font-medium">
                    Admin Access Required
                  </span>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                  You need administrator privileges to access this page. Please
                  contact your system administrator if you believe this is an
                  error.
                </p>

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  <span>Current role: {user?.role || "Unknown"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br">
        {/* Admin Header */}
        {/* <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 capitalize">
                  Welcome back, {user?.username || "Administrator"}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {/* Force dropdown styles to override global CSS */}
            <CompanyTable />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
