import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CustomerRepository from '../repository/CustomerRepository.js';
import DriverRepository from '../repository/DriverRepository.js';
import AdminRepository from '../repository/AdminRepository.js';
import { USER_ROLES, AUTH_MESSAGES } from '../constants.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '7d';

class AuthService {
  async registerUser(data) {
    const existing = await CustomerRepository.findByUsername(data.username) || await CustomerRepository.findByEmail(data.email);
    if (existing) throw new Error(AUTH_MESSAGES.USER_EXISTS);
    data.password = await bcrypt.hash(data.password, 10);
    return CustomerRepository.create(data);
  }

  async registerDriver(data) {
    const existing = await DriverRepository.findByUsername(data.username) || await DriverRepository.findByEmail(data.email);
    if (existing) throw new Error(AUTH_MESSAGES.DRIVER_EXISTS);
    data.password = await bcrypt.hash(data.password, 10);
    return DriverRepository.create(data);
  }

  async registerAdmin(data) {
    const existing = await AdminRepository.findByUsername(data.username) || await AdminRepository.findByEmail(data.email);
    if (existing) throw new Error('Admin already exists.');
    data.password = await bcrypt.hash(data.password, 10);
    return AdminRepository.create(data);
  }

  async loginUser({ username, password }) {
    // Accept username or email
    const user = await CustomerRepository.findByUsername(username) || await CustomerRepository.findByEmail(username);
    if (!user) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { user, token };
  }

  async loginDriver({ username, password }) {
    // Accept username or email
    const driver = await DriverRepository.findByUsername(username) || await DriverRepository.findByEmail(username);
    if (!driver) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const valid = await bcrypt.compare(password, driver.password);
    if (!valid) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const token = jwt.sign({ id: driver._id, role: USER_ROLES.DRIVER }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { driver, token };
  }

  async loginAdmin({ username, password }) {
    const admin = await AdminRepository.findByUsername(username) || await AdminRepository.findByEmail(username);
    if (!admin) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const token = jwt.sign({ id: admin._id, role: USER_ROLES.ADMIN }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { admin, token };
  }
}

export default new AuthService();
