const fs = require('fs');
const path = require('path');

// Список файлов для исправления
const filesToFix = [
  'screens/HomeScreen.js',
  'screens/RequestsScreen.js', 
  'screens/ProfileScreen.js',
  'screens/AnalysesScreen.js',
  'screens/AuthScreen.js',
  'screens/ClinicsScreen.js',
  'screens/SplashScreen.js',
  'screens/ClinicDetailScreen.js'
];

function fixStylesPosition(filePath) {
  console.log(`Исправляем ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Найти строку с const styles = createStyles(colors); в середине функции
  const stylesPattern = /(\s+)(const styles = createStyles\(colors\);)/g;
  const matches = [...content.matchAll(stylesPattern)];
  
  if (matches.length > 0) {
    // Удалить все вхождения const styles = createStyles(colors); из середины
    content = content.replace(stylesPattern, '');
    
    // Найти место после useTheme и добавить const styles = createStyles(colors);
    const useThemePattern = /(const \{ colors, isDarkMode \} = useTheme\(\);)/;
    const useThemeMatch = content.match(useThemePattern);
    
    if (useThemeMatch) {
      const replacement = `${useThemeMatch[1]}\n  const styles = createStyles(colors);`;
      content = content.replace(useThemePattern, replacement);
      
      // Записать исправленный файл
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath} исправлен`);
    } else {
      console.log(`❌ Не найден useTheme в ${filePath}`);
    }
  } else {
    console.log(`ℹ️ ${filePath} не требует исправления`);
  }
}

// Исправить все файлы
filesToFix.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    fixStylesPosition(fullPath);
  } else {
    console.log(`❌ Файл не найден: ${fullPath}`);
  }
});

console.log('\n🎉 Исправление завершено!');




