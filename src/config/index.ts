import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']),
  port: z.number(),
  cors: z.object({
    origins: z.array(z.string()),
  }),
  database: z.object({
    url: z.string(),
  }),
  telegram: z.object({
    botToken: z.string(),
  }),
  jwt: z.object({
    secret: z.string(),
  }),
  yookassa: z.object({
    shopId: z.string(),
    secretKey: z.string(),
  }),
});

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  },
  database: {
    url: process.env.DATABASE_URL || '',
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
  },
  yookassa: {
    shopId: process.env.YOOKASSA_SHOP_ID || '',
    secretKey: process.env.YOOKASSA_SECRET_KEY || '',
  },
} as const;

const result = configSchema.safeParse(config);

if (!result.success) {
  console.error('❌ Invalid configuration', result.error.format());
  throw new Error('Invalid configuration');
}

// Проверка обязательных переменных окружения
const requiredEnvs = [
  'DATABASE_URL',
  'JWT_SECRET',
  'TELEGRAM_BOT_TOKEN',
  'YOOKASSA_SHOP_ID',
  'YOOKASSA_SECRET_KEY'
] as const;

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}

export { config };
