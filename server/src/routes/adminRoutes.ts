import express from 'express';
import {
  getAllCompaniesForAdmin,
  getCompanyByIdForAdmin,
  updateCompanyStatus,
} from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth';
import { requireAdmin } from '../middleware/roles';

const router = express.Router();

// All routes in this file are protected by authMiddleware and requireAdmin
router.use(authMiddleware);
router.use(requireAdmin);

// Routes for admin
router.get('/companies', getAllCompaniesForAdmin);
router.get('/companies/:id', getCompanyByIdForAdmin);
router.patch('/companies/:id/status', updateCompanyStatus);

export default router;
