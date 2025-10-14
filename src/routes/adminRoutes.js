import express from 'express';
import { approveCase, rejectCase, getCases, getDoctors } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// existing routes
router.get('/doctors', protectAdmin, getDoctors);
router.get('/cases', protectAdmin, getCases);

// ✅ new PATCH routes
router.patch('/cases/:id/approve', protectAdmin, approveCase);
router.patch('/cases/:id/reject', protectAdmin, rejectCase);

export default router;
