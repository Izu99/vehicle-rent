"use client"

import { useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react"

export default function CarsTab() {
  const [search, setSearch] = useState("")

  // Mock cars data
  const cars = [
    { id: 1, name: 'Toyota Camry', status: 'Available', price: 45, year: 2022, license: 'ABC123' },
    { id: 2, name: 'Honda Civic', status: 'Rented', price: 40, year: 2021, license: 'DEF456' },
    { id: 3, name: 'BMW 3 Series', status: 'Available', price: 85, year: 2023, license: 'GHI789' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Vehicle Management</h2>
          <p className="text-gray-600 mt-1">Manage your fleet of {cars.length} vehicles</p>
        </div>
        <button className="bg-gradient-to-r from-primary to-accent text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add New Car</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cars..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
              {cars.map((car) => (
                <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg"></div>
                      <div>
                        <div className="font-semibold text-gray-900">{car.name}</div>
                        <div className="text-sm text-gray-500">Premium Vehicle</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      car.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {car.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">${car.price}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">{car.year}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{car.license}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
