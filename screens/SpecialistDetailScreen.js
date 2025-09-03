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
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Calendar from 'expo-calendar';
import LocalIcons from '../components/LocalIcons';

const { width, height } = Dimensions.get('window');

export default function SpecialistDetailScreen({ route, navigation }) {
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
  }, []);

  const checkCalendarPermissions = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setCalendarPermission(status === 'granted');
      
      if (status === 'granted') {
        // Проверяем доступность календарей
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        if (calendars.length === 0) {
          Alert.alert('Информация', 'На устройстве не найдены доступные календари');
          setCalendarPermission(false);
        }
      }
    } catch (error) {
      console.log('Ошибка при проверке разрешений календаря:', error);
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
      // Создаем событие в календаре
      if (calendarPermission) {
        console.log('Создаем событие в календаре...');
        await createCalendarEvent();
      }

      setShowBookingModal(false);
      Alert.alert(
        'Успешно!',
        `Ваша запись к ${specialist.name} на ${selectedDate} в ${selectedTime} подтверждена.${calendarPermission ? ' Событие добавлено в календарь.' : ''} Мы свяжемся с вами для подтверждения.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.log('Ошибка при создании записи:', error);
      Alert.alert('Ошибка', 'Не удалось создать запись. Попробуйте еще раз.');
    }
  };

  const createCalendarEvent = async () => {
    try {
      // Получаем список календарей
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      
      if (calendars.length === 0) {
        throw new Error('Не найдены доступные календари');
      }

      // Ищем основной календарь (обычно первый)
      let selectedCalendar = calendars.find(cal => cal.isPrimary);
      
      // Если нет основного, выбираем первый доступный
      if (!selectedCalendar) {
        selectedCalendar = calendars[0];
      }

      // Парсим дату и время
      const [year, month, day] = selectedDate.split('-').map(Number);
      const [hour, minute] = selectedTime.split(':').map(Number);
      
      const startDate = new Date(year, month - 1, day, hour, minute);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 час

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

      const eventId = await Calendar.createEventAsync(selectedCalendar.id, eventDetails);
      console.log('Событие создано в календаре:', eventId);
      
      return eventId;
    } catch (error) {
      console.log('Ошибка при создании события в календаре:', error);
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
      animationType="none"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Запись к специалисту</Text>
            <TouchableOpacity 
              onPress={() => setShowBookingModal(false)}
              style={styles.closeButton}
            >
              {LocalIcons.close({ size: 24, color: "#333" })}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
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
               >
                 <LinearGradient colors={['#0863a7', '#074393']} style={styles.confirmGradient}>
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

        <ScrollView style={styles.body}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    color: '#0863a7',
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
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
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    padding: 20,
  },
  datesContainer: {
    marginBottom: 20,
  },
  dateButton: {
    alignItems: 'center',
    padding: 15,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    minWidth: 70,
  },
  dateButtonActive: {
    backgroundColor: '#0863a7',
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
  },
  timeButton: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: '#0863a7',
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
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  confirmGradient: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#ffffff',
  },
  calendarStatus: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  calendarStatusText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  calendarPermissionButton: {
    backgroundColor: '#0863a7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
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
    marginTop: 20,
    width: '100%',
  },
});
