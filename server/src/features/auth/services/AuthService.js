// src/features/auth/services/AuthService.js
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
    // Helper to generate a random 6-digit OTP
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendOtpForRegistration(email, role) {
        // Check if user already exists
        let existingUser = null;
        if (role === USER_ROLES.CUSTOMER) {
            existingUser = await CustomerRepository.findByEmail(email);
        } else if (role === USER_ROLES.DRIVER) {
            existingUser = await DriverRepository.findByEmail(email);
        }
        // Admin registration is not allowed via this OTP flow

        if (existingUser) {
            throw new Error(`User with email ${email} already exists.`);
        }

        const otp = this.generateOtp();
        console.log(`[AuthService.sendOtpForRegistration] Generated OTP for ${email} (${role}): ${otp}`);

        // Save OTP to database, overwriting any existing OTP for this email
        // Delete existing OTP for this email first
        await OtpRepository.deleteByEmail(email);
        const newOtpRecord = await OtpRepository.create({ email, otp });
        console.log('[AuthService.sendOtpForRegistration] OTP record created:', newOtpRecord);

        // Send OTP email
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
            // Optionally, delete the OTP from DB if email sending fails, to prevent stale OTPs
            await OtpRepository.deleteByEmail(email);
            throw new Error('Failed to send OTP. Please try again.');
        }
    }

    async verifyOtp(email, otp, role) { // role isn't strictly needed for verification but good for context
        console.log(`[AuthService.verifyOtp] Attempting to verify OTP for email: ${email}, received OTP: ${otp}`);

        const storedOtpRecord = await OtpRepository.findByEmail(email);
        console.log('[AuthService.verifyOtp] Stored OTP record found:', storedOtpRecord);

        if (!storedOtpRecord) {
            console.warn(`[AuthService.verifyOtp] No OTP found for email: ${email}`);
            throw new Error(AUTH_MESSAGES.INVALID_OTP);
        }

        // Check for expiration explicitly (Mongoose TTL index cleans up, but explicit check helps immediate feedback)
        const now = new Date();
        const otpCreationTime = storedOtpRecord.createdAt;
        // OTP expires after 5 minutes (300 seconds) as per Otp.js schema
        const expirationTime = otpCreationTime.getTime() + (300 * 1000);

        if (now.getTime() > expirationTime) {
            console.warn(`[AuthService.verifyOtp] OTP for ${email} has expired. Created at: ${otpCreationTime.toISOString()}, Current time: ${now.toISOString()}`);
            await OtpRepository.delete(storedOtpRecord._id); // Clean up expired OTP immediately
            throw new Error(AUTH_MESSAGES.INVALID_OTP);
        }

        // Compare the OTPs
        if (storedOtpRecord.otp !== otp) {
            console.warn(`[AuthService.verifyOtp] OTP mismatch for ${email}. Stored: "${storedOtpRecord.otp}", Received: "${otp}"`);
            // Do NOT delete the OTP here, as the user might try again with the correct one.
            throw new Error(AUTH_MESSAGES.INVALID_OTP);
        }

        // OTP is valid, delete it to prevent reuse
        console.log(`[AuthService.verifyOtp] OTP matched for ${email}. Deleting record...`);
        await OtpRepository.delete(storedOtpRecord._id);

        console.log(`[AuthService.verifyOtp] OTP for ${email} verified and deleted successfully.`);
        return { message: 'OTP verified successfully.' };
    }

    async registerCustomer(data) {
        if (!data.email) {
            throw new Error('Email is required for registration.');
        }

        const existing = await CustomerRepository.findByUsername(data.username) || await CustomerRepository.findByEmail(data.email);
        if (existing) throw new Error(AUTH_MESSAGES.CUSTOMER_EXISTS);

        // This function assumes OTP has already been verified for the email by the calling controller method.
        // It's crucial that the client-side flow or a preceding server-side step ensures OTP verification.

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
        if (!data.email) {
            throw new Error('Email is required for registration.');
        }
        const existing = await DriverRepository.findByUsername(data.username) || await DriverRepository.findByEmail(data.email);
        if (existing) throw new Error(AUTH_MESSAGES.DRIVER_EXISTS);
        
        // This function assumes OTP has already been verified for the email by the calling controller method.

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