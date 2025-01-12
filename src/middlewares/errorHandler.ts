import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  logger.error({
    err: error,
    req: {
      method: request.method,
      url: request.url,
      body: request.body,
      query: request.query,
    },
  });

  if (error instanceof AppError) {
    return reply
      .status(error.statusCode)
      .send({ 
        error: error.name,
        message: error.message 
      });
  }

  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ 
        error: 'ValidationError',
        message: 'Invalid request data',
        details: error.errors 
      });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    return reply
      .status(400)
      .send({
        error: 'DatabaseError',
        message: 'Database operation failed'
      });
  }

  // Для неизвестных ошибок
  return reply
    .status(500)
    .send({ 
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
};
