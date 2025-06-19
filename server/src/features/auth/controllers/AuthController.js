import AuthService from '../services/AuthService.js';
import { AUTH_MESSAGES } from '../constants.js';
import passport from '../services/GoogleStrategy.js';
import jwt from 'jsonwebtoken';
import Customer from '../schema/Customer.js';
import Driver from '../schema/Driver.js';
import Admin from '../schema/Admin.js';
import sendMail from '../../../utils/mailer.js';

class AuthController {
  async registerCustomer(req, res) {
    try {
      // Only register if email sent successfully
      const customer = await AuthService.registerCustomer(req.body);
      res.status(201).json({ message: AUTH_MESSAGES.REGISTER_SUCCESS, customer });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async registerDriver(req, res) {
    try {
      const driver = await AuthService.registerDriver(req.body);
      res.status(201).json({ message: AUTH_MESSAGES.REGISTER_SUCCESS, driver });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async loginCustomer(req, res) {
    try {
      const { customer, token } = await AuthService.loginCustomer(req.body);
      res.status(200).json({ message: AUTH_MESSAGES.LOGIN_SUCCESS, customer, token });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async loginDriver(req, res) {
    try {
      const { driver, token } = await AuthService.loginDriver(req.body);
      res.status(200).json({ message: AUTH_MESSAGES.LOGIN_SUCCESS, driver, token });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async loginAdmin(req, res) {
    try {
      const { admin, token } = await AuthService.loginAdmin(req.body);
      res.status(200).json({ message: AUTH_MESSAGES.LOGIN_SUCCESS, admin, token });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async logout(req, res) {
    // For JWT, logout is handled on the client by deleting the token
    res.status(200).json({ message: AUTH_MESSAGES.LOGOUT_SUCCESS });
  }

  googleAuth(req, res, next) {
    const role = req.query.role || 'customer';
    req.query.role = role;
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: JSON.stringify({ role })
    })(req, res, next);
  }

  googleCallback(req, res, next) {
    let role = 'customer';
    if (req.query.state) {
      try {
        const state = JSON.parse(req.query.state);
        if (state.role) role = state.role;
      } catch {}
    }
    req.query.role = role;
    passport.authenticate('google', { failureRedirect: '/login', session: false }, async (err, user) => {
      if (err || !user) {
        return res.send('<script>window.opener && window.opener.postMessage({ error: "OAuth failed" }, "*"); window.close();</script>');
      }
      const jwt = (await import('jsonwebtoken')).default;
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '7d' });
      res.send(`<script>\n  window.opener && window.opener.postMessage({ token: '${token}', user: ${JSON.stringify(user)}, role: '${user.role}' }, '*');\n  window.close();\n<\/script>`);
    })(req, res, next);
  }

  async getMe(req, res) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      let user = null;
      if (decoded.role === 'customer') {
        user = await Customer.findById(decoded.id).select('-password');
        if (user) user = { ...user.toObject(), role: 'customer' };
      } else if (decoded.role === 'driver') {
        user = await Driver.findById(decoded.id).select('-password');
        if (user) user = { ...user.toObject(), role: 'driver' };
      } else if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id).select('-password');
        if (user) user = { ...user.toObject(), role: 'admin' };
      }
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (e) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}

export default new AuthController();
// Named exports for Google OAuth and getMe endpoints
export const googleAuth = (...args) => new AuthController().googleAuth(...args);
export const googleCallback = (...args) => new AuthController().googleCallback(...args);
export const getMe = (...args) => new AuthController().getMe(...args);
