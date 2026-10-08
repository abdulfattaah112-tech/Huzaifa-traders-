# Security Routes Map

- **METHOD**: ALL | **PATH**: `/supabase/*` | **AUTH**: Supabase JWT (Proxy) | **ADMIN**: NO | **CSRF**: NO | **RATE LIMITED**: NO | **WAF**: YES
- **METHOD**: ALL | **PATH**: `/api/auth/*` | **AUTH**: NO | **ADMIN**: NO | **CSRF**: NO | **RATE LIMITED**: YES (10/15m) | **WAF**: YES
- **METHOD**: ALL | **PATH**: `/api/*` | **AUTH**: NO | **ADMIN**: NO | **CSRF**: NO | **RATE LIMITED**: YES (100/1m) | **WAF**: YES
- **METHOD**: GET | **PATH**: `/api/security-logs` | **AUTH**: NONE (VULNERABILITY) | **ADMIN**: NO | **CSRF**: NO | **RATE LIMITED**: YES | **WAF**: YES
- **METHOD**: POST| **PATH**: `/api/security-config` | **AUTH**: NONE (VULNERABILITY) | **ADMIN**: NO | **CSRF**: NO | **RATE LIMITED**: YES | **WAF**: YES