import app from './app';
import config from './config/config';
import { logger } from './utils/logger';

const startServer = (): void => {
  const port = config.PORT;

  app.listen(port, () => {
    logger.info(`🏥 Hospital Management System API started`);
    logger.info(`Environment: ${config.NODE_ENV}`);
    logger.info(`Server running on http://localhost:${port}`);
    logger.info(`API Version: v${config.API_VERSION}`);
    logger.info(`Health check: http://localhost:${port}/health`);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Rejection', { reason: String(reason) });
    process.exit(1);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', { error: error.message });
    process.exit(1);
  });
};

startServer();
