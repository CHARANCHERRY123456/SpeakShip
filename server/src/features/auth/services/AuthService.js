import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CustomerRepository from '../repository/CustomerRepository.js';
import DriverRepository from '../repository/DriverRepository.js';
import AdminRepository from '../repository/AdminRepository.js';
import OtpRepository from '../repository/OtpRepository.js'; // Import OtpRepository
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
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendOtpForRegistration(email, role) {
        let existingUser = null;
        if (role === USER_ROLES.CUSTOMER) {
            existingUser = await CustomerRepository.findByEmail(email);
        } else if (role === USER_ROLES.DRIVER) {
            existingUser = await DriverRepository.findByEmail(email);
        }
        if (existingUser) {
            throw new Error(`User with email ${email} already exists.`);
        }

        const otp = this.generateOtp();

        await OtpRepository.deleteByEmail(email);
        await OtpRepository.create({ email, otp });

        try {
            const templatePath = path.join(__dirname, '../templates/otpEmail.html');
            let html = await fs.readFile(templatePath, 'utf-8');
            html = html.replace(/{{otp}}/g, otp);
            html = html.replace(/{{role}}/g, role.charAt(0).toUpperCase() + role.slice(1)); // Capitalize role

            await sendMail({
                to: email,
                subject: 'Your SpeakShip OTP for Registration',
                html
            });
            return { message: 'OTP sent successfully to your email.' };
        } catch (mailErr) {
            console.error('Failed to send OTP email:', mailErr);
            await OtpRepository.deleteByEmail(email);
            throw new Error('Failed to send OTP. Please try again.');
        }
    }

    async verifyOtp(email, otp, role) {
        const storedOtpRecord = await OtpRepository.findByEmail(email);
        if (!storedOtpRecord) {
            console.warn(`[AuthService.verifyOtp] No OTP found for email: ${email}`);
            throw new Error(AUTH_MESSAGES.INVALID_OTP);
        }

        const now = new Date();
        const otpCreationTime = storedOtpRecord.createdAt;
        const expirationTime = otpCreationTime.getTime() + (300 * 1000);

        if (now.getTime() > expirationTime) {
            console.warn(`[AuthService.verifyOtp] OTP for ${email} has expired. Created at: ${otpCreationTime.toISOString()}, Current time: ${now.toISOString()}`);
            await OtpRepository.delete(storedOtpRecord._id);
            throw new Error(AUTH_MESSAGES.INVALID_OTP);
        }

        if (storedOtpRecord.otp !== otp) {
            console.warn(`[AuthService.verifyOtp] OTP mismatch for ${email}. Stored: "${storedOtpRecord.otp}", Received: "${otp}"`);
            throw new Error(AUTH_MESSAGES.INVALID_OTP);
        }

        await OtpRepository.delete(storedOtpRecord._id);

        return { message: 'OTP verified successfully.' };
    }

    async registerCustomer(data) {
        if (!data.email) {
            throw new Error('Email is required for registration.');
        }

        const existing = await CustomerRepository.findByUsername(data.username) || await CustomerRepository.findByEmail(data.email);
        if (existing) throw new Error(AUTH_MESSAGES.CUSTOMER_EXISTS);

        data.password = await bcrypt.hash(data.password, 10);
        const customer = await CustomerRepository.create(data);

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
        if (!data.email) {
            throw new Error('Email is required for registration.');
        }
        const existing = await DriverRepository.findByUsername(data.username) || await DriverRepository.findByEmail(data.email);
        if (existing) throw new Error(AUTH_MESSAGES.DRIVER_EXISTS);
        
        data.password = await bcrypt.hash(data.password, 10);
        const driver = await DriverRepository.create(data);

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
        const customer = await CustomerRepository.findByUsername(username) || await CustomerRepository.findByEmail(username);
        if (!customer) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
        const valid = await bcrypt.compare(password, customer.password);
        if (!valid) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
        const token = jwt.sign({ id: customer._id, role: customer.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return { customer, token };
    }

    async loginDriver({ username, password }) {
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