import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Modal, 
  Alert,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalIcons from '../components/LocalIcons';
import { useTheme } from '../themes/useTheme';

const screenWidth = Dimensions.get('window').width;

export default function ExpensesScreen({ onBack }) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  
  const [activeTimeFilter, setActiveTimeFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expenses, setExpenses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const timeFilters = [
    { key: 'all', label: 'Все' },
    { key: 'today', label: 'Сегодня' },
    { key: 'week', label: 'Неделя' },
    { key: 'month', label: 'Месяц' },
    { key: 'year', label: 'Год' }
  ];

  const categories = [
    { key: 'all', label: 'Все', icon: 'list' },
    { key: 'medications', label: 'Препараты', icon: 'pills' },
    { key: 'tests', label: 'Анализы', icon: 'flask' },
    { key: 'diagnostics', label: 'Диагностика', icon: 'stethoscope' },
    { key: 'procedures', label: 'Процедуры', icon: 'syringe' },
    { key: 'consultations', label: 'Консультации', icon: 'user-md' },
    { key: 'hospitalization', label: 'Госпитализация', icon: 'hospital' },
    { key: 'other', label: 'Другое', icon: 'ellipsis-h' }
  ];

  // Функция для генерации дамми-данных
  const generateDummyData = () => {
    const now = new Date();
    const expenses = [];

    // Данные за сегодня
    const today = new Date(now);
    expenses.push(
      {
        id: Date.now() + 1,
        amount: 3200,
        category: 'medications',
        description: 'Антибиотики при простуде',
        date: today.toISOString().split('T')[0],
        time: '14:30'
      },
      {
        id: Date.now() + 2,
        amount: 2100,
        category: 'tests',
        description: 'Общий анализ крови',
        date: today.toISOString().split('T')[0],
        time: '09:15'
      }
    );

    // Данные за последнюю неделю
    const weekAmounts = [1800, 3500, 2400, 4200, 1900, 3800, 2700];
    const weekCategories = ['medications', 'tests', 'consultations', 'procedures', 'medications', 'tests', 'consultations'];
    const weekDescriptions = ['Консультация врача', 'Анализы', 'Лекарства', 'Процедуры', 'Консультация врача', 'Анализы', 'Лекарства'];
    const weekTimes = ['08:30', '10:15', '14:20', '16:45', '09:00', '11:30', '15:15'];

    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      expenses.push(
        {
          id: Date.now() + 10 + i,
          amount: weekAmounts[i - 1],
          category: weekCategories[i - 1],
          description: weekDescriptions[i - 1],
          date: dateStr,
          time: weekTimes[i - 1]
        }
      );
    }

    // Данные за последний месяц
    const monthAmounts = [2200, 3100, 2600, 4500, 1900, 3600, 2800, 4200, 2400, 3300, 2700, 3800, 2100, 3900, 3000, 4400, 2300, 3500, 2900, 4100, 2500, 3400, 2800, 3700, 2000, 4000, 3100, 4300, 2200, 3600];
    const monthCategories = ['medications', 'tests', 'diagnostics', 'procedures', 'consultations', 'hospitalization', 'other', 'medications', 'tests', 'diagnostics', 'procedures', 'consultations', 'hospitalization', 'other', 'medications', 'tests', 'diagnostics', 'procedures', 'consultations', 'hospitalization', 'other', 'medications', 'tests', 'diagnostics', 'procedures', 'consultations', 'hospitalization', 'other', 'medications', 'tests'];
    const monthDescriptions = ['Медицинские услуги', 'Диагностика', 'Лечение', 'Консультация', 'Анализы', 'Госпитализация', 'Прочие расходы', 'Медицинские услуги', 'Диагностика', 'Лечение', 'Консультация', 'Анализы', 'Госпитализация', 'Прочие расходы', 'Медицинские услуги', 'Диагностика', 'Лечение', 'Консультация', 'Анализы', 'Госпитализация', 'Прочие расходы', 'Медицинские услуги', 'Диагностика', 'Лечение', 'Консультация', 'Анализы', 'Госпитализация', 'Прочие расходы', 'Медицинские услуги', 'Диагностика'];

    for (let i = 8; i <= 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      expenses.push(
        {
          id: Date.now() + 20 + i,
          amount: monthAmounts[i - 8],
          category: monthCategories[i - 8],
          description: monthDescriptions[i - 8],
          date: dateStr,
          time: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        }
      );
    }

    // Данные за последний год
    const yearAmounts = [1800, 3500, 2400, 4200, 1900, 3800, 2700, 4500, 2200, 3600, 2800, 4000, 2100, 3900, 3000, 4400, 2000, 3700, 2600, 4100, 2300, 3500, 2900, 4300, 1950, 3850, 2750, 4250, 2050, 3750, 2550, 4150, 2250, 3650, 2850, 4350, 1850, 3950, 2650, 4050, 2150, 3550, 2950, 4450, 1750, 4050, 2550, 3950, 2350, 3450, 2750, 4250];
    const yearCategories = ['medications', 'tests', 'diagnostics', 'procedures', 'consultations', 'hospitalization', 'other', 'medications', 'tests', 'diagnostics', 'procedures', 'consultations', 'hospitalization', 'other', 'medications', 'tests', 'diagnostics', 'procedures', 'consultations', 'hospitalization', 'other', 'medications', 'tests', 'diagnostics', 'procedures', 'consultations', 'hospitalization', 'other', 'medications', 'tests', 'diagnostics', 'procedures', 'consultations', 'hospitalization', 'other', 'medications', 'tests', 'diagnostics', 'procedures', 'consultations', 'hospitalization', 'other', 'medications', 'tests', 'diagnostics', 'procedures', 'consultations', 'hospitalization', 'other', 'medications', 'tests', 'diagnostics', 'procedures'];
    const yearDescriptions = ['Плановое обследование', 'Лечение', 'Консультация специалиста', 'Анализы', 'Процедуры', 'Госпитализация', 'Медицинские расходы', 'Плановое обследование', 'Лечение', 'Консультация специалиста', 'Анализы', 'Процедуры', 'Госпитализация', 'Медицинские расходы', 'Плановое обследование', 'Лечение', 'Консультация специалиста', 'Анализы', 'Процедуры', 'Госпитализация', 'Медицинские расходы', 'Плановое обследование', 'Лечение', 'Консультация специалиста', 'Анализы', 'Процедуры', 'Госпитализация', 'Медицинские расходы', 'Плановое обследование', 'Лечение', 'Консультация специалиста', 'Анализы', 'Процедуры', 'Госпитализация', 'Медицинские расходы', 'Плановое обследование', 'Лечение', 'Консультация специалиста', 'Анализы', 'Процедуры', 'Госпитализация', 'Медицинские расходы', 'Плановое обследование', 'Лечение', 'Консультация специалиста', 'Анализы', 'Процедуры', 'Госпитализация', 'Медицинские расходы', 'Плановое обследование', 'Лечение', 'Консультация специалиста', 'Анализы', 'Процедуры'];

    for (let i = 31; i <= 365; i += 7) { // Каждую неделю
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const index = Math.floor((i - 31) / 7);
      expenses.push(
        {
          id: Date.now() + 30 + i,
          amount: yearAmounts[index % yearAmounts.length],
          category: yearCategories[index % yearCategories.length],
          description: yearDescriptions[index % yearDescriptions.length],
          date: dateStr,
          time: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        }
      );
    }

    return expenses;
  };

  // Загрузка и сохранение данных
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const savedExpenses = await AsyncStorage.getItem('expenses');
        if (savedExpenses) {
          setExpenses(JSON.parse(savedExpenses));
        } else {
          // Если нет сохраненных данных, создаем дамми-данные
          const dummyData = generateDummyData();
          setExpenses(dummyData);
          await AsyncStorage.setItem('expenses', JSON.stringify(dummyData));
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // В случае ошибки используем дамми-данные
        const dummyData = generateDummyData();
        setExpenses(dummyData);
      }

      // Анимация появления
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };

    loadExpenses();
  }, []);

  const getFilteredExpenses = () => {
    let filtered = expenses;

    // Фильтр по времени
    const now = new Date();
    switch (activeTimeFilter) {
      case 'today':
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(expense => new Date(expense.date) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        filtered = filtered.filter(expense => new Date(expense.date) >= monthAgo);
        break;
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        filtered = filtered.filter(expense => new Date(expense.date) >= yearAgo);
        break;
    }

    // Фильтр по категории
    if (activeCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === activeCategory);
    }

    return filtered.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
  };

  const getTotalAmount = () => {
    return getFilteredExpenses().reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getChartData = () => {
    const filteredExpenses = getFilteredExpenses();
    const categoryTotals = {};
    
    // Подсчитываем суммы по категориям
    filteredExpenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });

    // Создаем данные для диаграммы
    const chartData = Object.entries(categoryTotals).map(([category, amount], index) => {
      const categoryInfo = categories.find(cat => cat.key === category);
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
      ];
      
       return {
         name: categoryInfo ? categoryInfo.label : 'Другое',
         population: Math.round(amount),
         color: colors[index % colors.length],
         legendFontColor: isDarkMode ? '#ffffff' : '#666666',
         legendFontSize: 10,
       };
    });

    return chartData;
  };

  const getCategoryIcon = (categoryKey) => {
    const category = categories.find(cat => cat.key === categoryKey);
    if (!category) return LocalIcons.ellipsisH;
    
    switch (category.icon) {
      case 'pills': return LocalIcons.pills;
      case 'flask': return LocalIcons.flask;
      case 'stethoscope': return LocalIcons.stethoscope;
      case 'syringe': return LocalIcons.syringe;
      case 'user-md': return LocalIcons.userMd;
      case 'hospital': return LocalIcons.hospital;
      case 'ellipsis-h': return LocalIcons.ellipsisH;
      default: return LocalIcons.ellipsisH;
    }
  };

  const getCategoryLabel = (categoryKey) => {
    const category = categories.find(cat => cat.key === categoryKey);
    return category ? category.label : 'Другое';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.description) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    const expense = {
      id: Date.now(),
      amount: parseInt(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      date: newExpense.date,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedExpenses = [expense, ...expenses];
    setExpenses(updatedExpenses);
    
    // Сохраняем в AsyncStorage
    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    } catch (error) {
      console.error('Ошибка сохранения данных:', error);
    }

    setNewExpense({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
    Alert.alert('Успех', 'Расход добавлен');
  };

  const handleExpensePress = (expense) => {
    setSelectedExpense(expense);
    setShowDetailModal(true);
  };

  const renderExpenseCard = (expense) => (
    <TouchableOpacity key={expense.id} style={styles.expenseCard} onPress={() => handleExpensePress(expense)}>
      <View style={styles.expenseHeader}>
        <View style={styles.expenseIcon}>
          {getCategoryIcon(expense.category)({ size: 20, color: colors.primary })}
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseDescription}>{expense.description}</Text>
          <Text style={styles.expenseCategory}>{getCategoryLabel(expense.category)}</Text>
        </View>
        <View style={styles.expenseAmount}>
          <Text style={styles.amountText}>{expense.amount.toLocaleString()} ₸</Text>
          <Text style={styles.dateText}>{formatDate(expense.date)} {expense.time}</Text>
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
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              {LocalIcons.arrowBack({ size: 24, color: '#ffffff' })}
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Мои траты</Text>
            
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
              >
                {LocalIcons.plus({ size: 24, color: "#ffffff" })}
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Фильтры времени */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeFilters}>
            {timeFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  activeTimeFilter === filter.key && styles.filterButtonActive
                ]}
                onPress={() => setActiveTimeFilter(filter.key)}
              >
                <Text style={[
                  styles.filterButtonText,
                  activeTimeFilter === filter.key && styles.filterButtonTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      {/* Основной контент с прокруткой */}
      <ScrollView 
        style={styles.mainContent} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Круговая диаграмма */}
        {getFilteredExpenses().length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Распределение расходов по категориям</Text>
            <View style={styles.chartWrapper}>
             <PieChart
               data={getChartData()}
               width={screenWidth - 60}
               height={180}
               chartConfig={{
                 color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
               }}
               accessor="population"
               backgroundColor="transparent"
               paddingLeft="5"
               center={[0, 0]}
               absolute
               hasLegend={true}
               radius={50}
               innerRadius={35}
             />
            </View>
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountLabel}>Общая сумма:</Text>
              <Text style={styles.totalAmountValue}>{getTotalAmount().toLocaleString()} ₸</Text>
            </View>
          </View>
        )}

        {/* Фильтры категорий */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilters}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  activeCategory === category.key && styles.categoryButtonActive
                ]}
                onPress={() => setActiveCategory(category.key)}
              >
                <View style={styles.categoryIcon}>
                  {getCategoryIcon(category.key)({ 
                    size: 16, 
                    color: activeCategory === category.key ? '#ffffff' : colors.primary 
                  })}
                </View>
                <Text style={[
                  styles.categoryButtonText,
                  activeCategory === category.key && styles.categoryButtonTextActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Список расходов */}
        <View style={styles.expensesList}>
          {getFilteredExpenses().length > 0 ? (
            getFilteredExpenses().map(renderExpenseCard)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Нет расходов за выбранный период</Text>
            </View>
          )}
        </View>
      </ScrollView>

          {/* Модальное окно добавления расхода */}
          <Modal
            visible={showAddModal}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            <View style={styles.modalContainer}>
              <LinearGradient colors={['#0863a7', '#074393']} style={styles.modalHeader}>
                <View style={styles.modalHeaderContent}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowAddModal(false)}
                  >
                    {LocalIcons.close({ size: 24, color: "#ffffff" })}
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Добавить расход</Text>
                  <View style={styles.placeholder} />
                </View>
              </LinearGradient>

              <ScrollView style={styles.modalContent}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Сумма</Text>
                  <TextInput
                    style={styles.input}
                    value={newExpense.amount}
                    onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
                    placeholder="Введите сумму"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Категория</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
                    {categories.filter(cat => cat.key !== 'all').map((category) => (
                      <TouchableOpacity
                        key={category.key}
                        style={[
                          styles.categoryOption,
                          newExpense.category === category.key && styles.categoryOptionActive
                        ]}
                        onPress={() => setNewExpense({...newExpense, category: category.key})}
                      >
                        <View style={styles.categoryOptionIcon}>
                          {getCategoryIcon(category.key)({ 
                            size: 16, 
                            color: newExpense.category === category.key ? '#ffffff' : colors.primary 
                          })}
                        </View>
                        <Text style={[
                          styles.categoryOptionText,
                          newExpense.category === category.key && styles.categoryOptionTextActive
                        ]}>
                          {category.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Описание</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={newExpense.description}
                    onChangeText={(text) => setNewExpense({...newExpense, description: text})}
                    placeholder="Описание расхода"
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Дата</Text>
                  <TextInput
                    style={styles.input}
                    value={newExpense.date}
                    onChangeText={(text) => setNewExpense({...newExpense, date: text})}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.addExpenseButton}
                  onPress={handleAddExpense}
                  disabled={!newExpense.amount || !newExpense.category || !newExpense.description}
                >
                  <LinearGradient
                    colors={newExpense.amount && newExpense.category && newExpense.description ? ['#22ae2c', '#5cc72f'] : ['#cccccc', '#999999']}
                    style={styles.addExpenseGradient}
                  >
                    <Text style={styles.addExpenseText}>Добавить расход</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Модальное окно детальной информации о расходе */}
          <Modal
            visible={showDetailModal}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            <View style={styles.modalContainer}>
              <LinearGradient colors={['#0863a7', '#074393']} style={styles.modalHeader}>
                <View style={styles.modalHeaderContent}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowDetailModal(false)}
                  >
                    {LocalIcons.close({ size: 24, color: "#ffffff" })}
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Детали расхода</Text>
                  <View style={styles.placeholder} />
                </View>
              </LinearGradient>

              {selectedExpense && (
                <ScrollView style={styles.modalContent}>
                  <View style={styles.detailSection}>
                    <View style={styles.detailIconContainer}>
                      <LinearGradient colors={['#0863a7', '#074393']} style={styles.detailIcon}>
                        {getCategoryIcon(selectedExpense.category)({ size: 32, color: "#ffffff" })}
                      </LinearGradient>
                    </View>
                    
                    <View style={styles.detailInfo}>
                      <Text style={styles.detailTitle}>{selectedExpense.description}</Text>
                      <Text style={styles.detailCategory}>{getCategoryLabel(selectedExpense.category)}</Text>
                    </View>
                    
                    <View style={styles.detailAmount}>
                      <Text style={styles.detailAmountText}>{selectedExpense.amount.toLocaleString()} ₸</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Дата:</Text>
                    <Text style={styles.detailValue}>{formatDate(selectedExpense.date)}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Время:</Text>
                    <Text style={styles.detailValue}>{selectedExpense.time}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Категория:</Text>
                    <Text style={styles.detailValue}>{getCategoryLabel(selectedExpense.category)}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Сумма:</Text>
                    <Text style={styles.detailValue}>{selectedExpense.amount.toLocaleString()} ₸</Text>
                  </View>

                  <View style={styles.detailDescription}>
                    <Text style={styles.detailLabel}>Описание:</Text>
                    <Text style={styles.detailDescriptionText}>{selectedExpense.description}</Text>
                  </View>
                </ScrollView>
              )}

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.closeDetailButton}
                  onPress={() => setShowDetailModal(false)}
                >
                  <LinearGradient colors={['#0863a7', '#074393']} style={styles.closeDetailGradient}>
                    <Text style={styles.closeDetailText}>Закрыть</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Animated.View>
      </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    gap: 10,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalAmountLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  totalAmountValue: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  filtersContainer: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeFilters: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  categoriesContainer: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryFilters: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  expensesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  expenseCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  expenseCategory: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  expenseAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textSecondary,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categorySelector: {
    marginTop: 5,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryOptionIcon: {
    marginRight: 6,
  },
  categoryOptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryOptionTextActive: {
    color: '#ffffff',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addExpenseButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  addExpenseGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  addExpenseText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  detailSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailIconContainer: {
    marginRight: 15,
  },
  detailIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailInfo: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 5,
  },
  detailCategory: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailAmount: {
    alignItems: 'flex-end',
  },
  detailAmountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailDescription: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailDescriptionText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginTop: 10,
  },
  closeDetailButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  closeDetailGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  closeDetailText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
