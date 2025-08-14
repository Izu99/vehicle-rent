import express from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  // getUserProfile, 
  updateUserProfile,
  getAllUsers
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { requireAdmin } from '../middleware/roles';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);

// Profile endpoints
// router.get('/users/:id', authMiddleware, getUserProfile);
router.put('/users/:id', authMiddleware, updateUserProfile);

// Admin only - get all users
router.get('/users', authMiddleware, requireAdmin, getAllUsers);

export default router;
