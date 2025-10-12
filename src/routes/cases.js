import { Router } from 'express';
import Case from '../models/Case.js';
import { requireAuth, attachUser, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, attachUser);

// List cases. Doctors see their own; admins see all.
router.get('/', async (req, res) => {
  const query = req.currentUser.role === 'doctor' ? { doctor: req.currentUser._id } : {};
  const cases = await Case.find(query).sort({ createdAt: -1 }).lean();
  res.json({ cases });
});

router.post('/', async (req, res) => {
  const { patient, details } = req.body;
  if (!patient?.name) return res.status(400).json({ error: 'Patient name required' });
  const docId = req.currentUser._id;
  const created = await Case.create({ doctor: docId, patient, details });
  res.status(201).json({ case: created });
});

router.get('/:id', async (req, res) => {
  const c = await Case.findById(req.params.id).lean();
  if (!c) return res.status(404).json({ error: 'Case not found' });
  // Permission check
  if (req.currentUser.role === 'doctor' && String(c.doctor) != String(req.currentUser._id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json({ case: c });
});

router.patch('/:id', async (req, res) => {
  const c = await Case.findById(req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found' });
  if (req.currentUser.role === 'doctor' && String(c.doctor) != String(req.currentUser._id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const allowed = ['patient', 'details', 'status'];
  for (const k of allowed) if (k in req.body) c[k] = req.body[k];
  await c.save();
  res.json({ case: c });
});

export default router;
