import mongoose, { Document, Types } from 'mongoose';

// Reference to the rental company, not the user
export interface ICar extends Document {
  _id: Types.ObjectId;
  companyId: Types.ObjectId; // Reference to RentalCompany
  // Basic Car Info
  brand: string;
  carModel: string;
  year: number;
  color: string;
  // Car Specifications
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  seatingCapacity: number;
  engineSize: string;
  mileage: string;
  // Rental Info
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  // Features
  airConditioning: boolean;
  bluetooth: boolean;
  gps: boolean;
  sunroof: boolean;
  // Images
  images: string[];
  // Availability
  isAvailable: boolean;
  // Additional Info
  description?: string;
  licensePlate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const carSchema = new mongoose.Schema<ICar>({
  // Associate car with RentalCompany, not User
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RentalCompany', 
    required: true 
  },

  // Basic Info
  brand: { type: String, required: true },
  carModel: { type: String, required: true },
  year: { 
    type: Number, 
    required: true, 
    min: 1990, 
    max: new Date().getFullYear() + 1 
  },
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
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true },

  // Additional
  description: { type: String, maxlength: 500 },
  licensePlate: { type: String, required: true, unique: true },
}, { timestamps: true });

// Helpful indexes for queries/filtering
carSchema.index({ companyId: 1, isAvailable: 1 });
carSchema.index({ brand: 1, carModel: 1 });
carSchema.index({ pricePerDay: 1 });

export const Car = mongoose.model<ICar>('Car', carSchema);
