import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// === Initialize Express ===
const app = express();

// === Database connection ===
import "./db.js";

// === Route imports ===
import authRoutes from "./routes/auth.js";
import doctorRoutes from "./routes/doctors.js";
import caseRoutes from "./routes/cases.js";
import fileRoutes from "./routes/files.js";
import dashboardRoutes from "./routes/dashboard.js";

// === Path setup ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

// === Middleware ===
app.use(helmet());
app.use(
  cors({
    origin: [
      "https://shboard.render.com", // frontend
      "https://clearpro-fullstack.onrender.com", // backend
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// === Rate limiter (basic protection) ===
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000,
});
app.use(limiter);

// === Serve static uploads ===
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(path.join(__dirname, "..", uploadDir)));

// === Serve frontend static assets ===
app.use(express.static(publicDir));

// === Health check ===
app.get("/api/health", (req, res) => res.json({ ok: true }));

// === API routes ===
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/dashboard", dashboardRoutes);

// === Frontend routes ===

// Root → login page
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "login.html"));
});

// Any direct .html route (e.g., /dashboard.html, /cases.html)
app.get("/:page.html", (req, res, next) => {
  const filePath = path.join(publicDir, `${req.params.page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

// Short URLs (e.g., /dashboard, /cases)
app.get("/:page", (req, res, next) => {
  const filePath = path.join(publicDir, `${req.params.page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

// === 404 fallback for missing routes ===
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api/")) {
    res.status(404).json({ error: "Not found" });
  } else {
    res.sendFile(path.join(publicDir, "login.html"));
  }
});

export default app;
