import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function attachUser(req, res, next) {
  if (!req.user) return next();
  try {
    const user = await User.findById(req.user.id).lean();
    req.currentUser = user;
  } catch {}
  next();
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.currentUser || !roles.includes(req.currentUser.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
