import mongoose, { Document, Types } from 'mongoose';

export interface ICar extends Document {
  _id: Types.ObjectId;
  shopId: Types.ObjectId; // Reference to the rent-shop owner
  
  // Basic Car Info
  brand: string; // Toyota, Honda, BMW, etc.
  carModel: string; // Changed from 'model' to 'carModel'
  year: number; // 2020, 2021, 2022, etc.
  color: string; // Red, Blue, Black, etc.
  
  // Car Specifications
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  seatingCapacity: number; // 2, 4, 5, 7, etc.
  engineSize: string; // "1.5L", "2.0L", "3.0L"
  mileage: string; // "15 km/l", "20 km/l"
  
  // Rental Info
  pricePerDay: number; // Daily rental price
  pricePerWeek?: number; // Weekly rental price (optional)
  pricePerMonth?: number; // Monthly rental price (optional)
  
  // Car Condition & Features
  airConditioning: boolean;
  bluetooth: boolean;
  gps: boolean;
  sunroof: boolean;
  
  // Images
  images: string[]; // Array of image URLs
  
  // Availability
  isAvailable: boolean;
  
  // Additional Info
  description?: string; // Optional description
  licensePlate: string; // Car registration number
  
  createdAt?: Date;
  updatedAt?: Date;
}

const carSchema = new mongoose.Schema<ICar>({
  shopId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Basic Info
  brand: { type: String, required: true },
  carModel: { type: String, required: true }, // Changed from 'model' to 'carModel'
  year: { type: Number, required: true, min: 1990, max: new Date().getFullYear() + 1 },
  color: { type: String, required: true },
  
  // Specifications
  fuelType: { 
    type: String, 
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], 
    required: true 
  },
  transmission: { 
    type: String, 
    enum: ['Manual', 'Automatic'], 
    required: true 
  },
  seatingCapacity: { type: Number, required: true, min: 2, max: 15 },
  engineSize: { type: String, required: true },
  mileage: { type: String, required: true },
  
  // Pricing
  pricePerDay: { type: Number, required: true, min: 0 },
  pricePerWeek: { type: Number, min: 0 },
  pricePerMonth: { type: Number, min: 0 },
  
  // Features
  airConditioning: { type: Boolean, default: true },
  bluetooth: { type: Boolean, default: false },
  gps: { type: Boolean, default: false },
  sunroof: { type: Boolean, default: false },
  
  // Images and Availability
  images: [{ type: String }], // Will store image file paths
  isAvailable: { type: Boolean, default: true },
  
  // Additional
  description: { type: String, maxlength: 500 },
  licensePlate: { type: String, required: true, unique: true },
  
}, { timestamps: true });

// Index for better search performance
carSchema.index({ shopId: 1, isAvailable: 1 });
carSchema.index({ brand: 1, carModel: 1 }); // Updated index
carSchema.index({ pricePerDay: 1 });

export const Car = mongoose.model<ICar>('Car', carSchema);
