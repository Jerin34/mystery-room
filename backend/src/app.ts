import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import { requestIdMiddleware } from './middleware/requestId';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes';
import { sendError } from './utils/response';

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // allow standard client resources in dev
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS
  app.use(
    cors({
      origin: [env.CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    })
  );

  // Parsers
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Request ID
  app.use(requestIdMiddleware);

  // Health root
  app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'AI Mystery Room Backend' });
  });

  // API v1 router
  app.use('/api/v1', apiRouter);

  // Serve static frontend assets if built (for all-in-one / single-server deployments)
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path === '/health') {
        return next();
      }
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  // 404 handler (for unmatched API requests or when frontend dist is not present)
  app.use((req, res) => {
    sendError(res, 'NOT_FOUND', `Route ${req.method} ${req.path} not found.`, 404);
  });

  // Centralized Error handler
  app.use(errorHandler);

  return app;
}
