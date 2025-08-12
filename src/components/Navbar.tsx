"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavbarProps {
  onLoginClick: () => void
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Navigation items
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

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav 
      // initial={{ y: -100 }}
      // animate={{ y: 0 }}
      // transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-primary-opacity z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo - Links to homepage */}
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
        
        {/* Desktop Navigation */}
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

        <div className="flex items-center space-x-4">
          {/* Login Button */}
          <Button
            onClick={onLoginClick}
            className="gradient-primary gradient-primary-hover text-black font-semibold px-4 sm:px-6 shadow-lg transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
          >
            Login
          </Button>

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
            
            {/* Mobile Login Button */}
            <div className="pt-4 border-t border-gray-700">
              <Button
                onClick={() => {
                  onLoginClick()
                  closeMobileMenu()
                }}
                className="w-full gradient-primary gradient-primary-hover text-black font-semibold py-3"
              >
                Login
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
