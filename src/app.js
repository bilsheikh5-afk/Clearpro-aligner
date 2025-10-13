import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// === Initialize Express ===
const app = express();

// === Database connection ===
import './db.js';

// === Route imports ===
import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import caseRoutes from './routes/cases.js';
import fileRoutes from './routes/files.js';
import dashboardRoutes from './routes/dashboard.js';

// === Path setup ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

// === Middleware ===
app.use(helmet());
app.use(cors({
  origin: [
    'https://shboard.render.com',           // frontend Render site
    'https://clearpro-fullstack.onrender.com' // backend Render API
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// === Rate limiter (basic protection) ===
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
});
app.use(limiter);

// === Serve static uploads directory ===
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

// === Serve frontend static assets (JS, CSS, images) ===
app.use(express.static(publicDir));

// === Health check route ===
app.get('/api/health', (req, res) => res.json({ ok: true }));

// === API routes ===
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/dashboard', dashboardRoutes);

// === Frontend pages ===
app.get('/', (req, res) => res.sendFile(path.join(publicDir, 'login.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(publicDir, 'dashboard.html')));
app.get('/cases', (req, res) => res.sendFile(path.join(publicDir, 'cases.html')));
app.get('/new-case', (req, res) => res.sendFile(path.join(publicDir, 'new-case.html')));

// === Fallback for unknown non-API routes ===
app.get('*', (req, res) => {
  // Only handle frontend paths (not /api or assets)
  if (!req.originalUrl.startsWith('/api/') && !req.originalUrl.includes('.')) {
    res.sendFile(path.join(publicDir, 'login.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

export default app;
