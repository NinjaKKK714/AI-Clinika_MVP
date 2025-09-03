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
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';

export default function HistoryScreen({ activeTab, setActiveTab, onBack }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('treatment');
  const [formData, setFormData] = useState({});
  
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

  // Данные для демонстрации
  const [historyData] = useState({
    treatment: [
      {
        id: 1,
        period: '01.01.2024 - 15.01.2024',
        time: '08:00, 20:00',
        medication: 'Амоксициллин',
        dosage: '500 мг',
        frequency: '2 раза в день',
        status: 'completed',
        notes: 'Курс антибиотиков при бронхите'
      },
      {
        id: 2,
        period: '20.01.2024 - 25.01.2024',
        time: '09:00',
        medication: 'Физиотерапия',
        dosage: '10 сеансов',
        frequency: 'Ежедневно',
        status: 'completed',
        notes: 'УВЧ на грудную клетку'
      }
    ],
    prevention: [
      {
        id: 1,
        period: '01.01.2024 - 31.01.2024',
        time: '08:00',
        medication: 'Витамин D',
        dosage: '2000 МЕ',
        frequency: '1 раз в день',
        status: 'in_progress',
        notes: 'Профилактика дефицита витамина D'
      },
      {
        id: 2,
        period: '01.01.2024 - 31.01.2024',
        time: '07:00',
        medication: 'Утренняя зарядка',
        dosage: '30 минут',
        frequency: 'Ежедневно',
        status: 'in_progress',
        notes: 'Комплекс упражнений для укрепления мышц'
      }
    ],
    hospitalization: [
      {
        id: 1,
        period: '10.01.2024 - 20.01.2024',
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
      }
    ],
    sickLeave: [
      {
        id: 1,
        period: '01.01.2024 - 15.01.2024',
        diagnosis: 'Острый бронхит',
        status: 'closed',
        notes: 'Больничный лист закрыт'
      },
      {
        id: 2,
        period: '20.01.2024 - 25.01.2024',
        diagnosis: 'ОРВИ',
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
            {historyData.treatment.map(renderTreatmentItem)}
          </View>
        );
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
            {historyData.prevention.map(renderPreventionItem)}
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
            {historyData.hospitalization.map(renderHospitalizationItem)}
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
            {historyData.sickLeave.map(renderSickLeaveItem)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
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
          </View>
        </LinearGradient>

        {/* Подвкладки */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'treatment' && styles.tabButtonActive]}
            onPress={() => setActiveTab('treatment')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'treatment' && styles.tabButtonTextActive]}>
              Лечение
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'prevention' && styles.tabButtonActive]}
            onPress={() => setActiveTab('prevention')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'prevention' && styles.tabButtonTextActive]}>
              Профилактика
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'hospitalization' && styles.tabButtonActive]}
            onPress={() => setActiveTab('hospitalization')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'hospitalization' && styles.tabButtonTextActive]}>
              Госпитализация
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'sickLeave' && styles.tabButtonActive]}
            onPress={() => setActiveTab('sickLeave')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'sickLeave' && styles.tabButtonTextActive]}>
              Больничные листы
            </Text>
          </TouchableOpacity>
        </View>

        {/* Контент */}
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </Animated.View>

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
                  value={formData.time || ''}
                  onChangeText={(text) => setFormData({...formData, time: text})}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                
                <TextInput
                  style={styles.modalInput}
                  placeholder={modalType === 'treatment' ? 'Препарат/Процедура' : 'Средство/Процедура'}
                  value={formData.medication || ''}
                  onChangeText={(text) => setFormData({...formData, medication: text})}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                
                <TextInput
                  style={styles.modalInput}
                  placeholder="Дозировка/Длительность"
                  value={formData.dosage || ''}
                  onChangeText={(text) => setFormData({...formData, dosage: text})}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                
                <TextInput
                  style={styles.modalInput}
                  placeholder="Частота"
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
                value={formData.diagnosis || ''}
                onChangeText={(text) => setFormData({...formData, diagnosis: text})}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            )}
            
            <TextInput
              style={styles.modalInput}
              placeholder="Примечания (необязательно)"
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabButtonActive: {
    backgroundColor: '#0863a7',
  },
  tabButtonText: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  body: {
    flex: 1,
    padding: 20,
  },
  tabContent: {
    marginBottom: 30,
  },
  tabHeader: {
    marginBottom: 20,
  },
  tabDescription: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#666',
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
    backgroundColor: '#ffffff',
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
    color: '#333',
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
    color: '#666',
    width: 120,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#333',
    flex: 1,
  },
  medicationsSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  medicationItem: {
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#f8f9fa',
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
  },
  modalScrollContent: {
    padding: 25,
    paddingBottom: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 0,
    width: '90%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
});
