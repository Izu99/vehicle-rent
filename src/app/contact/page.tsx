"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { motion, Variants } from "framer-motion"
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Users,
  CheckCircle
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function ContactPage() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

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

  // Use small icons from Unsplash — you can swap URLs with your favorites
  const contactInfo = [
    {
      icon: (
        <Image
          src="https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=32&q=80"
          alt="Phone Icon"
          width={24}
          height={24}
          className="inline-block"
        />
      ),
      title: "Call Us",
      details: ["+94 11 234 5678", "+94 77 123 4567"],
      description: "Monday - Sunday: 6:00 AM - 10:00 PM"
    },
    {
      icon: (
        <Image
          src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=32&q=80"
          alt="Mail Icon"
          width={24}
          height={24}
          className="inline-block"
        />
      ),
      title: "Email Us", 
      details: ["info@skyline.lk", "support@skyline.lk"],
      description: "We'll respond within 2 hours"
    },
    {
      icon: (
        <Image
          src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=32&q=80"
          alt="Map Pin Icon"
          width={24}
          height={24}
          className="inline-block"
        />
      ),
      title: "Visit Us",
      details: ["123 Galle Road", "Colombo 03, Sri Lanka"],
      description: "Monday - Friday: 9:00 AM - 6:00 PM"
    },
    {
      icon: (
        <Image
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=32&q=80"
          alt="Live Chat Icon"
          width={24}
          height={24}
          className="inline-block"
        />
      ),
      title: "Live Chat",
      details: ["24/7 Support", "Instant Response"],
      description: "Click the chat icon below"
    }
  ]

  const faqs = [
    {
      question: "How do I book a car?",
      answer: "Simply search for cars in your desired location, compare options, and click 'Book Now' on your preferred vehicle."
    },
    {
      question: "What documents do I need?",
      answer: "You'll need a valid driving license, national ID/passport, and a credit card for security deposit."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel up to 24 hours before pickup for a full refund. Check individual rental terms for specific policies."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No, we believe in transparent pricing. All fees are clearly displayed during the booking process."
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white text-gray-900">
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <Badge className="bg-indigo-500/30 text-indigo-200 px-4 py-2 text-sm font-semibold mb-6 inline-flex items-center justify-center rounded-full tracking-wide">
              📞 Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              We&apos;re Here to <span className="text-pink-400">Help You</span>
            </h1>
            <p className="text-xl text-indigo-200 leading-relaxed">
              Have questions about our service? Need help with a booking? Our friendly team 
              is available 24/7 to assist you with anything you need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {contactInfo.map((info, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-transform duration-300 h-full group">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 inline-block text-primary group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-3">{info.title}</h3>
                    <div className="space-y-1 mb-3">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-700 font-medium">{detail}</p>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">{info.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">
                  Send us a <span className="text-pink-500">Message</span>
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        placeholder="Enter your full name"
                        className="input-primary"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="input-primary"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <select 
                      className="select-primary"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className="input-primary resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 text-lg flex justify-center items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map & Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Map Image */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <Image
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                  alt="Map Location"
                  width={800}
                  height={300}
                  className="rounded-lg object-cover w-full h-[300px]"
                  priority
                />
                <div className="p-4 text-center">
                  <MapPin className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                  <p className="text-gray-700 font-semibold">123 Galle Road, Colombo 03</p>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-900">
                  <Clock className="w-5 h-5 text-pink-500" />
                  Business Hours
                </h3>
                <div className="space-y-2 text-gray-700 font-medium">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>24/7 Support</span>
                    <span>Always Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Features */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-900">
                  <Headphones className="w-5 h-5 text-pink-500" />
                  Support Features
                </h3>
                <ul className="space-y-3 text-gray-700 font-medium list-disc list-inside">
                  {[
                    "24/7 customer support",
                    "Multi-language assistance", 
                    "Emergency roadside help",
                    "Live chat support",
                    "Email & phone support",
                    "Video call assistance"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Frequently Asked <span className="text-pink-500">Questions</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Quick answers to the most common questions about our service
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3 text-gray-900">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
