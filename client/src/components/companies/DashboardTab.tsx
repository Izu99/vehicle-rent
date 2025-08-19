"use client"

import { motion } from "framer-motion"
import { DollarSign, Car, Calendar, Star, TrendingUp } from "lucide-react"

interface DashboardTabProps {
  // You can pass data from parent if needed
}

export default function DashboardTab() {
  // Simple mock data - replace with your useCompanyData hook
  const stats = {
    totalRevenue: 45231,
    activeCars: 24,
    todayBookings: 8,
    customerRating: 4.9
  }

  const activities = [
    { text: 'New booking for Toyota Camry', time: '2 minutes ago', type: 'booking' },
    { text: 'Payment received from John Doe', time: '1 hour ago', type: 'payment' },
    { text: 'Car maintenance scheduled', time: '3 hours ago', type: 'maintenance' },
    { text: 'New customer registered', time: '5 hours ago', type: 'customer' }
  ]

  const statsData = [
    { 
      title: 'Total Revenue', 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      change: '+20%', 
      icon: DollarSign,
      color: 'text-green-600' 
    },
    { 
      title: 'Active Cars', 
      value: stats.activeCars.toString(), 
      change: '+2', 
      icon: Car,
      color: 'text-blue-600' 
    },
    { 
      title: 'Bookings Today', 
      value: stats.todayBookings.toString(), 
      change: '+12%', 
      icon: Calendar,
      color: 'text-purple-600' 
    },
    { 
      title: 'Customer Rating', 
      value: stats.customerRating.toString(), 
      change: '+0.1', 
      icon: Star,
      color: 'text-yellow-600' 
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className={`flex items-center text-sm font-medium ${stat.color}`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-sm text-gray-500 font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'booking' ? 'bg-blue-500' :
                  activity.type === 'payment' ? 'bg-green-500' :
                  activity.type === 'maintenance' ? 'bg-yellow-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <span className="text-gray-700 font-medium">{activity.text}</span>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-primary to-accent text-black font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-shadow">
              Add New Car
            </button>
            <button className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors">
              View All Bookings
            </button>
            <button className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors">
              Generate Report
            </button>
            <button className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors">
              Customer Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
