import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { wafMiddleware, getSecurityLogs } from "./middleware/waf.js";
import { apiLimiter, authLimiter, orderLimiter } from "./middleware/rateLimiter.js";
import { requireAdmin } from "./middleware/auth.js";
import adminRoutes from "./routes/admin.js";

import neonCategoriesRoutes from "./server/routes/neon_categories.js";
import neonProductsRoutes from "./server/routes/neon_products.js";
import neonOrdersRoutes from "./server/routes/neon_orders.js";
import neonHistoryRoutes from "./server/routes/neon_history.js";
import neonBusinessDetailsRoutes from "./server/routes/neon_business_details.js";
import neonRealtimeRoutes from "./server/routes/neon_realtime.js";
import neonAuthRoutes from "./server/routes/neon_auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust reverse proxies for accurate rate limiting (Cloudflare, AWS, etc)
app.set('trust proxy', 1);

app.use(cookieParser());

// Security Headers
app.use(helmet({
  contentSecurityPolicy: process.env.SECURITY_ENABLED === "true" ? undefined : false,
}));

// CORS Configuration
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));

// Basic Body Parsing for our custom API endpoints
app.use(express.json({ limit: "1mb" })); 
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Apply WAF Middleware
if (process.env.WAF_ENABLED === "true") {
  app.use(wafMiddleware);
}

// Rate Limiting
if (process.env.RATE_LIMIT_ENABLED === "true") {
  app.use("/api", apiLimiter);
  app.use("/api/auth", authLimiter);
  app.use("/api/admin", authLimiter);
}

// CSRF Protection for state-changing endpoints
const csrfMiddleware = (req, res, next) => {
  if (process.env.CSRF_ENABLED !== "true") return next();
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  
  // Custom CSRF check for admin routes
  const token = req.headers['x-csrf-token'];
  const cookieToken = req.cookies.csrf_token;
  
  if (!token || !cookieToken || token !== cookieToken) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  next();
};

app.get('/api/csrf-token', (req, res) => {
  // Generate a random token
  const token = Math.random().toString(36).substring(2, 15);
  res.cookie('csrf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ csrfToken: token });
});

// Admin Routes
app.use("/api/admin", adminRoutes);

// Security Testing Endpoints
app.get('/api/security-config', (req, res) => {
  res.json({
    wafEnabled: process.env.WAF_ENABLED === 'true',
    rateLimitEnabled: process.env.RATE_LIMIT_ENABLED === 'true',
    csrfEnabled: process.env.CSRF_ENABLED === 'true'
  });
});

app.get('/api/security-test-waf', (req, res) => {
  res.json({ status: 'ALLOWED', message: 'Payload bypassed WAF.' });
});


// Mount parallel Neon routes
app.use("/api/neon/categories", neonCategoriesRoutes);
app.use("/api/neon/products", neonProductsRoutes);
app.use("/api/neon/orders", neonOrdersRoutes);
app.use("/api/neon/history", neonHistoryRoutes);
app.use("/api/neon/business-details", neonBusinessDetailsRoutes);
app.use("/api/neon/realtime", neonRealtimeRoutes);
app.use("/api/neon/auth", neonAuthRoutes);

// Dummy endpoint for rate limit testing
app.post("/api/auth/test-rate-limit", (req, res) => {
  res.json({ success: true, message: "Request allowed" });
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Security Server running on http://localhost:${PORT}`);
    console.log(`WAF Enabled: ${process.env.WAF_ENABLED}`);
  });

export default app;
