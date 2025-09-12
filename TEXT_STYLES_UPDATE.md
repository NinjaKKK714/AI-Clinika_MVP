# 🎨 Обновление стилей текста в экранах "Профиль" и "История"

## 📋 Задача
Привести стили текста в экранах "Профиль" и "История" к такому же виду, как в экране "Обращения", чтобы текст был белым в темной теме.

## 🔍 Проблема
В экранах "Профиль" и "История" использовались жестко заданные цвета вместо цветов темы:
- `color: '#333'` вместо `colors.textPrimary`
- `color: '#666'` вместо `colors.textSecondary`
- `borderTopColor: '#f0f0f0'` вместо `colors.border`

## ✅ Решение

### 🔧 Изменения в `screens/ProfileScreen.js`:

#### 1. Заголовки секций:
```javascript
// Было:
sectionTitle: {
  color: '#333',
}

// Стало:
sectionTitle: {
  color: colors.textPrimary,
}
```

#### 2. Информационные элементы:
```javascript
// Было:
infoTitle: {
  color: '#666',
}
infoValue: {
  color: '#333',
}

// Стало:
infoTitle: {
  color: colors.textSecondary,
}
infoValue: {
  color: colors.textPrimary,
}
```

### 🔧 Изменения в `screens/HistoryScreen.js`:

#### 1. Описание вкладок:
```javascript
// Было:
tabDescription: {
  color: '#666',
}

// Стало:
tabDescription: {
  color: colors.textSecondary,
}
```

#### 2. Период элементов:
```javascript
// Было:
itemPeriod: {
  color: '#333',
}

// Стало:
itemPeriod: {
  color: colors.textPrimary,
}
```

#### 3. Информационные метки и значения:
```javascript
// Было:
infoLabel: {
  color: '#666',
}
infoValue: {
  color: '#333',
}

// Стало:
infoLabel: {
  color: colors.textSecondary,
}
infoValue: {
  color: colors.textPrimary,
}
```

#### 4. Заголовки секций:
```javascript
// Было:
sectionTitle: {
  color: '#333',
}

// Стало:
sectionTitle: {
  color: colors.textPrimary,
}
```

#### 5. Границы:
```javascript
// Было:
medicationsSection: {
  borderTopColor: '#f0f0f0',
}

// Стало:
medicationsSection: {
  borderTopColor: colors.border,
}
```

## 🎯 Результат

- ✅ **Текст в экране "Профиль"** теперь использует цвета темы
- ✅ **Текст в экране "История"** теперь использует цвета темы
- ✅ **Темная тема** корректно отображает белый текст
- ✅ **Единообразие** с экраном "Обращения"
- ✅ **Адаптивность** к переключению темы

## 🌙 Визуальные изменения

### Светлая тема:
- Основной текст: темно-серый (#333)
- Вторичный текст: серый (#666)
- Границы: светло-серые

### Темная тема:
- Основной текст: белый
- Вторичный текст: светло-серый
- Границы: темно-серые

---

**Обновление завершено!** 🎉

Текст в экранах "Профиль" и "История" теперь полностью соответствует стилям экрана "Обращения" и корректно отображается в обеих темах.




