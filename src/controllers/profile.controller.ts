import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { SubscriptionStatus } from '@prisma/client';

interface GetUserProfileParams {
  userId: string;
}

interface ProfileResponse {
  subscription: {
    id: string;
    status: SubscriptionStatus;
    startsAt: string;
    expiresAt: string;
    deviceCount: number;
    planId: string;
  } | null;
  payments: Array<{
    id: string;
    planId: string;
    deviceCount: number;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export const profileController = {
  async getUserProfile(
    request: FastifyRequest<{
      Params: GetUserProfileParams;
    }>,
    reply: FastifyReply
  ) {
    const { userId } = request.params;

    try {
      // Получаем пользователя
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return reply.code(404).send({
          message: 'User not found'
        });
      }

      // Получаем активную подписку
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: user.telegramId,
          status: SubscriptionStatus.ACTIVE,
          expiresAt: {
            gt: new Date()
          }
        },
        include: {
          order: true,
          devices: true
        },
        orderBy: {
          expiresAt: 'desc'
        }
      });

      // Получаем историю платежей
      const payments = await prisma.payment.findMany({
        where: {
          userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Форматируем ответ
      const response: ProfileResponse = {
        subscription: subscription ? {
          id: subscription.id,
          status: subscription.status,
          startsAt: subscription.startsAt.toISOString(),
          expiresAt: subscription.expiresAt.toISOString(),
          deviceCount: subscription.devices.length,
          planId: subscription.order.planId
        } : null,
        payments: payments.map(payment => ({
          id: payment.id,
          planId: payment.planId,
          deviceCount: payment.deviceCount,
          amount: Number(payment.amount),
          status: payment.status,
          createdAt: payment.createdAt.toISOString()
        }))
      };

      return reply.send(response);
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return reply.code(500).send({
        message: 'Internal server error'
      });
    }
  }
};
