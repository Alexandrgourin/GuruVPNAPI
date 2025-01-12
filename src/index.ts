import fastify from 'fastify';
import cors from '@fastify/cors';
import { userRoutes } from './routes/user.routes';
import { subscriptionRoutes } from './routes/subscription.routes';
import { prisma } from './lib/prisma';

const server = fastify({
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  },
});

// Настраиваем CORS
server.register(cors, {
  origin: true,
  credentials: true,
});

// Регистрируем маршруты
server.register(userRoutes, { prefix: '/api/v1' });
server.register(subscriptionRoutes, { prefix: '/api/v1' });

// Health check endpoint
server.get('/health', async (request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'ok', timestamp: new Date().toISOString() }
  } catch (error) {
    reply.status(500).send({ status: 'error', message: 'Database connection failed' })
  }
})

// Запускаем сервер
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    const host = process.env.HOST || 'localhost';
    
    await server.listen({ port, host });
    
    console.log(`[${new Date().toISOString()}] Server listening at http://${host}:${port}`);
  } catch (err) {
    console.error('[' + new Date().toISOString() + '] ERROR: Error starting server:', err);
    process.exit(1);
  }
};

start();
