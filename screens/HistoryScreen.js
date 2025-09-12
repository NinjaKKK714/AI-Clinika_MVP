import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  Image,
  Alert,
  BackHandler,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';
import { useTheme } from '../themes/useTheme';

export default function HistoryScreen({ activeTab, setActiveTab, onBack }) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('prevention');
  const [formData, setFormData] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' или 'oldest'
  const [showSortMenu, setShowSortMenu] = useState(false);
  
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
      // Возвращаемся на главный экран
      onBack();
      return true; // Предотвращаем стандартное поведение
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [onBack]);

  // Функция для получения названия вкладки
  const getTabLabel = (tab) => {
    switch (tab) {
      case 'treatment': return 'Лечение';
      case 'prevention': return 'Профилактика';
      case 'hospitalization': return 'Госпитализация';
      case 'sickLeave': return 'Больничные листы';
      default: return 'Профилактика';
    }
  };

  // Данные для демонстрации
  const [historyData] = useState({
    treatment: [
      {
        id: 1,
        period: '15.08.2025 - 30.08.2025',
        time: '08:00, 20:00',
        medication: 'Амоксициллин',
        dosage: '500 мг',
        frequency: '2 раза в день',
        status: 'completed',
        notes: 'Курс антибиотиков при бронхите'
      },
      {
        id: 2,
        period: '10.08.2025 - 20.08.2025',
        time: '09:00',
        medication: 'Физиотерапия',
        dosage: '10 сеансов',
        frequency: 'Ежедневно',
        status: 'completed',
        notes: 'УВЧ на грудную клетку'
      },
      {
        id: 3,
        period: '05.08.2025 - 15.08.2025',
        time: '14:00',
        medication: 'Ибупрофен',
        dosage: '400 мг',
        frequency: '3 раза в день',
        status: 'completed',
        notes: 'Обезболивающее при болях в спине'
      },
      {
        id: 4,
        period: '01.08.2025 - 10.08.2025',
        time: '10:00',
        medication: 'Массаж',
        dosage: '8 сеансов',
        frequency: 'Через день',
        status: 'completed',
        notes: 'Массаж спины для снятия напряжения'
      }
    ],
    prevention: [
      {
        id: 1,
        period: '01.08.2025 - 30.08.2025',
        time: '08:00',
        medication: 'Витамин D',
        dosage: '2000 МЕ',
        frequency: '1 раз в день',
        status: 'in_progress',
        notes: 'Профилактика дефицита витамина D'
      },
      {
        id: 2,
        period: '01.08.2025 - 30.08.2025',
        time: '07:00',
        medication: 'Утренняя зарядка',
        dosage: '30 минут',
        frequency: 'Ежедневно',
        status: 'in_progress',
        notes: 'Комплекс упражнений для укрепления мышц'
      },
      {
        id: 3,
        period: '15.07.2025 - 30.08.2025',
        time: '19:00',
        medication: 'Омега-3',
        dosage: '1000 мг',
        frequency: '1 раз в день',
        status: 'in_progress',
        notes: 'Поддержка сердечно-сосудистой системы'
      },
      {
        id: 4,
        period: '01.07.2025 - 30.08.2025',
        time: '20:00',
        medication: 'Прогулки',
        dosage: '45 минут',
        frequency: 'Ежедневно',
        status: 'in_progress',
        notes: 'Прогулки на свежем воздухе для укрепления иммунитета'
      }
    ],
    hospitalization: [
      {
        id: 1,
        period: '20.08.2025 - 30.08.2025',
        hospital: 'Городская больница №1',
        department: 'Терапевтическое отделение',
        doctor: 'Иванов И.И.',
        medications: [
          {
            name: 'Цефтриаксон',
            dosage: '1 г',
            frequency: '2 раза в день',
            status: 'completed'
          }
        ],
        procedures: [
          {
            name: 'Капельница',
            frequency: 'Ежедневно',
            status: 'completed'
          }
        ]
      },
      {
        id: 2,
        period: '15.07.2025 - 25.07.2025',
        hospital: 'Центральная клиническая больница',
        department: 'Кардиологическое отделение',
        doctor: 'Петров П.П.',
        medications: [
          {
            name: 'Аспирин',
            dosage: '100 мг',
            frequency: '1 раз в день',
            status: 'completed'
          }
        ],
        procedures: [
          {
            name: 'ЭКГ',
            frequency: 'Ежедневно',
            status: 'completed'
          }
        ]
      }
    ],
    sickLeave: [
      {
        id: 1,
        period: '25.08.2025 - 30.08.2025',
        diagnosis: 'Острый бронхит',
        status: 'closed',
        notes: 'Больничный лист закрыт'
      },
      {
        id: 2,
        period: '20.08.2025 - 25.08.2025',
        diagnosis: 'ОРВИ',
        status: 'closed',
        notes: 'Больничный лист закрыт'
      },
      {
        id: 3,
        period: '15.07.2025 - 25.07.2025',
        diagnosis: 'Гипертонический криз',
        status: 'closed',
        notes: 'Больничный лист закрыт'
      },
      {
        id: 4,
        period: '10.07.2025 - 20.07.2025',
        diagnosis: 'Обострение гастрита',
        status: 'closed',
        notes: 'Больничный лист закрыт'
      }
    ]
  });

  const handleAddItem = () => {
    setModalType(activeTab);
    setShowAddModal(true);
    setFormData({});
  };

  const handleSaveItem = () => {
    // Здесь будет логика сохранения
    setShowAddModal(false);
    Alert.alert('Успешно', 'Запись добавлена в историю');
  };

  const handleSortSelect = (order) => {
    setSortOrder(order);
    setShowSortMenu(false);
  };

  const getSortLabel = () => {
    return sortOrder === 'newest' ? 'Новые' : 'Старые';
  };

  // Функция для парсинга даты в формате DD.MM.YYYY
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  // Функция для сортировки данных
  const getSortedData = (data) => {
    return [...data].sort((a, b) => {
      const dateA = parseDate(a.period.split(' - ')[0]);
      const dateB = parseDate(b.period.split(' - ')[0]);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const renderTreatmentItem = (item) => (
    <View key={item.id} style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemPeriod}>{item.period}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'completed' ? '#22ae2c' : '#ff9800' }
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'completed' ? 'Завершено' : 'В процессе'}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Время приема:</Text>
          <Text style={styles.infoValue}>{item.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Препарат/Процедура:</Text>
          <Text style={styles.infoValue}>{item.medication}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Дозировка:</Text>
          <Text style={styles.infoValue}>{item.dosage}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Частота:</Text>
          <Text style={styles.infoValue}>{item.frequency}</Text>
        </View>
        {item.notes && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Примечания:</Text>
            <Text style={styles.infoValue}>{item.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderPreventionItem = (item) => (
    <View key={item.id} style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemPeriod}>{item.period}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'completed' ? '#22ae2c' : '#ff9800' }
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'completed' ? 'Завершено' : 'В процессе'}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Время приема:</Text>
          <Text style={styles.infoValue}>{item.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Средство/Процедура:</Text>
          <Text style={styles.infoValue}>{item.medication}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Дозировка/Длительность:</Text>
          <Text style={styles.infoValue}>{item.dosage}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Частота:</Text>
          <Text style={styles.infoValue}>{item.frequency}</Text>
        </View>
        {item.notes && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Примечания:</Text>
            <Text style={styles.infoValue}>{item.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderHospitalizationItem = (item) => (
    <View key={item.id} style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemPeriod}>{item.period}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Госпитализация</Text>
        </View>
      </View>
      
      <View style={styles.itemContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Больница:</Text>
          <Text style={styles.infoValue}>{item.hospital}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Отделение:</Text>
          <Text style={styles.infoValue}>{item.department}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Лечащий врач:</Text>
          <Text style={styles.infoValue}>{item.doctor}</Text>
        </View>
        
        {item.medications && item.medications.length > 0 && (
          <View style={styles.medicationsSection}>
            <Text style={styles.sectionTitle}>Препараты:</Text>
            {item.medications.map((med, index) => (
              <View key={index} style={styles.medicationItem}>
                <Text style={styles.medicationName}>{med.name}</Text>
                <Text style={styles.medicationDetails}>
                  {med.dosage} - {med.frequency}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        {item.procedures && item.procedures.length > 0 && (
          <View style={styles.proceduresSection}>
            <Text style={styles.sectionTitle}>Процедуры:</Text>
            {item.procedures.map((proc, index) => (
              <View key={index} style={styles.procedureItem}>
                <Text style={styles.procedureName}>{proc.name}</Text>
                <Text style={styles.procedureDetails}>{proc.frequency}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderSickLeaveItem = (item) => (
    <View key={item.id} style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemPeriod}>{item.period}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'closed' ? '#22ae2c' : '#ff9800' }
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'closed' ? 'Закрыт' : 'Открыт'}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Диагноз:</Text>
          <Text style={styles.infoValue}>{item.diagnosis}</Text>
        </View>
        {item.notes && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Примечания:</Text>
            <Text style={styles.infoValue}>{item.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'prevention':
        return (
          <View style={styles.tabContent}>
            <View style={styles.tabHeader}>
              <Text style={styles.tabDescription}>
                Профилактические меры: витамины, БАДы, физические упражнения
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.addButtonGradient}>
                  <Text style={styles.addButtonText}>+ Добавить</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {getSortedData(historyData.prevention).map(renderPreventionItem)}
          </View>
        );
      case 'treatment':
        return (
          <View style={styles.tabContent}>
            <View style={styles.tabHeader}>
              <Text style={styles.tabDescription}>
                История лечения: препараты, процедуры, их дозировки и выполнение
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.addButtonGradient}>
                  <Text style={styles.addButtonText}>+ Добавить</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {getSortedData(historyData.treatment).map(renderTreatmentItem)}
          </View>
        );
      case 'hospitalization':
        return (
          <View style={styles.tabContent}>
            <View style={styles.tabHeader}>
              <Text style={styles.tabDescription}>
                История госпитализаций: больницы, отделения, врачи, лечение
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.addButtonGradient}>
                  <Text style={styles.addButtonText}>+ Добавить</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {getSortedData(historyData.hospitalization).map(renderHospitalizationItem)}
          </View>
        );
      case 'sickLeave':
        return (
          <View style={styles.tabContent}>
            <View style={styles.tabHeader}>
              <Text style={styles.tabDescription}>
                История больничных листов: периоды, диагнозы, статус
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.addButtonGradient}>
                  <Text style={styles.addButtonText}>+ Добавить</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {getSortedData(historyData.sickLeave).map(renderSickLeaveItem)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Заголовок */}
          <LinearGradient colors={['#0863a7', '#074393']} style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                {LocalIcons.arrowBack ? LocalIcons.arrowBack({ size: 24, color: '#ffffff' }) : 
                  <Text style={{ color: '#ffffff', fontSize: 20 }}>←</Text>
                }
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>История</Text>
                <Text style={styles.headerSubtitle}>Медицинская история</Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity 
                  style={styles.sortButton}
                  onPress={() => setShowSortMenu(!showSortMenu)}
                >
                  <Text style={styles.sortButtonText}>{getSortLabel()}</Text>
                  {LocalIcons.chevron({ size: 16, color: "#ffffff" })}
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

        {/* Выпадающий список для выбора вкладки */}
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={styles.dropdownButtonText}>
                {getTabLabel(activeTab)}
              </Text>
              <View style={[styles.dropdownArrow, showDropdown && styles.dropdownArrowUp]}>
                {LocalIcons.chevron({ size: 16, color: "#666" })}
              </View>
            </TouchableOpacity>
            
            {showDropdown && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity 
                  style={[styles.dropdownItem, activeTab === 'prevention' && styles.dropdownItemActive]}
                  onPress={() => {
                    setActiveTab('prevention');
                    setShowDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, activeTab === 'prevention' && styles.dropdownItemTextActive]}>
                    Профилактика
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dropdownItem, activeTab === 'treatment' && styles.dropdownItemActive]}
                  onPress={() => {
                    setActiveTab('treatment');
                    setShowDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, activeTab === 'treatment' && styles.dropdownItemTextActive]}>
                    Лечение
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dropdownItem, activeTab === 'hospitalization' && styles.dropdownItemActive]}
                  onPress={() => {
                    setActiveTab('hospitalization');
                    setShowDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, activeTab === 'hospitalization' && styles.dropdownItemTextActive]}>
                    Госпитализация
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dropdownItem, styles.dropdownItemLast, activeTab === 'sickLeave' && styles.dropdownItemActive]}
                  onPress={() => {
                    setActiveTab('sickLeave');
                    setShowDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, activeTab === 'sickLeave' && styles.dropdownItemTextActive]}>
                    Больничные листы
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        {/* Контент */}
        <TouchableWithoutFeedback onPress={() => setShowSortMenu(false)}>
          <ScrollView 
            style={styles.body} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          >
            {renderContent()}
          </ScrollView>
        </TouchableWithoutFeedback>
        </Animated.View>

        {/* Выпадающее меню сортировки - вне Animated.View для правильного z-index */}
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

        {/* Модальное окно добавления */}
        <Modal
         visible={showAddModal}
         transparent={true}
         animationType="none"
         onRequestClose={() => setShowAddModal(false)}
       >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
           <View style={styles.modalOverlay}>
             <View style={styles.modalContent}>
               <ScrollView 
                 showsVerticalScrollIndicator={false}
                 contentContainerStyle={styles.modalScrollContent}
                 keyboardShouldPersistTaps="handled"
               >
            <Text style={styles.modalTitle}>
              Добавить в {modalType === 'treatment' ? 'лечение' : 
                          modalType === 'prevention' ? 'профилактику' :
                          modalType === 'hospitalization' ? 'госпитализацию' : 'больничный лист'}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Период (например: 01.01.2024 - 15.01.2024)"
              placeholderTextColor="#999999"
              value={formData.period || ''}
              onChangeText={(text) => setFormData({...formData, period: text})}
              returnKeyType="next"
              blurOnSubmit={false}
            />
            
            {modalType !== 'sickLeave' && (
              <>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Время приема"
                  placeholderTextColor="#999999"
                  value={formData.time || ''}
                  onChangeText={(text) => setFormData({...formData, time: text})}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                
                <TextInput
                  style={styles.modalInput}
                  placeholder={modalType === 'treatment' ? 'Препарат/Процедура' : 'Средство/Процедура'}
                  placeholderTextColor="#999999"
                  value={formData.medication || ''}
                  onChangeText={(text) => setFormData({...formData, medication: text})}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                
                <TextInput
                  style={styles.modalInput}
                  placeholder="Дозировка/Длительность"
                  placeholderTextColor="#999999"
                  value={formData.dosage || ''}
                  onChangeText={(text) => setFormData({...formData, dosage: text})}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                
                <TextInput
                  style={styles.modalInput}
                  placeholder="Частота"
                  placeholderTextColor="#999999"
                  value={formData.frequency || ''}
                  onChangeText={(text) => setFormData({...formData, frequency: text})}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </>
            )}
            
            {modalType === 'sickLeave' && (
              <TextInput
                style={styles.modalInput}
                placeholder="Диагноз"
                placeholderTextColor="#999999"
                value={formData.diagnosis || ''}
                onChangeText={(text) => setFormData({...formData, diagnosis: text})}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            )}
            
            <TextInput
              style={styles.modalInput}
              placeholder="Примечания (необязательно)"
              placeholderTextColor="#999999"
              value={formData.notes || ''}
              onChangeText={(text) => setFormData({...formData, notes: text})}
              multiline
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            
                         <View style={styles.modalButtons}>
               <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setShowAddModal(false)}>
                 <Text style={styles.modalButtonTextCancel}>Отмена</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.modalButtonSave} onPress={handleSaveItem}>
                 <Text style={styles.modalButtonTextSave}>Сохранить</Text>
               </TouchableOpacity>
             </View>
               </ScrollView>
             </View>
           </View>
         </TouchableWithoutFeedback>
        </Modal>
      </View>
    </>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    opacity: 0.9,
  },
  dropdownContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    position: 'relative',
    zIndex: 9999,
    overflow: 'visible',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dropdownArrow: {
    transform: [{ rotate: '0deg' }],
  },
  dropdownArrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 15,
    zIndex: 9999,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemActive: {
    backgroundColor: '#f0f8ff',
  },
  dropdownItemText: {
    fontSize: 15,
    fontFamily: 'Open Sauce',
    fontWeight: '500',
    color: colors.textPrimary,
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    padding: 20,
    flexGrow: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Отступ для нижней панели навигации
    minHeight: '100%',
  },
  tabContent: {
    marginBottom: 30,
    flex: 1,
  },
  tabHeader: {
    marginBottom: 20,
  },
  tabDescription: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    marginBottom: 15,
    lineHeight: 20,
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  addButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemPeriod: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#22ae2c',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
  },
  itemContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: colors.textSecondary,
    width: 120,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textPrimary,
    flex: 1,
  },
  medicationsSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  medicationItem: {
    backgroundColor: colors.backgroundSecondary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  medicationName: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#333',
  },
  medicationDetails: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    color: '#666',
    marginTop: 2,
  },
  proceduresSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  procedureItem: {
    backgroundColor: colors.backgroundSecondary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  procedureName: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#333',
  },
  procedureDetails: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    color: '#666',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        paddingHorizontal: 20,
      },
    }),
  },
  modalScrollContent: {
    padding: 25,
    paddingBottom: 20,
    ...Platform.select({
      android: {
        padding: 20,
        paddingBottom: 15,
      },
    }),
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 0,
    width: '90%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    ...Platform.select({
      android: {
        width: '95%',
        maxHeight: '90%',
      },
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    fontFamily: 'Open Sauce',
    marginBottom: 15,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    ...Platform.select({
      android: {
        textAlignVertical: 'top',
        includeFontPadding: false,
        paddingTop: 15,
        paddingBottom: 15,
      },
    }),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButtonCancel: {
    flex: 1,
    marginRight: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  modalButtonSave: {
    flex: 1,
    marginLeft: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#22ae2c',
    alignItems: 'center',
  },
  modalButtonTextCancel: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
  },
  modalButtonTextSave: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
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
    elevation: 10,
    zIndex: 9999, // Максимальный z-index для отображения поверх всех элементов
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
