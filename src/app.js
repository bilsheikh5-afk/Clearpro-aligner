import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import './db.js';
import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import caseRoutes from './routes/cases.js';
import fileRoutes from './routes/files.js';
import dashboardRoutes from './routes/dashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use(limiter);

// Serve uploads statically
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Routes (prefixed with /api to match the frontend code)
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

export default app;

// Serve static frontend pages
import { fileURLToPath } from 'url';
import path from 'path';
const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename2);
const publicDir = path.join(__dirname2, '..', 'public');
app.use(express.static(publicDir));
app.get('/', (req, res) => res.sendFile(path.join(publicDir, 'dash.html')));
app.get('/doctor', (req, res) => res.sendFile(path.join(publicDir, 'doctor.html')));
