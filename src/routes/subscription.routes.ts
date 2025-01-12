import { FastifyInstance } from 'fastify';

export default async function subscriptionRoutes(fastify: FastifyInstance) {
  // Здесь будут маршруты для подписок
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });
}
