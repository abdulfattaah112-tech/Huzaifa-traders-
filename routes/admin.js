import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authLimiter } from '../middleware/rateLimiter.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not defined. Admin authentication might be insecure.');
}

const getAdminHash = () => {
  // Always use the new password hash for atturahman@3214@
  return '$2b$10$mzPhrcC.JjyMTNMpFgaGxuk761bdJ45YAlK5oEkVA6trMUimDzPfm';
};

router.post('/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const currentAdminHash = getAdminHash();

  const expectedUsername = 'atturahman';

  if (username !== expectedUsername) {
    // Fake compare to mitigate timing attack
    await bcrypt.compare(password, currentAdminHash);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, currentAdminHash);
  
  if (match) {
    // Regenerate session id essentially by issuing a new JWT
    const token = jwt.sign({ role: 'admin', user: expectedUsername, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET, { expiresIn: '2h' });
    
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    return res.json({ success: true, message: 'Logged in successfully' });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  return res.json({ success: true });
});

router.get('/status', requireAdmin, (req, res) => {
  res.json({ authenticated: true, role: req.admin.role });
});

export default router;
