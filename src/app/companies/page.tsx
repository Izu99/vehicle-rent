"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Star,
  MapPin,
  Search,
  Filter,
  Car,
  Users,
  Phone,
  Mail,
  Globe,
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

export default function CompaniesPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    rating: "",
    search: "",
  });

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

  // Companies data with real Unsplash images
  const companies = [
    {
      id: 1,
      name: "Elite Motors Sri Lanka",
      category: "Luxury",
      image:
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=1469&auto=format&fit=crop&w=100&h=100&ixlib=rb-4.0.3",
      rating: 4.9,
      reviews: 324,
      fleetSize: "150+",
      established: "2010",
      locations: ["Colombo", "Kandy", "Galle"],
      description:
        "Premium luxury car rental service with high-end vehicles and exceptional customer service.",
      features: [
        "24/7 Support",
        "Chauffeur Service",
        "Airport Pickup",
        "Insurance Included",
      ],
      phone: "+94 11 234 5678",
      email: "info@elitemotors.lk",
      website: "www.elitemotors.lk",
      verified: true,
      featured: true,
    },
    {
      id: 2,
      name: "Budget Car Rentals",
      category: "Economy",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=1469&auto=format&fit=crop&w=100&h=100&ixlib=rb-4.0.3",
      rating: 4.6,
      reviews: 856,
      fleetSize: "300+",
      established: "2008",
      locations: ["Colombo", "Negombo", "Kandy", "Galle", "Jaffna"],
      description:
        "Affordable car rental solutions for budget-conscious travelers across Sri Lanka.",
      features: [
        "Best Price Guarantee",
        "Free Cancellation",
        "Multiple Locations",
        "Online Booking",
      ],
      phone: "+94 11 567 8901",
      email: "bookings@budgetcars.lk",
      website: "www.budgetcars.lk",
      verified: true,
      featured: false,
    },
    {
      id: 3,
      name: "Green Drive Eco Rentals",
      category: "Electric/Hybrid",
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=1469&auto=format&fit=crop&w=100&h=100&ixlib=rb-4.0.3",
      rating: 4.8,
      reviews: 198,
      fleetSize: "80+",
      established: "2020",
      locations: ["Colombo", "Mount Lavinia"],
      description:
        "Sri Lanka's first fully electric and hybrid vehicle rental company promoting sustainable transportation.",
      features: [
        "Eco-Friendly Fleet",
        "Carbon Neutral",
        "Charging Stations",
        "Green Certification",
      ],
      phone: "+94 11 789 0123",
      email: "hello@greendrive.lk",
      website: "www.greendrive.lk",
      verified: true,
      featured: true,
    },
    {
      id: 4,
      name: "Family Van Rentals",
      category: "Family/Van",
      image:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=1469&auto=format&fit=crop&w=100&h=100&ixlib=rb-4.0.3",
      rating: 4.7,
      reviews: 445,
      fleetSize: "120+",
      established: "2015",
      locations: ["Colombo", "Kandy", "Anuradhapura"],
      description:
        "Specialized in family-friendly vehicles and group transportation with spacious vans and SUVs.",
      features: [
        "Child Safety Seats",
        "Group Discounts",
        "Large Capacity",
        "Tour Packages",
      ],
      phone: "+94 11 345 6789",
      email: "family@vanrentals.lk",
      website: "www.familyvanrentals.lk",
      verified: true,
      featured: false,
    },
    {
      id: 5,
      name: "Sports Car Paradise",
      category: "Sports/Luxury",
      image:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=1469&auto=format&fit=crop&w=100&h=100&ixlib=rb-4.0.3",
      rating: 4.9,
      reviews: 127,
      fleetSize: "45+",
      established: "2018",
      locations: ["Colombo", "Bentota"],
      description:
        "Exclusive collection of sports cars and supercars for special occasions and luxury experiences.",
      features: [
        "Exotic Cars",
        "Special Events",
        "Photo Shoots",
        "VIP Service",
      ],
      phone: "+94 11 456 7890",
      email: "luxury@sportscarparadise.lk",
      website: "www.sportscarparadise.lk",
      verified: true,
      featured: true,
    },
    {
      id: 6,
      name: "City Express Rentals",
      category: "Business",
      image:
        "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=1469&auto=format&fit=crop&w=100&h=100&ixlib=rb-4.0.3",
      rating: 4.5,
      reviews: 612,
      fleetSize: "200+",
      established: "2012",
      locations: ["Colombo", "Kandy", "Galle", "Matara"],
      description:
        "Professional car rental service catering to business travelers and corporate clients.",
      features: [
        "Corporate Rates",
        "Monthly Rentals",
        "Airport Service",
        "Professional Drivers",
      ],
      phone: "+94 11 678 9012",
      email: "corporate@cityexpress.lk",
      website: "www.cityexpress.lk",
      verified: true,
      featured: false,
    },
  ];

  // Filter companies based on current filters
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
      company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      company.description.toLowerCase().includes(filters.search.toLowerCase());

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
                number: "50+",
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
              {filteredCompanies.map((company, index) => (
                <motion.div key={company.id} variants={itemVariants}>
                  <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group h-full">
                    <div className="relative overflow-hidden">
                      {/* <Image
                        src={company.image}
                        alt={company.name}
                        width={600}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      /> */}

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
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                        <Image
                          src={company.logo}
                          alt={`${company.name} logo`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
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
                            {company.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({company.reviews})
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {company.description}
                      </p>

                      {/* Company Info */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Car className="w-4 h-4" />
                          <span>{company.fleetSize} vehicles</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Since {company.established}</span>
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
                          {company.features.slice(0, 2).map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-1 text-xs text-green-600"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {company.features.length > 2 && (
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
