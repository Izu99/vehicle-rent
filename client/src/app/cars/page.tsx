/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Star, MapPin, Search, Filter, Car, Heart, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarDetailsModal from "@/components/CarDetails";
import { carsApi, Car as ApiCar } from "@/lib/api/cars";

export default function CarsPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [cars, setCars] = useState<ApiCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCars, setTotalCars] = useState(0);
  const [selectedCar, setSelectedCar] = useState<ApiCar | null>(null);
  const [showCarDetails, setShowCarDetails] = useState(false);

  const [filters, setFilters] = useState({
    location: "",
    carType: "",
    priceRange: "",
    transmission: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

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

  // Fetch cars from API
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert frontend filters to API format
        const apiFilters: any = {};

        if (filters.transmission && filters.transmission !== "") {
          apiFilters.transmission =
            filters.transmission === "Auto"
              ? "Automatic"
              : filters.transmission;
        }

        if (filters.search && filters.search !== "") {
          apiFilters.brand = filters.search;
        }

        // Handle price range
        if (filters.priceRange) {
          switch (filters.priceRange) {
            case "under-50":
              apiFilters.maxPrice = 49;
              break;
            case "50-100":
              apiFilters.minPrice = 50;
              apiFilters.maxPrice = 100;
              break;
            case "100-150":
              apiFilters.minPrice = 100;
              apiFilters.maxPrice = 150;
              break;
            case "over-150":
              apiFilters.minPrice = 151;
              break;
          }
        }

        const response = await carsApi.getAll(apiFilters);
        setCars(response.cars);
        setTotalCars(response.total);
      } catch (err) {
        setError("Failed to load cars. Please try again.");
        console.error("Error loading cars:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [filters]);

  // Function to open car details modal
  const openCarDetails = async (carId: string) => {
    try {
      const response = await carsApi.getById(carId);
      setSelectedCar(response.car);
      setShowCarDetails(true);
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  // Function to close modal
  const closeCarDetails = () => {
    setShowCarDetails(false);
    setSelectedCar(null);
  };

  // Transform API car data to match display format
  const transformCarForDisplay = (apiCar: ApiCar) => {
    return {
      id: apiCar._id,
      name: `${apiCar.brand} ${apiCar.carModel}`,
      type: getCarType(apiCar),
      image:
        apiCar.images.length > 0
          ? `http://localhost:5000${apiCar.images[0]}`
          : null,
      hasImage: apiCar.images.length > 0,
      imageCount: apiCar.images.length,
      price: apiCar.pricePerDay.toString(),
      rating: 4.5,
      reviews: Math.floor(Math.random() * 200) + 50,
      company: apiCar.companyId?.name || "Unknown", // get RentalCompany name
      location: apiCar.companyId?.locations?.[0] || "Unknown", // first location from RentalCompany
      available: apiCar.isAvailable,
      fuel: apiCar.fuelType,
      year: apiCar.year.toString(),
    };
  };

  const getCarType = (car: ApiCar): string => {
    if (car.fuelType === "Electric") return "Electric";
    if (car.fuelType === "Hybrid") return "Hybrid";
    if (car.seatingCapacity >= 7) return "Van";
    if (car.seatingCapacity <= 2) return "Sports";
    if (car.pricePerDay > 100) return "Luxury";
    return "Economy";
  };

  const getCarFeatures = (car: ApiCar): string[] => {
    const features = [];
    features.push(car.transmission === "Automatic" ? "Auto" : "Manual");
    if (car.airConditioning) features.push("AC");
    features.push(`${car.seatingCapacity} Seats`);
    if (car.gps) features.push("GPS");
    if (car.bluetooth) features.push("Bluetooth");
    if (car.sunroof) features.push("Sunroof");
    return features;
  };

  // Transform cars for display
  const displayCars = cars.map(transformCarForDisplay);

  // Filter cars based on frontend filters
  const filteredCars = displayCars.filter((car) => {
    const matchesLocation =
      !filters.location ||
      car.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesType = !filters.carType || car.type === filters.carType;
    const matchesSearch =
      !filters.search ||
      car.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      car.company.toLowerCase().includes(filters.search.toLowerCase());

    return matchesLocation && matchesType && matchesSearch;
  });

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      location: "",
      carType: "",
      priceRange: "",
      transmission: "",
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
            <p className="text-gray-600">Loading cars...</p>
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
            <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
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
            "url('https://images.unsplash.com/photo-1666520629801-7f21614bedd7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
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
              🚗 Browse Cars
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Browse Our <span className="text-primary">Premium Fleet</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Choose from {totalCars}+ vehicles from trusted rental partners
              across Sri Lanka
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm top-[80px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          > 
            {/* Filter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filter by:</span>
                <Badge className="bg-primary text-black text-xs">
                  {filteredCars.length} cars found
                </Badge>
              </div>

              {/* Mobile Filter Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>

                {(filters.location ||
                  filters.carType ||
                  filters.priceRange ||
                  filters.transmission) && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Filter Controls */}
            <div className={`${showFilters ? "block" : "hidden"} sm:block`}>
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
                  <option value="Jaffna">Jaffna</option>
                </select>

                <select
                  className="select-primary"
                  value={filters.carType}
                  onChange={(e) =>
                    setFilters({ ...filters, carType: e.target.value })
                  }
                >
                  <option value="">All Types</option>
                  <option value="Economy">Economy</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Van">Van</option>
                  <option value="Electric">Electric</option>
                  <option value="Sports">Sports</option>
                  <option value="Hybrid">Hybrid</option>
                </select>

                <select
                  className="select-primary"
                  value={filters.priceRange}
                  onChange={(e) =>
                    setFilters({ ...filters, priceRange: e.target.value })
                  }
                >
                  <option value="">All Prices</option>
                  <option value="under-50">Under $50/day</option>
                  <option value="50-100">$50-100/day</option>
                  <option value="100-150">$100-150/day</option>
                  <option value="over-150">$150+/day</option>
                </select>

                <select
                  className="select-primary"
                  value={filters.transmission}
                  onChange={(e) =>
                    setFilters({ ...filters, transmission: e.target.value })
                  }
                >
                  <option value="">All Transmission</option>
                  <option value="Auto">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>

                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search cars..."
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {filteredCars.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No cars found
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCars.map((car, index) => (
                <motion.div key={car.id} variants={itemVariants}>
                  <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    <div className="relative overflow-hidden">
                      {car.hasImage ? (
                        <Image
                          src={car.image!}
                          alt={car.name}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <Car className="w-16 h-16 mx-auto mb-3 stroke-1" />
                            <p className="text-sm font-semibold text-gray-600">
                              {car.name}
                            </p>
                            <p className="text-xs mt-1">Image coming soon</p>
                          </div>
                        </div>
                      )}

                      {/* Image count badge */}
                      {car.imageCount > 1 && (
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                          +{car.imageCount} photos
                        </div>
                      )}

                      <Badge
                        className={`absolute top-4 right-4 ${
                          car.available ? "bg-green-500" : "bg-red-500"
                        } text-white font-semibold`}
                      >
                        {car.available ? "Available" : "Booked"}
                      </Badge>

                      <Button className="absolute top-4 right-16 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full hover:scale-110 transition-transform">
                        <Heart className="w-4 h-4" />
                      </Button>

                      <div className="absolute bottom-4 right-4 bg-primary text-black px-3 py-1 rounded-full font-bold">
                        ${car.price}/day
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-1">
                            {car.name}
                          </h3>
                          <p className="text-accent text-sm font-medium">
                            {car.type} • {car.year}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {car.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({car.reviews})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600 mb-3 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{car.location}</span>
                        <span className="text-gray-400">•</span>
                        <span>{car.company}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-green-600 font-medium">
                          {car.fuel}
                        </span>
                      </div>
  
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getCarFeatures(
                          cars.find((apiCar) => apiCar._id === car.id)!
                        )
                          .slice(0, 3)
                          .map((feature, idx) => (
                            <Badge key={idx} className="bg-gray-100 text-gray-700 text-xs">
                              {feature}
                            </Badge>
                          ))}
                        {getCarFeatures(cars.find((apiCar) => apiCar._id === car.id)!).length > 3 && (
                          <Badge className="bg-gray-100 text-gray-700 text-xs">+{getCarFeatures(cars.find((apiCar) => apiCar._id === car.id)!).length - 3} more</Badge>
                        )}
</div>


                      <div className="flex space-x-2">
                        <Button
                          className={`flex-1 ${
                            car.available
                              ? "gradient-primary gradient-primary-hover text-black"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          disabled={!car.available}
                        >
                          {car.available ? "Book Now" : "Not Available"}
                        </Button>
                        <Button
                          variant="outline"
                          className="px-4 border-primary text-primary hover:bg-primary hover:text-black"
                          onClick={() => openCarDetails(car.id)}
                        >
                          Details
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

      <Footer />

      {/* Car Details Modal - Separate Component */}
      <CarDetailsModal
        isOpen={showCarDetails}
        car={selectedCar}
        onClose={closeCarDetails}
      />
    </div>
  );
}
