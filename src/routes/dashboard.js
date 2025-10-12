import { Router } from 'express';
import User from '../models/User.js';
import Case from '../models/Case.js';
import { requireAuth, attachUser } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, attachUser);

router.get('/stats', async (req, res) => {
  const totalDoctors = await User.countDocuments({ role: 'doctor' });
  const totalCases = await Case.countDocuments({});
  const activePatients = await Case.distinct('patient.email', { status: { $in: ['pending', 'in_review', 'approved'] } });
  const approvedRatio = await Case.countDocuments({ status: 'approved' });
  const totalWithStatus = await Case.countDocuments({});
  const successRate = totalWithStatus ? Math.round((approvedRatio / totalWithStatus) * 100) : 0;
  res.json({
    stats: {
      totalDoctors,
      totalCases,
      activePatients: activePatients.filter(Boolean).length,
      successRate
    }
  });
});

export default router;
