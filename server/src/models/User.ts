import mongoose, { Document, Types } from 'mongoose'; 
import bcrypt from 'bcrypt';

export type Role = 'customer' | 'rental-company' | 'admin';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  phone: string;
  role: Role;
  
  // Customer specific fields
  firstName?: string;
  lastName?: string;
  drivingLicenseNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  
  // Remove rental-company specific fields - they're now in RentalCompany model
  // CompanyName?: string;     // REMOVED
  // CompanyAddress?: string;  // REMOVED
  
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['customer', 'rental-company', 'admin'], required: true },
  
  // Customer fields only
  firstName: { type: String },
  lastName: { type: String },
  drivingLicenseNumber: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  
  // Removed rental-company fields - they're now in RentalCompany model
}, { timestamps: true });

// Updated validation - removed rental-company validation
userSchema.pre('save', async function (next) {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  // Only validate customer fields now
  if (this.role === 'customer') {
    if (!this.firstName || !this.lastName) {
      return next(new Error('First name and last name are required for customers'));
    }
  }
  
  // No validation for rental-company here - company profile handled separately
  
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
