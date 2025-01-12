import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

interface CustomError extends FastifyError {
  statusCode?: number;
}

export function errorHandler(error: CustomError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  // Обработка ошибок с статус кодом
  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      success: false,
      message: error.message,
    });
  }

  // Обработка ошибок валидации Zod
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      message: 'Validation error',
      details: error.errors,
    });
  }

  // Обработка ошибок Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return reply.status(400).send({
      success: false,
      message: 'Database operation failed',
    });
  }

  // Общая обработка ошибок
  return reply.status(500).send({
    success: false,
    message: 'Something went wrong',
  });
}
