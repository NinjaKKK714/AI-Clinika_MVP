import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Alert,
  BackHandler,
  Linking,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';
import { useTheme } from '../themes/useTheme';

export default function CheckupDetailScreen({ route, navigation, onBack }) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  const { checkup } = route.params;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Обработчик системной кнопки "Назад" на Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onBack) {
        onBack();
        return true; // Предотвращаем стандартное поведение
      }
      return false; // Позволяем системе обработать кнопку "Назад"
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleBookAppointment = () => {
    Alert.alert(
      'Записаться на чек-ап',
      `Вы хотите записаться на ${checkup.type} в ${checkup.name}?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Позвонить',
          onPress: () => {
            const phoneNumber = checkup.phone.replace(/\s/g, '');
            const phoneUrl = Platform.OS === 'ios' ? `tel:${phoneNumber}` : `tel:${phoneNumber}`;
            Linking.openURL(phoneUrl).catch(err => {
              console.error('Error opening phone app:', err);
              Alert.alert('Ошибка', 'Не удалось открыть приложение для звонков');
            });
          },
        },
        {
          text: 'Записаться',
          style: 'default',
          onPress: () => {
            Alert.alert(
              'Запись подтверждена',
              'Ваша заявка на запись принята. С вами свяжутся в ближайшее время для подтверждения времени.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const renderServiceItem = (service, index) => (
    <View key={index} style={styles.serviceItem}>
      <View style={styles.serviceIcon}>
        <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.serviceIconGradient}>
          <Text style={styles.serviceIconText}>✓</Text>
        </LinearGradient>
      </View>
      <Text style={styles.serviceText}>{service}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Заголовок */}
        <LinearGradient colors={isDarkMode ? [colors.primary, colors.primaryDark] : ['#0863a7', '#074393']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              {LocalIcons.arrowBack({ size: 24, color: '#ffffff' })}
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Детали чек-апа</Text>
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Изображение */}
          <View style={styles.imageContainer}>
            <Image
              source={checkup.image || require('../ai.png')}
              style={styles.mainImage}
              resizeMode="cover"
            />
            
            {/* Рейтинг */}
            <View style={styles.ratingOverlay}>
              <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.ratingGradient}>
                <View style={styles.ratingContent}>
                  {LocalIcons.star({ size: 16, color: "#ffffff" })}
                  <Text style={styles.ratingText}>{checkup.rating}</Text>
                  <Text style={styles.reviewsText}>({checkup.reviews})</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Основная информация */}
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{checkup.name}</Text>
            <Text style={styles.type}>{checkup.type}</Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{checkup.price}</Text>
              <Text style={styles.duration}>• {checkup.duration}</Text>
            </View>

            <Text style={styles.description}>{checkup.description}</Text>
          </View>

          {/* Услуги */}
          <View style={styles.servicesContainer}>
            <Text style={styles.sectionTitle}>Включенные услуги</Text>
            {checkup.services.map(renderServiceItem)}
          </View>

          {/* Контактная информация */}
          <View style={styles.contactContainer}>
            <Text style={styles.sectionTitle}>Контактная информация</Text>
            
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <LinearGradient colors={['#0863a7', '#074393']} style={styles.contactIconGradient}>
                  {LocalIcons.location({ size: 20, color: "#ffffff" })}
                </LinearGradient>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Адрес</Text>
                <Text style={styles.contactValue}>{checkup.location}</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <LinearGradient colors={['#0863a7', '#074393']} style={styles.contactIconGradient}>
                  {LocalIcons.call({ size: 20, color: "#ffffff" })}
                </LinearGradient>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Телефон</Text>
                <Text style={styles.contactValue}>{checkup.phone}</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <LinearGradient colors={['#0863a7', '#074393']} style={styles.contactIconGradient}>
                  {LocalIcons.time({ size: 20, color: "#ffffff" })}
                </LinearGradient>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Часы работы</Text>
                <Text style={styles.contactValue}>{checkup.workingHours}</Text>
              </View>
            </View>
          </View>

          {/* Кнопка записи */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
              <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.bookButtonGradient}>
                <Text style={styles.bookButtonText}>Записаться на чек-ап</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 34,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  ratingOverlay: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  ratingGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    marginLeft: 4,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: colors.background,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  type: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 20,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#22ae2c',
    marginRight: 10,
  },
  duration: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  servicesContainer: {
    padding: 20,
    backgroundColor: colors.background,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    marginRight: 12,
  },
  serviceIconGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIconText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  serviceText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textPrimary,
    flex: 1,
  },
  contactContainer: {
    padding: 20,
    backgroundColor: colors.background,
    marginTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactIcon: {
    marginRight: 15,
  },
  contactIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textPrimary,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: colors.background,
    marginTop: 10,
    marginBottom: 40,
  },
  bookButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
