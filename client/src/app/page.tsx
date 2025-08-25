"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Star,
  MapPin,
  Search,
  Car,
  Users,
  Shield,
  Award,
  Phone,
  Mail,
  Clock,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";



export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [topServiceOpen, setTopServiceOpen] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
    },
  };

  return (
    <div className="min-h-screen gradient-background text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1684323674292-825832273d27?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        />
        <div className="absolute inset-0 gradient-hero" />

        <div className="relative h-full flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-center max-w-5xl w-full"
          >
            {/* Compact Header */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Car className="w-4 h-4 text-primary" />
                <span className="text-white text-sm font-medium">
                  Premium Car Rental Marketplace
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                Find Your Perfect
                <span className="text-primary ml-2">Rental Car</span>
              </h1>

              <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto opacity-90">
                Compare prices from 50+ trusted rental companies across Sri
                Lanka
              </p>
            </motion.div>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white/40 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Pick-up Location
                  </label>
                  <select className="select-primary">
                    <option>Select Province</option>
                    <option>Western Province</option>
                    <option>Central Province</option>
                    <option>Southern Province</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    District
                  </label>
                  <select className="select-primary">
                    <option>Select District</option>
                    <option>Colombo</option>
                    <option>Gampaha</option>
                    <option>Kandy</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Car Type
                  </label>
                  <select className="select-primary">
                    <option>Any Type</option>
                    <option>Economy</option>
                    <option>SUV</option>
                    <option>Luxury</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Budget
                  </label>
                  <select className="select-primary">
                    <option>Any Budget</option>
                    <option>Under $50/day</option>
                    <option>$50-100/day</option>
                    <option>$100-200/day</option>
                  </select>
                </div>
              </div>

              <Button className="w-full gradient-primary gradient-primary-hover text-black font-bold py-4 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Search Available Cars</span>
              </Button>

              <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-black/80">
                <div className="flex items-center space-x-1">
                  <Car className="w-4 h-4 text-accent" />
                  <span>500+ Cars Available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-accent" />
                  <span>50+ Trusted Companies</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-accent" />
                  <span>Verified Partners</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Car Types */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 gradient-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <Badge className="bg-primary-light text-primary px-4 py-2 text-sm font-medium mb-4">
              🚗 Popular Categories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Browse by <span className="text-primary">Vehicle Type</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find the perfect car for your journey from our diverse fleet
              categories
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {[
              {
                img: "ed3.png",
                title: "Luxury Cars",
                desc: "Premium vehicles for special occasions",
                count: "45+ Available",
                badge: "Premium",
              },
              {
                img: "ed4.png",
                title: "SUVs & 4WDs",
                desc: "Perfect for family trips",
                count: "120+ Available",
                badge: "Popular",
              },
              {
                img: "ed1.png",
                title: "Sports Cars",
                desc: "High-performance vehicles",
                count: "25+ Available",
                badge: "Exclusive",
              },
              {
                img: "ed2.png",
                title: "Economy Cars",
                desc: "Budget-friendly options",
                count: "200+ Available",
                badge: "Budget",
              },
            ].map((category, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <Image
                      src={`/images/${category.img}`}
                      alt={category.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4 bg-accent text-black font-semibold">
                      {category.badge}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {category.count}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.desc}</p>
                    <Button className="w-full gradient-primary gradient-primary-hover text-black font-semibold">
                      Browse {category.title}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Top Service Companies */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 gradient-dark"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <Badge className="bg-primary/20 text-primary px-4 py-2 text-sm font-medium mb-4">
              🏆 Top Rated Partners
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted <span className="text-primary">Rental Companies</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Choose from our verified partner network of premium car rental
              services
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {[
              {
                img: "da1.jfif",
                rating: "4.9",
                name: "NAB Rent A Car",
                reviews: "2.5K",
                modal: () => setTopServiceOpen(true),
              },
              {
                img: "da2.jfif",
                rating: "4.8",
                name: "Global India Tours",
                reviews: "1.8K",
              },
              {
                img: "da3.jfif",
                rating: "4.9",
                name: "Nanuan Travels",
                reviews: "3.2K",
              },
              {
                img: "da4.jfif",
                rating: "4.8",
                name: "Premium Chauffeur",
                reviews: "2.1K",
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="bg-gray-800 border-gray-700 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <Image
                      src={`/images/${service.img}`}
                      alt={service.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-accent text-black px-3 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{service.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-white text-lg mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {service.reviews} Reviews
                    </p>
                    <Button
                      onClick={service.modal}
                      className="w-full gradient-primary gradient-primary-hover text-black font-semibold"
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

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 gradient-primary relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center mb-8 lg:mb-0"
            >
              <Image
                src="/logo.png"
                alt="Skyline"
                width={120}
                height={120}
                className="rounded-xl shadow-lg"
              />
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
                Join thousands of satisfied customers. Book your premium vehicle
                today!
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
                🚗 Start Booking
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      

      {/* Modals */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="bg-white border-primary-opacity shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-900">
              Welcome Back!
            </DialogTitle>
            <p className="text-center text-gray-600">
              Sign in to access exclusive deals
            </p>
          </DialogHeader>
          <form className="space-y-4">
            <Input placeholder="Email address" className="input-primary" />
            <Input
              placeholder="Password"
              type="password"
              className="input-primary"
            />
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-primary/80">
                Forgot password?
              </a>
            </div>
            <Button className="w-full gradient-primary gradient-primary-hover text-black font-semibold">
              Sign In
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 border-gray-300"
            >
              <Image src="/images/go.png" alt="Google" width={20} height={20} />
              <span>Continue with Google</span>
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="text-primary hover:text-primary/80 font-semibold"
            >
              Sign up
            </a>
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
