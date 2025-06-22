import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CustomerRepository from '../repository/CustomerRepository.js';
import DriverRepository from '../repository/DriverRepository.js';
import AdminRepository from '../repository/AdminRepository.js';
import { USER_ROLES, AUTH_MESSAGES, WELCOME_EMAIL_SUBJECT } from '../constants.js';
import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import sendMail from '../../../utils/mailer.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '7d';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AuthService {
  async registerCustomer(data) {
    
    const existing = await CustomerRepository.findByUsername(data.username) || await CustomerRepository.findByEmail(data.email);
    if (existing) throw new Error(AUTH_MESSAGES.CUSTOMER_EXISTS);
    data.password = await bcrypt.hash(data.password, 10);
    const customer = await CustomerRepository.create(data);

    // Send welcome email (non-blocking, but log errors)
    try {
      const templatePath = path.join(__dirname, '../templates/welcomeEmail.html');
      let html = await fs.readFile(templatePath, 'utf-8');
      html = html.replace(/{{name}}/g, customer.name || 'Valued User');
      html = html.replace(/{{role}}/g, 'Customer');
      await sendMail({
        to: customer.email,
        subject: WELCOME_EMAIL_SUBJECT,
        html
      });
    } catch (mailErr) {
      console.error('Failed to send welcome email:', mailErr);
    }

    return customer;
  }
  
  async registerDriver(data) {
    const existing = await DriverRepository.findByUsername(data.username) || await DriverRepository.findByEmail(data.email);
    if (existing) throw new Error(AUTH_MESSAGES.DRIVER_EXISTS);
    data.password = await bcrypt.hash(data.password, 10);
    const driver = await DriverRepository.create(data);

    // Send welcome email (non-blocking, but log errors)
    try {
      const templatePath = path.join(__dirname, '../templates/welcomeEmail.html');
      let html = await fs.readFile(templatePath, 'utf-8');
      html = html.replace(/{{name}}/g, driver.name || 'Valued User');
      html = html.replace(/{{role}}/g, 'Driver');
      await sendMail({
        to: driver.email,
        subject: WELCOME_EMAIL_SUBJECT,
        html
      });
    } catch (mailErr) {
      console.error('Failed to send welcome email:', mailErr);
    }

    return driver;
  }

  async registerAdmin(data) {
    const existing = await AdminRepository.findByUsername(data.username) || await AdminRepository.findByEmail(data.email);
    if (existing) throw new Error('Admin already exists.');
    data.password = await bcrypt.hash(data.password, 10);
    return AdminRepository.create(data);
  }

  async loginCustomer({ username, password }) {
    // Accept username or email
    const customer = await CustomerRepository.findByUsername(username) || await CustomerRepository.findByEmail(username);
    if (!customer) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    const token = jwt.sign({ id: customer._id, role: customer.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { customer, token };
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
