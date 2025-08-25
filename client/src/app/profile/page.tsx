/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { profileAPI } from "@/lib/api/profile";
import { CustomerProfileForm } from "@/components/profile/CustomerProfileForm";
import { CompanyProfileForm } from "@/components/profile/CompanyProfileForm";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { div } from "framer-motion/client";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfileData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userProfile = await profileAPI.getUserProfile();
      setProfileData(userProfile);

      if (user.role === "rental-company") {
        try {
          const companyProfile = await profileAPI.getCompanyProfile();
          setCompanyData(companyProfile);
        } catch {
          console.warn("Company profile may not exist yet.");
          setCompanyData(null);
        }
      }
    } catch (error: any) {
      toast.error("Failed to load profile data.", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      loadProfileData();
    }
  }, [authLoading, loadProfileData]);

  const handleSaveUser = async (data: any) => {
    setSaving(true);
    try {
      await profileAPI.updateUserProfile(user!.userId, data);
      toast.success("Profile updated successfully!");
      loadProfileData();
    } catch (error: any) {
      toast.error("Failed to update profile.", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCompany = async (data: any) => {
    if (!companyData) return;
    setSaving(true);
    try {
      await profileAPI.updateCompanyProfile(companyData._id, data);
      toast.success("Company profile updated successfully!");
      loadProfileData();
    } catch (error: any) {
      toast.error("Failed to update company profile.", {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="inline-block px-6 py-3 bg-white rounded-xl shadow text-gray-700">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="inline-block px-6 py-3 bg-yellow-100 rounded-xl border border-yellow-200 text-gray-800">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-10 space-y-8">
        <h1 className="text-3xl font-black text-gray-900">My Profile</h1>

        {user.role === "customer" && profileData && (
          <CustomerProfileForm
            customerData={profileData}
            onSave={handleSaveUser}
            loading={saving}
          />
        )}

        {user.role === "rental-company" && companyData && (
          <CompanyProfileForm
            companyData={companyData}
            onSave={handleSaveCompany}
            loading={saving}
          />
        )}

        {user.role === "rental-company" && !companyData && (
          <div className="text-center p-6 rounded-xl border border-yellow-200 bg-yellow-50 text-gray-800">
            You have not created a company profile yet.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
