"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  User, 
  Mail,
  Phone,
  Building,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Lock
} from "lucide-react"
import Link from "next/link"
import { authAPI } from "@/lib/api/auth"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'customer' | 'rental-company'>('customer')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Customer-only fields
    firstName: '',
    lastName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role,
        // Only include customer fields if role is customer
        ...(role === 'customer' && {
          firstName: formData.firstName,
          lastName: formData.lastName
        })
      }

      const response = await authAPI.register(registerData)
      setSuccess(true)
      
      // Different messages based on role
      if (role === 'rental-company') {
        // Redirect to login with message about creating company profile
        setTimeout(() => {
          router.push('/login?message=account-created-setup-company')
        }, 2000)
      } else {
        // Regular customer redirect
        setTimeout(() => {
          router.push('/login?message=account-created')
        }, 2000)
      }
      
    } catch (err: any) {
      setError(err.message || 'Registration failed')
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Card className="p-8 shadow-2xl border-0 bg-white max-w-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your {role === 'customer' ? 'customer' : 'rental company'} account has been created successfully.
            </p>
            {role === 'rental-company' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  Next: Create your company profile to start adding cars
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Step 1: Role Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-10 h-10 text-black" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Skyline</h1>
              <p className="text-gray-600">Choose how you want to use our platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Customer Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setRole('customer')
                  setStep(2)
                }}
                className="cursor-pointer p-8 rounded-2xl border-2 border-gray-200 bg-white hover:border-primary/50 transition-all"
              >
                <User className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">I'm a Customer</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Looking to rent cars for personal or business use
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="bg-blue-100 text-blue-800 text-xs">Book Cars</Badge>
                  <Badge className="bg-green-100 text-green-800 text-xs">Compare Prices</Badge>
                </div>
              </motion.div>

              {/* Rental Company Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setRole('rental-company')
                  setStep(2)
                }}
                className="cursor-pointer p-8 rounded-2xl border-2 border-gray-200 bg-white hover:border-accent/50 transition-all"
              >
                <Building className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">I own a Rental Company</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Want to list my cars and grow my rental business
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">List Cars</Badge>
                  <Badge className="bg-orange-100 text-orange-800 text-xs">Manage Bookings</Badge>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Registration Form */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="text-center space-y-4 pb-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-fit mx-auto text-xs"
                >
                  ← Change Role
                </Button>
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                  {role === 'customer' ? (
                    <User className="w-8 h-8 text-black" />
                  ) : (
                    <Building className="w-8 h-8 text-black" />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Create Your Account
                </CardTitle>
                <Badge className={`${role === 'customer' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                  {role === 'customer' ? '👤 Customer Registration' : '🏪 Company Owner Registration'}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-red-800 text-sm">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      Account Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="username"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleInputChange}
                            className="pl-9 h-10"
                            placeholder="Choose a username"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-9 h-10"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-9 h-10"
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pl-9 pr-9 h-10"
                            placeholder="Create a password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="pl-9 h-10"
                            placeholder="Confirm password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer-specific fields */}
                  {role === 'customer' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="h-10"
                            placeholder="Your first name"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="h-10"
                            placeholder="Your last name"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Note for rental company owners */}
                  {role === 'rental-company' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Next step:</strong> After registration, you'll be able to create your company profile and start adding cars to your fleet.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-black font-semibold py-3 h-12"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <UserPlus className="w-4 h-4" />
                        <span>Create Account</span>
                      </div>
                    )}
                  </Button>
                </form>

                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link 
                      href="/login" 
                      className="text-primary hover:text-primary/80 font-semibold"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
