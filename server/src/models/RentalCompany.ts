import mongoose, { Document, Types } from 'mongoose';

export interface IRentalCompany extends Document {
  _id: Types.ObjectId;
  name: string;
  ownerId: Types.ObjectId;
  // category: 'Economy' | 'Luxury' | 'Business' | 'Family/Van' | 'Electric/Hybrid' | 'Sports/Luxury';
  description?: string;
  image?: string;
  logo?: string;
  rating: number;
  reviews: number;
  fleetSize?: string;
  // established?: string;
  locations: string[];
  features: string[];
  phone?: string;
  email?: string;
  website?: string;
  verified: boolean;
  featured: boolean;
  status: 'active' | 'inactive' | 'pending';
}

const rentalCompanySchema = new mongoose.Schema<IRentalCompany>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['Economy', 'Luxury', 'Business', 'Family/Van', 'Electric/Hybrid', 'Sports/Luxury'],
    default: 'Economy'
  },
  description: {
    type: String,
    maxlength: 500
  },
  image: String,
  logo: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  fleetSize: String,
  established: String,
  locations: [String],
  features: [String],
  phone: String,
  email: String,
  website: String,
  verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  }
}, { 
  timestamps: true 
});

export const RentalCompany = mongoose.model<IRentalCompany>('RentalCompany', rentalCompanySchema);
