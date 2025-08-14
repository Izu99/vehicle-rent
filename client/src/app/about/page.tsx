"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, Variants } from "framer-motion";
import {
  Users,
  Car,
  Shield,
  Award,
  CheckCircle,
  Globe,
  Target,
  Star,
  Building,
  TrendingUp,
  UserCheck,
  MapPin,
  Handshake,
  Heart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function AboutPage() {
  const [loginOpen, setLoginOpen] = useState(false);

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
      {/* Navbar */}
      <Navbar onLoginClick={() => setLoginOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden h-[60vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://plus.unsplash.com/premium_photo-1686730540270-93f2c33351b6?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        />
        <div className="absolute inset-0 gradient-hero" />

        <div className="relative h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-center max-w-4xl w-full"
          >
            <Badge className="bg-primary/20 text-primary px-6 py-3 text-sm font-medium mb-6 backdrop-blur-sm">
              🚗 About Skyline
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Connecting You to
              <span className="text-primary ml-2">Premium Rentals</span>
            </h1>

            <p className="text-gray-200 text-lg sm:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
              Sri Lanka&apos;s premier car rental marketplace, bringing together trusted rental companies and customers for seamless mobility solutions
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 gradient-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge className="bg-primary-light text-primary px-4 py-2 text-sm font-medium mb-4">
              🎯 Our Story
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Revolutionizing <span className="text-primary">Car Rentals</span> in Sri Lanka
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Skyline is more than just a car rental platform - we&apos;re a comprehensive marketplace that connects customers with verified rental companies across Sri Lanka, making car rentals accessible, transparent, and hassle-free.
            </p>
          </motion.div>

          {/* Mission & Vision Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    To create a unified platform where customers can easily discover, compare, and book rental cars from trusted companies across Sri Lanka, while helping rental businesses reach more customers and grow their operations.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Simplify car rental booking process",
                      "Connect customers with verified partners",
                      "Provide transparent pricing and reviews",
                      "Support local rental businesses"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-accent/20 p-3 rounded-full mr-4">
                      <Globe className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    To become Sri Lanka&apos;s most trusted and comprehensive car rental marketplace, setting new standards for convenience, reliability, and customer satisfaction in the mobility industry.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Market leader in car rental marketplace",
                      "Technology-driven customer experience",
                      "Sustainable mobility solutions",
                      "Island-wide coverage and accessibility"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* How It Works */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How <span className="text-primary">Skyline</span> Works
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our platform connects you with the best rental options in three simple steps
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                icon: MapPin,
                step: "01",
                title: "Search by Location",
                desc: "Enter your location, dates, and preferences to find available rental cars in your area",
                color: "text-primary"
              },
              {
                icon: Car,
                step: "02",
                title: "Compare Options",
                desc: "Browse through verified rental companies, compare prices, read reviews, and select your perfect match",
                color: "text-accent"
              },
              {
                icon: Handshake,
                step: "03",
                title: "Book & Enjoy",
                desc: "Contact the rental company directly or book through our platform and enjoy your hassle-free journey",
                color: "text-primary"
              }
            ].map((step, i) => (
              <motion.div key={i} variants={itemVariants} className="relative">
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4`}>
                        <step.icon className={`w-8 h-8 ${step.color}`} />
                      </div>
                      <Badge className="absolute -top-2 -right-2 bg-gray-900 text-white px-3 py-1 font-bold">
                        {step.step}
                      </Badge>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {[
              { icon: Building, number: "50+", label: "Partner Companies", color: "text-primary" },
              { icon: Car, number: "500+", label: "Available Vehicles", color: "text-accent" },
              { icon: Users, number: "10K+", label: "Happy Customers", color: "text-primary" },
              { icon: TrendingUp, number: "95%", label: "Satisfaction Rate", color: "text-accent" }
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-6">
                    <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-4`} />
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Partnership CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 gradient-primary relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
                Ready to <span className="text-white">Join Our Network?</span>
              </h2>
              <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
                Partner with Skyline and expand your car rental business reach across Sri Lanka. Join our growing network of trusted rental companies.
              </p>
              <div className="flex flex-wrap gap-6 justify-center mb-8">
                <div className="flex items-center space-x-2 text-black">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Verified Platform</span>
                </div>
                <div className="flex items-center space-x-2 text-black">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Grow Your Business</span>
                </div>
                <div className="flex items-center space-x-2 text-black">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Trusted Community</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  🤝 Become a Partner
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white font-bold px-8 py-4 text-lg"
                >
                  📞 Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
