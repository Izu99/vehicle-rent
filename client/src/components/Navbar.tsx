"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Menu, X, User, LogOut, Crown, Store, Settings } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  // Navigation items - visible to everyone
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Browse Cars" },
    { href: "/companies", label: "Companies" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ]

  // Check if link is active
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
    closeMobileMenu()
  }

  const getRoleInfo = () => {
    if (!user) return null
    
    switch (user.role) {
      case 'admin':
        return {
          icon: Crown,
          label: 'Admin',
          color: 'bg-purple-100 text-purple-800',
          dashboardRoute: '/admin'
        }
      case 'rent-shop':
        return {
          icon: Store,
          label: 'Shop Owner',
          color: 'bg-orange-100 text-orange-800',
          dashboardRoute: '/shop'
        }
      case 'customer':
        return {
          icon: User,
          label: 'Customer',
          color: 'bg-blue-100 text-blue-800',
          dashboardRoute: '/customer'
        }
      default:
        return null
    }
  }

  const roleInfo = getRoleInfo()

  if (isLoading) {
    return (
      <nav className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-primary-opacity z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="animate-pulse bg-gray-200 h-12 w-32 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-10 w-24 rounded"></div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-primary-opacity z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo */}
        <Link href="/" onClick={closeMobileMenu}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="relative">
              <Image src="/logo.png" alt="Logo" width={50} height={50} className="rounded-lg sm:w-[60px] sm:h-[60px]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-white">SKYLINE</span>
              <p className="text-xs text-primary font-medium hidden sm:block">Car Rental Marketplace</p>
            </div>
          </motion.div>
        </Link>
        
        {/* Desktop Navigation - Show for everyone, especially customers */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors font-medium ${
                isActive(item.href)
                  ? "text-primary font-semibold"
                  : "text-gray-300 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side - Auth Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            /* Logged In User Menu */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-black bg-primary w-10 h-8 rounded-full flex items-center justify-center">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-white text-sm font-medium">{user.username}</p>
                  <p className="text-gray-400 text-xs">{roleInfo?.label}</p>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-black bg-primary w-10 h-10 rounded-full flex items-center justify-center">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.username}</p>
                        <Badge className={`${roleInfo?.color} text-xs`}>
                          {roleInfo && <roleInfo.icon className="w-3 h-3 mr-1" />}
                          {roleInfo?.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {/* Only show dashboard link for shop/admin users */}
                    {(user.role === 'rent-shop' || user.role === 'admin') && (
                      <Link
                        href={roleInfo?.dashboardRoute || '/'}
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {roleInfo && <roleInfo.icon className="w-4 h-4" />}
                        <span>Go to Dashboard</span>
                      </Link>
                    )}
                    
                    {/* Profile/Settings for all users */}
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>

                    {/* Customer-specific menu items */}
                    {user.role === 'customer' && (
                      <>
                        <Link
                          href="/my-bookings"
                          onClick={closeMobileMenu}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>My Bookings</span>
                        </Link>
                        <Link
                          href="/favorites"
                          onClick={closeMobileMenu}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Favorites</span>
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Not Logged In - Login/Signup Buttons */
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => router.push('/login')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-black font-medium px-4 py-2 text-sm"
              >
                Login
              </Button>
              <Button
                onClick={() => router.push('/register')}
                className="gradient-primary gradient-primary-hover text-black font-semibold px-4 sm:px-6 shadow-lg transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-black/95 border-t border-primary-opacity"
        >
          <div className="px-4 py-4 space-y-4">
            {/* Navigation Links - Important for customers on mobile */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`block transition-colors font-medium py-2 px-2 rounded-lg ${
                  isActive(item.href)
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-gray-300 hover:text-primary hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile User Section */}
            <div className="pt-4 border-t border-gray-700">
              {user ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-black bg-primary w-10 h-10 rounded-full flex items-center justify-center">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.username}</p>
                      <Badge className={`${roleInfo?.color} text-xs`}>
                        {roleInfo?.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Dashboard Button (only for shop/admin) */}
                  {(user.role === 'rent-shop' || user.role === 'admin') && (
                    <Button
                      onClick={() => {
                        router.push(roleInfo?.dashboardRoute || '/')
                        closeMobileMenu()
                      }}
                      className="w-full gradient-primary gradient-primary-hover text-black font-semibold py-3"
                    >
                      {roleInfo && <roleInfo.icon className="w-4 h-4 mr-2" />}
                      Go to Dashboard
                    </Button>
                  )}

                  {/* Customer Quick Links */}
                  {user.role === 'customer' && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          router.push('/my-bookings')
                          closeMobileMenu()
                        }}
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary hover:text-black py-3"
                      >
                        My Bookings
                      </Button>
                      <Button
                        onClick={() => {
                          router.push('/favorites')
                          closeMobileMenu()
                        }}
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary hover:text-black py-3"
                      >
                        Favorites
                      </Button>
                    </div>
                  )}

                  {/* Logout Button */}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-3"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                /* Mobile Login/Signup Buttons */
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      router.push('/login')
                      closeMobileMenu()
                    }}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-black py-3"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      router.push('/register')
                      closeMobileMenu()
                    }}
                    className="w-full gradient-primary gradient-primary-hover text-black font-semibold py-3"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}