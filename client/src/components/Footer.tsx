"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Image src="/logo.png" alt="Skyline Logo" width={50} height={50} className="rounded-lg" />
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-white">SKYLINE</h3>
                <p className="text-primary text-sm">Car Rental Marketplace</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm max-w-md">
              Your trusted partner for finding the perfect rental car. Compare prices, read reviews, and book instantly from verified rental companies across Sri Lanka.
            </p>
            
            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+94 11 234 5678</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">info@skyline.lk</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Colombo, Sri Lanka</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                className="bg-accent p-2 rounded-full cursor-pointer"
              >
                <Image src="/images/f1.png" alt="Facebook" width={20} height={20} />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                className="bg-accent p-2 rounded-full cursor-pointer"
              >
                <Image src="/images/t2.png" alt="Twitter" width={20} height={20} />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                className="bg-accent p-2 rounded-full cursor-pointer"
              >
                <Image src="/images/i1.png" alt="Instagram" width={20} height={20} />
              </motion.div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-6 sm:gap-0 lg:contents">
            {/* Services */}
            <div className="lg:col-span-1">
              <h4 className="font-bold text-primary mb-3 text-base">Services</h4>
              <ul className="space-y-1">
                {[
                  { name: "Browse Cars", href: "/cars" },
                  { name: "Compare Prices", href: "/compare" },
                  { name: "Instant Booking", href: "/book" },
                  { name: "Customer Reviews", href: "/reviews" }
                ].map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href={item.href} 
                      className="text-gray-300 hover:text-primary transition-colors text-sm block py-1 hover:translate-x-1 transition-transform duration-200"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="lg:col-span-1">
              <h4 className="font-bold text-primary mb-3 text-base">Company</h4>
              <ul className="space-y-1">
                {[
                  { name: "About Us", href: "/about" },
                  { name: "Partner Network", href: "/partners" },
                  { name: "Careers", href: "/careers" },
                  { name: "Press & Media", href: "/press" }
                ].map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href={item.href} 
                      className="text-gray-300 hover:text-primary transition-colors text-sm block py-1 hover:translate-x-1 transition-transform duration-200"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Support & Newsletter */}
          <div className="sm:col-span-2 lg:col-span-2 xl:col-span-1">
            {/* Support Links */}
            <div className="mb-6">
              <h4 className="font-bold text-primary mb-3 text-base">Support</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1 sm:gap-2 lg:gap-1">
                {[
                  { name: "Help Center", href: "/help" },
                  { name: "Contact Us", href: "/contact" },
                  { name: "FAQ", href: "/faq" },
                  { name: "Live Chat", href: "/chat" }
                ].map((item, idx) => (
                  <a 
                    key={idx}
                    href={item.href} 
                    className="text-gray-300 hover:text-primary transition-colors text-sm block py-1 hover:translate-x-1 transition-transform duration-200"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            {/* <div className="mb-6">
              <h4 className="font-bold text-primary mb-3 text-base">Stay Updated</h4>
              <p className="text-gray-300 text-sm mb-3">
                Get exclusive deals and travel tips.
              </p>
              
              <div className="space-y-3">
                <div className="flex rounded-lg overflow-hidden border border-gray-600">
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    className="bg-gray-800 border-none text-white placeholder-gray-400 flex-1 text-sm focus:ring-0 focus:outline-none"
                  />
                  <Button className="bg-accent hover:bg-primary text-black px-3 py-2 flex-shrink-0">
                    <Image src="/images/t1.png" alt="Send" width={16} height={16} />
                  </Button>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="newsletter-terms" 
                    className="mt-1 rounded border-gray-600 bg-gray-800 text-amber-400 flex-shrink-0"
                  />
                  <label htmlFor="newsletter-terms" className="text-xs text-gray-400 leading-relaxed">
                    I agree to receive marketing emails and can unsubscribe anytime.
                  </label>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Section */}
        <hr className="my-8 border-gray-800" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <p className="text-xs sm:text-sm">&copy; 2025 Skyline Car Rental Marketplace. All rights reserved.</p>
            <div className="flex items-center space-x-1 text-xs sm:text-sm">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>in Sri Lanka</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 lg:gap-6 text-xs sm:text-sm">
            <a href="/privacy" className="hover:text-primary transition-colors whitespace-nowrap">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-primary transition-colors whitespace-nowrap">
              Terms & Conditions
            </a>
            <a href="/cookies" className="hover:text-primary transition-colors whitespace-nowrap">
              Cookie Policy
            </a>
            <a href="/sitemap" className="hover:text-primary transition-colors whitespace-nowrap">
              Sitemap
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-2 lg:flex lg:justify-center items-center gap-4 lg:gap-8 text-xs text-gray-500">
            {[
              "SSL Secured",
              "Verified Partners", 
              "24/7 Support",
              "Best Price Guarantee"
            ].map((badge, idx) => (
              <div key={idx} className="flex items-center space-x-2 justify-center lg:justify-start">
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-xs">✓</span>
                </div>
                <span className="whitespace-nowrap">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
