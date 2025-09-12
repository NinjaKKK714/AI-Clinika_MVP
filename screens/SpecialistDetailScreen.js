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
  Alert,
  Linking,
  Modal,
  BackHandler
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Calendar from 'expo-calendar';
import LocalIcons from '../components/LocalIcons';
import { useTheme } from '../themes/useTheme';

const { width, height } = Dimensions.get('window');

export default function SpecialistDetailScreen({ route, navigation, onBack }) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  const { specialist } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [calendarPermission, setCalendarPermission] = useState(null);
  
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

    // Проверяем разрешения календаря при загрузке
    checkCalendarPermissions();

    // Обработчик системной кнопки "Назад" на Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onBack) {
        onBack();
        return true; // Предотвращаем закрытие приложения
      }
      return false; // Позволяем системе обработать кнопку "Назад"
    });

    return () => {
      backHandler.remove();
    };
  }, [onBack]);

  const checkCalendarPermissions = async () => {
    try {
      console.log('Проверяем разрешения календаря...');
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      console.log('Статус разрешений календаря:', status);
      
      setCalendarPermission(status === 'granted');
      
      if (status === 'granted') {
        // Проверяем доступность календарей
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        console.log('Найдено календарей:', calendars.length);
        
        if (calendars.length === 0) {
          console.log('Календари не найдены');
          Alert.alert('Информация', 'На устройстве не найдены доступные календари');
          setCalendarPermission(false);
        } else {
          console.log('Календари доступны:', calendars.map(cal => cal.title));
        }
      } else {
        console.log('Разрешения календаря не предоставлены');
      }
    } catch (error) {
      console.error('Ошибка при проверке разрешений календаря:', error);
      setCalendarPermission(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${specialist.phone}`);
  };

  const handleBookAppointment = () => {
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    console.log('handleConfirmBooking вызван');
    console.log('selectedDate:', selectedDate);
    console.log('selectedTime:', selectedTime);
    console.log('calendarPermission:', calendarPermission);
    
    if (!selectedDate || !selectedTime) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите дату и время');
      return;
    }

    try {
      let calendarEventCreated = false;
      
      // Создаем событие в календаре
      if (calendarPermission) {
        console.log('Создаем событие в календаре...');
        try {
          await createCalendarEvent();
          calendarEventCreated = true;
          console.log('Событие в календаре создано успешно');
        } catch (calendarError) {
          console.error('Ошибка при создании события в календаре:', calendarError);
          // Продолжаем выполнение, даже если календарь не работает
        }
      }

      setShowBookingModal(false);
      
      const successMessage = `Ваша запись к ${specialist.name} на ${selectedDate} в ${selectedTime} подтверждена.${calendarEventCreated ? ' Событие добавлено в календарь.' : ''} Мы свяжемся с вами для подтверждения.`;
      
      Alert.alert('Успешно!', successMessage, [{ text: 'OK' }]);
      
    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      Alert.alert('Ошибка', 'Не удалось создать запись. Попробуйте еще раз.');
    }
  };

  const createCalendarEvent = async () => {
    try {
      console.log('Начинаем создание события в календаре...');
      console.log('selectedDate:', selectedDate);
      console.log('selectedTime:', selectedTime);
      
      // Получаем список календарей
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      console.log('Найдено календарей:', calendars.length);
      
      if (calendars.length === 0) {
        throw new Error('Не найдены доступные календари');
      }

      // Ищем основной календарь (обычно первый)
      let selectedCalendar = calendars.find(cal => cal.isPrimary);
      
      // Если нет основного, выбираем первый доступный
      if (!selectedCalendar) {
        selectedCalendar = calendars[0];
      }
      
      console.log('Выбран календарь:', selectedCalendar.title);

      // Парсим дату и время
      if (!selectedDate || !selectedTime) {
        throw new Error('Не выбраны дата или время');
      }
      
      const [year, month, day] = selectedDate.split('-').map(Number);
      const [hour, minute] = selectedTime.split(':').map(Number);
      
      console.log('Парсинг даты:', { year, month, day, hour, minute });
      
      const startDate = new Date(year, month - 1, day, hour, minute);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 час
      
      console.log('Даты события:', { startDate, endDate });

      // Создаем событие
      const eventDetails = {
        title: `Прием у ${specialist.name}`,
        startDate: startDate,
        endDate: endDate,
        location: specialist.location || 'Медицинский центр',
        notes: `Запись к специалисту: ${specialist.name}\nСпециализация: ${specialist.specialization}\nТелефон: ${specialist.phone}`,
        alarms: [
          { relativeOffset: -60 }, // Напоминание за 1 час
          { relativeOffset: -1440 } // Напоминание за 1 день
        ]
      };

      console.log('Детали события:', eventDetails);
      
      const eventId = await Calendar.createEventAsync(selectedCalendar.id, eventDetails);
      console.log('Событие создано в календаре с ID:', eventId);
      
      return eventId;
    } catch (error) {
      console.error('Ошибка при создании события в календаре:', error);
      throw error;
    }
  };

  // Генерация доступных дат (следующие 30 дней)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Пропускаем выходные (суббота и воскресенье)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          month: date.toLocaleDateString('ru-RU', { month: 'short' }),
          weekday: date.toLocaleDateString('ru-RU', { weekday: 'short' })
        });
      }
    }
    
    return dates;
  };

  // Временные слоты
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

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

  const BookingModal = () => (
    <Modal
      visible={showBookingModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          onPress={() => setShowBookingModal(false)}
          activeOpacity={1}
        />
        <View style={styles.modalContent}>
          {/* Индикатор перетаскивания */}
          <View style={styles.modalDragIndicator} />
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Запись к специалисту</Text>
            <TouchableOpacity 
              onPress={() => setShowBookingModal(false)}
              style={styles.closeButton}
            >
              {LocalIcons.close({ size: 24, color: "#666" })}
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalBody} 
            contentContainerStyle={styles.modalBodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Индикатор календаря */}
            <View style={styles.calendarStatusContainer}>
              <View style={styles.calendarStatusRow}>
                {LocalIcons.calendar({ size: 16, color: calendarPermission ? "#22ae2c" : "#ff4444" })}
                <Text style={[styles.calendarStatusText, { color: calendarPermission ? "#22ae2c" : "#ff4444" }]}>
                  {calendarPermission ? 'Событие будет добавлено в календарь' : 'Календарь недоступен'}
                </Text>
              </View>
            </View>
            
            {/* Выбор даты */}
            <Text style={styles.sectionTitle}>Выберите дату:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
              {generateAvailableDates().map((dateObj, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateButton,
                    selectedDate === dateObj.date && styles.dateButtonActive
                  ]}
                  onPress={() => setSelectedDate(dateObj.date)}
                >
                  <Text style={[
                    styles.dateDay,
                    selectedDate === dateObj.date && styles.dateDayActive
                  ]}>
                    {dateObj.day}
                  </Text>
                  <Text style={[
                    styles.dateMonth,
                    selectedDate === dateObj.date && styles.dateMonthActive
                  ]}>
                    {dateObj.month}
                  </Text>
                  <Text style={[
                    styles.dateWeekday,
                    selectedDate === dateObj.date && styles.dateWeekdayActive
                  ]}>
                    {dateObj.weekday}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Выбор времени */}
            {selectedDate && (
              <>
                <Text style={styles.sectionTitle}>Выберите время:</Text>
                <View style={styles.timeGrid}>
                  {timeSlots.map((time, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeButton,
                        selectedTime === time && styles.timeButtonActive
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={[
                        styles.timeText,
                        selectedTime === time && styles.timeTextActive
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Статус календаря */}
            <View style={styles.calendarStatus}>
              <Text style={styles.calendarStatusText}>
                {calendarPermission ? '📅 Событие будет добавлено в календарь' : '📅 Разрешите доступ к календарю для напоминаний'}
              </Text>
              {!calendarPermission && (
                <TouchableOpacity 
                  style={styles.calendarPermissionButton}
                  onPress={checkCalendarPermissions}
                >
                  <Text style={styles.calendarPermissionButtonText}>Разрешить</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Кнопки */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowBookingModal(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirmBooking}
                disabled={!selectedDate || !selectedTime}
              >
                <LinearGradient 
                  colors={(!selectedDate || !selectedTime) ? ['#cccccc', '#999999'] : ['#0863a7', '#074393']} 
                  style={styles.confirmGradient}
                >
                  <Text style={styles.confirmButtonText}>Подтвердить запись</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
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
            
            <Text style={styles.headerTitle}>Специалист</Text>
            
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
          style={styles.body} 
          contentContainerStyle={styles.bodyContent}
        >
          {/* Фото и основная информация */}
          <View style={styles.specialistHeader}>
            <Image
              source={specialist.image}
              style={styles.specialistImage}
              resizeMode="cover"
            />
            
            <View style={styles.specialistInfo}>
              <Text style={styles.specialistName}>{specialist.name}</Text>
              <Text style={styles.specialistSpecialization}>{specialist.specialization}</Text>
              
              <View style={styles.ratingContainer}>
                <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.ratingGradient}>
                  <View style={styles.ratingContent}>
                    {LocalIcons.star({ size: 16, color: "#ffffff" })}
                    <Text style={styles.ratingText}>{specialist.rating}</Text>
                    <Text style={styles.reviewsText}>({specialist.reviews})</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Описание */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>О специалисте</Text>
            <Text style={styles.description}>{specialist.description}</Text>
          </View>

          {/* Информация */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Информация</Text>
            
            {renderInfoItem('time', 'Опыт работы', specialist.experience)}
            {renderInfoItem('school', 'Образование', specialist.education)}
            {renderInfoItem('location', 'Адрес', specialist.location)}
            {renderInfoItem('time', 'Рабочие часы', specialist.workingHours)}
            {renderInfoItem('call', 'Телефон', specialist.phone, handleCall)}
            
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <LinearGradient colors={['#0863a7', '#074393']} style={styles.iconGradient}>
                  {LocalIcons.language({ size: 20, color: "#ffffff" })}
                </LinearGradient>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Языки</Text>
                <Text style={styles.infoValue}>{specialist.languages.join(', ')}</Text>
              </View>
            </View>
          </View>

          {/* Кнопка записи */}
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={handleBookAppointment}
          >
            <LinearGradient colors={['#0863a7', '#074393']} style={styles.bookGradient}>
              <Text style={styles.bookButtonText}>Записаться на прием</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      <BookingModal />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#ffffff',
  },
  favoriteButton: {
    padding: 8,
  },
  body: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  bodyContent: {
    paddingBottom: 120, // Отступ для нижней панели навигации
  },
  specialistHeader: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  specialistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  specialistInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  specialistName: {
    fontSize: 24,
    fontFamily: 'Open Sauce',
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  specialistSpecialization: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.primary,
    marginBottom: 10,
  },
  ratingContainer: {
    alignSelf: 'flex-start',
  },
  ratingGradient: {
    borderRadius: 15,
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
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    marginLeft: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: '700',
    color: '#333',
    marginBottom: 18,
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#666',
    lineHeight: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIcon: {
    marginRight: 15,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#666',
  },
  actionButton: {
    padding: 8,
  },
  bookButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  bookGradient: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalDragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Open Sauce',
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  modalBody: {
    padding: 20,
    backgroundColor: colors.background,
  },
  modalBodyContent: {
    paddingBottom: 20, // Отступ для модального окна
  },
  datesContainer: {
    marginBottom: 25,
    paddingVertical: 5,
  },
  dateButton: {
    alignItems: 'center',
    padding: 15,
    marginRight: 10,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    minWidth: 75,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateButtonActive: {
    backgroundColor: '#0863a7',
    borderColor: '#0863a7',
    shadowColor: '#0863a7',
    shadowOpacity: 0.3,
  },
  dateDay: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: '700',
    color: '#333',
  },
  dateDayActive: {
    color: '#ffffff',
  },
  dateMonth: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    color: '#666',
    marginTop: 2,
  },
  dateMonthActive: {
    color: '#ffffff',
  },
  dateWeekday: {
    fontSize: 10,
    fontFamily: 'Open Sauce',
    color: '#999',
    marginTop: 2,
  },
  dateWeekdayActive: {
    color: '#ffffff',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeButton: {
    width: '30%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeButtonActive: {
    backgroundColor: '#0863a7',
    borderColor: '#0863a7',
    shadowColor: '#0863a7',
    shadowOpacity: 0.3,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#333',
  },
  timeTextActive: {
    color: '#ffffff',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 0,
    borderTopColor: 'transparent',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    justifyContent: 'center',
  },
  confirmGradient: {
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0863a7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#ffffff',
  },
  calendarStatus: {
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    marginTop: 25,
    marginBottom: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  calendarStatusText: {
    fontSize: 15,
    fontFamily: 'Open Sauce',
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  calendarPermissionButton: {
    backgroundColor: '#0863a7',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#0863a7',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  calendarPermissionButtonText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 10,
    width: '100%',
  },
  calendarStatusContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calendarStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarStatusText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '500',
  },
});
