# Security Testing Guide

### Test 1: Normal Request
1. Open the homepage.
2. Verify products load (request passes WAF & Proxy to Supabase).
- **Expected**: ALLOWED

### Test 2: Harmless Suspicious Input
1. Open the Admin Panel -> Firewall Test tab.
2. Click "Run Test" for XSS (sends `<TEST-XSS>`).
- **Expected**: DETECTED/BLOCKED. HTTP 403 returned.

### Test 3: Rate Limit
1. Open Admin Panel -> Firewall Test.
2. Click "Start Rate Limit Test".
- **Expected**: First 10 requests ALLOWED (HTTP 200). Subsequent requests BLOCKED (HTTP 429).

### Test 4: Unauthorized Admin Access
1. Attempt to access Admin endpoints without credentials.
- **Expected**: DENIED (Currently Fails: Endpoints lack token verification - VULNERABILITY).

### Test 5: Invalid CSRF Token
- **Expected**: DENIED (Currently Fails: CSRF NOT IMPLEMENTED).