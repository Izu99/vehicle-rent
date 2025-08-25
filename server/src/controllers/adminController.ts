import { Request, Response } from 'express';
import { RentalCompany } from '../models/RentalCompany';

export const getAllCompaniesForAdmin = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let filter: any = {};
    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const companies = await RentalCompany.find(filter)
      .populate('ownerId', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await RentalCompany.countDocuments(filter);

    res.json({
      companies,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompanyByIdForAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await RentalCompany.findById(id).populate('ownerId', 'username email');
    if (!company) {
      return res.status(404).json({ message: 'Rental company not found' });
    }
    res.json(company);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCompanyStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const company = await RentalCompany.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Rental company not found' });
    }

    res.json({ message: 'Company status updated successfully', company });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
