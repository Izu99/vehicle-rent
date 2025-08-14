import express from 'express';
import {
  addCar,
  getShopCars,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar
} from '../controllers/carController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { uploadCarImages } from '../middleware/uploads'; // Import upload middleware

const router = express.Router();

// Add car WITH images in one step
router.post('/', authMiddleware, requireRole('rent-shop'), uploadCarImages, addCar);

// Other routes remain the same
router.get('/', getAllCars);
router.get('/:carId', getCarById);
router.get('/shop/:shopId', authMiddleware, getShopCars);
router.put('/:carId', authMiddleware, updateCar);
router.delete('/:carId', authMiddleware, deleteCar);

export default router;
