import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  TextInput,
  Alert,
  BackHandler,
  Modal,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import LocalIcons from '../components/LocalIcons';

export default function AnalysesScreen({ navigation, onBack }) {
  const [analyses, setAnalyses] = useState([
    {
      id: 1,
      file: {
        uri: 'https://via.placeholder.com/300x200/0863a7/ffffff?text=Анализ+крови',
        type: 'photo',
        name: 'Общий анализ крови'
      },
      date: '2025-08-15',
      clinicName: 'Центральная клиническая больница',
      comment: 'Результаты в норме. Гемоглобин 145 г/л, лейкоциты 6.5×10^9/л, тромбоциты 250×10^9/л.',
      uploadDate: '2025-08-15',
    },
    {
      id: 2,
      file: {
        uri: 'https://via.placeholder.com/300x200/ff4444/ffffff?text=Биохимия',
        type: 'pdf',
        name: 'Биохимический анализ крови.pdf'
      },
      date: '2025-08-10',
      clinicName: 'Лаборатория "Медицинский центр"',
      comment: 'Повышенный уровень холестерина. Рекомендуется диета и контроль через месяц.',
      uploadDate: '2025-08-10',
    },
    {
      id: 3,
      file: {
        uri: 'https://via.placeholder.com/300x200/22ae2c/ffffff?text=ЭКГ',
        type: 'photo',
        name: 'Электрокардиограмма'
      },
      date: '2025-08-05',
      clinicName: 'Кардиологический центр',
      comment: 'Синусовый ритм, ЧСС 72 уд/мин. Патологических изменений не выявлено.',
      uploadDate: '2025-08-05',
    },
    {
      id: 4,
      file: {
        uri: 'https://via.placeholder.com/300x200/ff8c42/ffffff?text=УЗИ',
        type: 'photo',
        name: 'УЗИ брюшной полости'
      },
      date: '2025-07-28',
      clinicName: 'Диагностический центр',
      comment: 'Печень, желчный пузырь, поджелудочная железа без патологий. Селезенка в норме.',
      uploadDate: '2025-07-28',
    },
    {
      id: 5,
      file: {
        uri: 'https://via.placeholder.com/300x200/9ad0e7/ffffff?text=Гормоны',
        type: 'pdf',
        name: 'Анализ на гормоны щитовидной железы.pdf'
      },
      date: '2025-07-20',
      clinicName: 'Эндокринологический центр',
      comment: 'ТТГ, Т3, Т4 в пределах нормы. Патологических изменений не выявлено.',
      uploadDate: '2025-07-20',
    },
    {
      id: 6,
      file: {
        uri: 'https://via.placeholder.com/300x200/60caac/ffffff?text=Моча',
        type: 'photo',
        name: 'Общий анализ мочи'
      },
      date: '2025-07-15',
      clinicName: 'Лаборатория "Здоровье"',
      comment: 'Цвет, прозрачность, плотность в норме. Белок, глюкоза, кетоны не обнаружены.',
      uploadDate: '2025-07-15',
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [clinicName, setClinicName] = useState('');
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' или 'oldest'
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Статистика анализов
  const totalAnalyses = analyses.length;
  const pdfAnalyses = analyses.filter(analysis => analysis.file.type === 'pdf').length;
  const photoAnalyses = analyses.filter(analysis => analysis.file.type === 'photo').length;

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

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходим доступ к галерее для загрузки фото');
        return false;
      }
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedFile({
        uri: result.assets[0].uri,
        type: 'photo',
        name: `Анализ_${new Date().toISOString().split('T')[0]}.jpg`
      });
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedFile({
        uri: result.assets[0].uri,
        type: 'photo',
        name: `Анализ_${new Date().toISOString().split('T')[0]}.jpg`
      });
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile({
          uri: result.assets[0].uri,
          type: 'pdf',
          name: result.assets[0].name
        });
      }
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось выбрать документ');
    }
  };

  const addAnalysis = () => {
    if (!selectedFile) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите файл');
      return;
    }

    const newAnalysis = {
      id: Date.now(),
      file: selectedFile,
      date: selectedDate,
      clinicName: clinicName,
      comment: comment,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    setAnalyses([newAnalysis, ...analyses]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedFile(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setClinicName('');
    setComment('');
  };

  const handleSortSelect = (order) => {
    setSortOrder(order);
    setShowSortMenu(false);
  };

  const getSortLabel = () => {
    return sortOrder === 'newest' ? 'Новые' : 'Старые';
  };

  // Функция для сортировки данных
  const getSortedAnalyses = () => {
    return [...analyses].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const deleteAnalysis = (id) => {
    Alert.alert(
      'Удаление анализа',
      'Вы уверены, что хотите удалить этот анализ?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            setAnalyses(analyses.filter(analysis => analysis.id !== id));
          },
        },
      ]
    );
  };

  const renderAnalysisCard = (analysis) => (
    <TouchableOpacity 
      key={analysis.id} 
      style={styles.analysisCard}
      onPress={() => navigation.navigate('AnalysisDetail', { analysis })}
    >
      <View style={styles.analysisHeader}>
        <View style={styles.analysisInfo}>
          <Text style={styles.analysisDate}>{analysis.date}</Text>
          {analysis.clinicName && (
            <Text style={styles.clinicName}>{analysis.clinicName}</Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            deleteAnalysis(analysis.id);
          }}
        >
          {LocalIcons.close({ size: 20, color: "#ff4444" })}
        </TouchableOpacity>
      </View>

      <View style={styles.fileInfo}>
        <View style={styles.fileIcon}>
          {analysis.file.type === 'pdf' ? (
            <LinearGradient colors={['#ff4444', '#d32f2f']} style={styles.iconGradient}>
              {LocalIcons.document({ size: 24, color: "#ffffff" })}
            </LinearGradient>
          ) : (
            <LinearGradient colors={['#0863a7', '#074393']} style={styles.iconGradient}>
              {LocalIcons.image({ size: 24, color: "#ffffff" })}
            </LinearGradient>
          )}
        </View>
        <View style={styles.fileDetails}>
          <Text style={styles.fileName}>{analysis.file.name}</Text>
          <Text style={styles.fileType}>
            {analysis.file.type === 'pdf' ? 'PDF документ' : 'Фотография'}
          </Text>
        </View>
      </View>

      {analysis.comment && (
        <View style={styles.commentContainer}>
          <Text style={styles.commentLabel}>Комментарий:</Text>
          <Text style={styles.commentText} numberOfLines={2}>{analysis.comment}</Text>
        </View>
      )}

      <View style={styles.analysisFooter}>
        <Text style={styles.uploadDate}>Загружено: {analysis.uploadDate}</Text>
        <View style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Просмотреть</Text>
          {LocalIcons.arrow({ size: 16, color: "#0863a7" })}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={() => setShowSortMenu(false)}>
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Заголовок */}
        <LinearGradient colors={['#0863a7', '#074393']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              {LocalIcons.arrowBack({ size: 24, color: '#ffffff' })}
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Мои анализы</Text>
            
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.sortButton}
                onPress={() => setShowSortMenu(!showSortMenu)}
              >
                <Text style={styles.sortButtonText}>{getSortLabel()}</Text>
                {LocalIcons.chevron({ size: 16, color: "#ffffff" })}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
              >
                {LocalIcons.plus({ size: 24, color: "#ffffff" })}
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

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
              {LocalIcons.document({ size: 24, color: "#ffffff" })}
            </LinearGradient>
            <Text style={styles.statNumber}>{totalAnalyses}</Text>
            <Text style={styles.statLabel}>Всего анализов</Text>
          </View>
          
          <View style={styles.statItem}>
            <LinearGradient colors={['#ff6b35', '#ff8c42']} style={styles.statIcon}>
              {LocalIcons.image({ size: 24, color: "#ffffff" })}
            </LinearGradient>
            <Text style={styles.statNumber}>{photoAnalyses}</Text>
            <Text style={styles.statLabel}>Фото</Text>
          </View>
          
          <View style={styles.statItem}>
            <LinearGradient colors={['#ff4444', '#d32f2f']} style={styles.statIcon}>
              {LocalIcons.document({ size: 24, color: "#ffffff" })}
            </LinearGradient>
            <Text style={styles.statNumber}>{pdfAnalyses}</Text>
            <Text style={styles.statLabel}>PDF</Text>
          </View>
        </View>

        {/* Список анализов */}
        <ScrollView 
          style={styles.analysesList} 
          contentContainerStyle={styles.analysesListContent}
          showsVerticalScrollIndicator={false}
        >
          {analyses.length > 0 ? (
            getSortedAnalyses().map(renderAnalysisCard)
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <LinearGradient colors={['#f0f0f0', '#e0e0e0']} style={styles.emptyIconGradient}>
                  {LocalIcons.document({ size: 48, color: "#cccccc" })}
                </LinearGradient>
              </View>
              <Text style={styles.emptyTitle}>Анализы не найдены</Text>
              <Text style={styles.emptyText}>Добавьте свои первые анализы для отслеживания</Text>
            </View>
          )}
        </ScrollView>
        </Animated.View>

        {/* Модальное окно добавления */}
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
                onPress={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                {LocalIcons.close({ size: 24, color: "#ffffff" })}
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Добавить анализ</Text>
              <View style={styles.placeholder} />
            </View>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            {/* Выбор файла */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Выберите файл</Text>
              <View style={styles.fileButtons}>
                <TouchableOpacity style={styles.fileButton} onPress={takePhoto}>
                  <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.fileButtonGradient}>
                    {LocalIcons.camera({ size: 24, color: "#ffffff" })}
                    <Text style={styles.fileButtonText}>Сделать фото</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.fileButton} onPress={pickImage}>
                  <LinearGradient colors={['#0863a7', '#074393']} style={styles.fileButtonGradient}>
                    {LocalIcons.image({ size: 24, color: "#ffffff" })}
                    <Text style={styles.fileButtonText}>Выбрать фото</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.fileButton} onPress={pickDocument}>
                  <LinearGradient colors={['#ff4444', '#d32f2f']} style={styles.fileButtonGradient}>
                    {LocalIcons.document({ size: 24, color: "#ffffff" })}
                    <Text style={styles.fileButtonText}>PDF документ</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

                             {selectedFile && (
                 <View style={styles.selectedFile}>
                   <View style={styles.selectedFileIcon}>
                     {selectedFile.type === 'pdf' ? 
                       LocalIcons.document({ size: 20, color: "#ff4444" }) :
                       LocalIcons.image({ size: 20, color: "#0863a7" })
                     }
                   </View>
                   <Text style={styles.selectedFileName}>{selectedFile.name}</Text>
                 </View>
               )}
            </View>

            {/* Дата анализа */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Дата анализа</Text>
              <TextInput
                style={styles.dateInput}
                value={selectedDate}
                onChangeText={setSelectedDate}
                placeholder="ГГГГ-ММ-ДД"
                placeholderTextColor="#999999"
              />
            </View>

            {/* Клиника */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Где были сделаны анализы</Text>
              <TextInput
                style={styles.textInput}
                value={clinicName}
                onChangeText={setClinicName}
                placeholder="Название клиники или лаборатории"
                placeholderTextColor="#999999"
              />
            </View>

            {/* Комментарий */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Комментарий</Text>
              <TextInput
                style={[styles.textInput, styles.commentInput]}
                value={comment}
                onChangeText={setComment}
                placeholder="Дополнительная информация об анализах"
                placeholderTextColor="#999999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Кнопка добавления */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.addAnalysisButton}
              onPress={addAnalysis}
              disabled={!selectedFile}
            >
              <LinearGradient
                colors={selectedFile ? ['#22ae2c', '#5cc72f'] : ['#cccccc', '#999999']}
                style={styles.addAnalysisGradient}
              >
                <Text style={styles.addAnalysisText}>Добавить анализ</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
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
  addButton: {
    padding: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
  analysesList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  analysesListContent: {
    paddingBottom: 120, // Отступ для нижней панели навигации
  },
  analysisCard: {
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
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  analysisInfo: {
    flex: 1,
  },
  analysisDate: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  clinicName: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#666666',
  },
  deleteButton: {
    padding: 5,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  fileIcon: {
    marginRight: 15,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  fileType: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#666666',
  },
  commentContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  commentLabel: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#666666',
    lineHeight: 20,
  },
  analysisFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  uploadDate: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    color: '#999999',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#0863a7',
    fontWeight: '600',
    marginRight: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 34,
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
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  fileButtons: {
    gap: 15,
  },
  fileButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  fileButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  fileButtonText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 10,
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedFileIcon: {
    marginRight: 10,
  },
  selectedFileName: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#333333',
    flex: 1,
  },
  dateInput: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#333333',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#333333',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  commentInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addAnalysisButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  addAnalysisGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  addAnalysisText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
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
    backgroundColor: '#ffffff',
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
    color: '#333333',
    fontWeight: '500',
  },
  sortMenuItemTextActive: {
    color: '#0863a7',
    fontWeight: '600',
  },
  sortMenuItemCheck: {
    fontSize: 16,
    color: '#0863a7',
    fontWeight: 'bold',
  },
});
