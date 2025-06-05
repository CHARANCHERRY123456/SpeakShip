import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
};

export default config;
