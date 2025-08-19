import { Request, Response } from 'express';
import { RentalCompany } from '../models/RentalCompany';
import { User } from '../models/User';

// Get all rental companies (public)
export const getAllRentalCompanies = async (req: Request, res: Response) => {
  try {
    const { category, location, minRating, search, page = 1, limit = 10 } = req.query;
    
    let filter: any = { status: 'active' };
    
    if (category) filter.category = category;
    if (location) filter.locations = { $regex: location, $options: 'i' };
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const companies = await RentalCompany.find(filter)
      .populate('ownerId', 'username email phone')
      .sort({ featured: -1, rating: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await RentalCompany.countDocuments(filter);

    res.json({
      companies,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create rental company (owner only)
export const createRentalCompany = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;
    
    if (userRole !== 'rental-company') {
      return res.status(403).json({ message: 'Only rental-company users can create companies' });
    }
    
    // Check if user already has a company
    const existingCompany = await RentalCompany.findOne({ ownerId: userId });
    if (existingCompany) {
      return res.status(400).json({ message: 'You already have a rental company' });
    }
    
    const { name, category, description, locations, features, phone, email, website } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }
    
    const companyData = {
      name,
      ownerId: userId,
      category,
      description,
      locations: locations || [],
      features: features || [],
      phone,
      email,
      website
    };
    
    const company = new RentalCompany(companyData);
    await company.save();
    
    res.status(201).json({ message: 'Rental company created successfully', company });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get my company (for rental-company owners)
export const getMyRentalCompany = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    
    const company = await RentalCompany.findOne({ ownerId: userId });
    if (!company) {
      return res.status(404).json({ message: 'No rental company found for this user' });
    }
    
    res.json(company);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update rental company (owner only)
export const updateRentalCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;
    
    const company = await RentalCompany.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Rental company not found' });
    }
    
    // Check ownership or admin
    if (company.ownerId.toString() !== userId.toString() && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedCompany = await RentalCompany.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.json({ message: 'Company updated successfully', company: updatedCompany });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
