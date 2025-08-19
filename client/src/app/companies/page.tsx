"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  Star,
  MapPin,
  Search,
  Filter,
  Car,
  Phone,
  Mail,
  Shield,
  Award,
  Clock,
  CheckCircle,
  Building,
  Heart,
  Eye,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { companiesApi, RentalCompany } from "@/lib/api/companies";

export default function CompaniesPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    rating: "",
    search: "",
  });

  // Real data states
  const [companies, setCompanies] = useState<RentalCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
    },
  };

  // Load companies from API
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert frontend filters to API format
        const apiFilters: any = {};
        if (filters.category) apiFilters.category = filters.category;
        if (filters.location) apiFilters.location = filters.location;
        if (filters.rating) apiFilters.minRating = filters.rating.replace('+', '');
        if (filters.search) apiFilters.search = filters.search;

        const response = await companiesApi.getAll(apiFilters);
        setCompanies(response.companies);
      } catch (err) {
        setError("Failed to load companies. Please try again.");
        console.error("Error loading companies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [filters]);

  // Filter companies based on current filters (client-side)
  const filteredCompanies = companies.filter((company) => {
    const matchesLocation =
      !filters.location ||
      company.locations.some((loc) =>
        loc.toLowerCase().includes(filters.location.toLowerCase())
      );
    const matchesCategory =
      !filters.category || company.category === filters.category;
    const matchesSearch =
      !filters.search ||
      company.name.toLowerCase().includes(filters.search.toLowerCase());

    let matchesRating = true;
    if (filters.rating) {
      const rating = parseFloat(company.rating.toString());
      switch (filters.rating) {
        case "4.5+":
          matchesRating = rating >= 4.5;
          break;
        case "4.0+":
          matchesRating = rating >= 4.0;
          break;
        case "3.5+":
          matchesRating = rating >= 3.5;
          break;
      }
    }

    return matchesLocation && matchesCategory && matchesSearch && matchesRating;
  });

  const clearFilters = () => {
    setFilters({
      location: "",
      category: "",
      rating: "",
      search: "",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen gradient-background text-gray-900">
        <Navbar onLoginClick={() => setLoginOpen(true)} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading companies...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen gradient-background text-gray-900">
        <Navbar onLoginClick={() => setLoginOpen(true)} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <Button
              onClick={() => window.location.reload()}
              className="gradient-primary gradient-primary-hover text-black"
            >
              Retry
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-background text-gray-900">
      <Navbar onLoginClick={() => setLoginOpen(true)} />

      {/* Page Header */}
      <section
        className="py-40 bg-cover bg-center bg-no-repeat gradient-dark"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1745446425901-0659b088becc?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="bg-primary/20 text-primary px-4 py-2 text-sm font-medium mb-6">
              🏢 Partner Network
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Trusted <span className="text-primary">Rental Partners</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover {companies.length}+ verified car rental companies across
              Sri Lanka, each offering unique services and competitive rates
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <Building className="w-8 h-8" />,
                number: `${companies.length}+`,
                label: "Partner Companies",
              },
              {
                icon: <Car className="w-8 h-8" />,
                number: "1000+",
                label: "Total Fleet Size",
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                number: "25+",
                label: "Cities Covered",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                number: "100%",
                label: "Verified Partners",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-primary mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filter companies:</span>
                <Badge className="bg-primary text-black text-xs">
                  {filteredCompanies.length} companies found
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                className="select-primary"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
              >
                <option value="">All Locations</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
                <option value="Negombo">Negombo</option>
                <option value="Jaffna">Jaffna</option>
              </select>

              <select
                className="select-primary"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value="">All Categories</option>
                <option value="Economy">Economy</option>
                <option value="Luxury">Luxury</option>
                <option value="Business">Business</option>
                <option value="Family/Van">Family/Van</option>
                <option value="Electric/Hybrid">Electric/Hybrid</option>
                <option value="Sports/Luxury">Sports/Luxury</option>
              </select>

              <select
                className="select-primary"
                value={filters.rating}
                onChange={(e) =>
                  setFilters({ ...filters, rating: e.target.value })
                }
              >
                <option value="">All Ratings</option>
                <option value="4.5+">4.5+ Stars</option>
                <option value="4.0+">4.0+ Stars</option>
                <option value="3.5+">3.5+ Stars</option>
              </select>

              <div className="sm:col-span-2 flex items-center space-x-2">
                <Input
                  placeholder="Search companies..."
                  className="input-primary flex-1"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
                <Button className="gradient-primary gradient-primary-hover text-black">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {filteredCompanies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No companies found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to see more results
              </p>
              <Button
                onClick={clearFilters}
                className="gradient-primary gradient-primary-hover text-black"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {filteredCompanies.map((company) => (
                <motion.div key={company._id} variants={itemVariants}>
                  <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group h-full">
                    <div className="relative overflow-hidden h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex space-x-2">
                        {company.verified && (
                          <Badge className="bg-green-500 text-white font-semibold flex items-center space-x-1">
                            <Shield className="w-3 h-3" />
                            <span>Verified</span>
                          </Badge>
                        )}
                        {company.featured && (
                          <Badge className="bg-primary text-black font-semibold flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span>Featured</span>
                          </Badge>
                        )}
                      </div>

                      {/* Company Logo */}
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white flex items-center justify-center">
                        <Building className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-1">
                            {company.name}
                          </h3>
                          <p className="text-accent text-sm font-medium">
                            {company.category}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {company.rating || 4.5}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({company.reviews || 0})
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        Professional car rental service offering {company.category.toLowerCase()} vehicles with excellent customer service.
                      </p>

                      {/* Company Info */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Car className="w-4 h-4" />
                          <span>Fleet Available</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Active Partner</span>
                        </div>
                      </div>

                      {/* Locations */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {company.locations.map((location, idx) => (
                            <Badge
                              key={idx}
                              className="bg-gray-100 text-gray-700 text-xs"
                            >
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {company.features?.slice(0, 2).map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-1 text-xs text-green-600"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {company.features && company.features.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{company.features.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="border-t pt-4 mb-4">
                        <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3 h-3" />
                            <span>{company.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3" />
                            <span>{company.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button className="flex-1 gradient-primary gradient-primary-hover text-black font-semibold">
                          View Cars
                        </Button>
                        <Button
                          variant="outline"
                          className="px-4 border-primary text-primary hover:bg-primary hover:text-black"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="px-4 border-gray-300 text-gray-600 hover:bg-gray-100"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Want to Join Our{" "}
              <span className="text-white">Partner Network?</span>
            </h2>
            <p className="text-black/80 text-lg mb-8">
              List your car rental business on Skyline and reach thousands of
              customers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-3 text-lg">
                Become a Partner
              </Button>
              <Button
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white font-bold px-8 py-3 text-lg"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
