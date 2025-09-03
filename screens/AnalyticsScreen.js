import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';

export default function AnalyticsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Все', icon: 'apps' },
    { id: 'text', name: 'Текст', icon: 'document-text' },
    { id: 'image', name: 'Изображения', icon: 'image' },
    { id: 'data', name: 'Данные', icon: 'analytics' },
    { id: 'voice', name: 'Голос', icon: 'mic' }
  ];

  const analyticsTools = [
    {
      id: 1,
      name: 'Анализ текста',
      description: 'Семантический анализ и извлечение ключевых фраз',
      icon: 'document-text',
      color: ['#22ae2c', '#5cc72f'],
      category: 'text'
    },
    {
      id: 2,
      name: 'Распознавание изображений',
      description: 'Компьютерное зрение и анализ объектов',
      icon: 'eye',
      color: ['#60caac', '#9ad0e7'],
      category: 'image'
    },
    {
      id: 3,
      name: 'Анализ данных',
      description: 'Статистический анализ и визуализация',
      icon: 'analytics',
      color: ['#2571aa', '#0b417a'],
      category: 'data'
    },
    {
      id: 4,
      name: 'Распознавание речи',
      description: 'Преобразование речи в текст',
      icon: 'mic',
      color: ['#22ae2c', '#5cc72f'],
      category: 'voice'
    },
    {
      id: 5,
      name: 'Сентимент анализ',
      description: 'Анализ эмоциональной окраски текста',
      icon: 'heart',
      color: ['#ff4444', '#d32f2f'],
      category: 'text'
    },
    {
      id: 6,
      name: 'Классификация данных',
      description: 'Автоматическая категоризация информации',
      icon: 'layers',
      color: ['#60caac', '#9ad0e7'],
      category: 'data'
    }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? analyticsTools 
    : analyticsTools.filter(tool => tool.category === selectedCategory);

  const handleToolPress = (tool) => {
    console.log('Выбран инструмент:', tool.name);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0863a7', '#074393']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Аналитика</Text>
        <Text style={styles.headerSubtitle}>Инструменты для анализа данных</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Категории */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <LinearGradient
                  colors={selectedCategory === category.id 
                    ? ['#22ae2c', '#5cc72f'] 
                    : ['#ffffff', '#f8f9fa']
                  }
                  style={styles.categoryIcon}
                >
                  {LocalIcons[category.icon] ? 
                    LocalIcons[category.icon]({ 
                      size: 20, 
                      color: selectedCategory === category.id ? '#ffffff' : '#0863a7' 
                    }) : 
                    <Text style={{ 
                      color: selectedCategory === category.id ? '#ffffff' : '#0863a7', 
                      fontSize: 16 
                    }}>?</Text>
                  }
                </LinearGradient>
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategory === category.id ? '#22ae2c' : '#666666' }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Инструменты анализа */}
        <View style={styles.toolsSection}>
          <Text style={styles.sectionTitle}>Инструменты анализа</Text>
          {filteredTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={() => handleToolPress(tool)}
            >
              <LinearGradient
                colors={tool.color}
                style={styles.toolIcon}
              >
                {LocalIcons[tool.icon] ? 
                  LocalIcons[tool.icon]({ size: 24, color: "#ffffff" }) : 
                  <Text style={{ color: "#ffffff", fontSize: 16 }}>?</Text>
                }
              </LinearGradient>
              <View style={styles.toolContent}>
                <Text style={styles.toolName}>{tool.name}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </View>
              {LocalIcons['chevron-forward']({ size: 20, color: "#9ad0e7" })}
            </TouchableOpacity>
          ))}
        </View>

        {/* Статистика использования */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Статистика использования</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#22ae2c', '#5cc72f']}
                style={styles.statIcon}
              >
                {LocalIcons['trending-up']({ size: 24, color: "#ffffff" })}
              </LinearGradient>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Анализов сегодня</Text>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#60caac', '#9ad0e7']}
                style={styles.statIcon}
              >
                {LocalIcons.time({ size: 24, color: "#ffffff" })}
              </LinearGradient>
              <Text style={styles.statNumber}>2.3s</Text>
              <Text style={styles.statLabel}>Среднее время</Text>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#2571aa', '#0b417a']}
                style={styles.statIcon}
              >
                {LocalIcons['checkmark-circle']({ size: 24, color: "#ffffff" })}
              </LinearGradient>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Точность</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 10,
  },
  categoryButtonActive: {
    // Активное состояние уже обрабатывается в стилях
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  toolsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0863a7',
    marginBottom: 15,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  toolIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  toolContent: {
    flex: 1,
  },
  toolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0863a7',
    marginBottom: 5,
  },
  toolDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  statsSection: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
    color: '#0863a7',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});
