# 🚀 Быстрый старт AI-Clinika Admin Panel

## ⚡ Быстрая настройка (5 минут)

### 1. Установите PostgreSQL
```bash
# Windows: скачайте с postgresql.org
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql
```

### 2. Создайте базу данных
```bash
# Подключитесь к PostgreSQL
sudo -u postgres psql

# Создайте базу данных
CREATE DATABASE ai_clinika;
\q
```

### 3. Настройте конфигурацию
```bash
# Скопируйте файл конфигурации
cp env.example .env

# Отредактируйте .env файл
# Укажите ваш пароль PostgreSQL в DB_PASSWORD
```

### 4. Установите зависимости
```bash
npm install
```

### 5. Настройте базу данных
```bash
# Создайте таблицы
npm run setup-db

# Добавьте тестовые данные
npm run seed-db
```

### 6. Запустите сервер
```bash
npm start
```

### 7. Откройте админ-панель
Перейдите по адресу: http://localhost:3000

## ✅ Готово!

Теперь у вас есть:
- ✅ Рабочая админ-панель
- ✅ База данных PostgreSQL
- ✅ API для мобильного приложения
- ✅ Тестовые данные

## 🔧 Полезные команды

```bash
# Режим разработки (с автоперезагрузкой)
npm run dev

# Проверка API
curl http://localhost:3000/api/health

# Сброс базы данных
npm run setup-db && npm run seed-db
```

## 📱 Интеграция с мобильным приложением

API готово для интеграции с мобильным приложением:
- `GET /api/clinics` - список клиник
- `GET /api/specialists` - список специалистов
- `POST /api/requests` - создание обращения

## 🆘 Если что-то не работает

1. **Ошибка подключения к БД**: проверьте пароль в `.env`
2. **Порт занят**: измените PORT в `.env`
3. **База не создана**: выполните `npm run setup-db`

---

**Нужна помощь?** Смотрите полную документацию в `README_DATABASE_SETUP.md`


