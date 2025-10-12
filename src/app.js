import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// === Initialize Express early ===
const app = express();

// === Database ===
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
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// === Rate limiter ===
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
});
app.use(limiter);

// === Serve static uploads ===
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

// === Serve frontend files ===
app.use(express.static(publicDir));

app.get('/', (req, res) => res.sendFile(path.join(publicDir, 'login.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(publicDir, 'dashboard.html')));
app.get('/cases', (req, res) => res.sendFile(path.join(publicDir, 'cases.html')));
app.get('/new-case', (req, res) => res.sendFile(path.join(publicDir, 'new-case.html')));

// === Health check ===
app.get('/api/health', (req, res) => res.json({ ok: true }));

// === API routes ===
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/dashboard', dashboardRoutes);

// === Fallback for unknown routes ===
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'login.html'));
});

// === 404 JSON handler (for API endpoints only) ===
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(publicDir, 'login.html'));
});

export default app;
