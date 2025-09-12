import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  TextInput,
  Dimensions,
  BackHandler,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';
import { useTheme } from '../themes/useTheme';
import StorageService from '../services/storageService';

const { width } = Dimensions.get('window');

export default function RequestsScreen({ navigation, onBack }) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' или 'oldest'
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;


  useEffect(() => {
    loadRequests();

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
      // Возвращаемся на главный экран
      onBack();
      return true; // Предотвращаем стандартное поведение
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [onBack]);

  const loadRequests = async () => {
    try {
      // Сначала наполняем дамми-данными, если их нет
      await StorageService.populateDummyRequests();

      // Затем загружаем обращения
      const storedRequests = await StorageService.getRequests();
      setRequests(storedRequests);

      // Для тестирования: раскомментируйте следующую строку для очистки данных
      // await StorageService.clearAllData();
    } catch (error) {
      console.error('Error loading requests:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить обращения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortSelect = (order) => {
    setSortOrder(order);
    setShowSortMenu(false);
  };

  const getSortLabel = () => {
    return sortOrder === 'newest' ? 'Новые' : 'Старые';
  };


  const dateFilters = [
    { id: 'all', name: 'Все' },
    { id: 'today', name: 'Сегодня' },
    { id: 'week', name: 'Неделя' },
    { id: 'month', name: 'Месяц' },
    { id: 'year', name: 'Год' },
  ];

  // Функция для парсинга даты в формате DD.MM.YYYY
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  // Функция для получения текущей даты
  const getCurrentDate = () => {
    return new Date();
  };

  // Функция для проверки, попадает ли дата в выбранный период
  const isDateInRange = (dateStr, filter) => {
    const requestDate = parseDate(dateStr);
    const currentDate = getCurrentDate();

    switch (filter) {
      case 'today':
        const today = new Date(currentDate);
        today.setHours(0, 0, 0, 0);
        const requestDay = new Date(requestDate);
        requestDay.setHours(0, 0, 0, 0);
        return requestDay.getTime() === today.getTime();
      case 'week':
        const weekAgo = new Date(currentDate);
        weekAgo.setDate(currentDate.getDate() - 7);
        return requestDate >= weekAgo && requestDate <= currentDate;
      case 'month':
        const monthAgo = new Date(currentDate);
        monthAgo.setMonth(currentDate.getMonth() - 1);
        return requestDate >= monthAgo && requestDate <= currentDate;
      case 'year':
        const yearAgo = new Date(currentDate);
        yearAgo.setFullYear(currentDate.getFullYear() - 1);
        return requestDate >= yearAgo && requestDate <= currentDate;
      default:
        return true;
    }
  };

  const filteredRequests = requests
    .filter(request =>
      searchQuery === '' ||
      request.userQuery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.aiResponse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.symptoms.some(symptom =>
        symptom.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .filter(request => isDateInRange(request.date, selectedDateFilter))
    .sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Вычисляем статистику на основе отфильтрованных данных
  const filteredRequestsCount = filteredRequests.length;
  const recommendationsCount = filteredRequestsCount; // Каждое обращение = одна рекомендация
  const appointmentsCount = Math.floor(filteredRequestsCount * 0.8); // Примерно 80% обращений ведут к записям

  const renderRequestCard = (request) => (
    <View 
      key={request.id} 
      style={styles.requestCard}
    >
      <View style={styles.requestHeader}>
        <View style={styles.requestInfo}>
          <Text style={styles.requestDate}>{request.date} в {request.time}</Text>
          <View style={styles.categoryContainer}>
            <LinearGradient colors={['#0863a7', '#074393']} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{request.category}</Text>
            </LinearGradient>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
        </View>
      </View>

      <View style={styles.requestContent}>
        <Text style={styles.requestTitle}>Ваш запрос:</Text>
        <Text style={styles.requestQuery} numberOfLines={2}>
          {request.userQuery}
        </Text>
        
        <Text style={styles.requestTitle}>Ответ ИИ:</Text>
        <Text style={styles.aiResponse} numberOfLines={3}>
          {request.aiResponse}
        </Text>

        <View style={styles.symptomsContainer}>
          <Text style={styles.symptomsTitle}>Симптомы:</Text>
          <View style={styles.symptomsList}>
            {request.symptoms.map((symptom, index) => (
              <View key={index} style={styles.symptomTag}>
                <Text style={styles.symptomText}>{symptom}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.requestFooter}>
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          activeOpacity={0.7}
          onPress={(e) => {
            e.stopPropagation(); // Предотвращаем всплытие события
            console.log('Нажатие на кнопку Подробнее:', request.id);
            
            if (navigation && navigation.navigate) {
              console.log('Navigating to RequestDetail with request:', request);
              navigation.navigate('RequestDetail', { request });
            } else {
              console.log('Navigation not available');
              Alert.alert('Ошибка', 'Навигация недоступна');
            }
          }}
        >
          <Text style={styles.viewDetailsText}>Подробнее</Text>
          {LocalIcons.arrow({ size: 16, color: "#0863a7" })}
        </TouchableOpacity>
      </View>
    </View>
  );

return (
    <TouchableWithoutFeedback onPress={() => setShowSortMenu(false)}>
      <View style={styles.container}>
        {/* Заголовок */}
        <LinearGradient colors={['#0863a7', '#074393']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              {LocalIcons.arrowBack({ size: 24, color: '#ffffff' })}
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Каталог обращений</Text>
            
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.sortButton}
                onPress={() => setShowSortMenu(!showSortMenu)}
              >
                <Text style={styles.sortButtonText}>{getSortLabel()}</Text>
                {LocalIcons.chevron({ size: 16, color: "#ffffff" })}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => setShowSearch(!showSearch)}
              >
                {LocalIcons.search({ size: 24, color: "#ffffff" })}
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Выпадающее меню сортировки */}
            {showSortMenu && (
          <View style={styles.sortMenu}>
            <TouchableOpacity 
              style={styles.sortMenuItem}
              onPress={() => handleSortSelect('newest')}
            >
              <Text style={[
                styles.sortMenuItemText,
                sortOrder === 'newest' && styles.sortMenuItemTextActive
              ]}>
                Новые сначала
              </Text>
              {sortOrder === 'newest' && (
                <Text style={styles.sortMenuItemCheck}>✓</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.sortMenuItem}
              onPress={() => handleSortSelect('oldest')}
            >
              <Text style={[
                styles.sortMenuItemText,
                sortOrder === 'oldest' && styles.sortMenuItemTextActive
              ]}>
                Старые сначала
              </Text>
              {sortOrder === 'oldest' && (
                <Text style={styles.sortMenuItemCheck}>✓</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Статистика */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.statIcon}>
              {LocalIcons.document ? LocalIcons.document({ size: 16, color: "#ffffff" }) : 
                <Text style={{ color: "#ffffff", fontSize: 14 }}>📄</Text>
              }
            </LinearGradient>
            <Text style={styles.statNumber}>{filteredRequestsCount}</Text>
            <Text style={styles.statLabel}>Обращений</Text>
          </View>
          
          <View style={styles.statItem}>
            <LinearGradient colors={['#60caac', '#9ad0e7']} style={styles.statIcon}>
              {LocalIcons.analytics ? LocalIcons.analytics({ size: 16, color: "#ffffff" }) : 
                <Text style={{ color: "#ffffff", fontSize: 14 }}>📊</Text>
              }
            </LinearGradient>
            <Text style={styles.statNumber}>{recommendationsCount}</Text>
            <Text style={styles.statLabel}>Рекомендаций</Text>
          </View>
          
          <View style={styles.statItem}>
            <LinearGradient colors={['#ff6b35', '#ff8c42']} style={styles.statIcon}>
              {LocalIcons.medical ? LocalIcons.medical({ size: 16, color: "#ffffff" }) : 
                <Text style={{ color: "#ffffff", fontSize: 14 }}>🏥</Text>
              }
            </LinearGradient>
            <Text style={styles.statNumber}>{appointmentsCount}</Text>
            <Text style={styles.statLabel}>Записей</Text>
          </View>
        </View>
        

        {/* Поиск */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              {LocalIcons.search({ size: 20, color: "#0863a7" })}
              <TextInput
                style={styles.searchInput}
                placeholder="Поиск по обращениям..."
                placeholderTextColor="#9ad0e7"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  {LocalIcons.close({ size: 20, color: "#0863a7" })}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Фильтры по датам */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dateFilters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selectedDateFilter === filter.id && styles.filterButtonActive
                ]}
                onPress={() => setSelectedDateFilter(filter.id)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedDateFilter === filter.id && styles.filterButtonTextActive
                ]}>
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>


            {/* Список обращений */}
            <View style={styles.requestsListHeader}>
              <Text style={styles.requestsListTitle}>
                {isLoading ? 'Загрузка обращений...' : `Найдено обращений: ${filteredRequests.length}`}
              </Text>
            </View>
            <View style={styles.requestsList}>
              {isLoading ? (
                <View style={styles.loadingState}>
                  <Text style={styles.loadingStateText}>Загрузка обращений...</Text>
                </View>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map(renderRequestCard)
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    {requests.length === 0 ? 'У вас пока нет обращений' : 'Обращения не найдены'}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Отступ для нижней панели навигации
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
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    padding: 5,
    marginLeft: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textPrimary,
    marginLeft: 10,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: '#0863a7',
    borderColor: '#0863a7',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textPrimary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  requestsListHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  requestsListTitle: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  requestsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  requestCard: {
    backgroundColor: colors.background,
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  requestInfo: {
    flex: 1,
  },
  requestDate: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    marginBottom: 5,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    fontWeight: '600',
  },
  statusContainer: {
    marginLeft: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22ae2c',
  },
  requestContent: {
    marginBottom: 15,
  },
  requestTitle: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
    marginTop: 10,
  },
  requestQuery: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  aiResponse: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.primary,
    lineHeight: 20,
  },
  symptomsContainer: {
    marginTop: 15,
  },
  symptomsTitle: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  symptomsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  symptomText: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    color: colors.primary,
  },
  requestFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.primary,
    fontWeight: '600',
    marginRight: 5,
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  loadingStateText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: 'Open Sauce',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: 'Open Sauce',
    marginTop: 1,
    textAlign: 'center',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sortButtonText: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    fontWeight: '500',
    marginRight: 4,
  },
  sortMenu: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: colors.background,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    minWidth: 150,
  },
  sortMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortMenuItemText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textPrimary,
    fontWeight: '500',
  },
  sortMenuItemTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  sortMenuItemCheck: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
});


