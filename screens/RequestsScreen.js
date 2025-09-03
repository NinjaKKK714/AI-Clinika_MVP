import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  TextInput,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';

const { width } = Dimensions.get('window');

export default function RequestsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  
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

  const dateFilters = [
    { id: 'all', name: 'Все' },
    { id: 'today', name: 'Сегодня' },
    { id: 'week', name: 'Неделя' },
    { id: 'month', name: 'Месяц' },
    { id: 'year', name: 'Год' },
  ];

  const requests = [
    {
      id: 1,
      date: '15.12.2024',
      time: '14:30',
      userQuery: 'Болит голова и тошнит уже 3 дня',
      aiResponse: 'По описанным симптомам возможно у вас мигрень или пищевое отравление. Рекомендую обратиться к неврологу для диагностики.',
      symptoms: ['Головная боль', 'Тошнота', 'Слабость'],
      category: 'Неврология',
      status: 'completed'
    },
    {
      id: 2,
      date: '14.12.2024',
      time: '09:15',
      userQuery: 'Покраснение и зуд на коже рук',
      aiResponse: 'Симптомы указывают на аллергическую реакцию или дерматит. Проконсультируйтесь с дерматологом.',
      symptoms: ['Покраснение кожи', 'Зуд', 'Сыпь'],
      category: 'Дерматология',
      status: 'completed'
    },
    {
      id: 3,
      date: '13.12.2024',
      time: '16:45',
      userQuery: 'Боли в груди при физической нагрузке',
      aiResponse: 'Это может быть признаком сердечно-сосудистых проблем. Немедленно обратитесь к кардиологу.',
      symptoms: ['Боль в груди', 'Одышка', 'Усталость'],
      category: 'Кардиология',
      status: 'completed'
    },
    {
      id: 4,
      date: '12.12.2024',
      time: '11:20',
      userQuery: 'Боли в спине после поднятия тяжестей',
      aiResponse: 'Возможно растяжение мышц или проблемы с позвоночником. Рекомендую консультацию ортопеда.',
      symptoms: ['Боль в спине', 'Скованность', 'Ограничение движений'],
      category: 'Ортопедия',
      status: 'completed'
    },
    {
      id: 5,
      date: '11.12.2024',
      time: '13:10',
      userQuery: 'Проблемы со сном и тревожность',
      aiResponse: 'Симптомы могут указывать на неврологические или психиатрические проблемы. Обратитесь к специалисту.',
      symptoms: ['Бессонница', 'Тревожность', 'Раздражительность'],
      category: 'Неврология',
      status: 'completed'
    },
    {
      id: 6,
      date: '10.12.2024',
      time: '08:30',
      userQuery: 'Боли в зубах и чувствительность к холодному',
      aiResponse: 'Возможно кариес или воспаление нерва. Необходима консультация стоматолога.',
      symptoms: ['Зубная боль', 'Чувствительность', 'Дискомфорт'],
      category: 'Стоматология',
      status: 'completed'
    },
  ];

  const filteredRequests = requests
    .filter(request => 
      searchQuery === '' || 
      request.userQuery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.aiResponse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.symptoms.some(symptom => 
        symptom.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .filter(request => {
      if (selectedDateFilter === 'all') return true;
      // Здесь можно добавить логику фильтрации по датам
      return true;
    });

  const renderRequestCard = (request) => (
    <TouchableOpacity 
      key={request.id} 
      style={styles.requestCard}
      onPress={() => navigation.navigate('RequestDetail', { request })}
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
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>Подробнее</Text>
          {LocalIcons.arrow({ size: 16, color: "#0863a7" })}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Заголовок */}
        <LinearGradient colors={['#0863a7', '#074393']} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Каталог обращений</Text>
            
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => setShowSearch(!showSearch)}
            >
              {LocalIcons.search({ size: 24, color: "#ffffff" })}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Статистика */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.statIcon}>
              {LocalIcons.document ? LocalIcons.document({ size: 24, color: "#ffffff" }) : 
                <Text style={{ color: "#ffffff", fontSize: 20 }}>📄</Text>
              }
            </LinearGradient>
            <Text style={styles.statNumber}>{requests.length}</Text>
            <Text style={styles.statLabel}>Обращений</Text>
          </View>
          
          <View style={styles.statItem}>
            <LinearGradient colors={['#60caac', '#9ad0e7']} style={styles.statIcon}>
              {LocalIcons.analytics ? LocalIcons.analytics({ size: 24, color: "#ffffff" }) : 
                <Text style={{ color: "#ffffff", fontSize: 20 }}>📊</Text>
              }
            </LinearGradient>
            <Text style={styles.statNumber}>{requests.length}</Text>
            <Text style={styles.statLabel}>Рекомендаций</Text>
          </View>
          
          <View style={styles.statItem}>
            <LinearGradient colors={['#ff6b35', '#ff8c42']} style={styles.statIcon}>
              {LocalIcons.medical ? LocalIcons.medical({ size: 24, color: "#ffffff" }) : 
                <Text style={{ color: "#ffffff", fontSize: 20 }}>🏥</Text>
              }
            </LinearGradient>
            <Text style={styles.statNumber}>12</Text>
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
        <ScrollView style={styles.requestsList} showsVerticalScrollIndicator={false}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map(renderRequestCard)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Обращения не найдены</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  searchButton: {
    padding: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#333333',
    marginLeft: 10,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#0863a7',
    borderColor: '#0863a7',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#333333',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  requestsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  requestCard: {
    backgroundColor: '#ffffff',
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
    color: '#666666',
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
    color: '#333333',
    marginBottom: 5,
    marginTop: 10,
  },
  requestQuery: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#666666',
    lineHeight: 20,
  },
  aiResponse: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#0863a7',
    lineHeight: 20,
  },
  symptomsContainer: {
    marginTop: 15,
  },
  symptomsTitle: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#333333',
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
    borderColor: '#e0e0e0',
  },
  symptomText: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    color: '#0863a7',
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
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#0863a7',
    fontWeight: '600',
    marginRight: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#666666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Open Sauce',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Open Sauce',
    marginTop: 2,
  },
});


