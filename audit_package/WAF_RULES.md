# WAF Rules Documentation

### Rule Name: XSS Detection
- **Purpose**: Prevent Cross-Site Scripting payloads.
- **Where implemented**: `middleware/waf.js` (`xssPattern`)
- **What it detects**: `<script>` tags and a test payload `<TEST-XSS>`.
- **What happens when detected**: Request blocked.
- **HTTP response**: 403 Forbidden
- **Security event generated**: YES (`type: XSS Attempt`)
- **Enabled/Disabled**: Controlled by `WAF_ENABLED` env var.

### Rule Name: SQL Injection Detection
- **Purpose**: Prevent SQL injection via REST proxy.
- **Where implemented**: `middleware/waf.js` (`sqlPattern`)
- **What it detects**: Common SQL keywords (SELECT, INSERT, UPDATE, DROP, UNION) and test payload `TEST_SQL_INJECTION_PATTERN`.
- **What happens when detected**: Request blocked.
- **HTTP response**: 403 Forbidden
- **Security event generated**: YES (`type: SQL Injection Attempt`)
- **Enabled/Disabled**: Controlled by `WAF_ENABLED` env var.

### Rule Name: Path Traversal
- **Purpose**: Prevent directory escape attempts.
- **Where implemented**: `middleware/waf.js` (`pathTraversalPattern`)
- **What it detects**: `../` or `..\` patterns and test payload `TEST_PATH_TRAVERSAL_PATTERN`.
- **What happens when detected**: Request blocked.
- **HTTP response**: 403 Forbidden
- **Security event generated**: YES (`type: Path Traversal Attempt`)
- **Enabled/Disabled**: Controlled by `WAF_ENABLED` env var.

### Other Rules
- **Command injection**: NOT IMPLEMENTED
- **Suspicious URLs**: NOT IMPLEMENTED
- **Malicious headers**: NOT IMPLEMENTED
- **Bot detection**: PARTIALLY IMPLEMENTED (Dashboard toggle exists, logic missing)
- **Request size limits**: ACTIVE (Express body parser limited to 1mb)
- **File upload validation**: NOT IMPLEMENTED (Client-side FileReader only)
- **Open redirect protection**: NOT IMPLEMENTED