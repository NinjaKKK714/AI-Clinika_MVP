import { useTheme as useThemeContext } from './ThemeContext';

export const useTheme = () => {
  const { theme, isDarkMode, toggleTheme, isLoading } = useThemeContext();
  
  return {
    colors: theme,
    isDarkMode,
    toggleTheme,
    isLoading,
  };
};





