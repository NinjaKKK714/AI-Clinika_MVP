# 📝 Обновление названия проекта

## ✅ Выполненные изменения

### **README.md:**
- ✅ Исправлено: `AI Clinic` → `AI-Clinika` в описании дизайна
- ✅ Исправлено: `cd "AI Clinic"` → `cd "AI-Clinika"` в инструкциях
- ✅ Исправлено: `AI Clinic/` → `AI-Clinika/` в структуре проекта

### **package.json:**
- ✅ Обновлено: `"name": "mobile-app"` → `"name": "ai-clinika-mobile-app"`

### **Проверенные файлы (уже корректные):**
- ✅ `app.json` - уже содержит правильное название "AI-Clinika"
- ✅ `admin-panel/package.json` - уже содержит "ai-clinika-admin-panel"
- ✅ `MIS_INTEGRATION_ANALYSIS.md` - не содержит упоминаний "AI Clinic"

## 🎯 Результат

Теперь во всех файлах проекта используется единообразное название **"AI-Clinika"** вместо "AI Clinic".

### **Структура проекта на GitHub:**
```
AI-Clinika/
├── 📱 Мобильное приложение
│   ├── screens/              # Экраны приложения
│   │   ├── SplashScreen.js       # Загрузочный экран
│   │   ├── AuthScreen.js         # Аутентификация
│   │   ├── HomeScreen.js         # Главный экран с AI-ассистентом
│   │   ├── ClinicsScreen.js      # Список клиник
│   │   ├── ClinicDetailScreen.js # Детали клиники
│   │   ├── SpecialistDetailScreen.js # Детали специалиста
│   │   ├── RequestsScreen.js     # Обращения к врачам
│   │   ├── RequestDetailScreen.js # Детали обращения
│   │   ├── AnalysesScreen.js     # Медицинские анализы
│   │   ├── AnalysisDetailScreen.js # Детали анализа
│   │   ├── HistoryScreen.js      # История обращений
│   │   ├── ProfileScreen.js      # Профиль пользователя
│   │   ├── CheckupDetailScreen.js # Детали чекапа
│   │   ├── ExpensesScreen.js     # Отслеживание расходов
│   │   └── SettingsScreen.js     # Настройки
│   ├── components/           # Переиспользуемые компоненты
│   │   └── LocalIcons.js         # Локальные иконки
│   ├── services/            # Сервисы (хранилище, API)
│   │   └── storageService.js     # Локальное хранилище
│   ├── themes/              # Система тем
│   │   ├── colors.js            # Цветовые схемы
│   │   ├── ThemeContext.js      # Контекст темы
│   │   └── useTheme.js          # Хук для работы с темой
│   ├── config/              # Конфигурация
│   │   └── api.js               # API ключи и URL
│   ├── App.js              # Главный компонент
│   ├── app.json            # Конфигурация Expo
│   └── package.json        # Зависимости
│
├── 🖥️ Админ-панель
│   ├── server/             # Серверная часть
│   │   └── app.js              # Express сервер
│   ├── src/                # Клиентская часть
│   │   ├── js/                 # JavaScript файлы
│   │   └── styles/             # CSS стили
│   ├── sql/                # SQL скрипты
│   │   ├── 01_create_tables.sql # Создание таблиц
│   │   └── 02_sample_data.sql   # Тестовые данные
│   ├── scripts/            # Скрипты
│   │   ├── setup-database.js    # Настройка БД
│   │   └── seed-database.js     # Заполнение данными
│   ├── config/             # Конфигурация
│   │   └── database.js          # Настройки БД
│   ├── package.json        # Зависимости
│   └── README_DATABASE_SETUP.md # Документация БД
│
└── 📄 Документация
    ├── README.md                    # Основная документация
    ├── API_SETUP.md                 # Настройка API
    ├── DEPLOYMENT.md                # Развертывание
    ├── MIS_INTEGRATION_ANALYSIS.md  # Анализ интеграции с МИС
    └── PROJECT_NAME_UPDATE.md       # Этот файл
```

---

**Обновление завершено!** 🎉

Теперь проект имеет единообразное название **"AI-Clinika"** во всех файлах и документации.
