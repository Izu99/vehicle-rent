import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { RentalCompany } from '../models/RentalCompany';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set!');

// Registration controller

export const register = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;

    if (!role || !['customer', 'rental-company'].includes(role)) {
      return res.status(400).json({
        message: 'Valid role is required (customer or rental-company)',
      });
    }

    // Common required fields
    const { username, password, email, phone } = req.body;

    if (!username || !password || !email || !phone) {
      return res.status(400).json({
        message: 'Username, password, email, and phone are required',
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Username or email already exists',
      });
    }

    // User creation
    let userData: any = {
      username,
      password,
      email,
      phone,
      role,
    };

    // Role-specific fields
    if (role === 'customer') {
      const {
        firstName,
        lastName,
        drivingLicenseNumber,
        dateOfBirth,
        address,
      } = req.body;
      if (!firstName || !lastName) {
        return res.status(400).json({
          message: 'First name and last name are required for customers',
        });
      }
      userData = {
        ...userData,
        firstName,
        lastName,
        drivingLicenseNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address,
      };
    }

    // Create the user document
    const user = new User(userData);
    await user.save();

    // If user is a rental company, create a RentalCompany profile immediately
    if (role === 'rental-company') {
      // Collect company-specific fields (add more if desired)
      const {
        companyName, // Add to frontend registration form
        category,
        description,
        locations,
        features,
        phone: companyPhone, // use user phone as fallback
        email: companyEmail, // use user email as fallback
        website,
      } = req.body;

      const rentalCompanyData = {
        name: companyName || username, // Use companyName if available, otherwise username
        ownerId: user._id,
        category: category || 'Economy',
        description,
        locations: locations || [],
        features: features || [],
        phone: companyPhone || phone,
        email: companyEmail || email,
        website,
        verified: false,
        featured: false,
        status: 'pending',
      };

      const company = new RentalCompany(rentalCompanyData);
      await company.save();

      return res.status(201).json({
        message: 'Rental company registered successfully.',
        role: user.role,
        userId: user._id,
        companyId: company._id,
      });
    }

    // Return for customer registration
    return res.status(201).json({
      message: `${role} registered successfully`,
      role: user.role,
      userId: user._id,
    });
  } catch (error: any) {
    console.error('Register error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Username or email already exists',
      });
    }

    return res.status(500).json({
      message: error.message || 'Server error',
    });
  }
};

// Login controller (unchanged)
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn: '7d' });

    // ✅ FOR RENTAL-COMPANY USERS: Find their company ID
    let companyId = undefined;
    if (user.role === 'rental-company') {
      const company = await RentalCompany.findOne({ ownerId: user._id });
      if (company) {
        companyId = company._id.toString(); // ✅ Convert ObjectId to string
      }
    }

    res.json({
      token,
      role: user.role,
      username: user.username,
      userId: user._id.toString(),
      companyId, // ✅ This will be the actual company _id for rental-company users
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get current user (unchanged)
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Updated user profile - removed company fields
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUserId = (req as any).user._id;
    const requestingUserRole = (req as any).user.role;

    // Users can only update their own profile, unless they're admin
    if (id !== requestingUserId.toString() && requestingUserRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      username,
      email,
      phone,
      newPassword,
      firstName,
      lastName,
      drivingLicenseNumber,
      dateOfBirth,
      address,
      // Removed CompanyName, CompanyAddress - handled in RentalCompany model
    } = req.body;

    // Check if username is being changed and if it's already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' });
      }
    }

    // Handle password change
    if (newPassword) {
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: 'New password must be at least 6 characters' });
      }
      user.password = newPassword;
    }

    // Update basic fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Update role-specific fields (customer only now)
    if (user.role === 'customer') {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (drivingLicenseNumber)
        user.drivingLicenseNumber = drivingLicenseNumber;
      if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
      if (address) user.address = address;
    }

    // Removed rental-company field updates - handled in RentalCompany controller

    await user.save();

    const updatedUser = await User.findById(id).select('-password');
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (unchanged)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const requestingUser = (req as any).user;

    if (requestingUser.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Access denied. Admin access required.' });
    }

    const { role, page = 1, limit = 10 } = req.query;
    let filter: any = {};

    if (role && ['customer', 'rental-company'].includes(role as string)) {
      filter.role = role;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(filter, '-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
