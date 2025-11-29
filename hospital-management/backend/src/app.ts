import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/config';
import { authMiddleware, errorHandler, notFoundHandler, auditLogMiddleware } from './middleware';
import { logger } from './utils/logger';

const app: Express = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging Middleware
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Audit Logging Middleware
app.use(auditLogMiddleware);

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    version: '1.0.0',
    environment: config.NODE_ENV,
  });
});

// API Version
app.get('/api/version', (req: Request, res: Response) => {
  res.status(200).json({
    version: '1.0.0',
    apiVersion: config.API_VERSION,
    timestamp: new Date(),
  });
});

// Mount API routes
import apiRoutes from './routes';
app.use(`/api/${config.API_VERSION}`, apiRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
