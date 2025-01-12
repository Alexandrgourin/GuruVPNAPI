import fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';
import subscriptionRoutes from './routes/subscription.routes';

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Регистрируем плагины
app.register(cors, {
  origin: config.cors.origins,
  credentials: true
});

// Регистрируем маршруты
app.register(subscriptionRoutes, { prefix: '/api/v1/subscriptions' });

// Обработка ошибок
app.setErrorHandler(function (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  return errorHandler(error, request, reply);
});

export { app };
