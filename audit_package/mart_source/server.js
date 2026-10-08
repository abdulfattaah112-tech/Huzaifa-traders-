import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import { wafMiddleware, getSecurityLogs } from "./middleware/waf.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = 'https://pgsphvxetiwxpkzcqeui.supabase.co';

// Security Headers
app.use(helmet({
  contentSecurityPolicy: process.env.SECURITY_ENABLED === "true" ? undefined : false,
}));

// CORS Configuration
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? ["https://yourproductiondomain.com"] 
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Basic Body Parsing for our custom API endpoints (not proxy)
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
}

// Dummy endpoint for rate limit testing
app.post("/api/auth/test-rate-limit", (req, res) => {
  res.json({ success: true, message: "Request allowed" });
});

// Security Endpoints
app.get("/api/security-logs", (req, res) => {
  // In a real app, protect this with Admin Auth.
  const logs = getSecurityLogs();
  res.json(logs);
});

// Get Configuration
app.get("/api/security-config", (req, res) => {
  res.json({
    WAF_ENABLED: process.env.WAF_ENABLED === "true",
    RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED === "true",
    CSRF_ENABLED: process.env.CSRF_ENABLED === "true",
    SECURITY_LOGGING: process.env.SECURITY_LOGGING === "true",
    BOT_PROTECTION: process.env.BOT_PROTECTION === "true",
    FILE_UPLOAD_PROTECTION: process.env.FILE_UPLOAD_PROTECTION === "true",
    SECURITY_ENABLED: process.env.SECURITY_ENABLED === "true"
  });
});

// Update Configuration
app.post("/api/security-config", (req, res) => {
  const { WAF_ENABLED, RATE_LIMIT_ENABLED, CSRF_ENABLED, SECURITY_LOGGING, BOT_PROTECTION, FILE_UPLOAD_PROTECTION, SECURITY_ENABLED } = req.body;
  
  if (WAF_ENABLED !== undefined) process.env.WAF_ENABLED = WAF_ENABLED.toString();
  if (RATE_LIMIT_ENABLED !== undefined) process.env.RATE_LIMIT_ENABLED = RATE_LIMIT_ENABLED.toString();
  if (CSRF_ENABLED !== undefined) process.env.CSRF_ENABLED = CSRF_ENABLED.toString();
  if (SECURITY_LOGGING !== undefined) process.env.SECURITY_LOGGING = SECURITY_LOGGING.toString();
  if (BOT_PROTECTION !== undefined) process.env.BOT_PROTECTION = BOT_PROTECTION.toString();
  if (FILE_UPLOAD_PROTECTION !== undefined) process.env.FILE_UPLOAD_PROTECTION = FILE_UPLOAD_PROTECTION.toString();
  if (SECURITY_ENABLED !== undefined) process.env.SECURITY_ENABLED = SECURITY_ENABLED.toString();

  res.json({ success: true });
});

// Blocked IPs (mock for now)
app.get("/api/security-blocked-ips", (req, res) => {
  res.json([]);
});

// Proxy Requests to Supabase
// This intercepts the direct client calls and routes them safely through our server
app.use("/supabase", createProxyMiddleware({
  target: SUPABASE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/supabase": "", // strip /supabase from the URL
  },
  onProxyReq: (proxyReq, req, res) => {
    // We can inject additional headers or perform checks here before sending to Supabase
  }
}));

app.listen(PORT, () => {
  console.log(`Security Server running on http://localhost:${PORT}`);
  console.log(`WAF Enabled: ${process.env.WAF_ENABLED}`);
});
