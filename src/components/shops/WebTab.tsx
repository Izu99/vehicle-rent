"use client"

import { useState, useEffect, useMemo } from "react"
import { Car as CarType } from "@/lib/api/cars" // Import the Car type from the API
import { Plus, Search, Filter, Edit, Trash2, Eye, Car, AlertCircle, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import AddCarModal from "../AddCar"
import CarDetailsModal from "../CarDetails"

interface Car {
  _id: string
  shopId: CarType['shopId']
  brand: string
  carModel: string
  year: number
  color: string
  fuelType: CarType['fuelType']
  transmission: CarType['transmission']
  seatingCapacity: number
  engineSize: string
  mileage: string
  pricePerDay: number
  pricePerWeek?: number
  pricePerMonth?: number
  airConditioning: boolean
  bluetooth: boolean
  gps: boolean
  sunroof: boolean
  images: string[]
  isAvailable: boolean
  description?: string
  licensePlate: string
  createdAt: string
  updatedAt: string
}

interface CarDataForAddModal {
  _id: string;
  brand: string;
  carModel: string;
  year: number;
  color: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  seatingCapacity: number;
  engineSize: string;
  mileage: string;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  airConditioning: boolean;
  bluetooth: boolean;
  gps: boolean;
  sunroof: boolean;
  description?: string;
  licensePlate: string;
  images: string[];
}

export default function WebTab() {
  const { user } = useAuth()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')

  useEffect(() => {
    console.log('🔍 WebTab useEffect - User:', user)
    // ✅ Fixed: Use user?.userId instead of user?.id
    if (user?.userId) {
      loadCars()
    } else {
      console.log('❌ No user ID found, user object:', user)
      setLoading(false)
      setError('User not authenticated or missing user ID')
    }
  }, [user?.userId]) // ✅ Fixed: Watch user?.userId instead of user?.id

  const loadCars = async () => {
    // ✅ Fixed: Use user?.userId instead of user?.id
    if (!user?.userId) {
      setError('User not authenticated')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // ✅ Fixed: Use user.userId instead of user.id
      console.log('🔄 Loading cars for shop:', user.userId)
      console.log('🔍 User object:', user)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // ✅ Fixed: Use user.userId in the API call
      const apiUrl = `http://localhost:5000/api/cars/shop/${user.userId}`
      console.log('📡 API URL:', apiUrl)

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('📡 API Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ API Error Response:', errorData)
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ API Response data:', data)

      if (data.success && Array.isArray(data.cars)) {
        setCars(data.cars)
        console.log('✅ Cars loaded successfully:', data.cars.length)
      } else {
        console.error('❌ Invalid response structure:', data)
        throw new Error('Invalid response structure from server')
      }
      
    } catch (err: any) {
      console.error('❌ Failed to load cars:', err)
      setError(err.message || 'Failed to load cars')
      setCars([])
    } finally {
      setLoading(false)
    }
  }

  // ✅ Row click → Edit mode using AddCarModal
  const handleRowClick = (car: Car) => {
    setSelectedCar(car)
    setModalMode('edit')
    setShowAddModal(true)
  }

  // ✅ Eye icon → View details using CarDetailsModal
  const handleViewClick = (e: React.MouseEvent, car: Car) => {
    e.stopPropagation()
    setSelectedCar(car)
    setModalMode('view')
    setShowDetailsModal(true)
  }

  // ✅ Edit icon → Edit mode using AddCarModal
  const handleEditClick = (e: React.MouseEvent, car: Car) => {
    e.stopPropagation()
    setSelectedCar(car)
    setModalMode('edit')
    setShowAddModal(true)
  }

  // ✅ Add button → Add mode using AddCarModal
  const handleAddClick = () => {
    setSelectedCar(null)
    setModalMode('add')
    setShowAddModal(true)
  }

  const handleDeleteClick = async (e: React.MouseEvent, carId: string) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/cars/${carId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (response.ok) {
        console.log('✅ Car deleted successfully')
        loadCars()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to delete car')
      }
    } catch (err: any) {
      console.error('❌ Delete car error:', err)
      alert(err.message || 'Failed to delete car')
    }
  }

  const selectedCarForModal = useMemo(() => {
    if (!selectedCar) return null;
    const transformedCar: CarDataForAddModal = {
      ...selectedCar,
    };
    return transformedCar;
  }, [selectedCar]);

  const filteredCars = cars.filter(car =>
    car.brand.toLowerCase().includes(search.toLowerCase()) ||
    car.carModel.toLowerCase().includes(search.toLowerCase()) ||
    car.licensePlate.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-600">Loading your vehicles...</p>
        {/* ✅ Fixed: Display user.userId instead of user.id */}
        <p className="text-gray-400 text-sm">User ID: {user?.userId}</p>
        <p className="text-gray-400 text-xs">Username: {user?.username}</p>
        <p className="text-gray-400 text-xs">Role: {user?.role}</p>
        <button 
          onClick={() => {
            console.log('🔄 Forcing loading stop')
            setLoading(false)
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
        >
          Stop Loading
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        {/* <div>
          <h2 className="text-xl font-bold text-gray-900">Vehicle Management</h2>
          <p className="text-gray-600 mt-1">Manage your fleet of {cars.length} vehicles</p>
        </div> */}
        <div className="flex items-center space-x-3">
          {/* <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl">
            <Car className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-gray-700">Shop: {user?.username}</span>
          </div>
          
          <div className="text-xs text-gray-500"> */}
            {/* ✅ Fixed: Display user.userId instead of user.id */}
            {/* User ID: {user?.userId?.slice(-6)}
          </div>
          
          <button
            onClick={loadCars}
            disabled={loading}
            className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh cars list"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
           */}
          <button
            onClick={handleAddClick}
            className="bg-gradient-to-r from-primary to-accent text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Car</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Failed to load cars</p>
            <p className="text-red-600 text-sm">{error}</p>
            {/* ✅ Added debug info */}
            <details className="mt-2">
              <summary className="text-xs text-red-500 cursor-pointer">Debug Info</summary>
              <pre className="text-xs text-red-500 mt-1 bg-red-100 p-2 rounded overflow-auto">
                {JSON.stringify({
                  user: user,
                  userId: user?.userId,
                  username: user?.username,
                  role: user?.role,
                  hasToken: !!localStorage.getItem('token')
                }, null, 2)}
              </pre>
            </details>
          </div>
          <button
            onClick={loadCars}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by brand, model, or license plate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
        
        {search && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCars.length} of {cars.length} vehicles
          </div>
        )}
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Vehicles ({filteredCars.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Vehicle</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Price/Day</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Year</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">License</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr 
                  key={car._id} 
                  onClick={() => handleRowClick(car)}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center overflow-hidden">
                        {car.images && car.images.length > 0 ? (
                          <img 
                            src={`http://localhost:5000${car.images[0]}`}
                            alt={`${car.brand} ${car.carModel}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = '<div class="w-6 h-6 text-primary flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m6.75 4.5v-3.75m-6.75 3.75c0 .621.504 1.125 1.125 1.125h9.75c0 .621-.504 1.125 1.125-1.125m1.5-4.5H21a3.75 3.75 0 000-7.5H9.75a3.75 3.75 0 000 7.5h11.25m-12.75 0h3.75" /></svg></div>';
                            }}
                          />
                        ) : (
                          <Car className="w-6 h-6 text-primary" />
                        )}
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
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      car.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {car.isAvailable ? 'Available' : 'Rented'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">${car.pricePerDay}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">{car.year}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {car.licensePlate}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => handleViewClick(e, car)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button 
                        onClick={(e) => handleEditClick(e, car)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="Edit Car"
                      >
                        <Edit className="w-4 h-4 text-green-600" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(e, car._id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Car"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {!loading && filteredCars.length === 0 && (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {search ? 'No vehicles found' : 'No vehicles yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {search 
                  ? 'Try adjusting your search terms' 
                  : 'Start by adding your first vehicle to the fleet'
                }
              </p>
              {!search && (
                <button
                  onClick={handleAddClick}
                  className="bg-gradient-to-r from-primary to-accent text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  Add Your First Car
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AddCarModal - For Add and Edit */}
      {showAddModal && (
        <AddCarModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setSelectedCar(null)
            setModalMode('add')
          }}
          onSuccess={() => {
            setShowAddModal(false)
            setSelectedCar(null)
            setModalMode('add')
            loadCars()
          }}
          editCar={selectedCar}
          mode={modalMode as 'add' | 'edit'}
        />
      )}

      {/* CarDetailsModal - For View Only */}
      {showDetailsModal && selectedCar && (
        <CarDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedCar(null)
            setModalMode('view')
          }}
          car={selectedCar}
          mode="view"
          onSuccess={() => {
            setShowDetailsModal(false)
            setSelectedCar(null)
            setModalMode('view')
            loadCars()
          }}
        />
      )}
    </div>
  )
}