import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserRepository from '../repository/UserRepository.js';
import DriverRepository from '../repository/DriverRepository.js';
import { USER_ROLES, AUTH_MESSAGES } from '../constants.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '7d';

class AuthService {
  async registerUser(data) {
    const existing = await UserRepository.findByUsername(data.username) || await UserRepository.findByEmail(data.email);
    if (existing) throw new Error(AUTH_MESSAGES.USER_EXISTS);
    data.password = await bcrypt.hash(data.password, 10);
    return UserRepository.create(data);
  }

  async registerDriver(data) {
    const existing = await DriverRepository.findByUsername(data.username) || await DriverRepository.findByEmail(data.email);
    if (existing) throw new Error(AUTH_MESSAGES.DRIVER_EXISTS);
    data.password = await bcrypt.hash(data.password, 10);
    return DriverRepository.create(data);
  }

  async loginUser({ username, password }) {
    const user = await UserRepository.findByUsername(username);
    if (!user) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { user, token };
  }

  async loginDriver({ username, password }) {
    const driver = await DriverRepository.findByUsername(username);
    if (!driver) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const valid = await bcrypt.compare(password, driver.password);
    if (!valid) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const token = jwt.sign({ id: driver._id, role: USER_ROLES.DRIVER }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { driver, token };
  }
}

export default new AuthService();
