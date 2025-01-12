import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { CreateUserBody, UserResponse } from '../types/user.types';

const formatUser = (user: any): UserResponse => ({
  id: user.id,
  telegramId: user.telegramId.toString(),
  username: user.username,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

export const createUser = async (
  request: FastifyRequest<{
    Body: CreateUserBody;
  }>,
  reply: FastifyReply,
) => {
  const { telegramId, username } = request.body;

  try {
    const telegramIdBigInt = BigInt(telegramId);

    const existingUser = await prisma.user.findUnique({
      where: { telegramId: telegramIdBigInt },
    });

    if (existingUser) {
      return reply.send(formatUser(existingUser));
    }

    const user = await prisma.user.create({
      data: {
        telegramId: telegramIdBigInt,
        username: username || null,
      },
    });

    return reply.code(201).send(formatUser(user));
  } catch (error) {
    console.error('Failed to create user:', error);
    return reply.code(500).send({
      message: 'Internal server error',
    });
  }
};
