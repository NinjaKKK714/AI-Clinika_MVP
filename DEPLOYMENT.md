# 🚀 Инструкция по развертыванию на GitHub

## Подготовка к загрузке

### 1. Инициализация Git репозитория

```bash
# В корневой директории проекта
git init

# Добавьте все файлы
git add .

# Сделайте первый коммит
git commit -m "Initial commit: AI-Clinika medical platform"
```

### 2. Создание репозитория на GitHub

1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите "New repository"
3. Название: `ai-clinika-medical-platform`
4. Описание: `Медицинская платформа с AI-ассистентом для пациентов и админ-панелью для управления клиниками`
5. Выберите "Public" или "Private"
6. НЕ добавляйте README, .gitignore или лицензию (они уже есть)
7. Нажмите "Create repository"

### 3. Подключение к удаленному репозиторию

```bash
# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-clinika-medical-platform.git

# Переименуйте основную ветку в main (если нужно)
git branch -M main

# Загрузите код на GitHub
git push -u origin main
```

## Структура репозитория

После загрузки ваш репозиторий будет содержать:

```
ai-clinika-medical-platform/
├── 📱 Мобильное приложение (React Native + Expo)
├── 🖥️ Админ-панель (Node.js + Express + PostgreSQL)
├── 📱 Android приложение
├── 🖼️ Ресурсы (изображения, логотипы)
├── 📄 Документация
└── ⚙️ Конфигурационные файлы
```

## Настройка для разработчиков

### Клонирование репозитория

```bash
git clone https://github.com/YOUR_USERNAME/ai-clinika-medical-platform.git
cd ai-clinika-medical-platform
```

### Настройка мобильного приложения

```bash
# Установка зависимостей
npm install --legacy-peer-deps

# Запуск приложения
npx expo start
```

### Настройка админ-панели

```bash
# Переход в директорию админ-панели
cd admin-panel

# Установка зависимостей
npm install

# Настройка базы данных
cp env.example .env
# Отредактируйте .env файл

# Создание таблиц
npm run setup-db

# Заполнение тестовыми данными
npm run seed-db

# Запуск сервера
npm start
```

## GitHub Pages (для админ-панели)

Если хотите развернуть админ-панель на GitHub Pages:

1. В настройках репозитория перейдите в "Pages"
2. Выберите источник "GitHub Actions"
3. Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy Admin Panel

on:
  push:
    branches: [ main ]
    paths: [ 'admin-panel/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: |
        cd admin-panel
        npm install
        
    - name: Build
      run: |
        cd admin-panel
        npm run build
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./admin-panel/dist
```

## Секреты и переменные окружения

### Для мобильного приложения

Создайте файл `.env` в корне проекта:

```env
# API Configuration
API_BASE_URL=https://your-api-domain.com
API_KEY=your_api_key

# Expo Configuration
EXPO_PUBLIC_APP_NAME=AI-Clinika
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Для админ-панели

Файл `admin-panel/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_clinika
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Server Configuration
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://your-domain.com
```

## CI/CD Pipeline

### GitHub Actions для автоматического тестирования

Создайте файл `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-mobile:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install --legacy-peer-deps
      
    - name: Run tests
      run: npm test
      
  test-admin:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: |
        cd admin-panel
        npm install
        
    - name: Run tests
      run: |
        cd admin-panel
        npm test
```

## Мониторинг и аналитика

### GitHub Insights

- **Insights** → **Traffic**: Статистика просмотров и клонирований
- **Insights** → **Contributors**: Участники проекта
- **Insights** → **Community**: Сообщество и стандарты

### Настройка уведомлений

1. Перейдите в настройки репозитория
2. Включите уведомления для:
   - Issues и Pull Requests
   - Security alerts
   - Dependency updates

## Безопасность

### GitHub Security

1. **Dependabot**: Автоматические обновления зависимостей
2. **Code scanning**: Анализ кода на уязвимости
3. **Secret scanning**: Поиск секретов в коде

### Настройка Dependabot

Создайте файл `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      
  - package-ecosystem: "npm"
    directory: "/admin-panel"
    schedule:
      interval: "weekly"
```

## Документация

### README.md

Основной файл документации уже обновлен и включает:
- Описание проекта
- Инструкции по установке
- Структуру проекта
- API документацию
- Устранение неполадок

### Wiki

Создайте Wiki для репозитория с дополнительной документацией:
- Архитектура системы
- API спецификация
- Руководство по разработке
- FAQ

## Лицензия

Проект защищен авторскими правами AI-Clinika. Для коммерческого использования обратитесь к владельцам проекта.

---

**Готово!** 🎉 Ваш проект успешно загружен на GitHub и готов к совместной разработке!
