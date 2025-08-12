"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, Variants } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  UserCheck,
  Shield,
  Heart,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function ContactPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen gradient-background text-gray-900">
      {/* Navbar */}
      <Navbar onLoginClick={() => setLoginOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden h-[50vh] min-h-[300px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://plus.unsplash.com/premium_photo-1737623478597-a060bb092f53?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
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
              📞 Get In Touch
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Contact
              <span className="text-primary ml-2">Skyline</span>
            </h1>

            <p className="text-gray-200 text-lg sm:text-xl max-w-2xl mx-auto opacity-90 leading-relaxed">
              Have questions? Need support? Want to partner with us? We&apos;re here to help you every step of the way!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 gradient-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Let&apos;s Start a Conversation</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Whether you&apos;re a customer looking for the perfect rental or a business wanting to join our marketplace, we&apos;d love to hear from you.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: "Our Location",
                    details: ["123 Galle Road, Colombo 03", "Western Province, Sri Lanka"],
                    color: "text-primary"
                  },
                  {
                    icon: Phone,
                    title: "Phone Numbers",
                    details: ["+94 11 234 5678", "+94 77 123 4567"],
                    color: "text-accent"
                  },
                  {
                    icon: Mail,
                    title: "Email Addresses",
                    details: ["info@skyline.lk", "support@skyline.lk"],
                    color: "text-primary"
                  },
                  // {
                  //   icon: Clock,
                  //   title: "Business Hours",
                  //   details: ["Monday - Friday: 8:00 AM - 8:00 PM", "Saturday - Sunday: 9:00 AM - 6:00 PM"],
                  //   color: "text-accent"
                  // }
                ].map((contact, i) => (
                  <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <contact.icon className={`w-6 h-6 ${contact.color}`} />
                        </div>
                        <div>
                          <h4 className="text-gray-900 font-semibold mb-2">{contact.title}</h4>
                          {contact.details.map((detail, j) => (
                            <p key={j} className="text-gray-600">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Contact Options */}
              {/* <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <h4 className="text-gray-900 font-semibold mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button className="gradient-primary gradient-primary-hover text-black font-semibold flex items-center space-x-2">
                      <UserCheck className="w-4 h-4" />
                      <span>Become a Partner</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-black flex items-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Live Chat</span>
                    </Button>
                  </div>
                </CardContent>
              </Card> */}
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="input-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+94 XX XXX XXXX"
                          className="input-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="input-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Inquiry Type</label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="select-primary"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Customer Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                        <option value="business">Business Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Subject</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What's this about?"
                        className="input-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Message</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        className="resize-none rounded-lg border border-gray-300 p-3 w-full focus:border-primary focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full gradient-primary gradient-primary-hover text-black font-semibold py-3 flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
                Ready to <span className="text-white">Get Started?</span>
              </h2>
              <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers or become a trusted partner in our growing marketplace ecosystem.
              </p>
              <div className="flex flex-wrap gap-6 justify-center mb-8">
                <div className="flex items-center space-x-2 text-black">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Trusted Platform</span>
                </div>
                <div className="flex items-center space-x-2 text-black">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Fast Response</span>
                </div>
                <div className="flex items-center space-x-2 text-black">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Customer First</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  🚗 Start Booking
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white font-bold px-8 py-4 text-lg"
                >
                  📞 Call Us Now
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
