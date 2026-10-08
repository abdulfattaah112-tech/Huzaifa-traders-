# Project Security Map

project/
├── server.js               [CRITICAL: WAF, Helmet, Rate Limiter, Proxy]
├── middleware/
│   ├── waf.js              [CRITICAL: Threat detection logic & logging]
│   └── rateLimiter.js      [CRITICAL: Rate limit configurations]
├── src/
│   ├── App.jsx             [VULNERABLE: Contains hardcoded Admin Auth]
│   ├── supabase.js         [CRITICAL: Supabase client init, routes to proxy]
│   ├── SecurityDashboard.jsx
│   └── FirewallTestCenter.jsx
├── security_logs.json      [STORAGE: Flat-file log storage]
└── .env                    [STORAGE: WAF Configurations & Toggles]