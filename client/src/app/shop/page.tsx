"use client"

import { useState } from "react" 
import { motion } from "framer-motion"
import ShopSidebar from "@/components/Sidebar"
import DashboardTab from "@/components/shops/DashboardTab"
import CarsTab from "@/components/shops/CarsTab"
// Import other tab components...

const tabComponents = {
  dashboard: DashboardTab,
  cars: CarsTab,
  bookings: () => <div className="p-8 bg-white rounded-xl">Bookings Content</div>,
  analytics: () => <div className="p-8 bg-white rounded-xl">Analytics Content</div>,
  settings: () => <div className="p-8 bg-white rounded-xl">Settings Content</div>,
}

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const ActiveTabComponent = tabComponents[activeTab as keyof typeof tabComponents] || DashboardTab

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Shop & Admin */}
      <ShopSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 lg:ml-72">
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
        </div>

        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveTabComponent />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
