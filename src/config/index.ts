import 'dotenv/config';

export const config = {
  env: process.env.NODE_ENV || 'development',
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost'
  },
  database: {
    url: process.env.DATABASE_URL
  },
  cors: {
    origins: ['http://localhost:5173'] // Добавьте другие origins при необходимости
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key'
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN
  },
  yookassa: {
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY
  }
} as const;

// Проверка обязательных переменных окружения
const requiredEnvs = [
  'DATABASE_URL',
  'JWT_SECRET',
  'TELEGRAM_BOT_TOKEN',
  'YOOKASSA_SHOP_ID',
  'YOOKASSA_SECRET_KEY'
];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}
