"use client"

import { useState, useEffect } from "react"
import { X, Upload, Plus, Save, AlertCircle } from "lucide-react"

interface Car {
  _id: string
  vehicleCategory: 'car' | 'van' | 'lorry' | 'bus'
  vehicleSubCategory?: 'flex' | 'mini' | 'regular'
  brand: string
  carModel: string
  year: number
  color: string
  fuelType?: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'
  transmission?: 'Manual' | 'Automatic'
  seatingCapacity?: number
  engineSize?: string
  fuelConsumption?: string
  dimensions?: {
    length: number
    width: number
    height: number
  }
  pricePerDay: number
  pricePerWeek?: number
  pricePerMonth?: number
  airConditioning: boolean
  bluetooth: boolean
  gps: boolean
  sunroof: boolean
  description?: string
  licensePlate: string
  images: string[]
}

interface AddCarModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editCar?: Car | null
  mode?: 'add' | 'edit'
}

interface CarFormData {
  vehicleCategory: 'car' | 'van' | 'lorry' | 'bus' | ''
  vehicleSubCategory: 'flex' | 'mini' | 'regular' | ''
  brand: string
  carModel: string
  year: string
  color: string
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | ''
  transmission: 'Manual' | 'Automatic' | ''
  seatingCapacity: string
  engineSize: string
  fuelConsumption: string
  dimensions: {
    length: string
    width: string
    height: string
  }
  pricePerDay: string
  pricePerWeek: string
  pricePerMonth: string
  airConditioning: boolean
  bluetooth: boolean
  gps: boolean
  sunroof: boolean
  description: string
  licensePlate: string
}

