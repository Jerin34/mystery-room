import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    await connectDatabase();
    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`=================================================`);
      logger.info(` AI Mystery Room API Server running on port ${env.PORT}`);
      logger.info(` Environment: ${env.NODE_ENV}`);
      logger.info(` Health Check: http://localhost:${env.PORT}/health`);
      logger.info(` Base API URL: http://localhost:${env.PORT}/api/v1`);
      logger.info(`=================================================`);
    });

    const shutdown = async () => {
      logger.info('Shutting down server gracefully...');
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
