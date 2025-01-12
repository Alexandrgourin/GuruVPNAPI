import { createApp } from './app';

// Запускаем сервер
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    const server = await createApp();

    await server.listen({
      port,
      host: '0.0.0.0', // Слушаем на всех интерфейсах
    });

    console.log(`[${new Date().toISOString()}] Server listening at http://0.0.0.0:${port}`);
  } catch (err) {
    console.error('[' + new Date().toISOString() + '] ERROR: Error starting server:', err);
    process.exit(1);
  }
};

start();
