import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

// Импорт экранов
import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import StorageService from './services/storageService';

// Импорт темы
import { ThemeProvider, useTheme } from './themes/ThemeContext';

// Основной компонент приложения с темой
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { isDarkMode, isLoading: themeLoading } = useTheme();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const isAuth = await StorageService.isAuthenticated();
      setIsAuthenticated(isAuth);
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Ждем загрузки темы
  if (themeLoading) {
    return null;
  }

  if (isLoading || checkingAuth) {
    return (
      <>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <SplashScreen onFinish={handleSplashFinish} />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      </>
    );
  }

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <HomeScreen onLogout={handleLogout} />
    </>
  );
}

// Главный компонент с провайдером темы
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
