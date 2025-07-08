//server/index.js
import http from 'http';
import app from './src/app.js';
import { googleAuth, googleCallback, getMe } from './src/features/auth/controllers/AuthController.js';
import setupSocket from './src/sockets/index.js'; 

const PORT = process.env.PORT || 3000;

// Define routes before starting the server
app.get('/api/auth/google', googleAuth);
app.get('/api/auth/google/callback', googleCallback);
app.get('/api/auth/me', getMe);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO (handled inside setupSocket)
setupSocket(server);

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
