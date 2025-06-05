import express from "express";
import connectDB from  "./src/config/db.js "; 
import authRoutes from './src/features/auth/routes/index.js';
import logger from './src/middleware/logger.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});