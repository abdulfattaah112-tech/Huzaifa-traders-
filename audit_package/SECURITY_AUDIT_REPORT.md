# Security Audit Report

### Project Architecture
- **Frontend technology**: React, Vite
- **Backend technology**: Node.js, Express (used primarily as a WAF and Proxy)
- **Database technology**: Supabase (PostgreSQL)
- **Authentication system**: 
  - User Auth: Supabase Auth (Implicit via client, minimal usage detected)
  - Admin Auth: Hardcoded state-based authentication in React (VULNERABILITY)
- **Session system**: Supabase JWTs (localStorage), no backend sessions.
- **API architecture**: Frontend directly calls Supabase via REST/PostgREST, routed through the local Node.js proxy.
- **Deployment architecture**: Development environment tested (Express on port 3000 proxying to external Supabase).

### Firewall Architecture
- **Where the WAF/firewall is implemented**: Express Server (Port 3000)
- **Main middleware/file**: `middleware/waf.js`
- **Functions responsible for inspection**: `wafMiddleware` (Regex matching on req.query, req.body, req.params)
- **Request flow**: 
  Request → Express Server → WAF Middleware (`waf.js`) → Rate Limiter (`rateLimiter.js`) → `http-proxy-middleware` → Supabase (Database/Auth) → Response
- **Detection process**: Stringifies payloads and executes regex tests for XSS, SQLi, and Path Traversal.
- **Blocking process**: Returns HTTP 403 Forbidden immediately, skipping proxy.
- **Logging process**: Writes event details (IP, method, URL, severity) to `security_logs.json` on the host disk.