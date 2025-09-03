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
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';

const { width } = Dimensions.get('window');

export default function ClinicsScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('dentist');
  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('clinics'); // 'clinics' или 'specialists'
  
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

  const categories = [
    { id: 'all', name: 'Все' },
    { id: 'dentist', name: 'Стоматолог' },
    { id: 'cardiologist', name: 'Кардиолог' },
    { id: 'dermatologist', name: 'Дерматолог' },
    { id: 'neurologist', name: 'Невролог' },
    { id: 'orthopedist', name: 'Ортопед' },
  ];

  const clinics = [
    {
      id: 1,
      name: 'Клиника "Сердце"',
      services: 'Кардиология, Стоматология',
      location: 'ул. Абая 150, Алматы',
      distance: '15 мин • 1.5 км',
      rating: 4.8,
      reviews: '1k+',
      image: require('../ai.png'),
      category: 'cardiologist',
      description: 'Современная клиника с передовым оборудованием для диагностики и лечения сердечно-сосудистых заболеваний. Опытные кардиологи и стоматологи.',
      phone: '+7 (727) 123-45-67',
      workingHours: 'Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00',
      coordinates: { latitude: 43.238949, longitude: 76.889709 }
    },
    {
      id: 2,
      name: 'Медицинский центр "Здоровье"',
      services: 'Стоматология, Дерматология',
      location: 'пр. Достык 45, Алматы',
      distance: '20 мин • 2.1 км',
      rating: 4.6,
      reviews: '850+',
      image: require('../ai.png'),
      category: 'dentist',
      description: 'Специализированный центр стоматологии и дерматологии. Используем современные технологии и материалы.',
      phone: '+7 (727) 234-56-78',
      workingHours: 'Пн-Сб: 9:00-19:00, Вс: 10:00-16:00',
      coordinates: { latitude: 43.238949, longitude: 76.889709 }
    },
    {
      id: 3,
      name: 'Клиника "Современная медицина"',
      services: 'Неврология, Ортопедия',
      location: 'ул. Толе би 78, Алматы',
      distance: '25 мин • 3.2 км',
      rating: 4.9,
      reviews: '1.2k+',
      image: require('../ai.png'),
      category: 'neurologist',
      description: 'Ведущая клиника в области неврологии и ортопедии. Инновационные методы лечения и реабилитации.',
      phone: '+7 (727) 345-67-89',
      workingHours: 'Пн-Пт: 8:00-21:00, Сб: 9:00-17:00',
      coordinates: { latitude: 43.238949, longitude: 76.889709 }
    },
    {
      id: 4,
      name: 'Медицинский центр "Эксперт"',
      services: 'Дерматология, Стоматология',
      location: 'пр. Аль-Фараби 120, Алматы',
      distance: '18 мин • 2.8 км',
      rating: 4.7,
      reviews: '950+',
      image: require('../ai.png'),
      category: 'dermatologist',
      description: 'Экспертный центр дерматологии с современной лабораторией и диагностическим оборудованием.',
      phone: '+7 (727) 456-78-90',
      workingHours: 'Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00',
      coordinates: { latitude: 43.238949, longitude: 76.889709 }
    },
    {
      id: 5,
      name: 'Клиника "Ортопедия+"',
      services: 'Ортопедия, Кардиология',
      location: 'ул. Сатпаева 90, Алматы',
      distance: '22 мин • 2.5 км',
      rating: 4.5,
      reviews: '720+',
      image: require('../ai.png'),
      category: 'orthopedist',
      description: 'Специализированная клиника ортопедии с отделением кардиологии. Современные методы лечения.',
      phone: '+7 (727) 567-89-01',
      workingHours: 'Пн-Пт: 8:00-19:00, Сб: 9:00-16:00',
      coordinates: { latitude: 43.238949, longitude: 76.889709 }
    },
    {
      id: 6,
      name: 'Клиника "ДентаЛюкс"',
      services: 'Стоматология, Хирургия',
      location: 'ул. Фурманова 25, Алматы',
      distance: '12 мин • 1.8 км',
      rating: 4.9,
      reviews: '1.5k+',
      image: require('../ai.png'),
      category: 'dentist',
      description: 'Премиальная стоматологическая клиника с хирургическим отделением. Используем лучшие материалы и технологии.',
      phone: '+7 (727) 678-90-12',
      workingHours: 'Пн-Сб: 8:00-20:00, Вс: 10:00-17:00',
      coordinates: { latitude: 43.238949, longitude: 76.889709 }
    },
    {
      id: 7,
      name: 'Медицинский центр "КардиоПлюс"',
      services: 'Кардиология, Диагностика',
      location: 'пр. Республики 85, Алматы',
      distance: '30 мин • 4.1 км',
      rating: 4.8,
      reviews: '980+',
      image: require('../ai.png'),
      category: 'cardiologist',
      description: 'Специализированный кардиологический центр с полным спектром диагностических услуг.',
      phone: '+7 (727) 789-01-23',
      workingHours: 'Пн-Пт: 7:00-22:00, Сб-Вс: 8:00-18:00',
      coordinates: { latitude: 43.238949, longitude: 76.889709 }
    },
    {
      id: 8,
      name: 'Клиника "ДермаСтандарт"',
      services: 'Дерматология, Косметология',
      location: 'ул. Байтурсынова 45, Алматы',
      distance: '16 мин • 2.3 км',
      rating: 4.6,
      reviews: '820+',
      image: require('../ai.png'),
      category: 'dermatologist',
      description: 'Современная дерматологическая клиника с косметологическим отделением.',
      phone: '+7 (727) 890-12-34',
      workingHours: 'Пн-Пт: 9:00-19:00, Сб: 10:00-16:00',
      coordinates: { latitude: 43.238949, longitude: 76.889709 }
    },
    {
      id: 9,
      name: 'Неврологический центр "Мозг"',
      services: 'Неврология, Психиатрия',
      location: 'ул. Желтоксан 67, Алматы',
      distance: '28 мин • 3.8 км',
      rating: 4.7,
      reviews: '1.1k+',
      image: require('../ai.png'),
      category: 'neurologist',
      description: 'Специализированный неврологический центр с отделением психиатрии.',
      phone: '+7 (727) 901-23-45',
      workingHours: 'Пн-Пт: 8:00-20:00, Сб: 9:00-17:00',
      coordinates: { latitude: 43.238949, longitude: 76.889709 }
    },
    {
      id: 10,
      name: 'Ортопедический центр "Скелет"',
      services: 'Ортопедия, Травматология',
      location: 'пр. Абылай хана 112, Алматы',
      distance: '24 мин • 3.5 км',
      rating: 4.4,
      reviews: '650+',
      image: require('../ai.png'),
      category: 'orthopedist',
      description: 'Специализированный ортопедический центр с травматологическим отделением.',
      phone: '+7 (727) 012-34-56',
      workingHours: 'Пн-Пт: 8:00-19:00, Сб: 9:00-16:00',
      coordinates: { latitude: 43.238949, longitude: 76.889709 }
    },
  ];

  const specialists = [
    {
      id: 1,
      name: 'Доктор Ахметов А.К.',
      specialization: 'Кардиолог',
      experience: '15 лет опыта',
      rating: 4.9,
      reviews: '450+',
      location: 'ул. Абая 150, Алматы',
      distance: '15 мин • 1.5 км',
      image: require('../ai.png'),
      category: 'cardiologist',
      description: 'Ведущий кардиолог с 15-летним опытом работы. Специализируется на лечении сердечно-сосудистых заболеваний.',
      phone: '+7 (727) 123-45-67',
      workingHours: 'Пн-Пт: 9:00-18:00',
      education: 'Алматинский медицинский университет',
      languages: ['Казахский', 'Русский', 'Английский']
    },
    {
      id: 2,
      name: 'Доктор Смирнова Е.В.',
      specialization: 'Стоматолог',
      experience: '12 лет опыта',
      rating: 4.8,
      reviews: '380+',
      location: 'пр. Достык 45, Алматы',
      distance: '20 мин • 2.1 км',
      image: require('../ai.png'),
      category: 'dentist',
      description: 'Опытный стоматолог-терапевт. Специализируется на лечении кариеса и эстетической реставрации.',
      phone: '+7 (727) 234-56-78',
      workingHours: 'Пн-Сб: 9:00-19:00',
      education: 'Казахский национальный медицинский университет',
      languages: ['Русский', 'Казахский']
    },
    {
      id: 3,
      name: 'Доктор Ким Д.С.',
      specialization: 'Невролог',
      experience: '18 лет опыта',
      rating: 4.9,
      reviews: '520+',
      location: 'ул. Толе би 78, Алматы',
      distance: '25 мин • 3.2 км',
      image: require('../ai.png'),
      category: 'neurologist',
      description: 'Высококвалифицированный невролог с опытом работы в ведущих клиниках. Специалист по лечению мигрени.',
      phone: '+7 (727) 345-67-89',
      workingHours: 'Пн-Пт: 8:00-17:00',
      education: 'Московский медицинский университет',
      languages: ['Русский', 'Английский', 'Корейский']
    },
    {
      id: 4,
      name: 'Доктор Ибрагимов М.А.',
      specialization: 'Дерматолог',
      experience: '10 лет опыта',
      rating: 4.7,
      reviews: '320+',
      location: 'пр. Аль-Фараби 120, Алматы',
      distance: '18 мин • 2.8 км',
      image: require('../ai.png'),
      category: 'dermatologist',
      description: 'Специалист по лечению кожных заболеваний и косметологии. Опыт работы в дерматологии.',
      phone: '+7 (727) 456-78-90',
      workingHours: 'Пн-Пт: 9:00-18:00',
      education: 'Алматинский медицинский университет',
      languages: ['Казахский', 'Русский']
    },
    {
      id: 5,
      name: 'Доктор Петров В.И.',
      specialization: 'Ортопед',
      experience: '20 лет опыта',
      rating: 4.8,
      reviews: '410+',
      location: 'ул. Сатпаева 90, Алматы',
      distance: '22 мин • 2.5 км',
      image: require('../ai.png'),
      category: 'orthopedist',
      description: 'Ортопед-травматолог с большим опытом в лечении заболеваний опорно-двигательного аппарата.',
      phone: '+7 (727) 567-89-01',
      workingHours: 'Пн-Пт: 8:00-17:00',
      education: 'Казахский национальный медицинский университет',
      languages: ['Русский', 'Казахский']
    },
    {
      id: 6,
      name: 'Доктор Жанузакова А.М.',
      specialization: 'Стоматолог-хирург',
      experience: '14 лет опыта',
      rating: 4.9,
      reviews: '480+',
      location: 'ул. Фурманова 25, Алматы',
      distance: '12 мин • 1.8 км',
      image: require('../ai.png'),
      category: 'dentist',
      description: 'Стоматолог-хирург с опытом проведения сложных операций. Специалист по имплантации.',
      phone: '+7 (727) 678-90-12',
      workingHours: 'Пн-Сб: 8:00-18:00',
      education: 'Алматинский медицинский университет',
      languages: ['Казахский', 'Русский', 'Английский']
    },
    {
      id: 7,
      name: 'Доктор Нурланов Б.К.',
      specialization: 'Кардиолог',
      experience: '16 лет опыта',
      rating: 4.7,
      reviews: '360+',
      location: 'пр. Республики 85, Алматы',
      distance: '30 мин • 4.1 км',
      image: require('../ai.png'),
      category: 'cardiologist',
      description: 'Кардиолог-аритмолог. Специализируется на лечении нарушений сердечного ритма.',
      phone: '+7 (727) 789-01-23',
      workingHours: 'Пн-Пт: 9:00-19:00',
      education: 'Казахский национальный медицинский университет',
      languages: ['Казахский', 'Русский']
    },
    {
      id: 8,
      name: 'Доктор Васильева О.П.',
      specialization: 'Дерматолог-косметолог',
      experience: '11 лет опыта',
      rating: 4.6,
      reviews: '290+',
      location: 'ул. Байтурсынова 45, Алматы',
      distance: '16 мин • 2.3 км',
      image: require('../ai.png'),
      category: 'dermatologist',
      description: 'Дерматолог-косметолог. Специализируется на эстетической медицине и лечении акне.',
      phone: '+7 (727) 890-12-34',
      workingHours: 'Пн-Пт: 9:00-18:00',
      education: 'Московский медицинский университет',
      languages: ['Русский', 'Английский']
    },
    {
      id: 9,
      name: 'Доктор Алиев Р.М.',
      specialization: 'Невролог',
      experience: '13 лет опыта',
      rating: 4.8,
      reviews: '340+',
      location: 'ул. Желтоксан 67, Алматы',
      distance: '28 мин • 3.8 км',
      image: require('../ai.png'),
      category: 'neurologist',
      description: 'Невролог-эпилептолог. Специализируется на диагностике и лечении эпилепсии.',
      phone: '+7 (727) 901-23-45',
      workingHours: 'Пн-Пт: 8:00-17:00',
      education: 'Алматинский медицинский университет',
      languages: ['Казахский', 'Русский', 'Английский']
    },
    {
      id: 10,
      name: 'Доктор Соколов А.В.',
      specialization: 'Ортопед-травматолог',
      experience: '17 лет опыта',
      rating: 4.5,
      reviews: '280+',
      location: 'пр. Абылай хана 112, Алматы',
      distance: '24 мин • 3.5 км',
      image: require('../ai.png'),
      category: 'orthopedist',
      description: 'Ортопед-травматолог. Специализируется на лечении спортивных травм и артроскопии.',
      phone: '+7 (727) 012-34-56',
      workingHours: 'Пн-Пт: 8:00-17:00',
      education: 'Казахский национальный медицинский университет',
      languages: ['Русский', 'Казахский']
    }
  ];

  const filteredClinics = clinics
    .filter(clinic => selectedCategory === 'all' || clinic.category === selectedCategory)
    .filter(clinic => 
      searchQuery === '' || 
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.services.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredSpecialists = specialists
    .filter(specialist => selectedCategory === 'all' || specialist.category === selectedCategory)
    .filter(specialist => 
      searchQuery === '' || 
      specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialist.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialist.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const toggleFavorite = (clinicId) => {
    setFavorites(prev => ({
      ...prev,
      [clinicId]: !prev[clinicId]
    }));
  };

  const renderClinicCard = (clinic) => (
    <TouchableOpacity 
      key={clinic.id} 
      style={styles.clinicCard}
      onPress={() => navigation.navigate('ClinicDetail', { clinic })}
    >
      <View style={styles.clinicImageContainer}>
        <Image
          source={clinic.image}
          style={styles.clinicImage}
          resizeMode="cover"
        />
        
        {/* Рейтинг */}
        <View style={styles.ratingOverlay}>
          <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.ratingGradient}>
            <View style={styles.ratingContent}>
              {LocalIcons.star({ size: 12, color: "#ffffff" })}
              <Text style={styles.ratingText}>{clinic.rating}</Text>
              <Text style={styles.reviewsText}>({clinic.reviews})</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Кнопка избранного */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(clinic.id)}
        >
          <LinearGradient 
            colors={favorites[clinic.id] ? ['#ff4444', '#d32f2f'] : ['#ffffff', '#f8f9fa']} 
            style={styles.favoriteGradient}
          >
            {LocalIcons.heart({ 
              size: 20, 
              color: favorites[clinic.id] ? "#ffffff" : "#ff4444" 
            })}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.clinicInfo}>
        <Text style={styles.clinicName}>{clinic.name}</Text>
        <Text style={styles.clinicServices}>{clinic.services}</Text>
        
        <View style={styles.locationContainer}>
          {LocalIcons.location({ size: 16, color: "#0863a7" })}
          <Text style={styles.locationText}>{clinic.location}</Text>
        </View>
        
        <View style={styles.distanceContainer}>
          {LocalIcons.time({ size: 16, color: "#0863a7" })}
          <Text style={styles.distanceText}>{clinic.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSpecialistCard = (specialist) => (
    <TouchableOpacity 
      key={specialist.id} 
      style={styles.clinicCard}
      onPress={() => navigation.navigate('SpecialistDetail', { specialist })}
    >
      <View style={styles.clinicImageContainer}>
        <Image
          source={specialist.image}
          style={styles.clinicImage}
          resizeMode="cover"
        />
        
        {/* Рейтинг */}
        <View style={styles.ratingOverlay}>
          <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.ratingGradient}>
            <View style={styles.ratingContent}>
              {LocalIcons.star({ size: 12, color: "#ffffff" })}
              <Text style={styles.ratingText}>{specialist.rating}</Text>
              <Text style={styles.reviewsText}>({specialist.reviews})</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Кнопка избранного */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(specialist.id)}
        >
          <LinearGradient 
            colors={favorites[specialist.id] ? ['#ff4444', '#d32f2f'] : ['#ffffff', '#f8f9fa']} 
            style={styles.favoriteGradient}
          >
            {LocalIcons.heart({ 
              size: 20, 
              color: favorites[specialist.id] ? "#ffffff" : "#ff4444" 
            })}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.clinicInfo}>
        <Text style={styles.clinicName}>{specialist.name}</Text>
        <Text style={styles.clinicServices}>{specialist.specialization} • {specialist.experience}</Text>
        
        <View style={styles.locationContainer}>
          {LocalIcons.location({ size: 16, color: "#0863a7" })}
          <Text style={styles.locationText}>{specialist.location}</Text>
        </View>
        
        <View style={styles.distanceContainer}>
          {LocalIcons.time({ size: 16, color: "#0863a7" })}
          <Text style={styles.distanceText}>{specialist.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Заголовок */}
        <LinearGradient colors={['#0863a7', '#074393']} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Медицинские услуги</Text>
            
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => setShowSearch(!showSearch)}
            >
              {LocalIcons.search({ size: 24, color: "#ffffff" })}
            </TouchableOpacity>
          </View>

          {/* Подвкладки */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'clinics' && styles.tabButtonActive]}
              onPress={() => setActiveTab('clinics')}
            >
              <Text style={[styles.tabButtonText, activeTab === 'clinics' && styles.tabButtonTextActive]}>
                Клиники
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'specialists' && styles.tabButtonActive]}
              onPress={() => setActiveTab('specialists')}
            >
              <Text style={[styles.tabButtonText, activeTab === 'specialists' && styles.tabButtonTextActive]}>
                Специалисты
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Поиск */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              {LocalIcons.search({ size: 20, color: "#0863a7" })}
              <TextInput
                style={styles.searchInput}
                placeholder={activeTab === 'clinics' ? "Поиск клиник..." : "Поиск специалистов..."}
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

        {/* Фильтры категорий */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterButton,
                  selectedCategory === category.id && styles.filterButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedCategory === category.id && styles.filterButtonTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Список клиник или специалистов */}
        <ScrollView style={styles.clinicsList} showsVerticalScrollIndicator={false}>
          {activeTab === 'clinics' ? (
            filteredClinics.length > 0 ? (
              filteredClinics.map(renderClinicCard)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Клиники не найдены</Text>
              </View>
            )
          ) : (
            filteredSpecialists.length > 0 ? (
              filteredSpecialists.map(renderSpecialistCard)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Специалисты не найдены</Text>
              </View>
            )
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
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#ffffff',
  },
  tabButtonTextActive: {
    color: '#0863a7',
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
  clinicsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  clinicCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  clinicImageContainer: {
    position: 'relative',
    height: 200,
  },
  clinicImage: {
    width: '100%',
    height: '100%',
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  ratingGradient: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 2,
  },
  reviewsText: {
    fontSize: 10,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    marginLeft: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  favoriteGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  clinicInfo: {
    padding: 20,
  },
  clinicName: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  clinicServices: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#666666',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#333333',
    marginLeft: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#333333',
    marginLeft: 8,
  },
});
