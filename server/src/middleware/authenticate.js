import jwt from 'jsonwebtoken';
import Customer from '../features/auth/schema/Customer.js';
import Driver from '../features/auth/schema/Driver.js';
import Admin from '../features/auth/schema/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticate = (roles = []) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let user = null;
    if (decoded.role === 'customer' && (roles.length === 0 || roles.includes('customer'))) {
      user = await Customer.findById(decoded.id).select('-password');
    } else if (decoded.role === 'driver' && (roles.length === 0 || roles.includes('driver'))) {
      user = await Driver.findById(decoded.id).select('-password');
    } else if (decoded.role === 'admin' && (roles.length === 0 || roles.includes('admin'))) {
      user = await Admin.findById(decoded.id).select('-password');
    }
    if (!user) return res.status(403).json({ error: 'Unauthorized' });
    req.user = { id: user._id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
