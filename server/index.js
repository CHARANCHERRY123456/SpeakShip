import express from "express";
import connectDB from  "./src/config/db.js "; 
import authRoutes from './src/features/auth/routes/index.js';
import logger from './src/middleware/logger.js';
import cors from 'cors'; // <--- ADD THIS LINE
import session from 'express-session';
import passport from './src/features/auth/services/GoogleStrategy.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

// CORS Configuration (ADD THIS BLOCK)
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from your frontend's origin
  credentials: true, // Allow cookies to be sent with requests (important for session/auth, though less so for JWTs stored client-side)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods for cross-origin requests
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
};
app.use(cors(corsOptions)); 

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set to true in production with HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use('/api/auth', authRoutes);

// Google OAuth2 routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    // On success, redirect to frontend with a token or session
    // For SPA, you may want to send a JWT or set a cookie
    res.redirect('http://localhost:5173'); // Adjust as needed
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});