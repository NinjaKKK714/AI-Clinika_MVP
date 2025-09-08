# 🔑 Настройка API ключей

## OpenAI API

### Получение API ключа

1. Перейдите на [OpenAI Platform](https://platform.openai.com/)
2. Войдите в свой аккаунт или создайте новый
3. Перейдите в раздел "API Keys"
4. Нажмите "Create new secret key"
5. Скопируйте сгенерированный ключ

### Настройка в проекте

1. Откройте файл `config/api.js`
2. Замените `YOUR_OPENAI_API_KEY_HERE` на ваш реальный API ключ:

```javascript
export const API_KEYS = {
  OPENAI_API_KEY: 'sk-proj-your-actual-api-key-here'
};
```

### Переменные окружения (рекомендуется)

Для большей безопасности используйте переменные окружения:

1. Создайте файл `.env` в корне проекта:

```env
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
API_BASE_URL=http://localhost:3000/api
```

2. Обновите `config/api.js`:

```javascript
export const API_KEYS = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE'
};
```

## Другие API сервисы

### Google Maps API (для карт)

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите "Maps JavaScript API"
4. Создайте API ключ в разделе "Credentials"

### Firebase (для push-уведомлений)

1. Перейдите в [Firebase Console](https://console.firebase.google.com/)
2. Создайте новый проект
3. Добавьте Android/iOS приложение
4. Скачайте конфигурационные файлы

## Безопасность

### ⚠️ Важные правила:

1. **НЕ коммитьте** реальные API ключи в Git
2. Используйте `.env` файлы для локальной разработки
3. Добавьте `.env` в `.gitignore`
4. Используйте переменные окружения на продакшене
5. Регулярно ротируйте API ключи

### Пример .gitignore

```gitignore
# Environment variables
.env
.env.local
.env.production
.env.staging

# API keys
config/api-keys.js
secrets/
```

## Проверка настройки

### Тест OpenAI API

```javascript
import { API_KEYS, API_URLS } from './config/api.js';

const testOpenAI = async () => {
  try {
    const response = await fetch(API_URLS.OPENAI, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello!' }]
      })
    });
    
    if (response.ok) {
      console.log('✅ OpenAI API работает!');
    } else {
      console.log('❌ Ошибка API:', response.status);
    }
  } catch (error) {
    console.log('❌ Ошибка подключения:', error.message);
  }
};

testOpenAI();
```

## Поддержка

Если у вас возникли проблемы с настройкой API:

1. Проверьте правильность API ключа
2. Убедитесь, что у вас есть доступ к сервису
3. Проверьте лимиты использования
4. Обратитесь к документации сервиса

---

**Готово!** 🎉 Ваши API ключи настроены и готовы к использованию!
