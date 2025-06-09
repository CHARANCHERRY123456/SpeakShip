import express from "express";
import connectDB from  "./src/config/db.js "; 
import authRoutes from './src/features/auth/routes/index.js';
import logger from './src/middleware/logger.js';
import cors from 'cors'; // <--- ADD THIS LINE
import passport from './src/features/auth/services/GoogleStrategy.js';
import jwt from 'jsonwebtoken';
import User from './src/features/auth/schema/User.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

// CORS Configuration (ADD THIS BLOCK)
const corsOptions = {
  origin: '*', 
  credentials: true, // Allow cookies to be sent with requests (important for session/auth, though less so for JWTs stored client-side)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods for cross-origin requests
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
};
app.use(cors(corsOptions)); 

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use('/api/auth', authRoutes);

// Google OAuth2 routes
app.get('/api/auth/google', (req, res, next) => {
  // Get role from query param (sent by frontend dropdown)
  const role = req.query.role || 'customer';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: JSON.stringify({ role })
  })(req, res, next);
});

app.get('/api/auth/google/callback', (req, res, next) => {
  // Extract role from state param
  let role = 'customer';
  if (req.query.state) {
    try {
      const state = JSON.parse(req.query.state);
      if (state.role) role = state.role;
    } catch {}
  }
  passport.authenticate('google', { failureRedirect: '/login', session: false }, async (err, user) => {
    if (err || !user) {
      // Render a page that notifies the main window of failure
      return res.send('<script>window.opener && window.opener.postMessage({ error: "OAuth failed" }, "*"); window.close();</script>');
    }
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '7d' });
    // Render a page that sends the token to the main window
    res.send(`<script>\n  window.opener && window.opener.postMessage({ token: '${token}', role: '${user.role}' }, '*');\n  window.close();\n<\/script>`);
  })(req, res, next);
});

// Add /api/auth/me endpoint to return user info from JWT
app.get('/api/auth/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});