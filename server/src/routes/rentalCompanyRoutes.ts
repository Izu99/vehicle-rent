import express from 'express';
import {
  getAllRentalCompanies,
  createRentalCompany,
  updateRentalCompany,
  getMyRentalCompany,
} from '../controllers/RentalCompanyController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/rental-companies', getAllRentalCompanies);

// Protected routes
router.post('/rental-companies', authMiddleware, createRentalCompany);
router.put('/rental-companies/:id', authMiddleware, updateRentalCompany);
router.get('/my-rental-company', authMiddleware, getMyRentalCompany);

export default router;
