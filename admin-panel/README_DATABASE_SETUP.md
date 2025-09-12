# AI-Clinika Admin Panel - Настройка PostgreSQL

Полная инструкция по настройке админ-панели с базой данных PostgreSQL.

## 📋 Содержание

1. [Требования](#требования)
2. [Установка PostgreSQL](#установка-postgresql)
3. [Настройка базы данных](#настройка-базы-данных)
4. [Установка зависимостей](#установка-зависимостей)
5. [Запуск сервера](#запуск-сервера)
6. [Использование](#использование)
7. [API Endpoints](#api-endpoints)
8. [Структура базы данных](#структура-базы-данных)

## 🔧 Требования

- **Node.js** 16.0.0 или выше
- **PostgreSQL** 12.0 или выше
- **npm** 8.0.0 или выше

## 🐘 Установка PostgreSQL

### Windows
1. Скачайте PostgreSQL с [официального сайта](https://www.postgresql.org/download/windows/)
2. Запустите установщик и следуйте инструкциям
3. Запомните пароль для пользователя `postgres`

### macOS
```bash
# Через Homebrew
brew install postgresql
brew services start postgresql

# Или скачайте с официального сайта
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 🗄️ Настройка базы данных

### 1. Создание пользователя и базы данных

```bash
# Подключитесь к PostgreSQL как суперпользователь
sudo -u postgres psql

# Создайте пользователя (опционально)
CREATE USER ai_clinika_user WITH PASSWORD 'your_secure_password';

# Создайте базу данных
CREATE DATABASE ai_clinika OWNER ai_clinika_user;

# Предоставьте права
GRANT ALL PRIVILEGES ON DATABASE ai_clinika TO ai_clinika_user;

# Выйдите из psql
\q
```

### 2. Настройка переменных окружения

Скопируйте файл с примером конфигурации:
```bash
cp env.example .env
```

Отредактируйте файл `.env`:
```env
# Конфигурация базы данных PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_clinika
DB_USER=postgres
DB_PASSWORD=your_password

# Настройки сервера
PORT=3000
NODE_ENV=development
```

## 📦 Установка зависимостей

```bash
# Установите зависимости Node.js
npm install

# Или используйте yarn
yarn install
```

## 🚀 Запуск сервера

### 1. Настройка базы данных (первый запуск)

```bash
# Создание таблиц
npm run setup-db

# Заполнение тестовыми данными
npm run seed-db
```

### 2. Запуск сервера

```bash
# Режим разработки (с автоперезагрузкой)
npm run dev

# Или обычный запуск
npm start
```

Сервер будет доступен по адресу: `http://localhost:3000`

## 🎯 Использование

### Веб-интерфейс
1. Откройте браузер и перейдите по адресу `http://localhost:3000`
2. Используйте админ-панель для управления данными

### API
API доступно по адресу `http://localhost:3000/api`

Проверка работоспособности:
```bash
curl http://localhost:3000/api/health
```

## 📡 API Endpoints

### Общие
- `GET /api/health` - Проверка состояния сервера
- `GET /api/stats` - Статистика системы

### Клиники
- `GET /api/clinics` - Список всех клиник
- `GET /api/clinics/:id` - Получить клинику по ID
- `POST /api/clinics` - Создать новую клинику
- `PUT /api/clinics/:id` - Обновить клинику
- `DELETE /api/clinics/:id` - Удалить клинику

### Специалисты
- `GET /api/specialists` - Список всех специалистов
- `GET /api/specialists/:id` - Получить специалиста по ID
- `POST /api/specialists` - Создать нового специалиста
- `PUT /api/specialists/:id` - Обновить специалиста
- `DELETE /api/specialists/:id` - Удалить специалиста

### Обращения
- `GET /api/requests` - Список всех обращений

### Анализы
- `GET /api/analyses` - Список всех анализов

### Пользователи
- `GET /api/users` - Список всех пользователей

## 🗃️ Структура базы данных

### Основные таблицы:

#### `clinics` - Клиники
- `id` (UUID) - Уникальный идентификатор
- `name` (VARCHAR) - Название клиники
- `address` (TEXT) - Адрес
- `phone` (VARCHAR) - Телефон
- `email` (VARCHAR) - Email
- `website` (VARCHAR) - Веб-сайт
- `description` (TEXT) - Описание
- `latitude/longitude` (DECIMAL) - Координаты
- `working_hours` (JSONB) - Часы работы
- `services` (JSONB) - Услуги
- `rating` (DECIMAL) - Рейтинг
- `image_url` (VARCHAR) - URL изображения
- `is_active` (BOOLEAN) - Активность
- `created_at/updated_at` (TIMESTAMP) - Временные метки

#### `specialists` - Специалисты
- `id` (UUID) - Уникальный идентификатор
- `clinic_id` (UUID) - Ссылка на клинику
- `first_name/last_name/middle_name` (VARCHAR) - ФИО
- `specialization` (VARCHAR) - Специализация
- `experience_years` (INTEGER) - Опыт работы
- `education` (TEXT) - Образование
- `phone/email` (VARCHAR) - Контакты
- `bio` (TEXT) - Биография
- `services` (JSONB) - Услуги
- `working_hours` (JSONB) - Часы работы
- `price_per_hour` (DECIMAL) - Цена за час
- `rating` (DECIMAL) - Рейтинг
- `image_url` (VARCHAR) - URL изображения
- `is_active` (BOOLEAN) - Активность
- `created_at/updated_at` (TIMESTAMP) - Временные метки

#### `users` - Пользователи
- `id` (UUID) - Уникальный идентификатор
- `phone` (VARCHAR) - Телефон (уникальный)
- `email` (VARCHAR) - Email (уникальный)
- `first_name/last_name/middle_name` (VARCHAR) - ФИО
- `birth_date` (DATE) - Дата рождения
- `gender` (VARCHAR) - Пол
- `avatar_url` (VARCHAR) - URL аватара
- `is_verified` (BOOLEAN) - Верификация
- `created_at/updated_at` (TIMESTAMP) - Временные метки

#### `requests` - Обращения
- `id` (UUID) - Уникальный идентификатор
- `user_id` (UUID) - Ссылка на пользователя
- `specialist_id` (UUID) - Ссылка на специалиста
- `clinic_id` (UUID) - Ссылка на клинику
- `request_type` (VARCHAR) - Тип обращения
- `title` (VARCHAR) - Заголовок
- `description` (TEXT) - Описание
- `status` (VARCHAR) - Статус
- `priority` (VARCHAR) - Приоритет
- `scheduled_date` (TIMESTAMP) - Запланированная дата
- `response_text` (TEXT) - Ответ
- `response_date` (TIMESTAMP) - Дата ответа
- `created_at/updated_at` (TIMESTAMP) - Временные метки

#### `analyses` - Анализы
- `id` (UUID) - Уникальный идентификатор
- `user_id` (UUID) - Ссылка на пользователя
- `clinic_id` (UUID) - Ссылка на клинику
- `specialist_id` (UUID) - Ссылка на специалиста
- `name` (VARCHAR) - Название анализа
- `type` (VARCHAR) - Тип анализа
- `description` (TEXT) - Описание
- `results` (TEXT) - Результаты
- `file_url` (VARCHAR) - URL файла
- `status` (VARCHAR) - Статус
- `test_date` (DATE) - Дата анализа
- `result_date` (DATE) - Дата результата
- `created_at/updated_at` (TIMESTAMP) - Временные метки

## 🔧 Полезные команды

### Управление базой данных
```bash
# Подключение к базе данных
psql -h localhost -U postgres -d ai_clinika

# Создание резервной копии
pg_dump -h localhost -U postgres ai_clinika > backup.sql

# Восстановление из резервной копии
psql -h localhost -U postgres ai_clinika < backup.sql
```

### Разработка
```bash
# Запуск в режиме разработки
npm run dev

# Запуск тестов
npm test

# Проверка состояния базы данных
npm run setup-db
```

## 🚨 Устранение неполадок

### Ошибка подключения к базе данных
1. Проверьте, что PostgreSQL запущен
2. Убедитесь в правильности настроек в `.env`
3. Проверьте права доступа пользователя

### Ошибка "database does not exist"
```bash
# Создайте базу данных вручную
createdb -h localhost -U postgres ai_clinika
```

### Ошибка "permission denied"
```bash
# Предоставьте права пользователю
psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ai_clinika TO your_user;"
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи сервера
2. Убедитесь в правильности конфигурации
3. Проверьте состояние базы данных

## 🔄 Миграции

Для обновления структуры базы данных:
1. Создайте новый SQL файл в папке `sql/`
2. Выполните его в базе данных
3. Обновите код при необходимости

---

**Готово!** Ваша админ-панель готова к работе с PostgreSQL! 🎉


