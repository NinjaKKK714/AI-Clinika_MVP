import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { useTheme } from '../themes/useTheme';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Анимация появления
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Анимация прогресс-бара
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      // После завершения загрузки
      setTimeout(() => {
        onFinish();
      }, 500);
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Логотип */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../ai.png')}
            style={styles.logo}
            resizeMode="contain"
            fadeDuration={0}
          />
        </View>

        {/* Название компании */}
        <Text style={styles.title}>AI-CLINIKA</Text>
        <Text style={styles.subtitle}>Цифровая медицина рядом</Text>

        {/* Прогресс-бар */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>Загрузка...</Text>
        </View>

        {/* Версия */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Версия 1.0.0</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 150,
    height: 150,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 60,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  progressBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#22ae2c',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 60,
  },
  versionText: {
    fontSize: 14,
    color: '#999999',
    opacity: 0.7,
    fontWeight: '500',
  },
});
