"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Car,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  AlertTriangle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Settings,
  BarChart3,
  Users,
  MapPin
} from "lucide-react"
import Navbar from "@/components/Navbar"
import { carsApi, Car as ApiCar } from "@/lib/api/cars"

interface DashboardStats {
  totalCars: number;
  availableCars: number;
  rentedCars: number;
  maintenanceCars: number;
  monthlyRevenue: number;
  revenueChange: number;
}

export default function ShopDashboard() {
  const [cars, setCars] = useState<ApiCar[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "rented" | "maintenance">("all")
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    availableCars: 0,
    rentedCars: 0,
    maintenanceCars: 0,
    monthlyRevenue: 0,
    revenueChange: 0
  })

  // Mock user data - in real app, get from auth context
  const shopUser = {
    shopName: "Premium Car Rentals",
    email: "info@premiumcars.com"
  }

  useEffect(() => {
    loadShopCars()
  }, [])

  const loadShopCars = async () => {
    try {
      setLoading(true)
      // Note: You'll need to implement getShopCars in your API
      // For now, we'll use getAllCars and filter (in real app, use actual shop ID)
      const response = await carsApi.getAll()
      setCars(response.cars || [])
      
      // Calculate stats
      const available = response.cars?.filter(car => car.isAvailable).length || 0
      const total = response.cars?.length || 0
      const rented = total - available
      
      setStats({
        totalCars: total,
        availableCars: available,
        rentedCars: rented,
        maintenanceCars: 0, // You can add maintenance status to your backend
        monthlyRevenue: 45200,
        revenueChange: -2
      })
    } catch (error) {
      console.error('Error loading cars:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter cars based on search and status
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "available" && car.isAvailable) ||
                         (filterStatus === "rented" && !car.isAvailable) ||
                         (filterStatus === "maintenance" && false) // Add maintenance logic
    
    return matchesSearch && matchesFilter
  })

  const StatCard = ({ title, value, change, icon: Icon, trend }: {
    title: string;
    value: string | number;
    change?: string;
    icon: any;
    trend?: "up" | "down";
  }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center mt-1 text-sm ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}>
                {trend === "up" ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {change}
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">{shopUser.shopName}</p>
            </div>
            <Button className="gradient-primary gradient-primary-hover text-black mt-4 md:mt-0">
              <Plus className="w-5 h-5 mr-2" />
              Add New Car
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total Cars"
            value={stats.totalCars}
            change="10% from last month"
            icon={Car}
            trend="up"
          />
          <StatCard
            title="Available Cars"
            value={stats.availableCars}
            change="5% from last month"
            icon={Calendar}
            trend="up"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            change={`${stats.revenueChange}% from last month`}
            icon={DollarSign}
            trend={stats.revenueChange > 0 ? "up" : "down"}
          />
          <StatCard
            title="Maintenance Alerts"
            value={stats.maintenanceCars}
            icon={AlertTriangle}
          />
        </motion.div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search cars by brand, model, or license plate..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cars Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Vehicle Inventory</span>
              <Badge className="bg-primary/10 text-primary">
                {filteredCars.length} vehicles
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Vehicle</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Price/Day</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Year</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">License</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car, index) => (
                    <motion.tr 
                      key={car._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                            <Car className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {car.brand} {car.carModel}
                            </div>
                            <div className="text-sm text-gray-500">
                              {car.color} • {car.fuelType} • {car.transmission}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${
                          car.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {car.isAvailable ? 'Available' : 'Rented'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">${car.pricePerDay}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">{car.year}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {car.licensePlate}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="p-2">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="p-2">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="p-2 text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first vehicle'}
                </p>
                <Button className="gradient-primary gradient-primary-hover text-black">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Car
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
