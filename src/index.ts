import fastify from 'fastify';
import cors from '@fastify/cors';
import { userRoutes } from './routes/user.routes';
import { subscriptionRoutes } from './routes/subscription.routes';

const server = fastify({
  logger: true
});

// Регистрируем CORS
server.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
});

// Регистрируем маршруты
server.register(userRoutes, { prefix: '/api/v1' });
server.register(subscriptionRoutes, { prefix: '/api/v1' });

// Запускаем сервер
const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log('Server is running on port 3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
