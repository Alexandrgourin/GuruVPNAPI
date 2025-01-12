import { FastifyInstance } from 'fastify';
import { createPayment } from '../controllers/payment.controller';

export interface CreatePaymentBody {
  planId: string;
  deviceCount: number;
  amount: number;
  userId: string;
}

export async function subscriptionRoutes(fastify: FastifyInstance) {
  // Маршрут для проверки здоровья
  fastify.get('/subscriptions/health', async () => {
    return { status: 'ok' };
  });

  // Маршрут для создания платежа
  fastify.route({
    method: 'POST',
    url: '/payments',
    schema: {
      body: {
        type: 'object',
        required: ['planId', 'deviceCount', 'amount', 'userId'],
        properties: {
          planId: { type: 'string' },
          deviceCount: { type: 'number', minimum: 1 },
          amount: { type: 'number', minimum: 0 },
          userId: { type: 'string' },
        },
      },
    },
    handler: createPayment,
  });
}
