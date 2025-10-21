import express from "express";
import connectDB from  "./config/db.js";
import authRoutes from './features/auth/routes/index.js';
import deliveryRoutes from './features/delivery/routes/index.js';
import feedbackRoutes from './features/feedback/routes.js';
import profileRoutes from './features/profile/routes/index.js';
import priceRoutes from './features/delivery/routes/price.js';
import chatRoutes from './features/chat/routes/index.js';
import cors from 'cors';
import passport from './features/auth/services/GoogleStrategy.js';
import morgan from 'morgan';


const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, 
}))
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());


app.get("/", (req, res) => {
  res.send("Hello bro you are on right path!");
});

app.use('/api/auth', authRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/chat', chatRoutes);

export default app;
