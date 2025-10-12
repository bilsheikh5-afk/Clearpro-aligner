import { Router } from 'express';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import { requireAuth, attachUser, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, attachUser);

router.get('/', async (req, res) => {
  const docs = await Doctor.find().populate('user', 'name email role').lean();
  res.json({ doctors: docs });
});

router.post('/', requireRole(['admin']), async (req, res) => {
  const { name, email, password = 'changeme123', specialty, clinic, phone } = req.body;
  let existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already in use' });
  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role: 'doctor' });
  const doctor = await Doctor.create({ user: user._id, specialty, clinic, phone });
  res.status(201).json({ doctor: { ...doctor.toObject(), user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
});

export default router;
