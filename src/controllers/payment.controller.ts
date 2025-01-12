import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { YooCheckout } from '@a2seven/yoo-checkout';
import { config } from '../config';
import { logger } from '../utils/logger';
import { prisma } from '../lib/prisma';
import { CreatePaymentBody } from '../routes/subscription.routes';

const createPaymentSchema = z.object({
  planId: z.string(),
  deviceCount: z.number().int().positive(),
  amount: z.number().positive(),
  userId: z.string(),
});

const checkout = new YooCheckout({
  shopId: config.yookassa.shopId,
  secretKey: config.yookassa.secretKey,
});

export const createPayment = async (
  request: FastifyRequest<{
    Body: CreatePaymentBody;
  }>,
  reply: FastifyReply,
) => {
  logger.info('Received payment request:', request.body);

  try {
    const { planId, deviceCount, amount, userId } = createPaymentSchema.parse(request.body);

    logger.info('Creating payment with data:', { planId, deviceCount, amount, userId });

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      logger.error('User not found:', userId);
      return reply.status(404).send({
        error: 'User not found',
        details: 'The specified user does not exist',
      });
    }

    // Создаем платеж в YooKassa
    const yooKassaPayment = await checkout.createPayment({
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: config.yookassa.returnUrl,
      },
      description: `Подписка GuruVPN: ${planId}, ${deviceCount} устройств`,
      metadata: {
        planId,
        deviceCount,
        userId,
      },
    });

    logger.info('YooKassa payment created:', yooKassaPayment);

    // Преобразуем данные платежа в простой объект JSON
    const paymentMetadata = {
      yookassa_id: yooKassaPayment.id,
      status: yooKassaPayment.status,
      paid: yooKassaPayment.paid,
      amount_value: String(yooKassaPayment.amount.value),
      amount_currency: yooKassaPayment.amount.currency,
      confirmation_url: yooKassaPayment.confirmation.confirmation_url,
      created_at: yooKassaPayment.created_at,
      description: yooKassaPayment.description,
      plan_id: planId,
      device_count: deviceCount,
    };

    // Сохраняем платеж в базу данных
    const payment = await prisma.payment.create({
      data: {
        id: yooKassaPayment.id,
        userId,
        planId,
        deviceCount,
        amount: Number(amount),
        status: 'pending',
        yookassaPaymentId: yooKassaPayment.id,
        metadata: paymentMetadata,
      },
    });

    logger.info('Payment saved to database:', payment);

    return reply.send({
      id: payment.id,
      confirmation_url: yooKassaPayment.confirmation.confirmation_url,
    });
  } catch (error) {
    logger.error('Error creating payment:', error);
    return reply.status(400).send({
      error: 'Failed to create payment',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
