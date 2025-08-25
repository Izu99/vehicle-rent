
"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from "@/components/ui/sonner";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Show Navbar and Footer only if not a rental-company or if still loading (to avoid flash)
  const showGlobalLayout = !isLoading && user?.role !== 'rental-company';

  return (
    <>
      {showGlobalLayout && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {showGlobalLayout && <Footer />}
      <Toaster />
    </>
  );
}
