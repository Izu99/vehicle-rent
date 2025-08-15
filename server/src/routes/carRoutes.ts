import express from 'express';
import {
  addCar,
  getShopCars,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  toggleCarAvailability // Add this if you want the toggle functionality
} from '../controllers/carController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { uploadCarImages } from '../middleware/uploads';

const router = express.Router();

// Add car WITH multiple images using single field name
router.post('/', authMiddleware, requireRole('rent-shop'), uploadCarImages, addCar);

// Other routes
router.get('/', getAllCars);
router.get('/:carId', getCarById);
router.get('/shop/:shopId', authMiddleware, getShopCars);
router.put('/:carId', authMiddleware, updateCar);
router.delete('/:carId', authMiddleware, deleteCar);
router.patch('/:carId/toggle-availability', authMiddleware, toggleCarAvailability);

export default router;