export default function AddCarModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editCar = null, 
  mode = 'add' 
}: AddCarModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  const getInitialFormData = (): CarFormData => {
    if (mode === 'edit' && editCar) {
      return {
        vehicleCategory: editCar.vehicleCategory,
        vehicleSubCategory: editCar.vehicleSubCategory || '',
        brand: editCar.brand,
        carModel: editCar.carModel,
        year: editCar.year.toString(),
        color: editCar.color,
        fuelType: editCar.fuelType || '',
        transmission: editCar.transmission || '',
        seatingCapacity: editCar.seatingCapacity?.toString() || '',
        engineSize: editCar.engineSize || '',
        fuelConsumption: editCar.fuelConsumption || '',
        dimensions: {
          length: editCar.dimensions?.length?.toString() || '',
          width: editCar.dimensions?.width?.toString() || '',
          height: editCar.dimensions?.height?.toString() || ''
        },
        pricePerDay: editCar.pricePerDay.toString(),
        pricePerWeek: editCar.pricePerWeek?.toString() || '',
        pricePerMonth: editCar.pricePerMonth?.toString() || '',
        airConditioning: editCar.airConditioning,
        bluetooth: editCar.bluetooth,
        gps: editCar.gps,
        sunroof: editCar.sunroof,
        description: editCar.description || '',
        licensePlate: editCar.licensePlate
      }
    }
    
    return {
      vehicleCategory: '',
      vehicleSubCategory: '',
      brand: '',
      carModel: '',
      year: '',
      color: '',
      fuelType: '',
      transmission: '',
      seatingCapacity: '',
      engineSize: '',
      fuelConsumption: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      },
      pricePerDay: '',
      pricePerWeek: '',
      pricePerMonth: '',
      airConditioning: true,
      bluetooth: false,
      gps: false,
      sunroof: false,
      description: '',
      licensePlate: ''
    }
  }

  const [formData, setFormData] = useState<CarFormData>(getInitialFormData())

  useEffect(() => {
    if (isOpen) {
      const initialData = getInitialFormData()
      setFormData(initialData)
      setError('')
      setImages([])
      setImagePreviews([])
      
      if (mode === 'edit' && editCar?.images) {
        setExistingImages(editCar.images)
      } else {
        setExistingImages([])
      }
    }
  }, [isOpen, editCar, mode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name.startsWith('dimensions.')) {
      const dimensionKey = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionKey]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      
      // Reset sub-category when vehicle category changes
      if (name === 'vehicleCategory') {
        setFormData(prev => ({ ...prev, vehicleSubCategory: '' }))
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    const totalImages = existingImages.length + images.length + files.length
    if (totalImages > 5) {
      setError('Maximum 5 images allowed')
      return
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return false
      }
      return true
    })

    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    
    setImages(prev => [...prev, ...validFiles])
    setImagePreviews(prev => [...prev, ...newPreviews])
    setError('')
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const getAvailableSubCategories = () => {
    if (formData.vehicleCategory === 'car') {
      return [
        { value: 'flex', label: 'Flex Car' },
        { value: 'mini', label: 'Mini Car' },
        { value: 'regular', label: 'Regular Car' }
      ]
    } else if (formData.vehicleCategory === 'van') {
      return [
        { value: 'mini', label: 'Mini Van' },
        { value: 'regular', label: 'Regular Van' }
      ]
    }
    return []
  }

  const requiresSubCategory = formData.vehicleCategory === 'car' || formData.vehicleCategory === 'van'
  const isLorry = formData.vehicleCategory === 'lorry'
  const availableSubCategories = getAvailableSubCategories()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const basicRequiredFields = ['vehicleCategory', 'brand', 'carModel', 'year', 'color', 'pricePerDay', 'licensePlate']
      const missingBasicFields = basicRequiredFields.filter(field => !formData[field as keyof CarFormData])
      
      if (missingBasicFields.length > 0) {
        setError(`Please fill in: ${missingBasicFields.join(', ')}`)
        return
      }

      // Validate sub-category for car and van
      if (requiresSubCategory && !formData.vehicleSubCategory) {
        const categoryName = formData.vehicleCategory === 'car' ? 'car' : 'van'
        const options = formData.vehicleCategory === 'car' ? 'flex, mini, or regular' : 'mini or regular'
        setError(`Please select ${categoryName} sub-category (${options})`)
        return
      }

      // Validate lorry dimensions
      if (formData.vehicleCategory === 'lorry') {
        if (!formData.dimensions.length || !formData.dimensions.width || !formData.dimensions.height) {
          setError('Please fill in all dimensions for lorry (length, width, height)')
          return
        }
      } else {
        // Validate other vehicle fields
        if (!formData.fuelType || !formData.transmission || !formData.seatingCapacity || !formData.engineSize || !formData.fuelConsumption) {
          setError('Please fill in fuel type, transmission, seating capacity, engine size, and fuel consumption')
          return
        }
      }

      if (mode === 'add' && images.length === 0) {
        setError('At least one image is required')
        return
      }

      if (mode === 'edit' && existingImages.length === 0 && images.length === 0) {
        setError('At least one image is required')
        return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication required')
        return
      }

      let response: Response

      // Prepare submit data
      const submitData = new FormData()
      
      // Add basic fields
      submitData.append('vehicleCategory', formData.vehicleCategory)
      if (requiresSubCategory && formData.vehicleSubCategory) {
        submitData.append('vehicleSubCategory', formData.vehicleSubCategory)
      }
      submitData.append('brand', formData.brand)
      submitData.append('carModel', formData.carModel)
      submitData.append('year', formData.year)
      submitData.append('color', formData.color)
      submitData.append('pricePerDay', formData.pricePerDay)
      if (formData.pricePerWeek) submitData.append('pricePerWeek', formData.pricePerWeek)
      if (formData.pricePerMonth) submitData.append('pricePerMonth', formData.pricePerMonth)
      submitData.append('licensePlate', formData.licensePlate)
      submitData.append('description', formData.description)
      submitData.append('airConditioning', formData.airConditioning.toString())
      submitData.append('bluetooth', formData.bluetooth.toString())
      submitData.append('gps', formData.gps.toString())
      submitData.append('sunroof', formData.sunroof.toString())

      // Add category-specific fields
      if (formData.vehicleCategory === 'lorry') {
        submitData.append('dimensions[length]', formData.dimensions.length)
        submitData.append('dimensions[width]', formData.dimensions.width)
        submitData.append('dimensions[height]', formData.dimensions.height)
      } else {
        submitData.append('fuelType', formData.fuelType)
        submitData.append('transmission', formData.transmission)
        submitData.append('seatingCapacity', formData.seatingCapacity)
        submitData.append('engineSize', formData.engineSize)
        submitData.append('fuelConsumption', formData.fuelConsumption)
      }

      // Add images
      images.forEach(image => {
        submitData.append('images', image)
      })

      if (mode === 'edit' && editCar) {
        response = await fetch(`http://localhost:5000/api/cars/${editCar._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        })
      } else {
        response = await fetch('http://localhost:5000/api/cars', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        })
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${mode} vehicle`)
      }

      onSuccess()

    } catch (err: any) {
      setError(err.message || `Failed to ${mode} vehicle`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const isEditMode = mode === 'edit'
  const title = isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'
  const submitText = isEditMode ? 'Save Changes' : 'Add Vehicle'
  const SubmitIcon = isEditMode ? Save : Plus

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 backdrop-blur-[1px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {isEditMode && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                Edit Mode
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Error Message */}
          {error && (
            <div className="m-6 mb-0 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Vehicle Type Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Category *</label>
                  <select
                    name="vehicleCategory"
                    value={formData.vehicleCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select vehicle category</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="lorry">Lorry</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>

                {/* Sub-category for cars and vans */}
                {requiresSubCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.vehicleCategory === 'car' ? 'Car' : 'Van'} Sub-category *
                    </label>
                    <select
                      name="vehicleSubCategory"
                      value={formData.vehicleSubCategory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select {formData.vehicleCategory} type</option>
                      {availableSubCategories.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Toyota"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                  <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Camry"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Plate *</label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Lorry Dimensions */}
            {isLorry && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions (in feet)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Length (ft) *</label>
                    <input
                      type="number"
                      name="dimensions.length"
                      value={formData.dimensions.length}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Width (ft) *</label>
                    <input
                      type="number"
                      name="dimensions.width"
                      value={formData.dimensions.width}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 8"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (ft) *</label>
                    <input
                      type="number"
                      name="dimensions.height"
                      value={formData.dimensions.height}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 10"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Specifications for non-lorry vehicles */}
            {!isLorry && formData.vehicleCategory && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select fuel type</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select transmission</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity *</label>
                    <input
                      type="number"
                      name="seatingCapacity"
                      value={formData.seatingCapacity}
                      onChange={handleInputChange}
                      min="2"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Engine Size *</label>
                    <input
                      type="text"
                      name="engineSize"
                      value={formData.engineSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 2.0L"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Consumption (km/l) *</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="fuelConsumption"
                        value={formData.fuelConsumption}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                        placeholder="15"
                        required
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">km/l</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day ($) *</label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Week ($)</label>
                  <input
                    type="number"
                    name="pricePerWeek"
                    value={formData.pricePerWeek}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Month ($)</label>
                  <input
                    type="number"
                    name="pricePerMonth"
                    value={formData.pricePerMonth}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'airConditioning', label: 'Air Conditioning' },
                  { name: 'bluetooth', label: 'Bluetooth' },
                  { name: 'gps', label: 'GPS Navigation' },
                  { name: 'sunroof', label: 'Sunroof' }
                ].map(feature => (
                  <label key={feature.name} className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name={feature.name}
                      checked={formData[feature.name as keyof CarFormData] as boolean}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{feature.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vehicle Images {!isEditMode && '*'}
              </h3>
              
              {/* Show existing images in edit mode */}
              {isEditMode && existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={`http://localhost:5000${imageUrl}`}
                          alt={`Current ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload new images */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">
                    {isEditMode ? 'Upload additional images' : 'Click to upload vehicle images'}
                  </p>
                  <p className="text-sm text-gray-500">Maximum 5 images total, 5MB each</p>
                </label>
              </div>

              {/* Show new image previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">New Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Additional details about the vehicle..."
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-accent text-black px-8 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span>{isEditMode ? 'Saving...' : 'Adding...'}</span>
              </>
            ) : (
              <>
                <SubmitIcon className="w-4 h-4" />
                <span>{submitText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}