"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  BarChart3,
  Settings,
  Users,
  Globe,
  FileText,
  CreditCard,
  Bell,
  LogOut,
  Menu,
  X,
  Crown,
  Store
} from "lucide-react"

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
  adminOnly?: boolean;
}

const sidebarTabs: Tab[] = [ 
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cars', label: 'My Cars', icon: Car, badge: '24' },
  { id: 'bookings', label: 'Bookings', icon: Calendar, badge: '3' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'web', label: 'Web Settings', icon: Globe },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings }
]

interface CompanySidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function CompanySidebar({ activeTab, onTabChange }: CompanySidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // Get role info
  const getRoleInfo = () => {
    if (!user) return null
    
    switch (user.role) {
      case 'admin':
        return {
          icon: Crown,
          label: 'Administrator',
          color: 'bg-purple-100 text-purple-800 border-purple-200'
        }
      case 'rental-company':
        return {
          icon: Store,
          label: 'Company Owner',
          color: 'bg-orange-100 text-orange-800 border-orange-200'
        }
      default:
        return null
    }
  }

  const roleInfo = getRoleInfo()

  // Filter tabs based on user role (if needed)
  const availableTabs = sidebarTabs.filter(tab => {
    if (tab.adminOnly && user?.role !== 'admin') {
      return false
    }
    return true
  })

  const SidebarTab = ({ tab }: { tab: Tab }) => {
    const isActive = activeTab === tab.id
    const Icon = tab.icon

    const handleClick = () => {
      onTabChange(tab.id)
      setIsMobileOpen(false)
    }

    return (
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-gradient-to-r from-primary to-accent text-primary font-semibold shadow-md' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-gray-700'}`} />
          <span className="text-sm font-medium">{tab.label}</span>
        </div>
        {tab.badge && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            isActive 
              ? 'bg-black/20 text-black' 
              : 'bg-gray-200 text-gray-600 group-hover:bg-primary/20 group-hover:text-primary'
          }`}>
            {tab.badge}
          </span>
        )}
      </motion.button>
    )
  }

  const sidebarContent = (
    <>
      {/* Company Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">SKYLINE</h2>
            <p className="text-sm text-gray-500">
              {user?.role === 'admin' ? 'Admin Panel' : 'Company Dashboard'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-2">
          {availableTabs.map((tab) => (
            <SidebarTab key={tab.id} tab={tab} />
          ))}
        </nav>
      </div>

      {/* Bottom User Section */}
      <div className="p-4 border-t border-gray-200">
        {/* User Info Card */}
        <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-black">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.username || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'No email'}
            </p>
          </div>
        </div>

        {/* Role Badge */}
        {roleInfo && (
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border mb-3 ${roleInfo.color}`}>
            <roleInfo.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{roleInfo.label}</span>
          </div>
        )}
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:flex w-72 bg-white shadow-xl border-r border-gray-200 flex-col fixed left-0 top-0 h-full z-40">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar - Sliding */}
      <div className={`lg:hidden w-72 bg-white shadow-xl border-r border-gray-200 flex flex-col fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Menu</h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        {sidebarContent}
      </div>
    </>
  )
}

export { sidebarTabs }
