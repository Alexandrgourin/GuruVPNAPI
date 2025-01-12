# GuruVPN API

API сервер для управления подписками GuruVPN.

## Требования

- Node.js 18+
- PostgreSQL 14+
- npm или yarn

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/Alexandrgourin/GuruVPNAPI.git
cd GuruVPNAPI
```

2. Установите зависимости:
```bash
npm install
```

3. Скопируйте файл с переменными окружения:
```bash
cp .env.example .env
```

4. Отредактируйте `.env` файл, добавив необходимые значения.

5. Создайте базу данных и выполните миграции:
```bash
npm run db:migrate
```

6. Сгенерируйте Prisma Client:
```bash
npm run db:generate
```

## Разработка

Запуск сервера в режиме разработки:
```bash
npm run dev
```

## Тестирование

```bash
npm test
```

## Деплой

Приложение автоматически деплоится при пуше в ветку `main`.

## API Документация

### Подписки

#### Создание заказа
```http
POST /api/v1/subscriptions/create
```

#### Проверка статуса
```http
GET /api/v1/subscriptions/status/:id
```

#### Webhook для ЮKassa
```http
POST /api/v1/subscriptions/webhook
```

## CI/CD

- GitHub Actions используется для CI/CD
- Тесты запускаются при каждом PR
- Деплой происходит автоматически при мерже в main
