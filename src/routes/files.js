import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import { v4 as uuid } from 'uuid';
import { requireAuth, attachUser } from '../middleware/auth.js';
import Case from '../models/Case.js';
import { fileURLToPath } from 'url';

const router = Router();
router.use(requireAuth, attachUser);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..');
const baseUpload = process.env.UPLOAD_DIR || 'uploads';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const caseId = req.query.caseId || 'misc';
    const dir = path.join(projectRoot, baseUpload, caseId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || `.${mime.extension(file.mimetype) || 'bin'}`;
    cb(null, uuid() + ext.toLowerCase());
  }
});

const upload = multer({ storage });

router.post('/upload', upload.array('files', 30), async (req, res) => {
  const caseId = req.query.caseId;
  const t = (req.query.type || '').toLowerCase();
  if (!caseId) return res.status(400).json({ error: 'Missing caseId' });
  if (!['stl', 'photos', 'xrays', 'xray', 'photo'].includes(t)) {
    return res.status(400).json({ error: 'Invalid type' });
  }
  const c = await Case.findById(caseId);
  if (!c) return res.status(404).json({ error: 'Case not found' });
  if (req.currentUser.role === 'doctor' && String(c.doctor) !== String(req.currentUser._id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const normalized = t === 'photos' ? 'photo' : (t === 'xrays' ? 'xray' : t);
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
  const saved = (req.files || []).map(f => ({
    type: normalized,
    originalName: f.originalname,
    path: f.path.replace(projectRoot + path.sep, '').split(path.sep).join('/'),
    url: `${baseUrl}/` + f.path.replace(projectRoot + path.sep, '').split(path.sep).join('/'),
    size: f.size,
    mimeType: f.mimetype
  }));
  c.files.push(...saved);
  await c.save();
  res.json({ files: saved, case: { id: c._id } });
});

export default router;
