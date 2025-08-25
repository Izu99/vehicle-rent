import mongoose, { Document, Types } from 'mongoose';

export interface ICar extends Document {
  _id: Types.ObjectId;
  companyId: Types.ObjectId;
  
  // Vehicle Category and Sub-category
  vehicleCategory: 'car' | 'van' | 'lorry' | 'bus';
  vehicleSubCategory?: 'flex' | 'mini' | 'regular'; // Required for car (3 options) and van (2 options)
  
  // Basic Info
  brand: string;
  carModel: string;
  year: number;
  color: string;
  
  // Vehicle fields (required for all except lorry)
  fuelType?: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission?: 'Manual' | 'Automatic';
  seatingCapacity?: number;
  engineSize?: string;
  fuelConsumption?: string;
  
  // Lorry-only dimensions
  dimensions?: {
    length: number;  // in feet
    width: number;   // in feet  
    height: number;  // in feet
  };
  
  // Updated Pricing Structure - Starting prices with driver options
  pricing: {
    daily: {
      withoutDriver: number;    // Starting price per day without driver
      withDriver?: number;      // Starting price per day with driver (optional)
    };
    weekly?: {
      withoutDriver: number;    // Starting price per week without driver
      withDriver?: number;      // Starting price per week with driver (optional)
    };
    monthly?: {
      withoutDriver: number;    // Starting price per month without driver
      withDriver?: number;      // Starting price per month with driver (optional)
    };
  };
  
  // Driver availability
  driverAvailable: boolean;     // Whether company provides driver service
  
  // Features
  airConditioning?: boolean;
  bluetooth?: boolean;
  gps?: boolean;
  sunroof?: boolean;
  
  // Common fields
  images: string[];
  isAvailable: boolean;
  description?: string;
  licensePlate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const carSchema = new mongoose.Schema<ICar>({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RentalCompany', 
    required: true 
  },

  // Vehicle Category
  vehicleCategory: {
    type: String,
    enum: ['car', 'van', 'lorry', 'bus'],
    required: true
  },

  // Sub-category (required for 'car' and 'van' categories)
  vehicleSubCategory: {
    type: String,
    enum: ['flex', 'mini', 'regular'],
    required: function() {
      return this.vehicleCategory === 'car' || this.vehicleCategory === 'van';
    },
    validate: {
      validator: function(value: string) {
        if (this.vehicleCategory === 'car') {
          // Car can have: flex, mini, regular
          return ['flex', 'mini', 'regular'].includes(value);
        } else if (this.vehicleCategory === 'van') {
          // Van can have: mini, regular
          return ['mini', 'regular'].includes(value);
        }
        return true; // For lorry and bus, no sub-category needed
      },
      message: function(props: any) {
        const category = (props.instance as any).vehicleCategory;
        if (category === 'car') {
          return 'Car category requires sub-category: flex, mini, or regular';
        } else if (category === 'van') {
          return 'Van category requires sub-category: mini or regular';
        }
        return 'Invalid sub-category';
      }
    }
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

  // Vehicle-specific (required for all except lorry)
  fuelType: { 
    type: String, 
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    required: function() { 
      return this.vehicleCategory !== 'lorry'; 
    }
  },
  transmission: { 
    type: String, 
    enum: ['Manual', 'Automatic'],
    required: function() { 
      return this.vehicleCategory !== 'lorry'; 
    }
  },
  seatingCapacity: { 
    type: Number, 
    min: 2, 
    max: 50,
    required: function() { 
      return this.vehicleCategory !== 'lorry'; 
    }
  },
  engineSize: { 
    type: String,
    required: function() { 
      return this.vehicleCategory !== 'lorry'; 
    }
  },
  fuelConsumption: { 
    type: String,
    required: function() { 
      return this.vehicleCategory !== 'lorry'; 
    }
  },

  // Lorry-only dimensions
  dimensions: {
    length: { 
      type: Number,
      required: function() { 
        return this.vehicleCategory === 'lorry'; 
      }
    },
    width: { 
      type: Number,
      required: function() { 
        return this.vehicleCategory === 'lorry'; 
      }
    },
    height: { 
      type: Number,
      required: function() { 
        return this.vehicleCategory === 'lorry'; 
      }
    }
  },

  // Updated Pricing Structure
  pricing: {
    daily: {
      withoutDriver: { 
        type: Number, 
        required: true, 
        min: 0 
      },
      withDriver: { 
        type: Number, 
        min: 0,
        validate: {
          validator: function(this: ICar, value: number) {
            // If withDriver price is provided, driver must be available
            if (value !== undefined && value !== null && !this.driverAvailable) {
              return false;
            }
            return true;
          },
          message: 'Cannot set driver price when driver service is not available'
        }
      }
    },
    weekly: {
      withoutDriver: { 
        type: Number, 
        min: 0 
      },
      withDriver: { 
        type: Number, 
        min: 0,
        validate: {
          validator: function(this: ICar, value: number) {
            if (value !== undefined && value !== null && !this.driverAvailable) {
              return false;
            }
            return true;
          },
          message: 'Cannot set driver price when driver service is not available'
        }
      }
    },
    monthly: {
      withoutDriver: { 
        type: Number, 
        min: 0 
      },
      withDriver: { 
        type: Number, 
        min: 0,
        validate: {
          validator: function(this: ICar, value: number) {
            if (value !== undefined && value !== null && !this.driverAvailable) {
              return false;
            }
            return true;
          },
          message: 'Cannot set driver price when driver service is not available'
        }
      }
    }
  },

  // Driver availability
  driverAvailable: { 
    type: Boolean, 
    default: false 
  },

  // Features
  airConditioning: { type: Boolean, default: false },
  bluetooth: { type: Boolean, default: false },
  gps: { type: Boolean, default: false },
  sunroof: { type: Boolean, default: false },

  // Common
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  description: { type: String, maxlength: 500 },
  licensePlate: { type: String, required: true },
}, { 
  timestamps: true,
  // Add a virtual for backward compatibility
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields for backward compatibility
carSchema.virtual('pricePerDay').get(function() {
  return this.pricing?.daily?.withoutDriver || 0;
});

carSchema.virtual('pricePerWeek').get(function() {
  return this.pricing?.weekly?.withoutDriver;
});

carSchema.virtual('pricePerMonth').get(function() {
  return this.pricing?.monthly?.withoutDriver;
});

// Indexes
carSchema.index({ companyId: 1, isAvailable: 1 });
carSchema.index({ vehicleCategory: 1, vehicleSubCategory: 1 });
carSchema.index({ brand: 1, carModel: 1 });
carSchema.index({ 'pricing.daily.withoutDriver': 1 });
carSchema.index({ driverAvailable: 1 });

export const Car = mongoose.model<ICar>('Car', carSchema);