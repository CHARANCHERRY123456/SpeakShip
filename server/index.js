import app from './src/app.js';
import passport from './src/features/auth/services/GoogleStrategy.js';
import jwt from 'jsonwebtoken';
import Customer from './src/features/auth/schema/Customer.js';
import Driver from './src/features/auth/schema/Driver.js';
import Admin from './src/features/auth/schema/Admin.js';
import { googleAuth, googleCallback, getMe } from './src/features/auth/controllers/AuthController.js';

const PORT = process.env.PORT || 3000;

// Google OAuth2 routes
app.get('/api/auth/google', googleAuth);
app.get('/api/auth/google/callback', googleCallback);
app.get('/api/auth/me', getMe);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});