/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User2 } from "lucide-react";

interface CustomerProfileFormProps {
  // customerData should include both core and customer fields together
  // e.g. { username, email, phone, firstName, lastName, drivingLicenseNumber, dateOfBirth, address }
  customerData: any;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
}

export function CustomerProfileForm({ customerData, onSave, loading }: CustomerProfileFormProps) {
  const [formData, setFormData] = useState(customerData);

  useEffect(() => {
    setFormData(customerData);
  }, [customerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const safeDate =
    formData?.dateOfBirth && !Number.isNaN(Date.parse(formData.dateOfBirth))
      ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
      : "";

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      {/* Compact header, single title */}
      <CardHeader className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 px-6 py-4">
        <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
          <User2 className="w-5 h-5 text-gray-800" />
          My Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-white">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Core + Customer combined */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Core fields */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData?.username || ""}
                onChange={handleChange}
                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData?.email || ""}
                onChange={handleChange}
                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData?.phone || ""}
                onChange={handleChange}
                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Customer fields */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData?.firstName || ""}
                onChange={handleChange}
                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData?.lastName || ""}
                onChange={handleChange}
                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drivingLicenseNumber">Driving License</Label>
              <Input
                id="drivingLicenseNumber"
                name="drivingLicenseNumber"
                value={formData?.drivingLicenseNumber || ""}
                onChange={handleChange}
                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={safeDate}
                onChange={handleChange}
                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData?.address || ""}
              onChange={handleChange}
              className="rounded-xl border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Single Save button */}
          <div className="pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  disabled={loading}
                  className={`w-full rounded-xl py-3 font-bold ${
                    loading
                      ? "bg-gray-300 text-gray-600"
                      : "bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg hover:shadow-xl"
                  }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl border-0 p-0 overflow-hidden">
                <div className="bg-yellow-100 px-6 py-4">
                  <AlertDialogHeader className="p-0">
                    <AlertDialogTitle className="text-gray-900">
                      Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-700">
                      This will update your profile details.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <div className="px-6 py-5 bg-white">
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onSave(formData)}
                      disabled={loading}
                      className={`rounded-xl font-bold ${
                        loading
                          ? "bg-gray-300 text-gray-600"
                          : "bg-yellow-500 hover:bg-yellow-600 text-black"
                      }`}
                    >
                      Save
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
