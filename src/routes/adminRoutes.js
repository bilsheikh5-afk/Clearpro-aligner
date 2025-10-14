import express from 'express';
import {
  approveCase,
  rejectCase,
  getCases,
  getDoctors
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/doctors', protectAdmin, getDoctors);
router.get('/cases', protectAdmin, getCases);
router.patch('/cases/:id/approve', protectAdmin, approveCase);
router.patch('/cases/:id/reject', protectAdmin, rejectCase);

export default router;
