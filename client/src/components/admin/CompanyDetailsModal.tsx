"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RentalCompany } from "@/lib/api/admin";
import {
  Calendar,
  Building2,
  Mail,
  MapPin,
  User2,
  Star,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  Circle,
} from "lucide-react";

interface CompanyDetailsModalProps {
  company: RentalCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (
    id: string,
    status: "active" | "inactive" | "pending"
  ) => Promise<void>;
}

export function CompanyDetailsModal({
  company,
  isOpen,
  onClose,
  onStatusChange,
}: CompanyDetailsModalProps) {
  if (!company) return null;

  const handleStatusChange = async (
    status: "active" | "inactive" | "pending"
  ) => {
    await onStatusChange(company._id, status);
    onClose();
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          className:
            "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm",
          icon: CheckCircle,
          label: "Active",
        };
      case "pending":
        return {
          className:
            "bg-amber-100 text-amber-800 border border-amber-300 shadow-sm",
          icon: Clock,
          label: "Pending Review",
        };
      case "inactive":
        return {
          className:
            "bg-rose-100 text-rose-800 border border-rose-300 shadow-sm",
          icon: XCircle,
          label: "Inactive",
        };
      default:
        return {
          className:
            "bg-gray-100 text-gray-800 border border-gray-300 shadow-sm",
          icon: Circle,
          label: "Unknown",
        };
    }
  };

  const statusConfig = getStatusConfig(company.status);
  const StatusIcon = statusConfig.icon;
  const rating = company.rating ?? 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] rounded-2xl p-0 overflow-hidden shadow-2xl border-0 bg-white">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-amber-400/20 via-yellow-400/10 px-6 py-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-white/10"></div>

          <DialogHeader className="p-0 relative">
            <DialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md border border-white/20">
                <Building2 className="w-5 h-5 text-gray-800" />
              </div>
              {company.name}
            </DialogTitle>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={`${statusConfig.className} text-xs font-bold capitalize px-2 py-1 flex items-center gap-1`}
              >
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </Badge>

              <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm border border-white/30">
                <Star
                  className={`w-3 h-3 ${
                    rating >= 1
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
                <Star
                  className={`w-3 h-3 ${
                    rating >= 2
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
                <Star
                  className={`w-3 h-3 ${
                    rating >= 3
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
                <Star
                  className={`w-3 h-3 ${
                    rating >= 4
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
                <Star
                  className={`w-3 h-3 ${
                    rating >= 5
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
                <span className="text-gray-800 font-bold text-xs ml-1">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Compact Content */}
        <div className="p-4 bg-gradient-to-br from-amber-50/30 via-yellow-50/30 to-orange-50/30 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Owner Information - Compact */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-3 shadow-sm mb-3">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1 font-bold">
              <User2 className="w-3 h-3 text-amber-600" />
              Owner Information
            </div>
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Name
                </label>
                <div className="font-bold text-gray-900">
                  {company.ownerId?.firstName && company.ownerId?.lastName
                    ? `${company.ownerId.firstName} ${company.ownerId.lastName}`
                    : company.ownerId?.username || "N/A"}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Username
                </label>
                <div className="font-bold text-gray-900">
                  {company.ownerId?.username || "N/A"}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl">
                Website
                <div className="font-bold text-gray-900 text-sm">
                  {company.website || "N/A"}
                </div>
              </div>
              {company.ownerId?.dateOfBirth && (
                <div>
                  <label className="text-xs font-semibold text-gray-600">
                    DOB
                  </label>
                  <div className="font-bold text-gray-900">
                    {new Date(company.ownerId.dateOfBirth).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>
              )}
              {company.ownerId?.drivingLicenseNumber && (
                <div>
                  <label className="text-xs font-semibold text-gray-600">
                    License
                  </label>
                  <div className="font-bold text-gray-900 text-xs">
                    {company.ownerId.drivingLicenseNumber}
                  </div>
                </div>
              )}
            </div>
            {company.ownerId?.address && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <label className="text-xs font-semibold text-gray-600">
                  Address
                </label>
                <div className="font-bold text-gray-900 text-sm">
                  {company.ownerId.address}
                </div>
              </div>
            )}
          </div>

          {/* Company Contact & Details - Compact Grid */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1 font-bold">
                <Mail className="w-3 h-3 text-amber-600" />
                Email
              </div>
              <div className="font-bold text-gray-900 text-sm break-all">
                {company.email || "N/A"}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1 font-bold">
                <svg
                  className="w-3 h-3 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Phone
              </div>
              <div className="font-bold text-gray-900 text-sm">
                {company.phone || "N/A"}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1 font-bold">
                <Calendar className="w-3 h-3 text-amber-600" />
                Registered
              </div>
              <div className="font-bold text-gray-900 text-sm">
                {company.createdAt
                  ? new Date(company.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    })
                  : "N/A"}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1 font-bold">
                <MapPin className="w-3 h-3 text-amber-600" />
                Locations
              </div>
              <div className="font-bold text-gray-900 text-sm">
                {company.locations?.length ? (
                  company.locations.length <= 2 ? (
                    <div className="flex flex-wrap gap-1">
                      {company.locations.map((location, index) => (
                        <span
                          key={index}
                          className="bg-amber-100 text-amber-800 px-1 py-0.5 rounded text-xs"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 px-1 py-0.5 rounded text-xs">
                      {company.locations.length} locations
                    </span>
                  )
                ) : (
                  "None"
                )}
              </div>
            </div>
          </div>

          {/* Description - Compact */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-3 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1 font-bold">
              <Award className="w-3 h-3 text-amber-600" />
              Description
            </div>
            <div className="bg-gray-50/50 rounded-lg p-2 border border-gray-100">
              <p className="text-gray-700 text-sm leading-relaxed max-h-20 overflow-y-auto">
                {company.description ||
                  "No description provided for this company."}
              </p>
            </div>
          </div>
          {/* <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1 font-bold">
              <svg
                className="w-3 h-3 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Website
            </div>
            <div className="font-bold text-gray-900 text-sm">
              {company.website || "N/A"}
            </div>
          </div> */}

          {/* Company ID - Compact */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-gray-200/50">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>
              ID:{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">
                {company._id}
              </code>
            </span>
          </div>
        </div>

        {/* Compact Footer */}
        <DialogFooter className="px-4 pb-4 flex gap-2 bg-gradient-to-t from-white to-transparent">
          <Button
            variant="outline"
            onClick={() => handleStatusChange("pending")}
            className="border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 font-semibold text-sm px-3 py-2"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Button>

          <Button
            variant="destructive"
            onClick={() => handleStatusChange("inactive")}
            className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 border-0 font-bold text-sm px-3 py-2"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Decline
          </Button>

          <Button
            onClick={() => handleStatusChange("active")}
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold border-0 text-sm px-3 py-2"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
