import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  Image,
  Dimensions,
  BackHandler,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';
import { useTheme } from '../themes/useTheme';

const { width, height } = Dimensions.get('window');

export default function ClinicDetailScreen({ route, navigation, onBack }) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  
  // Безопасное получение данных клиники
  const clinic = route?.params?.clinic || null;
  const [isFavorite, setIsFavorite] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Проверяем, что данные клиники доступны
  if (!clinic) {
    console.error('Clinic data not available in ClinicDetailScreen');
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Данные клиники не найдены</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              if (navigation && navigation.goBack) {
                navigation.goBack();
              } else if (onBack) {
                onBack();
              }
            }}
          >
            <Text style={styles.backButtonText}>Назад</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('Animation error:', error);
    }
  }, []);

  // Обработка системной кнопки "Назад"
  useEffect(() => {
    const backAction = () => {
      try {
        if (onBack && typeof onBack === 'function') {
          onBack();
        } else if (navigation && navigation.goBack) {
          navigation.goBack();
        }
        return true;
      } catch (error) {
        console.error('Back action error:', error);
        return false;
      }
    };

    let backHandler = null;
    try {
      backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    } catch (error) {
      console.error('BackHandler error:', error);
    }

    return () => {
      try {
        if (backHandler) {
          backHandler.remove();
        }
      } catch (error) {
        console.error('BackHandler cleanup error:', error);
      }
    };
  }, [onBack, navigation]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleCall = () => {
    try {
      if (clinic && clinic.phone) {
        Linking.openURL(`tel:${clinic.phone}`);
      } else {
        Alert.alert('Ошибка', 'Номер телефона не указан');
      }
    } catch (error) {
      console.error('Call error:', error);
      Alert.alert('Ошибка', 'Не удалось совершить звонок');
    }
  };

  const handleBookAppointment = () => {
    try {
      if (!clinic || !clinic.name) {
        Alert.alert('Ошибка', 'Данные клиники недоступны');
        return;
      }
      
      Alert.alert(
        'Запись на прием',
        `Вы хотите записаться в клинику "${clinic.name}"?`,
        [
          {
            text: 'Отмена',
            style: 'cancel',
          },
          {
            text: 'Записаться',
            onPress: () => {
              Alert.alert(
                'Успешно!',
                'Ваша заявка на запись принята. Мы свяжемся с вами в ближайшее время.',
                [{ text: 'OK' }]
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Ошибка', 'Не удалось создать заявку на запись');
    }
  };

  const handleDirections = () => {
    try {
      if (clinic.coordinates && clinic.coordinates.latitude && clinic.coordinates.longitude) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.coordinates.latitude},${clinic.coordinates.longitude}`;
        Linking.openURL(url);
      } else if (clinic.location) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.location)}`;
        Linking.openURL(url);
      } else {
        Alert.alert('Ошибка', 'Адрес не указан');
      }
    } catch (error) {
      console.error('Maps error:', error);
      Alert.alert('Ошибка', 'Не удалось открыть карты');
    }
  };

  const renderInfoItem = (icon, title, value, onPress = null) => {
    try {
      return (
        <TouchableOpacity 
          style={styles.infoItem} 
          onPress={onPress}
          disabled={!onPress}
        >
          <View style={styles.infoIcon}>
            <LinearGradient colors={['#0863a7', '#074393']} style={styles.iconGradient}>
              {LocalIcons[icon] ? LocalIcons[icon]({ size: 20, color: "#ffffff" }) : null}
            </LinearGradient>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>{title || ''}</Text>
            <Text style={styles.infoValue}>{value || ''}</Text>
          </View>
          {onPress && (
            <View style={styles.actionButton}>
              {LocalIcons.arrowRight ? LocalIcons.arrowRight({ size: 20, color: "#0863a7" }) : null}
            </View>
          )}
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('renderInfoItem error:', error);
      return (
        <View style={styles.infoItem}>
          <Text style={styles.infoTitle}>{title || 'Ошибка отображения'}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Заголовок */}
        <LinearGradient colors={['#0863a7', '#074393']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                try {
                  if (navigation && navigation.goBack) {
                    navigation.goBack();
                  } else if (onBack) {
                    onBack();
                  }
                } catch (error) {
                  console.error('Navigation error:', error);
                }
              }}
            >
              {LocalIcons.arrowBack ? LocalIcons.arrowBack({ size: 24, color: "#ffffff" }) : null}
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Информация о клинике</Text>
            
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              {LocalIcons.heart ? LocalIcons.heart({ 
                size: 24, 
                color: isFavorite ? "#ff4444" : "#ffffff" 
              }) : null}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.scrollContent} 
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Изображение клиники */}
          <View style={styles.imageContainer}>
            {clinic.image ? (
              <Image
                source={clinic.image}
                style={styles.clinicImage}
                resizeMode="cover"
                onError={(error) => {
                  console.error('Image load error:', error);
                }}
              />
            ) : (
              <View style={[styles.clinicImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#666', fontSize: 16 }}>Изображение недоступно</Text>
              </View>
            )}
            
            {/* Рейтинг */}
            <View style={styles.ratingOverlay}>
              <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.ratingGradient}>
                <View style={styles.ratingContent}>
                  {LocalIcons.star ? LocalIcons.star({ size: 16, color: "#ffffff" }) : null}
                  <Text style={styles.ratingText}>{clinic.rating || 'N/A'}</Text>
                  <Text style={styles.reviewsText}>({clinic.reviews || 0})</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Основная информация */}
          <View style={styles.mainInfo}>
            <Text style={styles.clinicName}>{clinic.name || 'Название не указано'}</Text>
            <Text style={styles.clinicServices}>{clinic.services || 'Услуги не указаны'}</Text>
            <Text style={styles.clinicDistance}>{clinic.distance || 'Расстояние не указано'}</Text>
          </View>

          {/* Описание */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>О клинике</Text>
            <Text style={styles.description}>{clinic.description || 'Описание не указано'}</Text>
          </View>

          {/* Контактная информация */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Контактная информация</Text>
            <View style={styles.infoContainer}>
              {renderInfoItem('location', 'Адрес', clinic.location || 'Адрес не указан')}
              {renderInfoItem('call', 'Телефон', clinic.phone || 'Телефон не указан', clinic.phone ? handleCall : null)}
              {renderInfoItem('time', 'Часы работы', clinic.workingHours || 'Часы работы не указаны')}
            </View>
          </View>

          {/* Кнопка построения маршрута */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={handleDirections}
            >
              <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.directionsGradient}>
                <View style={styles.directionsContent}>
                  {LocalIcons.location ? LocalIcons.location({ size: 20, color: "#ffffff" }) : null}
                  <Text style={styles.directionsText}>Построить маршрут</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Кнопка записи */}
          <View style={styles.bookingSection}>
            <TouchableOpacity 
              style={styles.bookingButton}
              onPress={handleBookAppointment}
            >
              <LinearGradient colors={['#0863a7', '#074393']} style={styles.bookingGradient}>
                <Text style={styles.bookingButtonText}>Записаться на прием</Text>
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
    paddingTop: 60,
    paddingBottom: 20,
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
  favoriteButton: {
    padding: 5,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 120,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  clinicImage: {
    width: '100%',
    height: '100%',
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  ratingGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  mainInfo: {
    padding: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  clinicName: {
    fontSize: 24,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  clinicServices: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    marginBottom: 5,
  },
  clinicDistance: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.primary,
    fontWeight: '500',
  },
  section: {
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
  description: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  infoContainer: {
    gap: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 15,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actionButton: {
    padding: 5,
  },
  directionsButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  directionsGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  directionsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  bookingSection: {
    padding: 20,
    backgroundColor: colors.background,
    marginTop: 10,
    marginBottom: 20,
  },
  bookingButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  bookingGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  bookingButtonText: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.primary,
    fontWeight: '600',
  },
});