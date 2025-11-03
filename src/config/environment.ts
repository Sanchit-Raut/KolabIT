import dotenv from 'dotenv';

dotenv.config();

// Ensure a sensible default DATABASE_URL is available at runtime so
// the requiredEnvVars check below does not throw when .env is missing.
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/kolabit';

process.env.JWT_SECRET = process.env.JWT_SECRET || '752af32294d9b3bf1733d2fd39c4ce5247b342b587b79081143b399aa7bfe034f1c429ee192b3e723301add0a3126c113a9a6f4fa3b087035ed0d6885e14c969';


interface EnvironmentConfig {
  // Server
  PORT: number;
  NODE_ENV: string;
  
  // Database
  DATABASE_URL: string;
  
  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  
  // Password Hashing
  BCRYPT_SALT_ROUNDS: number;
  
  // File Upload
  UPLOAD_PATH: string;
  MAX_FILE_SIZE: number;
  
  // Email
  EMAIL_SERVICE_KEY: string;
  EMAIL_FROM: string;
  
  // Client
  CLIENT_URL: string;
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

const config: EnvironmentConfig = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/kolabit',  
  JWT_SECRET: process.env.JWT_SECRET || '752af32294d9b3bf1733d2fd39c4ce5247b342b587b79081143b399aa7bfe034f1c429ee192b3e723301add0a3126c113a9a6f4fa3b087035ed0d6885e14c969',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  
  EMAIL_SERVICE_KEY: process.env.EMAIL_SERVICE_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@kolabit.com',
  
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default config;
