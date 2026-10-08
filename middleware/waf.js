import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, "..", "security_logs.json");

// Initialize log file
try {
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, JSON.stringify([]));
  }
} catch (e) {
  console.warn("Could not initialize security_logs.json. Probably a read-only filesystem.");
}

const appendLog = (event) => {
  try {
    const logs = JSON.parse(fs.readFileSync(logFile, "utf-8"));
    logs.unshift({ id: uuidv4(), timestamp: new Date().toISOString(), ...event });
    // Keep last 1000 logs
    if (logs.length > 1000) logs.length = 1000;
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error("Failed to write security log", err);
  }
};

const xssPattern = /(<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>)|(<TEST-XSS>)/gi;
const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|UNION|OR|AND)\b.*\b(FROM|INTO|SET|TABLE)\b)|('.*')|(TEST_SQL_INJECTION_PATTERN)/gi;
const pathTraversalPattern = /(\.\.\/|\.\.\\)|(TEST_PATH_TRAVERSAL_PATTERN)/g;

export const wafMiddleware = (req, res, next) => {
  if (process.env.WAF_ENABLED !== "true") return next();

  const checkPayload = (data) => {
    if (!data) return null;
    const str = typeof data === "object" ? JSON.stringify(data) : String(data);
    
    if (xssPattern.test(str)) return "XSS Attempt";
    if (sqlPattern.test(str)) return "SQL Injection Attempt";
    if (pathTraversalPattern.test(str)) return "Path Traversal Attempt";
    
    return null;
  };

  const threat = checkPayload(req.query) || checkPayload(req.body) || checkPayload(req.params);

  if (threat) {
    const event = {
      type: threat,
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      severity: "HIGH",
    };
    appendLog(event);
    return res.status(403).json({ error: "Forbidden: Malicious activity detected." });
  }

  next();
};

export const getSecurityLogs = () => {
  try {
    return JSON.parse(fs.readFileSync(logFile, "utf-8"));
  } catch (err) {
    return [];
  }
};
