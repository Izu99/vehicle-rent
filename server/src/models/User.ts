import mongoose, { Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export type Role = 'customer' | 'rent-shop' | 'admin';

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
  
  // Rent-shop specific fields
  shopName?: string;
  shopAddress?: string;
  
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['customer', 'rent-shop', 'admin'], required: true },
  
  // Customer fields
  firstName: { type: String },
  lastName: { type: String },
  drivingLicenseNumber: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  
  // Rent-shop fields
  shopName: { type: String },
  shopAddress: { type: String },
}, { timestamps: true });

// Simple validation based on role
userSchema.pre('save', async function (next) {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  // Simple role-based validation
  if (this.role === 'customer') {
    if (!this.firstName || !this.lastName) {
      return next(new Error('First name and last name are required for customers'));
    }
  }
  
  if (this.role === 'rent-shop') {
    if (!this.shopName || !this.shopAddress) {
      return next(new Error('Shop name and address are required for rent shops'));
    }
  }
  
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
