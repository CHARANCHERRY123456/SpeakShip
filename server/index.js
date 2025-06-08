import express from "express";
import connectDB from  "./src/config/db.js "; 
import authRoutes from './src/features/auth/routes/index.js';
import logger from './src/middleware/logger.js';
import cors from 'cors'; // <--- ADD THIS LINE
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

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});