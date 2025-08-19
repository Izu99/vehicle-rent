"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  Settings,
  Users,
  Fuel,
  Car,
  CheckCircle,
  MapPin,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  Phone,
  Mail,
  Zap,
  Shield,
} from "lucide-react";

interface CompanyInfo {
  locations: any;
  _id: string;
  name: string; // <- Correct field, not CompanyName
  address: string; // <- Correct field, not CompanyAddress
  phone: string;
  email: string;
}

interface CarData {
  _id: string;
  companyId: CompanyInfo;
  brand: string;
  carModel: string;
  year: number;
  color: string;
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  transmission: "Manual" | "Automatic";
  seatingCapacity: number;
  engineSize: string;
  mileage: string;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  airConditioning: boolean;
  bluetooth: boolean;
  gps: boolean;
  sunroof: boolean;
  images: string[];
  isAvailable: boolean;
  description?: string;
  licensePlate: string;
  createdAt: string;
  updatedAt: string;
}

interface CarDetailsModalProps {
  isOpen: boolean;
  car: CarData | null;
  onClose: () => void;
}

export default function CarDetailsModal({
  isOpen,
  car,
  onClose,
}: CarDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  if (!isOpen || !car) return null;

  const nextImage = () => {
    if (car.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car.images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + car.images.length) % car.images.length
      );
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 z-30 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Simple Header - Just car name and availability */}
          <div className="bg-gradient-to-br from-primary/90 via-primary to-accent text-black p-6 pb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black mb-2 text-gray-900">
                  {car.brand} {car.carModel}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-700">
                      4.5 (120 reviews)
                    </span>
                  </div>
                  <Badge
                    className={`${
                      car.isAvailable ? "bg-green-500" : "bg-red-500"
                    } text-white border-0`}
                  >
                    {car.isAvailable ? "Available Now" : "Currently Booked"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Left Column - Images & Description (2/3 width) */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <div className="relative h-80 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-gray-100 to-gray-200">
                {car.images.length > 0 ? (
                  <>
                    <Image
                      src={`http://localhost:5000${car.images[currentImageIndex]}`}
                      alt={`${car.brand} ${car.carModel}`}
                      fill
                      className="object-cover"
                    />

                    {/* Navigation Arrows */}
                    {car.images.length > 1 && (
                      <>
                        <button
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/90 hover:bg-primary text-black rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/90 hover:bg-primary text-black rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {currentImageIndex + 1} / {car.images.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Car className="w-20 h-20 mx-auto mb-3 stroke-1" />
                      <p className="font-semibold">
                        {car.brand} {car.carModel}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Thumbnails Grid */}
              {car.images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-6">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative h-16 rounded-lg overflow-hidden transition-all ${
                        index === currentImageIndex
                          ? "ring-3 ring-primary scale-105"
                          : "hover:scale-105 opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => goToImage(index)}
                    >
                      <Image
                        src={`http://localhost:5000${image}`}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              {car.description && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {car.description}
                  </p>
                </div>
              )}

              {/* Complete Pricing Section */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Rental Pricing
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                    <div>
                      <div className="font-semibold text-gray-900">
                        Daily Rate
                      </div>
                      <div className="text-xs text-gray-600">
                        Perfect for short trips
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${car.pricePerDay}
                      </div>
                      <div className="text-xs text-gray-500">per day</div>
                    </div>
                  </div>

                  {car.pricePerWeek && (
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">
                          Weekly Rate
                        </div>
                        <div className="text-xs text-gray-600">
                          Save on longer rentals
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          ${car.pricePerWeek}
                        </div>
                        <div className="text-xs text-gray-500">per week</div>
                      </div>
                    </div>
                  )}

                  {car.pricePerMonth && (
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">
                          Monthly Rate
                        </div>
                        <div className="text-xs text-gray-600">
                          Best value option
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          ${car.pricePerMonth}
                        </div>
                        <div className="text-xs text-gray-500">per month</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - All Details (1/3 width) */}
            <div className="space-y-4">
              {/* Vehicle Overview - Complete specs in one place */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Car className="w-5 h-5 mr-2 text-primary" />
                  Vehicle Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Year</span>
                    <span className="font-semibold text-gray-900">
                      {car.year}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Color</span>
                    <span className="font-semibold text-gray-900">
                      {car.color}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Fuel Type</span>
                    <span className="font-semibold text-gray-900">
                      {car.fuelType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Transmission</span>
                    <span className="font-semibold text-gray-900">
                      {car.transmission}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Seating</span>
                    <span className="font-semibold text-gray-900">
                      {car.seatingCapacity} Seats
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Engine</span>
                    <span className="font-semibold text-gray-900">
                      {car.engineSize}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Mileage</span>
                    <span className="font-semibold text-gray-900">
                      {car.mileage}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">License</span>
                    <span className="font-semibold text-gray-900">
                      {car.licensePlate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`flex items-center text-xs py-2 px-3 rounded-lg ${
                      car.airConditioning
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    AC
                  </div>
                  <div
                    className={`flex items-center text-xs py-2 px-3 rounded-lg ${
                      car.bluetooth
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Bluetooth
                  </div>
                  <div
                    className={`flex items-center text-xs py-2 px-3 rounded-lg ${
                      car.gps
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    GPS
                  </div>
                  <div
                    className={`flex items-center text-xs py-2 px-3 rounded-lg ${
                      car.sunroof
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Sunroof
                  </div>
                </div>
              </div>

              {/* Rental Partner */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Rental Partner</h3>
                <div className="space-y-4">
                  {/* Company Name */}
                  <div className="font-semibold text-gray-900">
                    {car.companyId?.name ?? "Unknown"}
                  </div>

                  {/* Address/Location */}
                  <p className="text-sm text-gray-600 leading-relaxed break-words">
                    {car.companyId?.locations?.[0] ?? "Unknown"}
                  </p>

                  {/* Phone - SAFE */}
                  <span className="text-sm text-gray-600">
                    {car.companyId?.phone ?? "Not available"}
                  </span>

                  {/* Email - SAFE */}
                  <p className="text-sm text-gray-600 break-all">
                    {car.companyId?.email ?? "Not available"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space- sticky bottom-0 bg-gradient-to-br from-gray-50 to-gray-100 pt-4">
                <Button
                  className={`w-full py-3 font-bold rounded-xl transition-all duration-300 ${
                    car.isAvailable
                      ? "gradient-primary gradient-primary-hover text-black shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!car.isAvailable}
                >
                  {car.isAvailable ? (
                    <>
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Now - ${car.pricePerDay}/day
                    </>
                  ) : (
                    "Currently Not Available"
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-3 font-bold rounded-xl border-2 border-primary/30 text-primary hover:bg-primary hover:text-black transition-all duration-300"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Add to Favorites
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
