"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  X, 
  Upload, 
  Car, 
  DollarSign, 
  Settings, 
  Camera,
  Plus,
  Trash2
} from "lucide-react"

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCarModal({ isOpen, onClose, onSuccess }: AddCarModalProps) {
  const [formData, setFormData] = useState({
    brand: '',
    carModel: '',
    year: '',
    color: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: '',
    engineSize: '',
    mileage: '',
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    airConditioning: true,
    bluetooth: false,
    gps: false,
    sunroof: false,
    description: '',
    licensePlate: ''
  })
  
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages(prev => [...prev, ...newImages].slice(0, 10)) // Max 10 images
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString())
      })
      
      // Add images
      images.forEach(image => {
        submitData.append('images', image)
      })

      // Submit to your API
      const response = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Get from auth context
        },
        body: submitData
      })

      if (response.ok) {
        onSuccess()
        onClose()
        // Reset form
        setFormData({
          brand: '', carModel: '', year: '', color: '', fuelType: 'Petrol',
          transmission: 'Automatic', seatingCapacity: '', engineSize: '', mileage: '',
          pricePerDay: '', pricePerWeek: '', pricePerMonth: '', airConditioning: true,
          bluetooth: false, gps: false, sunroof: false, description: '', licensePlate: ''
        })
        setImages([])
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to add car')
      }
    } catch (error) {
      console.error('Error adding car:', error)
      alert('Failed to add car')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 text-black">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Add New Vehicle</h2>
              <p className="text-gray-700">Add a new car to your rental fleet</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-8">
            
            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 mr-2 text-primary" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    placeholder="Toyota, Honda, BMW..."
                  />
                </div>
                <div>
                  <Label htmlFor="carModel">Model *</Label>
                  <Input
                    id="carModel"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    required
                    placeholder="Camry, Civic, 3 Series..."
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    min="1990"
                    max="2025"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                    placeholder="White, Black, Red..."
                  />
                </div>
                <div>
                  <Label htmlFor="licensePlate">License Plate *</Label>
                  <Input
                    id="licensePlate"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    required
                    placeholder="ABC123"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-primary" />
                  Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="transmission">Transmission</Label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="seatingCapacity">Seating Capacity *</Label>
                  <Input
                    id="seatingCapacity"
                    name="seatingCapacity"
                    type="number"
                    min="2"
                    max="15"
                    value={formData.seatingCapacity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="engineSize">Engine Size *</Label>
                  <Input
                    id="engineSize"
                    name="engineSize"
                    value={formData.engineSize}
                    onChange={handleInputChange}
                    required
                    placeholder="2.0L, 1.5L..."
                  />
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage *</Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    required
                    placeholder="15 km/l, 20 mpg..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-primary" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="pricePerDay">Price per Day *</Label>
                  <Input
                    id="pricePerDay"
                    name="pricePerDay"
                    type="number"
                    min="0"
                    value={formData.pricePerDay}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerWeek">Price per Week</Label>
                  <Input
                    id="pricePerWeek"
                    name="pricePerWeek"
                    type="number"
                    min="0"
                    value={formData.pricePerWeek}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerMonth">Price per Month</Label>
                  <Input
                    id="pricePerMonth"
                    name="pricePerMonth"
                    type="number"
                    min="0"
                    value={formData.pricePerMonth}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'airConditioning', label: 'Air Conditioning' },
                    { name: 'bluetooth', label: 'Bluetooth' },
                    { name: 'gps', label: 'GPS Navigation' },
                    { name: 'sunroof', label: 'Sunroof' }
                  ].map((feature) => (
                    <label key={feature.name} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={feature.name}
                        checked={formData[feature.name as keyof typeof formData] as boolean}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-primary" />
                  Vehicle Images *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <label htmlFor="images" className="cursor-pointer">
                      <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB each (max 10 images)</p>
                  </div>
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your vehicle's unique features, condition, or any special notes..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-6 flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || images.length === 0}
              className="gradient-primary gradient-primary-hover text-black"
            >
              {loading ? 'Adding...' : 'Add Vehicle'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
