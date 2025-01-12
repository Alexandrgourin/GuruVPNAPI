import fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';
import { subscriptionRoutes } from './routes/subscription.routes';

const app = fastify({
  logger
});

// Регистрируем плагины
app.register(cors, {
  origin: config.cors.origins,
  credentials: true
});

// Регистрируем маршруты
app.register(subscriptionRoutes, { prefix: '/api/v1/subscriptions' });

// Обработка ошибок
app.setErrorHandler(errorHandler);

export { app };
