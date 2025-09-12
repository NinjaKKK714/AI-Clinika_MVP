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
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '../themes/useTheme';
import LocalIcons from '../components/LocalIcons';

const { width, height } = Dimensions.get('window');

export default function ClinicDetailScreen({ route, navigation, onBack }) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  
  // Безопасное получение данных клиники
  const clinic = route?.params?.clinic || null;
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Проверяем, что данные клиники доступны
  if (!clinic) {
    console.error('Clinic data not available in ClinicDetailScreen');
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Данные клиники не найдены</Text>
        </View>
      </View>
    );
  }
  
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
  }, []);

  // Обработка системной кнопки "Назад"
  useEffect(() => {
    const backAction = () => {
      // Возвращаемся на экран клиник
      onBack();
      return true; // Предотвращаем стандартное поведение
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [onBack]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${clinic.phone}`);
  };

  const handleBookAppointment = () => {
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
  };

  const renderInfoItem = (icon, title, value, onPress = null) => (
    <TouchableOpacity 
      style={styles.infoItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.infoIcon}>
        <LinearGradient colors={['#0863a7', '#074393']} style={styles.iconGradient}>
          {LocalIcons[icon]({ size: 20, color: "#ffffff" })}
        </LinearGradient>
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      {onPress && (
        <TouchableOpacity style={styles.actionButton}>
          {LocalIcons.call({ size: 20, color: "#0863a7" })}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Заголовок */}
        <LinearGradient colors={['#0863a7', '#074393']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              {LocalIcons.arrow({ size: 24, color: "#ffffff" })}
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Информация о клинике</Text>
            
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              {LocalIcons.heart({ 
                size: 24, 
                color: isFavorite ? "#ff4444" : "#ffffff" 
              })}
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
            <Image
              source={clinic.image}
              style={styles.clinicImage}
              resizeMode="cover"
            />
            
            {/* Рейтинг */}
            <View style={styles.ratingOverlay}>
              <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.ratingGradient}>
                <View style={styles.ratingContent}>
                  {LocalIcons.star({ size: 16, color: "#ffffff" })}
                  <Text style={styles.ratingText}>{clinic.rating}</Text>
                  <Text style={styles.reviewsText}>({clinic.reviews})</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Основная информация */}
          <View style={styles.mainInfo}>
            <Text style={styles.clinicName}>{clinic.name}</Text>
            <Text style={styles.clinicServices}>{clinic.services}</Text>
            <Text style={styles.clinicDistance}>{clinic.distance}</Text>
          </View>

          {/* Описание */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>О клинике</Text>
            <Text style={styles.description}>{clinic.description}</Text>
          </View>

          {/* Контактная информация */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Контактная информация</Text>
            <View style={styles.infoContainer}>
              {renderInfoItem('location', 'Адрес', clinic.location)}
              {renderInfoItem('call', 'Телефон', clinic.phone, handleCall)}
              {renderInfoItem('time', 'Часы работы', clinic.workingHours)}
            </View>
          </View>

          {/* Карта */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Расположение</Text>
            <View style={styles.mapContainer}>
              {clinic.coordinates && clinic.coordinates.latitude && clinic.coordinates.longitude ? (
                <>
                  {MapView && Marker && Platform.OS !== 'web' ? (
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: clinic.coordinates.latitude,
                        longitude: clinic.coordinates.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      showsUserLocation={true}
                      showsMyLocationButton={true}
                      showsCompass={true}
                      showsScale={true}
                      onMapReady={() => {
                        console.log('Map is ready');
                      }}
                      onError={(error) => {
                        console.error('Map error:', error);
                      }}
                      onMapLoaded={() => {
                        console.log('Map loaded successfully');
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: clinic.coordinates.latitude,
                          longitude: clinic.coordinates.longitude,
                        }}
                        title={clinic.name}
                        description={clinic.location}
                        pinColor="#0863a7"
                      />
                    </MapView>
                  ) : (
                    <View style={styles.mapPlaceholder}>
                      <Text style={styles.mapPlaceholderText}>Карта недоступна</Text>
                      <Text style={styles.mapPlaceholderSubtext}>Нажмите для открытия в браузере</Text>
                    </View>
                  )}
                  
                  {/* Информация о клинике на карте */}
                  <View style={styles.mapInfoOverlay}>
                    <View style={styles.mapInfoContent}>
                      <Text style={styles.mapInfoTitle}>{clinic.name}</Text>
                      <Text style={styles.mapInfoAddress}>{clinic.location}</Text>
                      <TouchableOpacity 
                        style={styles.mapDirectionsButton}
                        onPress={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.coordinates.latitude},${clinic.coordinates.longitude}`;
                          Linking.openURL(url);
                        }}
                      >
                        <LinearGradient colors={['#0863a7', '#074393']} style={styles.mapDirectionsGradient}>
                          <Text style={styles.mapDirectionsText}>Построить маршрут</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.mapPlaceholder}>
                  <View style={styles.mapContent}>
                    {LocalIcons.location({ size: 48, color: "#0863a7" })}
                    <Text style={styles.mapText}>Карта недоступна</Text>
                    <Text style={styles.mapSubtext}>Координаты не указаны</Text>
                    <TouchableOpacity 
                      style={styles.mapDirectionsButton}
                      onPress={() => {
                        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.location)}`;
                        Linking.openURL(url);
                      }}
                    >
                      <LinearGradient colors={['#0863a7', '#074393']} style={styles.mapDirectionsGradient}>
                        <Text style={styles.mapDirectionsText}>Открыть в Google Maps</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Кнопка записи */}
          <View style={styles.bookingSection}>
            <TouchableOpacity 
              style={styles.bookingButton}
              onPress={handleBookAppointment}
            >
              <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.bookingGradient}>
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
    paddingBottom: 120, // Отступ для нижней панели навигации
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
  mapContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    height: 250,
    width: '100%',
  },
  mapPlaceholder: {
    height: 250,
    width: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 5,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#999999',
  },
  mapInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  mapInfoContent: {
    alignItems: 'center',
  },
  mapInfoTitle: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 5,
    textAlign: 'center',
  },
  mapInfoAddress: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  mapDirectionsButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#0863a7',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mapDirectionsGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  mapDirectionsText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#ffffff',
  },
  mapPlaceholder: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
  },
  mapContent: {
    alignItems: 'center',
  },
  mapText: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 10,
  },
  mapSubtext: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    marginTop: 5,
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
  },
});



