# AYoQSH Backend

## O'rnatish

```bash
npm install
```

## Ma'lumotlar bazasi

```bash
# Prisma client generatsiya
npm run db:generate

# Ma'lumotlar bazasini yaratish
npm run db:push

# Test ma'lumotlarni qo'shish
npm run db:seed
```

## Ishga tushirish

```bash
# Backend server
npm run dev

# Telegram bot (alohida terminal)
npm run bot
```

## Test hisoblar

| Rol | Login | Parol |
|-----|-------|-------|
| Moderator | moderator | moderator123 |
| Operator 1 | operator1 | operator123 |
| Operator 2 | operator2 | operator123 |

## Telegram Bot

1. @BotFather dan yangi bot yarating
2. `.env` fayliga `BOT_TOKEN` ni qo'shing
3. `npm run bot` bilan ishga tushiring

## API Endpoints

- `POST /api/auth/login` - Kirish
- `GET /api/auth/me` - Joriy foydalanuvchi
- `GET /api/users` - Foydalanuvchilar
- `GET /api/stations` - Shaxobchalar
- `GET /api/checks` - Cheklar
- `POST /api/checks` - Chek yaratish
- `GET /api/stats` - Statistika
- `POST /api/messages/send-all` - Xabar yuborish
