import express from 'express';
import {
  addCar,
  getCompanyCars,        // <-- Updated name
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  toggleCarAvailability
} from '../controllers/carController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { uploadCarImages } from '../middleware/uploads';

const router = express.Router();

// Add car WITH multiple images using single field name
router.post(
  '/',
  authMiddleware,
  requireRole('rental-company'),
  uploadCarImages,
  addCar
);

// Public routes
router.get('/', getAllCars);
router.get('/:carId', getCarById);

// Company-centric routes
router.get(
  '/company/:companyId',           // <-- Changed from /company/:CompanyId
  authMiddleware,
  getCompanyCars                   // <-- Updated controller
);

// Modification routes
router.put('/:carId', authMiddleware, updateCar);
router.delete('/:carId', authMiddleware, deleteCar);
router.patch('/:carId/toggle-availability', authMiddleware, toggleCarAvailability);

export default router;
