// src/features/auth/controllers/AuthController.js
import AuthService from '../services/AuthService.js';
import { AUTH_MESSAGES, USER_ROLES } from '../constants.js'; // Import USER_ROLES
import passport from '../services/GoogleStrategy.js';
import jwt from 'jsonwebtoken';
import Customer from '../schema/Customer.js';
import Driver from '../schema/Driver.js';
import Admin from '../schema/Admin.js';
import sendMail from '../../../utils/mailer.js'; // Already present, but make sure the path is correct

class AuthController {
    async sendOtp(req, res) {
        const { email, role } = req.body;
        console.log(`[AuthController.sendOtp] Received request: email=${email}, role=${role}`);

        if (!email || !role || ![USER_ROLES.CUSTOMER, USER_ROLES.DRIVER].includes(role)) {
            console.error(`[AuthController.sendOtp] Missing or invalid parameters: email=${email}, role=${role}`);
            return res.status(400).json({ error: 'Email and a valid role (customer or driver) are required.' });
        }
        try {
            const result = await AuthService.sendOtpForRegistration(email, role);
            res.status(200).json(result);
        } catch (err) {
            console.error('[AuthController.sendOtp] Error sending OTP:', err.message);
            res.status(400).json({ error: err.message });
        }
    }

    async verifyOtp(req, res) {
        const { email, otp, role } = req.body;
        console.log(`[AuthController.verifyOtp] Received request: email=${email}, otp=${otp}, role=${role}`);

        if (!email || !otp || !role || ![USER_ROLES.CUSTOMER, USER_ROLES.DRIVER].includes(role)) {
            console.error(`[AuthController.verifyOtp] Missing or invalid parameters: email=${email}, otp=${otp}, role=${role}`);
            return res.status(400).json({ error: 'Email, OTP, and a valid role (customer or driver) are required.' });
        }
        try {
            const result = await AuthService.verifyOtp(email, otp, role);
            res.status(200).json(result);
        } catch (err) {
            console.error('[AuthController.verifyOtp] Error during OTP verification:', err.message);
            res.status(401).json({ error: err.message });
        }
    }

    async registerCustomer(req, res) {
        try {
            // The client should call /send-otp and /verify-otp successfully BEFORE calling this.
            // This endpoint now assumes OTP verification has been completed for the provided email.
            const customer = await AuthService.registerCustomer(req.body);
            res.status(201).json({ message: AUTH_MESSAGES.REGISTER_SUCCESS, customer });
        } catch (err) {
            console.error('[AuthController.registerCustomer] Error during customer registration:', err.message);
            res.status(400).json({ error: err.message });
        }
    }

    async registerDriver(req, res) {
        try {
            // The client should call /send-otp and /verify-otp successfully BEFORE calling this.
            const driver = await AuthService.registerDriver(req.body);
            res.status(201).json({ message: AUTH_MESSAGES.REGISTER_SUCCESS, driver });
        } catch (err) {
            console.error('[AuthController.registerDriver] Error during driver registration:', err.message);
            res.status(400).json({ error: err.message });
        }
    }

    async loginCustomer(req, res) {
        try {
            const { customer, token } = await AuthService.loginCustomer(req.body);
            res.status(200).json({ message: AUTH_MESSAGES.LOGIN_SUCCESS, customer, token });
        } catch (err) {
            console.error('[AuthController.loginCustomer] Error during customer login:', err.message);
            res.status(401).json({ error: err.message });
        }
    }

    async loginDriver(req, res) {
        try {
            const { driver, token } = await AuthService.loginDriver(req.body);
            res.status(200).json({ message: AUTH_MESSAGES.LOGIN_SUCCESS, driver, token });
        } catch (err) {
            console.error('[AuthController.loginDriver] Error during driver login:', err.message);
            res.status(401).json({ error: err.message });
        }
    }

    async loginAdmin(req, res) {
        try {
            const { admin, token } = await AuthService.loginAdmin(req.body);
            res.status(200).json({ message: AUTH_MESSAGES.LOGIN_SUCCESS, admin, token });
        } catch (err) {
            console.error('[AuthController.loginAdmin] Error during admin login:', err.message);
            res.status(401).json({ error: err.message });
        }
    }

    async logout(req, res) {
        // For JWT, logout is handled on the client by deleting the token
        res.status(200).json({ message: AUTH_MESSAGES.LOGOUT_SUCCESS });
    }

    googleAuth(req, res, next) {
        const role = req.query.role || 'customer';
        console.log('[GoogleAuth] role from query:', req.query.role, '| using:', role);
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
                console.log('[GoogleCallback] Parsed state:', state);
            } catch (e) {
                console.error('[GoogleCallback] Failed to parse state:', req.query.state, e);
            }
        }
        req.query.role = role;
        console.log('[GoogleCallback] Final role for passport:', role);
        passport.authenticate('google', { failureRedirect: '/login', session: false }, async (err, user) => {
            if (err || !user) {
                console.error('[GoogleCallback] OAuth failed:', err);
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
                console.error('[AuthController.getMe] Invalid token:', e.message);
            res.status(401).json({ error: 'Invalid token' });
        }
    }
}

export default new AuthController();
// Named exports for Google OAuth and getMe endpoints, and new OTP methods
export const googleAuth = (...args) => new AuthController().googleAuth(...args);
export const googleCallback = (...args) => new AuthController().googleCallback(...args);
export const getMe = (...args) => new AuthController().getMe(...args);
export const sendOtp = (...args) => new AuthController().sendOtp(...args); // Export new method
export const verifyOtp = (...args) => new AuthController().verifyOtp(...args); // Export new method