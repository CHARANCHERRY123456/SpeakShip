import AuthService from '../services/AuthService.js';
import { AUTH_MESSAGES } from '../constants.js';

class AuthController {
  async registerUser(req, res) {
    try {
      const user = await AuthService.registerUser(req.body);
      res.status(201).json({ message: AUTH_MESSAGES.REGISTER_SUCCESS, user });
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

  async loginUser(req, res) {
    try {
      const { user, token } = await AuthService.loginUser(req.body);
      res.status(200).json({ message: AUTH_MESSAGES.LOGIN_SUCCESS, user, token });
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
}

export default new AuthController();
