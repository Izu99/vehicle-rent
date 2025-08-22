"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
X,
Calendar,
Users,
Car,
CheckCircle,
Heart,
ChevronLeft,
ChevronRight,
Star,
Shield,
MapPin,
Clock,
Minus,
Plus,
} from "lucide-react";

interface CarData {
_id: string;
companyId: {
_id: string;
name: string;
locations: string[];
phone: string;
email: string;
};
vehicleCategory: string;
vehicleSubCategory: string;
brand: string;
carModel: string;
year: number;
color: string;
fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
transmission: "Manual" | "Automatic";
seatingCapacity: number;
engineSize: string;
fuelConsumption: string;
pricing: {
daily: {
withoutDriver: number;
withDriver?: number;
};
weekly?: {
withoutDriver: number;
withDriver?: number;
};
monthly?: {
withoutDriver: number;
withDriver?: number;
};
};
driverAvailable: boolean;
airConditioning: boolean;
bluetooth: boolean;
gps: boolean;
sunroof: boolean;
images: string[];
isAvailable: boolean;
licensePlate: string;
createdAt: string;
updatedAt: string;
pricePerDay: number;
pricePerWeek?: number;
pricePerMonth?: number;
}

interface CarDetailsModalProps {
isOpen: boolean;
car: CarData | null;
onClose: () => void;
userRole?: "customer" | "rental-shop";
}

export default function CarDetailsModal({
isOpen,
car,
onClose,
userRole = "customer",
}: CarDetailsModalProps) {
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [selectedDriverOption, setSelectedDriverOption] =
useState<"withoutDriver" | "withDriver">("withoutDriver");

// Booking details (UI only)
const [startDate, setStartDate] = useState("");
const [startTime, setStartTime] = useState("09:00");
const [pickupLocation, setPickupLocation] = useState("");
const [days, setDays] = useState(1);

useEffect(() => {
if (isOpen) {
setCurrentImageIndex(0);
setSelectedDriverOption("withoutDriver");
setStartDate("");
setStartTime("09:00");
setPickupLocation("");
setDays(1);
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

// Current prices remain "starting" and do NOT depend on days/date/time
const getCurrentPrice = () => {
return (
car.pricing.daily[selectedDriverOption] ||
car.pricing.daily.withoutDriver
);
};

const getWeeklyPrice = () => {
if (!car.pricing.weekly) return null;
return (
car.pricing.weekly[selectedDriverOption] ||
car.pricing.weekly.withoutDriver
);
};

const getMonthlyPrice = () => {
if (!car.pricing.monthly) return null;
return (
car.pricing.monthly[selectedDriverOption] ||
car.pricing.monthly.withoutDriver
);
};

const todayISO = new Date().toISOString().split("T");

return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
onClick={onClose}
>
<motion.div
initial={{ scale: 0.95, opacity: 0, y: 20 }}
animate={{ scale: 1, opacity: 1, y: 0 }}
exit={{ scale: 0.95, opacity: 0, y: 20 }}
className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
onClick={(e) => e.stopPropagation()}
>
{/* Close Button */}
<button className="absolute top-6 right-6 z-30 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105" onClick={onClose} >
<X className="w-5 h-5 text-gray-700" />
</button>

text
    <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {/* Header */}
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
              {car.driverAvailable && (
                <Badge className="bg-blue-500 text-white border-0">
                  Driver Available
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Left Column - Images (2/3 width) */}
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

          {/* Driver Selection Section - Only for customers */}
          {userRole === "customer" && car.driverAvailable && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Driver Service
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDriverOption === "withoutDriver"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedDriverOption("withoutDriver")}
                >
                  <div className="text-center">
                    <Car className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold">Self Drive</div>
                    <div className="text-xs text-gray-600">You drive</div>
                  </div>
                </button>
                <button
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDriverOption === "withDriver"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedDriverOption("withDriver")}
                >
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold">With Driver</div>
                    <div className="text-xs text-gray-600">
                      Driver included
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Booking Details (UI only, aligned and clean) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Booking Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                  min={todayISO}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="time"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Pickup Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Days (no price change, just input) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Days)
                </label>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDays((d) => Math.max(1, d - 1))}
                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {days}
                    </div>
                    <div className="text-xs text-gray-500">
                      {days === 1 ? "day" : "days"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDays((d) => d + 1)}
                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Starting Prices
              {userRole === "customer" && car.driverAvailable && (
                <span className="ml-2 text-sm text-gray-500">
                  ({selectedDriverOption === "withDriver"
                    ? "With Driver"
                    : "Self Drive"}
                  )
                </span>
              )}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                <div>
                  <div className="font-semibold text-gray-900">
                    Daily Rate
                  </div>
                  <div className="text-xs text-gray-600">
                    Starting price per day
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${getCurrentPrice()}
                  </div>
                  <div className="text-xs text-gray-500">per day</div>
                </div>
              </div>

              {getWeeklyPrice() && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-semibold text-gray-900">
                      Weekly Rate
                    </div>
                    <div className="text-xs text-gray-600">
                      Starting price per week
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      ${getWeeklyPrice()}
                    </div>
                    <div className="text-xs text-gray-500">per week</div>
                  </div>
                </div>
              )}

              {getMonthlyPrice() && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-semibold text-gray-900">
                      Monthly Rate
                    </div>
                    <div className="text-xs text-gray-600">
                      Starting price per month
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">
                      ${getMonthlyPrice()}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Vehicle Details (1/3 width) */}
        <div className="space-y-4">
          {/* Vehicle Overview */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2 text-primary" />
              Vehicle Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Company</span>
                <span className="font-semibold text-gray-900">
                  {car.companyId.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Category</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {car.vehicleCategory}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Type</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {car.vehicleSubCategory}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Year</span>
                <span className="font-semibold text-gray-900">
                  {car.year}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Color</span>
                <span className="font-semibold text-gray-900 capitalize">
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

              {userRole === "rental-shop" && (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      Fuel Consumption
                    </span>
                    <span className="font-semibold text-gray-900">
                      {car.fuelConsumption}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">
                      License Plate
                    </span>
                    <span className="font-semibold text-gray-900">
                      {car.licensePlate}
                    </span>
                  </div>
                </>
              )}
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

          {/* Action Buttons - Only show for customers */}
          {userRole === "customer" && (
            <div className="space-y-3 sticky bottom-0 bg-gradient-to-br from-gray-50 to-gray-100 pt-4">
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
                    Book Now - Starting ${getCurrentPrice()}/day
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
          )}
        </div>
      </div>
    </div>
  </motion.div>
</motion.div>
);
}