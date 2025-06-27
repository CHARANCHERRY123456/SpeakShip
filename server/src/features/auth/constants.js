// Auth-related constants
export const USER_ROLES = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    DRIVER: 'driver',
};

export const AUTH_MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid username or password.',
    CUSTOMER_EXISTS: 'Customer already exists.',
    DRIVER_EXISTS: 'Driver already exists.',
    REGISTER_SUCCESS: 'Registration successful.',
    LOGIN_SUCCESS: 'Login successful.',
    LOGOUT_SUCCESS: 'Logout successful.',
    UNAUTHORIZED: 'Unauthorized access.',
    INVALID_OTP: 'Invalid or expired OTP.', // New message
};

export const WELCOME_EMAIL_SUBJECT = "Welcome to SpeakShip!";
// This path is not actually used in AuthService.js as it constructs the path dynamically.
// You can remove this or keep it for documentation, but it's not directly used for fs.readFile.
export const WELCOME_EMAIL_TEMPLATE_PATH =
    "./server/src/features/auth/templates/welcomeEmail.html";