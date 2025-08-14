"use client"

import { useState, useEffect } from "react"

interface ShopStats {
  totalRevenue: number
  activeCars: number
  todayBookings: number
  customerRating: number
}

interface ShopData {
  stats: ShopStats
  recentActivity: Array<{
    id: string
    text: string
    time: string
    type: 'booking' | 'payment' | 'maintenance' | 'customer'
  }>
  cars: Array<{
    id: string
    name: string
    status: 'available' | 'rented' | 'maintenance'
    price: number
  }>
}

export function useShopData() {
  const [data, setData] = useState<ShopData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const loadShopData = async () => {
      try {
        setLoading(true)
        
        // Mock data - replace with real API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockData: ShopData = {
          stats: {
            totalRevenue: 45231,
            activeCars: 24,
            todayBookings: 8,
            customerRating: 4.9
          },
          recentActivity: [
            { id: '1', text: 'New booking for Toyota Camry', time: '2 minutes ago', type: 'booking' },
            { id: '2', text: 'Payment received from John Doe', time: '1 hour ago', type: 'payment' },
            { id: '3', text: 'Car maintenance scheduled', time: '3 hours ago', type: 'maintenance' },
            { id: '4', text: 'New customer registered', time: '5 hours ago', type: 'customer' }
          ],
          cars: [
            { id: '1', name: 'Toyota Camry', status: 'available', price: 45 },
            { id: '2', name: 'Honda Civic', status: 'rented', price: 40 },
            { id: '3', name: 'BMW 3 Series', status: 'available', price: 85 }
          ]
        }
        
        setData(mockData)
      } catch (err) {
        setError('Failed to load shop data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadShopData()
  }, [])

  const refreshData = async () => {
    setLoading(true)
    // Reload data logic
    setLoading(false)
  }

  return { data, loading, error, refreshData }
}
