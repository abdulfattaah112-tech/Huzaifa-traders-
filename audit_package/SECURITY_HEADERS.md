# Security Headers

Configured via `helmet` in `server.js`:

- **Content-Security-Policy**: STATUS: ACTIVE (Default helmet policy, toggleable via `SECURITY_ENABLED`)
- **Strict-Transport-Security**: STATUS: ACTIVE (Helmet default)
- **X-Content-Type-Options**: STATUS: ACTIVE (Helmet default)
- **Referrer-Policy**: STATUS: ACTIVE (Helmet default)
- **Secure Cookies**: STATUS: NOT VERIFIED (Supabase client manages cookies/localStorage internally)
- **HttpOnly Cookies**: STATUS: NOT VERIFIED (Supabase client manages session)
- **SameSite Cookies**: STATUS: NOT VERIFIED
- **CORS**: STATUS: ACTIVE (Configured in `server.js` to allow localhost / specific origins).