"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  Crown, 
  Store, 
  User,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    if (user) {
      const hour = new Date().getHours()
      if (hour < 12) setGreeting("Good Morning")
      else if (hour < 17) setGreeting("Good Afternoon")
      else setGreeting("Good Evening")
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If user is logged in, show personalized homepage
  if (user) {
    const getRoleDetails = () => {
      switch (user.role) {
        case 'admin':
          return {
            icon: Crown,
            title: "Admin Dashboard",
            subtitle: "Manage the entire platform",
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-800",
            buttonText: "Go to Admin Panel",
            route: "/admin"
          }
        case 'rent-shop':
          return {
            icon: Store,
            title: "Shop Dashboard", 
            subtitle: "Manage your rental business",
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-50",
            textColor: "text-orange-800",
            buttonText: "Go to Shop Dashboard",
            route: "/shop"
          }
        case 'customer':
          return {
            icon: User,
            title: "Customer Dashboard",
            subtitle: "Browse and book cars",
            color: "from-blue-500 to-cyan-500", 
            bgColor: "bg-blue-50",
            textColor: "text-blue-800",
            buttonText: "Browse Cars",
            route: "/cars"
          }
      }
    }

    const roleDetails = getRoleDetails()
    const Icon = roleDetails?.icon || User

    return (
      <div className="min-h-screen gradient-background">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            {/* Welcome Message */}
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome Back!
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {greeting}, <span className="text-primary">{user.username}</span>!
              </h1>
              
              <p className="text-gray-600 text-lg">
                Welcome to your personalized {user.role} experience
              </p>
            </div>

            {/* Role-specific Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="max-w-md mx-auto shadow-2xl border-0 overflow-hidden">
                <div className={`h-32 bg-gradient-to-r ${roleDetails?.color} relative`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-4 left-6 text-white">
                    <Icon className="w-8 h-8 mb-2" />
                    <h2 className="text-xl font-bold">{roleDetails?.title}</h2>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className={`${roleDetails?.bgColor} p-4 rounded-lg`}>
                    <p className={`${roleDetails?.textColor} font-medium`}>
                      {roleDetails?.subtitle}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => router.push(roleDetails?.route || '/')}
                    className="w-full bg-gradient-to-r from-primary to-accent text-black font-semibold py-3 hover:shadow-lg transition-all"
                  >
                    {roleDetails?.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 text-center border-0 shadow-lg">
                <Car className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">500+</h3>
                <p className="text-gray-600 text-sm">Available Cars</p>
              </Card>
              
              <Card className="p-6 text-center border-0 shadow-lg">
                <Store className="w-8 h-8 text-accent mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">50+</h3>
                <p className="text-gray-600 text-sm">Partner Shops</p>
              </Card>
              
              <Card className="p-6 text-center border-0 shadow-lg">
                <User className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">10K+</h3>
                <p className="text-gray-600 text-sm">Happy Customers</p>
              </Card>
            </div>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    )
  }

  // If not logged in, show regular homepage (your existing about page content)
  return (
    <div className="min-h-screen gradient-background text-gray-900">
      <Navbar />
      {/* Your existing homepage content here */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-primary">Skyline</span>
        </h1>
        <p className="text-gray-600 text-xl mb-8">
          Sri Lanka's premier car rental marketplace
        </p>
        <div className="space-x-4">
          <Button 
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-primary to-accent text-black font-semibold px-8 py-3"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => router.push('/register')}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-black px-8 py-3"
          >
            Sign Up
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
