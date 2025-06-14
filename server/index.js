import app from './src/app.js';
import { googleAuth, googleCallback, getMe } from './src/features/auth/controllers/AuthController.js';
// import 

const PORT = process.env.PORT || 3000;

// Google OAuth2 routes
app.get('/api/auth/google', googleAuth);
app.get('/api/auth/google/callback', googleCallback);
app.get('/api/auth/me', getMe);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});