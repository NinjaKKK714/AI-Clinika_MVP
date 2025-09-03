import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';

export default function RequestDetailScreen({ route, navigation }) {
  const { request } = route.params;
  
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

  const renderSymptomItem = (symptom, index) => (
    <View key={index} style={styles.symptomItem}>
      <View style={styles.symptomIcon}>
        <LinearGradient colors={['#0863a7', '#074393']} style={styles.iconGradient}>
          {LocalIcons.medical({ size: 16, color: "#ffffff" })}
        </LinearGradient>
      </View>
      <Text style={styles.symptomText}>{symptom}</Text>
    </View>
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
            
            <Text style={styles.headerTitle}>Детали обращения</Text>
            
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Основная информация */}
          <View style={styles.mainInfo}>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                {LocalIcons.time({ size: 20, color: "#0863a7" })}
                <Text style={styles.dateTimeText}>{request.date}</Text>
              </View>
              <View style={styles.dateTimeItem}>
                {LocalIcons.time({ size: 20, color: "#0863a7" })}
                <Text style={styles.dateTimeText}>{request.time}</Text>
              </View>
            </View>

            <View style={styles.categoryContainer}>
              <LinearGradient colors={['#0863a7', '#074393']} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{request.category}</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Запрос пользователя */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.sectionIcon}>
                {LocalIcons.user({ size: 20, color: "#ffffff" })}
              </LinearGradient>
              <Text style={styles.sectionTitle}>Ваш запрос</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.userQuery}>{request.userQuery}</Text>
            </View>
          </View>

          {/* Ответ ИИ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <LinearGradient colors={['#0863a7', '#074393']} style={styles.sectionIcon}>
                {LocalIcons.brain({ size: 20, color: "#ffffff" })}
              </LinearGradient>
              <Text style={styles.sectionTitle}>Ответ ИИ</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.aiResponse}>{request.aiResponse}</Text>
            </View>
          </View>

          {/* Симптомы */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <LinearGradient colors={['#ff4444', '#d32f2f']} style={styles.sectionIcon}>
                {LocalIcons.medical({ size: 20, color: "#ffffff" })}
              </LinearGradient>
              <Text style={styles.sectionTitle}>Выявленные симптомы</Text>
            </View>
            <View style={styles.sectionContent}>
              {request.symptoms.map(renderSymptomItem)}
            </View>
          </View>

          {/* Рекомендации */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.sectionIcon}>
                {LocalIcons.star({ size: 20, color: "#ffffff" })}
              </LinearGradient>
              <Text style={styles.sectionTitle}>Рекомендации</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationText}>
                  • Обратитесь к специалисту в области {request.category.toLowerCase()}
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationText}>
                  • Ведите дневник симптомов для отслеживания динамики
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationText}>
                  • При ухудшении состояния немедленно обратитесь к врачу
                </Text>
              </View>
            </View>
          </View>

          {/* Статус */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.sectionIcon}>
                {LocalIcons.checkmark({ size: 20, color: "#ffffff" })}
              </LinearGradient>
              <Text style={styles.sectionTitle}>Статус обращения</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Завершено</Text>
              </View>
            </View>
          </View>
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
  headerRight: {
    width: 34,
  },
  scrollContent: {
    flex: 1,
  },
  mainInfo: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#333333',
    marginLeft: 8,
    fontWeight: '600',
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  categoryBadge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    fontWeight: '600',
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#333333',
  },
  sectionContent: {
    paddingLeft: 52,
  },
  userQuery: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#333333',
    lineHeight: 24,
  },
  aiResponse: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#0863a7',
    lineHeight: 24,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  symptomIcon: {
    marginRight: 12,
  },
  iconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symptomText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#333333',
    flex: 1,
  },
  recommendationItem: {
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#333333',
    lineHeight: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22ae2c',
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#22ae2c',
    fontWeight: '600',
  },
});


