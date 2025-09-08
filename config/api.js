// Конфигурация API ключей
export const API_KEYS = {
  OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE' // Замените на ваш реальный API ключ
};

// URL для API
export const API_URLS = {
  OPENAI: 'https://api.openai.com/v1/chat/completions',
  OPENAI_WHISPER: 'https://api.openai.com/v1/audio/transcriptions'
};

// Конфигурация для разработки
export const DEV_CONFIG = {
  API_BASE_URL: 'http://localhost:3000/api',
  DEBUG_MODE: true
};

// Конфигурация для продакшена
export const PROD_CONFIG = {
  API_BASE_URL: 'https://your-api-domain.com/api',
  DEBUG_MODE: false
};
