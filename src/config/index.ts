import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3000),
  cors: z.object({
    origins: z.array(z.string()).default(['http://localhost:5173', 'http://192.168.0.75:5173']),
  }),
  database: z.object({
    url: z.string(),
  }),
  telegram: z.object({
    botToken: z.string(),
  }),
  jwt: z.object({
    secret: z.string().default('your-secret-key'),
  }),
  yookassa: z.object({
    shopId: z.string(),
    secretKey: z.string(),
    returnUrl: z.string().url(),
  }),
});

const parseConfig = () => {
  const config = {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    cors: {
      origins: process.env.CORS_ORIGINS
        ? JSON.parse(process.env.CORS_ORIGINS)
        : ['http://localhost:5173', 'http://192.168.0.75:5173'],
    },
    database: {
      url: process.env.DATABASE_URL,
    },
    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    yookassa: {
      shopId: process.env.YOOKASSA_SHOP_ID,
      secretKey: process.env.YOOKASSA_SECRET_KEY,
      returnUrl: process.env.YOOKASSA_RETURN_URL || 'https://t.me/GuruVPNBot',
    },
  };

  return configSchema.parse(config);
};

// Проверка обязательных переменных окружения
const requiredEnvs = [
  'DATABASE_URL',
  'JWT_SECRET',
  'TELEGRAM_BOT_TOKEN',
  'YOOKASSA_SHOP_ID',
  'YOOKASSA_SECRET_KEY',
] as const;

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}

export const config = parseConfig();
