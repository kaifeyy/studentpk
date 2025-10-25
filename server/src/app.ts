import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';
import onboardingRoutes from './routes/onboarding.routes';
import { ApiResponse } from './utils/apiResponse';
import path from 'path';
import multer from 'multer';

const app = express();

// Middleware
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);

// Serve uploaded files in development
if (process.env.NODE_ENV === 'development') {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  return ApiResponse.notFound(res, 'Route not found');
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export { app };
