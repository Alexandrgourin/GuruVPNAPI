import { FastifyInstance } from 'fastify';
import { createUser } from '../controllers/user.controller';
import { profileController } from '../controllers/profile.controller';

export async function userRoutes(fastify: FastifyInstance) {
  // Маршрут для инициализации пользователя
  fastify.post('/users/init', {
    schema: {
      body: {
        type: 'object',
        required: ['telegramId'],
        properties: {
          telegramId: { type: 'string' },
          username: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            telegramId: { type: 'string' },
            username: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            telegramId: { type: 'string' },
            username: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    handler: createUser
  });

  // Маршрут для получения профиля пользователя
  fastify.get('/users/:userId/profile', {
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            subscription: {
              type: ['object', 'null'],
              properties: {
                id: { type: 'string' },
                planId: { type: 'string' },
                deviceCount: { type: 'integer' },
                status: { type: 'string', enum: ['ACTIVE', 'EXPIRED', 'PENDING'] },
                startDate: { type: 'string', format: 'date-time' },
                endDate: { type: 'string', format: 'date-time' }
              }
            },
            payments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  planId: { type: 'string' },
                  deviceCount: { type: 'integer' },
                  amount: { type: 'number' },
                  status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'CANCELLED'] },
                  createdAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
      }
    },
    handler: profileController.getUserProfile
  });
}
