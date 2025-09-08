const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Поддержка нативных модулей
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Добавляем alias для react-native-maps на веб-платформе
config.resolver.alias = {
  'react-native-maps': require.resolve('./web-maps-stub.js'),
};

// Поддержка нативных модулей для голосового ввода
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config;
