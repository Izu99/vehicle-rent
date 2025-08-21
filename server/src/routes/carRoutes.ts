import express from 'express';
import {
  addCar,
  getCompanyCars,
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
  '/company/:companyId',
  authMiddleware,
  getCompanyCars
);

// Modification routes
// UPDATE: Added uploadCarImages middleware for update route to handle multipart form data
router.put(
  '/:carId', 
  authMiddleware, 
  uploadCarImages,  // <-- Added this line to handle multipart form data
  updateCar
);

router.delete('/:carId', authMiddleware, deleteCar);
router.patch('/:carId/toggle-availability', authMiddleware, toggleCarAvailability);

export default router;