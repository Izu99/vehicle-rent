"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(formData.username, formData.password)
      
      // Get user role to redirect appropriately
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const role = userData.role

      // Redirect based on role or redirect parameter
      if (redirectTo && redirectTo !== '/') {
        router.push(redirectTo)
      } else if (role === 'admin') {
        router.push('/admin')
      } else if (role === 'rental-company') {
        router.push('/company')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYWZhZmEiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
      
      <div className="w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Left Side - Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col items-center text-center space-y-8 flex-1"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl"
            />
            <div className="relative w-32 h-32 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-2xl">
              <Car className="w-16 h-16 text-black" />
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-primary">Skyline</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Sri Lanka&apos;s premier car rental marketplace connecting you with trusted rental partners
            </p>
          </div>

          <div className="space-y-4 w-full max-w-sm">
            {[
              { icon: Shield, text: "Verified Partners" },
              { icon: Zap, text: "Instant Booking" },
              { icon: CheckCircle, text: "24/7 Support" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm p-3 rounded-lg"
              >
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="text-gray-700 font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Sign In to Your Account
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Welcome back! Please enter your credentials
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10 py-3 border-gray-300 focus:border-primary focus:ring-primary"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 py-3 border-gray-300 focus:border-primary focus:ring-primary"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-black font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>

              {/* Role Badges */}
              <div className="space-y-3 pt-4">
                <p className="text-sm text-gray-500 text-center">Login as:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                    👤 Customer
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 px-3 py-1">
                    🏪 Rent Company
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                    👑 Admin
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
