import React from 'react';
import { Ionicons, MaterialIcons, FontAwesome5, AntDesign, Feather } from '@expo/vector-icons';

export const LocalIcons = {
  // Основные иконки
  home: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="home-outline" size={size} color={color} />
  ),

  search: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="search-outline" size={size} color={color} />
  ),

  analytics: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="bar-chart-outline" size={size} color={color} />
  ),

  settings: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="settings-outline" size={size} color={color} />
  ),

  // Голосовые иконки
  mic: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="mic-outline" size={size} color={color} />
  ),

  stop: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="stop-circle-outline" size={size} color={color} />
  ),

  // Телефон
  call: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="call-outline" size={size} color={color} />
  ),

  // Документы
  'document-text': ({ size = 24, color = '#000000' }) => (
    <Ionicons name="document-text-outline" size={size} color={color} />
  ),

  // Изображения
  image: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="image-outline" size={size} color={color} />
  ),

  // Тренды
  'trending-up': ({ size = 24, color = '#000000' }) => (
    <Ionicons name="trending-up-outline" size={size} color={color} />
  ),

  // Статистика
  'stats-chart': ({ size = 24, color = '#000000' }) => (
    <Ionicons name="stats-chart-outline" size={size} color={color} />
  ),

  // Сетка
  grid: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="grid-outline" size={size} color={color} />
  ),

  // Время
  time: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="time-outline" size={size} color={color} />
  ),

  // Стрелки
  'chevron-forward': ({ size = 24, color = '#000000' }) => (
    <Ionicons name="chevron-forward-outline" size={size} color={color} />
  ),
  'chevron': ({ size = 24, color = '#000000' }) => (
    <Ionicons name="chevron-down-outline" size={size} color={color} />
  ),

  // Приложения
  apps: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="apps-outline" size={size} color={color} />
  ),

  // Глаз
  eye: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="eye-outline" size={size} color={color} />
  ),

  // Сердце
  heart: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="heart-outline" size={size} color={color} />
  ),

  // Слои
  layers: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="layers-outline" size={size} color={color} />
  ),

  // Уведомления
  notifications: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="notifications-outline" size={size} color={color} />
  ),

  // Звук
  'volume-high': ({ size = 24, color = '#000000' }) => (
    <Ionicons name="volume-high-outline" size={size} color={color} />
  ),

  // Видео
  play: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="play-circle-outline" size={size} color={color} />
  ),

  // Луна
  moon: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="moon-outline" size={size} color={color} />
  ),

  // Молния
  flash: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="flash-outline" size={size} color={color} />
  ),

  // Обновить
  refresh: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="refresh-outline" size={size} color={color} />
  ),

  // Скачать
  download: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="download-outline" size={size} color={color} />
  ),

  // Загрузить
  upload: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="cloud-upload-outline" size={size} color={color} />
  ),

  // Информация
  'information-circle': ({ size = 24, color = '#000000' }) => (
    <Ionicons name="information-circle-outline" size={size} color={color} />
  ),

  // Пользователь
  'person-add': ({ size = 24, color = '#000000' }) => (
    <Ionicons name="person-add-outline" size={size} color={color} />
  ),

  // Вход
  'log-in': ({ size = 24, color = '#000000' }) => (
    <Ionicons name="log-in-outline" size={size} color={color} />
  ),

  // Галочка
  checkmark: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="checkmark-outline" size={size} color={color} />
  ),

  // Закрыть
  close: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="close-outline" size={size} color={color} />
  ),

  // Галочка в круге
  'checkmark-circle': ({ size = 24, color = '#000000' }) => (
    <Ionicons name="checkmark-circle-outline" size={size} color={color} />
  ),

  // Дополнительные иконки, которые могут использоваться
  brain: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="medical-outline" size={size} color={color} />
  ),

  // Аналитика (альтернативные названия)
  chart: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="bar-chart-outline" size={size} color={color} />
  ),

  // Документ (альтернативные названия)
  document: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="document-text-outline" size={size} color={color} />
  ),

  // Пользователь (альтернативные названия)
  user: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="person-outline" size={size} color={color} />
  ),

  // Стрелка (альтернативные названия)
  arrow: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="chevron-forward-outline" size={size} color={color} />
  ),

  // Звезда (может использоваться)
  star: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="star-outline" size={size} color={color} />
  ),

  // Плюс (может использоваться)
  plus: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="add-outline" size={size} color={color} />
  ),

  // Минус (может использоваться)
  minus: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="remove-outline" size={size} color={color} />
  ),

  // Настройки (альтернативные названия)
  gear: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="settings-outline" size={size} color={color} />
  ),

  // Дом (альтернативные названия)
  house: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="home-outline" size={size} color={color} />
  ),

  // Дополнительные иконки для профиля
  edit: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="create-outline" size={size} color={color} />
  ),

  mail: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="mail-outline" size={size} color={color} />
  ),

  logout: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="log-out-outline" size={size} color={color} />
  ),

  // Иконки для клиник
  location: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="location-outline" size={size} color={color} />
  ),

  arrow: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="arrow-back-outline" size={size} color={color} />
  ),

  medical: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="medical-outline" size={size} color={color} />
  ),

  close: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="close-outline" size={size} color={color} />
  ),

  heart: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="heart-outline" size={size} color={color} />
  ),

  call: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="call-outline" size={size} color={color} />
  ),

  checkmark: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="checkmark-outline" size={size} color={color} />
  ),

  medicalCross: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="medical" size={size} color={color} />
  ),

  camera: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="camera-outline" size={size} color={color} />
  ),

  image: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="image-outline" size={size} color={color} />
  ),

  plus: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="add-outline" size={size} color={color} />
  ),

  analytics: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="analytics-outline" size={size} color={color} />
  ),

  eye: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="eye-outline" size={size} color={color} />
  ),

  attach: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="attach" size={size} color={color} />
  ),

  // Иконки для статистики
  chat: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="chatbubble-outline" size={size} color={color} />
  ),

  help: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="help-circle-outline" size={size} color={color} />
  ),

  arrowBack: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="arrow-back-outline" size={size} color={color} />
  ),

  // Иконка отправки (самолетик)
  send: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="paper-plane" size={size} color={color} />
  ),

  // Иконки для специалистов
  school: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="school-outline" size={size} color={color} />
  ),

  language: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="language-outline" size={size} color={color} />
  ),

  // Календарь
  calendar: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="calendar-outline" size={size} color={color} />
  ),

  // Видео
  video: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="videocam-outline" size={size} color={color} />
  ),

  // Bluetooth
  bluetooth: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="bluetooth-outline" size={size} color={color} />
  ),

  // WiFi
  wifi: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="wifi-outline" size={size} color={color} />
  ),

  // Поделиться
  share: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="share-outline" size={size} color={color} />
  ),

  // AI иконка
  ai: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="hardware-chip-outline" size={size} color={color} />
  ),

  // Робот
  robot: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="construct-outline" size={size} color={color} />
  ),

  // Часы
  clock: ({ size = 24, color = '#000000' }) => (
    <Ionicons name="time-outline" size={size} color={color} />
  ),
};

export default LocalIcons;
