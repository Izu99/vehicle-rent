"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { motion } from "framer-motion"

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const [topServiceOpen, setTopServiceOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white shadow z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-3 font-bold text-xl">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
            <span>SKYLINE</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="font-semibold text-gray-700">Home</a>
            <a href="#" className="hover:text-gray-500">About Us</a>
            <a href="#" className="hover:text-gray-500">Contact Us</a>
            <Button
              className="bg-yellow-400 text-black hover:bg-yellow-300"
              onClick={() => setLoginOpen(true)}
            >
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative h-[500px] bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/background-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="mb-6">
            <div className="bg-[#207e8e] text-white text-2xl font-bold px-8 py-4 rounded-lg max-w-[700px]">
              Welcome to SKYLINE Car Rental
            </div>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-3/4">
            <select className="border border-gray-300 text-black rounded px-3 py-2 bg-white">
              <option>Province</option>
              <option>Sabaragamuwa</option>
              <option>Eastern</option>
              <option>North</option>
            </select>
            <select className="border border-gray-300 text-black rounded px-3 py-2 bg-white">
              <option>District</option>
              <option>Ratnapura</option>
              <option>Kegalle</option>
              <option>Nuwara</option>
            </select>
            <Button className="bg-yellow-400 text-black hover:bg-yellow-300 w-full">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-12 text-center max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold">Special Offers</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {[
            { img: "ed3.png", title: "Elite Cars", desc: "Mercedes-Benz E-Class" },
            { img: "ed4.png", title: "Revus Automotive", desc: "Toyota Land Cruiser" },
            { img: "ed1.png", title: "Limo Service", desc: "Chevrolet Camaro" },
            { img: "ed2.png", title: "Car Dealer", desc: "Audi Q3 Sportback SUV" },
          ].map((offer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <Image
                src={`/images/${offer.img}`}
                alt={offer.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h5 className="font-bold">{offer.title}</h5>
                <p className="text-sm text-gray-600">{offer.desc}</p>
                <Button className="bg-yellow-400 text-black mt-3 w-full font-semibold">
                  Discover Offers
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Services */}
      <section className="py-12 text-center bg-gray-50">
        <h3 className="text-2xl font-bold">Top Services Companies</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 max-w-7xl mx-auto">
          {[
            { img: "da1.jfif", rating: "4.5", name: "NAB Rent A Car", modal: () => setTopServiceOpen(true) },
            { img: "da2.jfif", rating: "4.2", name: "Global India Tours" },
            { img: "da3.jfif", rating: "4.6", name: "Nanuan Travels" },
            { img: "da4.jfif", rating: "4.8", name: "Premium Chauffeur" },
          ].map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white rounded-lg shadow overflow-hidden p-3"
            >
              <Image
                src={`/images/${service.img}`}
                alt={service.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded"
              />
              <p className="font-bold mt-2">Rating: {service.rating}</p>
              <p>{service.name}</p>
              <Button
                className="bg-yellow-400 text-black mt-3 font-semibold"
                onClick={service.modal}
              >
                Visit site
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <div className="bg-[#2a8fa0] text-white py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <Image src="/logo.png" alt="Skyline" width={200} height={200} />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">Best Deals Await You!</h2>
            <p>Book now and enjoy the ride</p>
          </div>
          <Button
            className="bg-yellow-400 text-black mt-4 md:mt-0"
            onClick={() => setBookOpen(true)}
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          {[
            { title: "Pages", items: ["Rental", "Locations", "FAQ", "Features", "Blog"] },
            { title: "Resources", items: ["Installation Manual", "Release Note", "Community Help"] },
            { title: "Company", items: ["About Us", "Career", "Press", "Support"] },
            { title: "Product", items: ["Demo", "Security", "FAQ", "Features"] },
          ].map((col, i) => (
            <div key={i}>
              <h5 className="font-bold mb-3">{col.title}</h5>
              <ul className="space-y-1 text-gray-300 text-sm">
                {col.items.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          ))}
          <div>
            <Image src="/logo.png" alt="Skyline Logo" width={150} height={100} />
            <p className="mt-3">Stay up to date on all the latest news.</p>
            <p className="mt-2 font-bold">Follow us:</p>
            <div className="flex space-x-3 mt-2">
              <Image src="/images/f1.png" alt="Facebook" width={30} height={30} />
              <Image src="/images/t2.png" alt="Twitter" width={30} height={30} />
              <Image src="/images/i1.png" alt="Instagram" width={30} height={30} />
            </div>
            <div className="flex mt-4 border border-gray-500 rounded overflow-hidden">
              <span className="bg-gray-800 flex items-center px-2">
                <Image src="/images/t1.png" alt="Telegram" width={30} height={30} />
              </span>
              <Input type="email" placeholder="Your email" className="bg-transparent border-none" />
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-700" />
        <p className="text-center text-sm">&copy; Premium Rental 2025 | Privacy Policy | Terms & Conditions</p>
      </footer>

      {/* Modals */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">WELCOME!</DialogTitle>
            <p className="text-center text-gray-500">LOG IN TO CONTINUE</p>
          </DialogHeader>
          <form className="space-y-3">
            <Input placeholder="Email" />
            <Input placeholder="Password" type="password" />
            <div className="flex justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" /> <span>Remember Me</span>
              </label>
              <a href="#" className="text-gray-500">Forgot Password?</a>
            </div>
            <Button className="w-full">Login</Button>
            <Button variant="outline" className="w-full flex items-center space-x-2">
              <Image src="/images/go.png" alt="Google" width={20} height={20} />
              <span>Continue with Google</span>
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent>
          <Image src="/images/book-now.png" alt="Book Now" width={400} height={300} className="rounded" />
        </DialogContent>
      </Dialog>

      <Dialog open={topServiceOpen} onOpenChange={setTopServiceOpen}>
        <DialogContent>
          <Image src="/images/top-service.png" alt="Top Service" width={400} height={300} className="rounded" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
