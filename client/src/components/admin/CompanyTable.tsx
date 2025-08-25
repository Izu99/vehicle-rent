/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminAPI, RentalCompany } from "@/lib/api/admin";
import { CompanyDetailsModal } from "./CompanyDetailsModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Building2, Search, Filter, Users, Activity } from "lucide-react";

export function CompanyTable() {
  const [companies, setCompanies] = useState<RentalCompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<RentalCompany | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit: 10 };
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;
      const data = await adminAPI.getAllCompanies(params);
      setCompanies(data.companies);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchQuery]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleRowClick = (company: RentalCompany) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (
    id: string,
    status: "active" | "inactive" | "pending"
  ) => {
    try {
      await adminAPI.updateCompanyStatus(id, status);
      toast.success(`Company status updated to ${status}.`);
      fetchCompanies();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          className:
            "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm",
          icon: <div className="w-3 h-3 rounded-full bg-emerald-500" />,
        };
      case "pending":
        return {
          className:
            "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm",
          icon: <div className="w-3 h-3 rounded-full bg-amber-500" />,
        };
      case "inactive":
        return {
          className:
            "bg-rose-50 text-rose-700 border border-rose-200 shadow-sm",
          icon: <div className="w-3 h-3 rounded-full bg-rose-500" />,
        };
      default:
        return {
          className:
            "bg-gray-50 text-gray-700 border border-gray-200 shadow-sm",
          icon: <div className="w-3 h-3 rounded-full bg-gray-400" />,
        };
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="pt-8 pb-6 relative">
        <div className=" bg-white/80 backdrop-blur-md p-6 border border-white/50 shadow-xl">
          {/* <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-gray-700" />
                  <span className="font-semibold text-gray-800">Search & Filter</span>
                </div> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white/90 backdrop-blur-sm shadow-sm"
                />
              </div>
            </div>

            <div className="col-span-1">
              <Select onValueChange={setStatusFilter} defaultValue="all">
                <SelectTrigger className="w-full border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white/90 backdrop-blur-sm shadow-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-gray-200">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Pending
                    </div>
                  </SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Enhanced Table Section */}
        <div className="bg-white/95 backdrop-blur-sm">
          {loading && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Loading companies...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <span>⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="p-6">
                <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-lg bg-white">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/80 sticky top-0">
                      <TableRow className="border-gray-200">
                        <TableHead className="text-gray-800 font-bold py-4">
                          Company Name
                        </TableHead>
                        <TableHead className="text-gray-800 font-bold py-4">
                          Status
                        </TableHead>
                        <TableHead className="text-gray-800 font-bold py-4">
                          Owner
                        </TableHead>
                        <TableHead className="text-gray-800 font-bold py-4">
                          Phone No.
                        </TableHead>
                        <TableHead className="text-gray-800 font-bold py-4">
                          Created Date
                        </TableHead>
                        <TableHead className="text-gray-800 font-bold py-4">
                          Address
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.map((company, index) => {
                        const statusConfig = getStatusConfig(company.status);
                        return (
                          <TableRow
                            key={company._id}
                            onClick={() => handleRowClick(company)}
                            className="cursor-pointer hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-yellow-50/50 transition-all duration-300 border-gray-100 group"
                            style={{
                              animationDelay: `${index * 50}ms`,
                            }}
                          >
                            <TableCell className="font-bold text-gray-900 group-hover:text-amber-700 transition-colors py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {company.name}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.className} inline-flex items-center gap-1`}
                              >
                                <span>{statusConfig.icon}</span>
                                {company.status}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium text-gray-700 py-4">
                              {company.ownerId?.username || "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-600 py-4">
                              {company.phone || "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-600 py-4">
                              {new Date(company.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </TableCell>
                            <TableCell className="text-gray-600 py-4">
                              {company.email || "N/A"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Enhanced Pagination */}
              <div className="flex items-center justify-between px-6 pb-6">
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  Showing {companies.length} companies
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium bg-amber-100 text-amber-800 px-3 py-1 rounded-lg">
                      Page {page} of {totalPages}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Modal */}
      <CompanyDetailsModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
