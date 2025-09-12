const fs = require('fs');
const path = require('path');

// Список экранов для обновления
const screens = [
  'AnalysesScreen.js',
  'AnalysisDetailScreen.js',
  'ClinicDetailScreen.js',
  'HistoryScreen.js',
  'ProfileScreen.js',
  'RequestDetailScreen.js',
  'RequestsScreen.js',
  'SpecialistDetailScreen.js',
  'SplashScreen.js'
];

// Функция для обновления экрана
function updateScreen(screenName) {
  const filePath = path.join(__dirname, '..', 'screens', screenName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Файл ${screenName} не найден`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Добавляем импорт темы, если его нет
  if (!content.includes("import { useTheme } from '../themes/useTheme';")) {
    const importMatch = content.match(/import.*from.*react-native.*;\n/);
    if (importMatch) {
      const insertIndex = importMatch.index + importMatch[0].length;
      content = content.slice(0, insertIndex) + 
                "import { useTheme } from '../themes/useTheme';\n" + 
                content.slice(insertIndex);
    }
  }

  // Добавляем использование темы в компоненте
  if (!content.includes('const { colors, isDarkMode } = useTheme();')) {
    const componentMatch = content.match(/export default function \w+\([^)]*\) \{\s*\n/);
    if (componentMatch) {
      const insertIndex = componentMatch.index + componentMatch[0].length;
      content = content.slice(0, insertIndex) + 
                '  const { colors, isDarkMode } = useTheme();\n' + 
                content.slice(insertIndex);
    }
  }

  // Заменяем статический StyleSheet.create на функцию
  if (content.includes('const styles = StyleSheet.create({')) {
    content = content.replace(
      'const styles = StyleSheet.create({',
      'const createStyles = (colors) => StyleSheet.create({'
    );
  }

  // Добавляем создание стилей в компоненте
  if (!content.includes('const styles = createStyles(colors);')) {
    const returnMatch = content.match(/return \(\s*\n/);
    if (returnMatch) {
      const insertIndex = returnMatch.index;
      content = content.slice(0, insertIndex) + 
                '  const styles = createStyles(colors);\n\n' + 
                content.slice(insertIndex);
    }
  }

  // Заменяем основные цвета
  const colorReplacements = [
    { from: "color: '#333333',", to: 'color: colors.textPrimary,' },
    { from: "color: '#666666',", to: 'color: colors.textSecondary,' },
    { from: "color: '#0863a7',", to: 'color: colors.primary,' },
    { from: "backgroundColor: '#ffffff',", to: 'backgroundColor: colors.background,' },
    { from: "backgroundColor: '#f8f9fa',", to: 'backgroundColor: colors.backgroundSecondary,' },
    { from: "borderColor: '#e0e0e0',", to: 'borderColor: colors.border,' },
    { from: "borderColor: '#e9ecef',", to: 'borderColor: colors.border,' }
  ];

  colorReplacements.forEach(({ from, to }) => {
    content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
  });

  // Сохраняем обновленный файл
  fs.writeFileSync(filePath, content);
  console.log(`✅ Обновлен ${screenName}`);
}

// Обновляем все экраны
console.log('🚀 Начинаем обновление экранов для поддержки темной темы...\n');

screens.forEach(updateScreen);

console.log('\n✨ Все экраны обновлены!');
console.log('\n📝 Что было сделано:');
console.log('- Добавлен импорт useTheme');
console.log('- Добавлено использование темы в компонентах');
console.log('- Обновлены стили для поддержки динамических цветов');
console.log('- Заменены основные цвета на переменные темы');
console.log('\n🎨 Теперь все экраны поддерживают темную тему!');




