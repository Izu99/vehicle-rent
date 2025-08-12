"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { motion, Variants } from "framer-motion"
import { 
  Star, 
  MapPin, 
  Search, 
  Filter, 
  Car, 
  Users, 
  Fuel, 
  Settings,
  Heart,
  Calendar,
  Clock,
  CheckCircle,
  X
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function CarsPage() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [filters, setFilters] = useState({
    location: '',
    carType: '',
    priceRange: '',
    transmission: '',
    search: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
    }
  }

  // Updated car data with real Unsplash car images - perfect for rental websites
  const cars = [
    {
      id: 1,
      name: "Toyota Corolla",
      type: "Economy",
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      price: "45",
      rating: 4.8,
      reviews: 156,
      company: "ABC Rentals",
      features: ["Auto", "AC", "4 Seats", "GPS"],
      location: "Colombo",
      available: true,
      fuel: "Petrol",
      year: "2023"
    },
    {
      id: 2,
      name: "Honda CR-V",
      type: "SUV",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      price: "85",
      rating: 4.9,
      reviews: 203,
      company: "Premium Cars",
      features: ["Auto", "AC", "7 Seats", "4WD"],
      location: "Kandy",
      available: true,
      fuel: "Petrol",
      year: "2023"
    },
    {
      id: 3,
      name: "BMW 3 Series",
      type: "Luxury",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      price: "150",
      rating: 4.9,
      reviews: 89,
      company: "Elite Motors",
      features: ["Auto", "Leather", "4 Seats", "Premium Audio"],
      location: "Galle",
      available: false,
      fuel: "Petrol",
      year: "2024"
    },
    {
      id: 4,
      name: "Toyota Hiace",
      type: "Van",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3",
      price: "65",
      rating: 4.7,
      reviews: 124,
      company: "Family Rentals",
      features: ["Manual", "AC", "15 Seats", "Luggage Space"],
      location: "Colombo",
      available: true,
      fuel: "Diesel",
      year: "2022"
    },
    {
      id: 5,
      name: "Tesla Model 3",
      type: "Electric",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3",
      price: "70",
      rating: 4.6,
      reviews: 67,
      company: "Eco Drive",
      features: ["Auto", "Electric", "5 Seats", "Eco-Friendly"],
      location: "Colombo",
      available: true,
      fuel: "Electric",
      year: "2023"
    },
    {
      id: 6,
      name: "Ford Mustang",
      type: "Sports",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3",
      price: "200",
      rating: 4.8,
      reviews: 45,
      company: "Sports Cars Ltd",
      features: ["Manual", "V8", "2 Seats", "Sport Mode"],
      location: "Kandy",
      available: true,
      fuel: "Petrol",
      year: "2024"
    },
    {
      id: 7,
      name: "Mercedes E-Class",
      type: "Luxury",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      price: "180",
      rating: 4.9,
      reviews: 76,
      company: "Elite Motors",
      features: ["Auto", "Leather", "5 Seats", "Sunroof"],
      location: "Colombo",
      available: true,
      fuel: "Petrol",
      year: "2024"
    },
    {
      id: 8,
      name: "Suzuki Swift",
      type: "Economy",
      image: "https://images.unsplash.com/photo-1627634777217-c864268db30c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      price: "35",
      rating: 4.5,
      reviews: 198,
      company: "Budget Cars",
      features: ["Manual", "AC", "4 Seats", "Bluetooth"],
      location: "Galle",
      available: true,
      fuel: "Petrol",
      year: "2022"
    },
    {
      id: 9,
      name: "Toyota Prius",
      type: "Hybrid",
      image: "https://images.unsplash.com/photo-1632717025270-1aa09e7ca5de?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
      price: "60",
      rating: 4.7,
      reviews: 134,
      company: "Eco Drive",
      features: ["Auto", "Hybrid", "5 Seats", "Fuel Efficient"],
      location: "Kandy",
      available: true,
      fuel: "Hybrid",
      year: "2023"
    }
  ]

  // Filter cars based on current filters
  const filteredCars = cars.filter(car => {
    const matchesLocation = !filters.location || car.location === filters.location
    const matchesType = !filters.carType || car.type === filters.carType
    const matchesTransmission = !filters.transmission || 
      car.features.some(feature => feature.toLowerCase() === filters.transmission.toLowerCase())
    const matchesSearch = !filters.search || 
      car.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      car.company.toLowerCase().includes(filters.search.toLowerCase())
    
    let matchesPrice = true
    if (filters.priceRange) {
      const price = parseInt(car.price)
      switch (filters.priceRange) {
        case 'under-50':
          matchesPrice = price < 50
          break
        case '50-100':
          matchesPrice = price >= 50 && price <= 100
          break
        case '100-150':
          matchesPrice = price >= 100 && price <= 150
          break
        case 'over-150':
          matchesPrice = price > 150
          break
      }
    }

    return matchesLocation && matchesType && matchesTransmission && matchesSearch && matchesPrice
  })

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      location: '',
      carType: '',
      priceRange: '',
      transmission: '',
      search: ''
    })
  }

  return (
    <div className="min-h-screen gradient-background text-gray-900">
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      
      {/* Page Header */}
      <section className="py-40 bg-cover bg-center bg-no-repeat gradient-dark"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1666520629801-7f21614bedd7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}>
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
              Choose from over {cars.length}+ vehicles from trusted rental partners across Sri Lanka
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm sticky top-[80px] z-40">
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
                
                {(filters.location || filters.carType || filters.priceRange || filters.transmission) && (
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
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <select 
                  className="select-primary"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
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
                  onChange={(e) => setFilters({...filters, carType: e.target.value})}
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
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
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
                  onChange={(e) => setFilters({...filters, transmission: e.target.value})}
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
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
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
            // No cars found
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
              <Button onClick={clearFilters} className="gradient-primary gradient-primary-hover text-black">
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
                      {/* Real Car Image from Unsplash */}
                      <Image
                        src={car.image}
                        alt={car.name}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Availability Badge */}
                      <Badge className={`absolute top-4 left-4 ${car.available ? 'bg-green-500' : 'bg-red-500'} text-white font-semibold`}>
                        {car.available ? 'Available' : 'Booked'}
                      </Badge>
                      
                      {/* Favorite Button */}
                      <Button className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full hover:scale-110 transition-transform">
                        <Heart className="w-4 h-4" />
                      </Button>
                      
                      {/* Price Tag */}
                      <div className="absolute bottom-4 right-4 bg-primary text-black px-3 py-1 rounded-full font-bold">
                        ${car.price}/day
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-1">{car.name}</h3>
                          <p className="text-accent text-sm font-medium">{car.type} • {car.year}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{car.rating}</span>
                          <span className="text-xs text-gray-500">({car.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600 mb-3 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{car.location}</span>
                        <span className="text-gray-400">•</span>
                        <span>{car.company}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-green-600 font-medium">{car.fuel}</span>
                      </div>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {car.features.slice(0, 3).map((feature, idx) => (
                          <Badge key={idx} className="bg-gray-100 text-gray-700 text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {car.features.length > 3 && (
                          <Badge className="bg-gray-100 text-gray-700 text-xs">
                            +{car.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          className={`flex-1 ${car.available ? 'gradient-primary gradient-primary-hover text-black' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                          disabled={!car.available}
                        >
                          {car.available ? 'Book Now' : 'Not Available'}
                        </Button>
                        <Button variant="outline" className="px-4 border-primary text-primary hover:bg-primary hover:text-black">
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Load More Button - Only show if there are more cars */}
          {filteredCars.length > 0 && filteredCars.length >= 6 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-12"
            >
              <Button className="gradient-primary gradient-primary-hover text-black px-8 py-3">
                <Car className="w-4 h-4 mr-2" />
                Load More Cars
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
