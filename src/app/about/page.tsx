"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { motion, Variants } from "framer-motion"
import { 
  Star,
  Users,
  Award,
  Shield,
  Car,
  Globe,
  Heart,
  Target,
  CheckCircle,
  Quote
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function AboutPage() {
  const [loginOpen, setLoginOpen] = useState(false)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
    }
  }

  const stats = [
    { icon: <Car className="w-8 h-8" />, number: "500+", label: "Premium Vehicles" },
    { icon: <Users className="w-8 h-8" />, number: "50+", label: "Trusted Partners" },
    { icon: <Star className="w-8 h-8" />, number: "4.9", label: "Average Rating" },
    { icon: <Globe className="w-8 h-8" />, number: "25+", label: "Cities Covered" }
  ]

  const team = [
    {
      name: "Samantha Fernando",
      role: "CEO & Founder",
      image: "team1.jpg",
      bio: "15+ years in automotive industry with passion for customer service excellence."
    },
    {
      name: "Rajesh Kumar",
      role: "CTO",
      image: "team2.jpg", 
      bio: "Tech expert specializing in marketplace platforms and customer experience."
    },
    {
      name: "Priya Jayawardena",
      role: "Head of Operations",
      image: "team3.jpg",
      bio: "Operations specialist ensuring seamless rental experiences across Sri Lanka."
    },
    {
      name: "Michael Silva",
      role: "Head of Partnerships",
      image: "team4.jpg",
      bio: "Building strong relationships with rental companies nationwide."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Traveler",
      image: "customer1.jpg",
      rating: 5,
      comment: "Skyline made my business trip to Colombo seamless. Great cars, better prices!"
    },
    {
      name: "David Chen",
      role: "Tourist",
      image: "customer2.jpg", 
      rating: 5,
      comment: "Perfect platform for comparing rental options. Saved both time and money!"
    },
    {
      name: "Amara Perera",
      role: "Local Customer",
      image: "customer3.jpg",
      rating: 5,
      comment: "Reliable service with transparent pricing. My go-to platform for car rentals."
    }
  ]

  return (
    <div className="min-h-screen gradient-background text-gray-900">
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      
      {/* Hero Section */}
      <section className="py-20 gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <Badge className="bg-primary/20 text-primary px-4 py-2 text-sm font-medium mb-6">
              🚗 About Skyline
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connecting You with the <span className="text-primary">Best Rides</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We&apos;re Sri Lanka&apos;s premier car rental marketplace, bringing together trusted 
              rental companies and customers for seamless, affordable transportation solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-primary mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-primary-light text-primary px-4 py-2 text-sm font-medium mb-4">
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Making Car Rental <span className="text-primary">Simple & Reliable</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2020, Skyline began with a simple mission: to revolutionize how people 
                find and book rental cars in Sri Lanka. We noticed the challenges customers faced 
                in comparing prices, finding reliable vehicles, and dealing with fragmented booking systems.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Today, we&apos;ve partnered with over 50 trusted rental companies across 25+ cities, 
                creating a one-stop platform where customers can compare, book, and manage their 
                rental experiences with complete confidence.
              </p>
              
              <div className="space-y-4">
                {[
                  "Transparent pricing with no hidden fees",
                  "Verified rental partners only",
                  "24/7 customer support",
                  "Instant booking confirmation"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image
                src="/images/about-story.jpg"
                alt="Our Story"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-black p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">2020</div>
                <div className="text-sm">Founded</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission & <span className="text-primary">Vision</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="text-primary mb-4">
                    <Target className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To democratize car rentals by providing a transparent, reliable platform 
                    that connects customers with the best rental options, ensuring everyone 
                    has access to quality transportation at fair prices.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="text-primary mb-4">
                    <Heart className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To become the most trusted car rental marketplace in South Asia, 
                    known for innovation, customer satisfaction, and contributing to 
                    sustainable tourism and transportation solutions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-primary-light text-primary px-4 py-2 text-sm font-medium mb-4">
              Meet Our Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The People Behind <span className="text-primary">Skyline</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our passionate team is dedicated to revolutionizing the car rental experience
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <Image
                        src={`/images/${member.image}`}
                        alt={member.name}
                        width={150}
                        height={150}
                        className="rounded-full mx-auto group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-primary">Customers Say</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Real feedback from real customers who trust Skyline for their rental needs
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border-0 shadow-xl h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Image
                        src={`/images/${testimonial.image}`}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <Quote className="w-6 h-6 text-primary mb-2" />
                    <p className="text-gray-700 leading-relaxed">{testimonial.comment}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Ready to Experience <span className="text-white">Skyline?</span>
            </h2>
            <p className="text-black/80 text-lg mb-8">
              Join thousands of satisfied customers and start your journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-3 text-lg">
                Browse Cars
              </Button>
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white font-bold px-8 py-3 text-lg">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
