import { app } from './app';
import { config } from './config';
import { logger } from './utils/logger';

const start = async () => {
  try {
    await app.listen({
      port: config.server.port,
      host: config.server.host
    });

    logger.info(`Server is running on http://${config.server.host}:${config.server.port}`);
  } catch (err) {
    logger.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
