"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { motion, Variants } from "framer-motion"
import { Star, MapPin, Calendar, Users, Shield, Award, Phone, Mail } from "lucide-react"

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const [topServiceOpen, setTopServiceOpen] = useState(false)

  const containerVariants: Variants = {
    hidden: { 
      opacity: 0 
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.6, -0.05, 0.01, 0.99] // Custom cubic bezier easing
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Enhanced Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
        className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-amber-500/20 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <Image src="/logo.png" alt="Logo" width={60} height={60} className="rounded-lg" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">SKYLINE</span>
              <p className="text-xs text-amber-400 font-medium">Premium Car Rental</p>
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-amber-400 transition-colors font-medium">Home</a>
            <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">Fleet</a>
            <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">About</a>
            <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">Contact</a>
          </div>

          <Button
            onClick={() => setLoginOpen(true)}
            className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 font-semibold px-6 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Login
          </Button>
        </div>
      </motion.nav>

      {/* Premium Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-110"
          style={{ backgroundImage: "url('https://parkplus-bkt-img.parkplus.io/production/crawler/public/Crawler83f158f652bf11f09894624b59288857_20250627002815484414_8435b940-d792-49ca-9765-0fa5bf064ca0.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        
        <div className="relative h-full flex items-center justify-center text-white px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-center max-w-4xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-gradient-to-r from-amber-500/90 to-yellow-500/90 backdrop-blur-sm text-black px-8 py-6 rounded-2xl shadow-2xl mb-8 border border-amber-300/50"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-2">
                Welcome to <span className="text-black">SKYLINE</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90">Premium Car Rental Experience</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
            >
              <select className="bg-white/95 backdrop-blur border-2 border-amber-400/50 text-black rounded-xl px-4 py-3 font-medium shadow-lg focus:ring-2 focus:ring-amber-400 transition-all">
                <option>📍 Province</option>
                <option>Sabaragamuwa</option>
                <option>Eastern</option>
                <option>North</option>
              </select>
              <select className="bg-white/95 backdrop-blur border-2 border-amber-400/50 text-black rounded-xl px-4 py-3 font-medium shadow-lg focus:ring-2 focus:ring-amber-400 transition-all">
                <option>🏙️ District</option>
                <option>Ratnapura</option>
                <option>Kegalle</option>
                <option>Nuwara</option>
              </select>
              <Button className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all">
                🔍 Search Now
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-8 text-white"
        >
          {[
            { icon: "🚗", number: "500+", label: "Premium Cars" },
            { icon: "⭐", number: "4.9", label: "Rating" },
            { icon: "👥", number: "10K+", label: "Happy Customers" }
          ].map((stat, i) => (
            <div key={i} className="text-center bg-black/50 backdrop-blur rounded-lg px-4 py-2">
              <div className="text-2xl">{stat.icon}</div>
              <div className="text-xl font-bold text-amber-400">{stat.number}</div>
              <div className="text-xs opacity-80">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Premium Special Offers */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <Badge className="bg-amber-100 text-amber-800 px-4 py-2 text-sm font-medium mb-4">
              🔥 Limited Time Offers
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Exclusive <span className="text-amber-600">Premium</span> Fleet
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our handpicked collection of luxury vehicles for your perfect journey
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { img: "ed3.png", title: "Elite Cars", desc: "Mercedes-Benz E-Class", price: "$299/day", badge: "Luxury" },
              { img: "ed4.png", title: "Revus Automotive", desc: "Toyota Land Cruiser", price: "$199/day", badge: "SUV" },
              { img: "ed1.png", title: "Limo Service", desc: "Chevrolet Camaro", price: "$399/day", badge: "Sports" },
              { img: "ed2.png", title: "Car Dealer", desc: "Audi Q3 Sportback SUV", price: "$249/day", badge: "Premium" },
            ].map((offer, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <Image
                      src={`/images/${offer.img}`}
                      alt={offer.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4 bg-amber-500 text-black font-semibold">
                      {offer.badge}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {offer.price}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600 mb-4">{offer.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                      <Button className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-semibold">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Premium Top Services */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-gradient-to-r from-gray-900 via-black to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <Badge className="bg-amber-400/20 text-amber-400 px-4 py-2 text-sm font-medium mb-4">
              🏆 Top Rated
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Premium <span className="text-amber-400">Service Partners</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Trusted by thousands of customers worldwide
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { img: "da1.jfif", rating: "4.9", name: "NAB Rent A Car", reviews: "2.5K", modal: () => setTopServiceOpen(true) },
              { img: "da2.jfif", rating: "4.8", name: "Global India Tours", reviews: "1.8K" },
              { img: "da3.jfif", rating: "4.9", name: "Nanuan Travels", reviews: "3.2K" },
              { img: "da4.jfif", rating: "4.8", name: "Premium Chauffeur", reviews: "2.1K" },
            ].map((service, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="bg-gray-800 border-gray-700 hover:border-amber-400/50 transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <Image
                      src={`/images/${service.img}`}
                      alt={service.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{service.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-white text-lg mb-2">{service.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{service.reviews} Reviews</p>
                    <Button 
                      onClick={service.modal}
                      className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-semibold"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Premium CTA Banner */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center mb-8 lg:mb-0"
            >
              <Image src="/logo.png" alt="Skyline" width={120} height={120} className="rounded-xl shadow-lg" />
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left flex-1 lg:mx-12"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
                Ready for Your <span className="text-white">Dream Ride?</span>
              </h2>
              <p className="text-black/80 text-lg mb-6">
                Join thousands of satisfied customers. Book your premium vehicle today!
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center space-x-2 text-black">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Insured</span>
                </div>
                <div className="flex items-center space-x-2 text-black">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Premium Quality</span>
                </div>
                <div className="flex items-center space-x-2 text-black">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">24/7 Support</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                onClick={() => setBookOpen(true)}
                size="lg"
                className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🚗 Book Now
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Premium Footer */}
      <footer className="bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Image src="/logo.png" alt="Skyline Logo" width={60} height={60} className="rounded-lg" />
                <div>
                  <h3 className="text-2xl font-bold text-white">SKYLINE</h3>
                  <p className="text-amber-400 text-sm">Premium Car Rental</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Experience luxury and comfort with our premium fleet. Your journey, our commitment.
              </p>
              <div className="flex space-x-4">
                <motion.div whileHover={{ scale: 1.1 }} className="bg-amber-500 p-2 rounded-full">
                  <Image src="/images/f1.png" alt="Facebook" width={24} height={24} />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} className="bg-amber-500 p-2 rounded-full">
                  <Image src="/images/t2.png" alt="Twitter" width={24} height={24} />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} className="bg-amber-500 p-2 rounded-full">
                  <Image src="/images/i1.png" alt="Instagram" width={24} height={24} />
                </motion.div>
              </div>
            </div>

            {/* Quick Links */}
            {[
              { title: "Services", items: ["Car Rental", "Chauffeur Service", "Airport Transfer", "Long Term Rental"] },
              { title: "Company", items: ["About Us", "Our Fleet", "Testimonials", "Career"] },
              { title: "Support", items: ["Help Center", "Contact Us", "Terms of Service", "Privacy Policy"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold text-amber-400 mb-4 text-lg">{col.title}</h4>
                <ul className="space-y-2">
                  {col.items.map((item, idx) => (
                    <li key={idx}>
                      <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-amber-400 mb-4 text-lg">Stay Updated</h4>
              <p className="text-gray-300 text-sm mb-4">Get exclusive deals and updates</p>
              <div className="space-y-3">
                <div className="flex rounded-lg overflow-hidden border border-gray-600">
                  <Input 
                    type="email" 
                    placeholder="Your email" 
                    className="bg-gray-800 border-none text-white placeholder-gray-400 flex-1"
                  />
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black px-4">
                    <Image src="/images/t1.png" alt="Send" width={20} height={20} />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                  <Mail className="w-4 h-4" />
                  <span>info@skyline.com</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-800" />
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2025 Skyline Premium Rental. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Premium Modals */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="bg-white border-amber-400/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-900">Welcome Back!</DialogTitle>
            <p className="text-center text-gray-600">Sign in to access your premium account</p>
          </DialogHeader>
          <form className="space-y-4">
            <Input placeholder="Email address" className="border-gray-300 focus:border-amber-400" />
            <Input placeholder="Password" type="password" className="border-gray-300 focus:border-amber-400" />
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" /> 
                <span>Remember me</span>
              </label>
              <a href="#" className="text-amber-600 hover:text-amber-700">Forgot password?</a>
            </div>
            <Button className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-semibold">
              Sign In
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2 border-gray-300">
              <Image src="/images/go.png" alt="Google" width={20} height={20} />
              <span>Continue with Google</span>
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account? <a href="#" className="text-amber-600 hover:text-amber-700 font-semibold">Sign up</a>
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Book Your Premium Ride</DialogTitle>
          </DialogHeader>
          <Image src="/images/book-now.png" alt="Book Now" width={600} height={400} className="rounded-lg w-full" />
        </DialogContent>
      </Dialog>

      <Dialog open={topServiceOpen} onOpenChange={setTopServiceOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Premium Service Details</DialogTitle>
          </DialogHeader>
          <Image src="/images/top-service.png" alt="Top Service" width={600} height={400} className="rounded-lg w-full" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
