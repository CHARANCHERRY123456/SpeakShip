import express from "express";
import connectDB from  "./config/db.js";
import authRoutes from './features/auth/routes/index.js';
import deliveryRoutes from './features/delivery/routes/index.js';
import feedbackRoutes from './features/feedback/routes.js';
import cors from 'cors';
import passport from './features/auth/services/GoogleStrategy.js';
import path from 'path';
import morgan from 'morgan';


const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, 
}))
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use('/api/auth', authRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/feedback', feedbackRoutes);



export default app;
