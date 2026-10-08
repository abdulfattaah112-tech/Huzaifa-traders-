import jwt from 'jsonwebtoken';

export const requireAdmin = (req, res, next) => {
  const token = req.cookies.admin_token;
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'admin') {
      req.admin = decoded;
      return next();
    } else {
      return res.status(403).json({ error: 'Forbidden. Admin authorization required.' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
  }
};
