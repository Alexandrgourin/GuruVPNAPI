import fastify from 'fastify';
import cors from '@fastify/cors';
import { subscriptionRoutes } from './routes/subscription.routes';
import { userRoutes } from './routes/user.routes';
import { logger } from './utils/logger';

export const createApp = async () => {
  const app = fastify({
    logger: true,
  });

  // Регистрируем CORS
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Регистрируем маршруты с префиксом /api/v1
  app.register(subscriptionRoutes, { prefix: '/api/v1' });
  app.register(userRoutes, { prefix: '/api/v1' });

  // Логируем все зарегистрированные маршруты
  app.ready(() => {
    const routes = app.printRoutes();
    logger.info('Registered routes:', { routes });
  });

  // Обработка ошибок
  app.setErrorHandler((error, request, reply) => {
    logger.error('Error handling request:', error);
    reply.status(500).send({
      error: 'Internal Server Error',
      message: error.message,
    });
  });

  // Добавляем обработчик для корневого маршрута
  app.get('/', async () => {
    return { status: 'ok' };
  });

  return app;
};
