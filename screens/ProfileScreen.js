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
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';
import StorageService from '../services/storageService';

export default function ProfileScreen({ onBack, onLogout }) {
  const [userData, setUserData] = useState({
    fullName: '',
    phone: '',
    gender: '',
    iin: '',
    birthDate: '',
    address: '',
    email: '',
    registrationDate: ''
  });

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editError, setEditError] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadUserData();
    loadProfilePhoto();

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

  const loadUserData = async () => {
    try {
      const storedData = await StorageService.getUserData();
      if (storedData) {
        // Преобразуем данные для отображения
        const displayData = {
          fullName: storedData.fullName || '',
          phone: formatPhoneForDisplay(storedData.phoneNumber || ''),
          gender: storedData.gender === 'male' ? 'Мужской' : storedData.gender === 'female' ? 'Женский' : '',
          iin: storedData.iin || '',
          birthDate: storedData.birthDate || '',
          address: storedData.address || '',
          email: storedData.email || '',
          registrationDate: storedData.registrationDate || ''
        };
        setUserData(displayData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные пользователя');
    }
  };

  const loadProfilePhoto = async () => {
    try {
      const photoUri = await StorageService.getProfilePhoto();
      if (photoUri) {
        setProfilePhoto(photoUri);
      }
    } catch (error) {
      console.error('Error loading profile photo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneForDisplay = (phoneNumber) => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
    }
    return phoneNumber;
  };



  const getFieldKey = (title) => {
    if (!title) return '';
    const fieldMap = {
      'ФИО': 'fullName',
      'Телефон': 'phone',
      'Пол': 'gender',
      'ИИН': 'iin',
      'Дата рождения': 'birthDate',
      'Адрес': 'address',
      'Email': 'email'
    };
    return fieldMap[title] || title.toLowerCase().replace(/\s+/g, '');
  };

  const getFieldTitle = (fieldKey) => {
    if (!fieldKey) return '';
    const titleMap = {
      'fullName': 'ФИО',
      'phone': 'Телефон',
      'gender': 'Пол',
      'iin': 'ИИН',
      'birthDate': 'Дата рождения',
      'address': 'Адрес',
      'email': 'Email'
    };
    return titleMap[fieldKey] || fieldKey;
  };

  const formatBirthDate = (text) => {
    // Удаляем все нецифровые символы
    const cleaned = text.replace(/\D/g, '');
    
    // Ограничиваем до 8 цифр
    const limited = cleaned.slice(0, 8);
    
    // Форматируем с точками
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 4) {
      return `${limited.slice(0, 2)}.${limited.slice(2)}`;
    } else {
      return `${limited.slice(0, 2)}.${limited.slice(2, 4)}.${limited.slice(4)}`;
    }
  };

  const validateBirthDate = (dateString) => {
    if (dateString.length !== 10) return false; // DD.MM.YYYY
    
    // Проверяем формат DD.MM.YYYY
    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = dateString.match(dateRegex);
    
    if (!match) return false;
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Проверяем корректность даты
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    // Проверяем, что дата не в будущем
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    if (inputDate > today) return false;
    
    return true;
  };

  const validateIIN = (iinString) => {
    return iinString.length === 12 && /^\d{12}$/.test(iinString);
  };

  const formatPhoneNumber = (text) => {
    // Удаляем все нецифровые символы
    const cleaned = text.replace(/\D/g, '');
    
    // Если номер начинается с 8, заменяем на 7
    let phoneDigits = cleaned;
    if (phoneDigits.startsWith('8')) {
      phoneDigits = '7' + phoneDigits.slice(1);
    }
    
    // Если номер не начинается с 7, добавляем 7
    if (!phoneDigits.startsWith('7') && phoneDigits.length > 0) {
      phoneDigits = '7' + phoneDigits;
    }
    
    // Ограничиваем до 11 цифр (7 + 10 цифр)
    phoneDigits = phoneDigits.slice(0, 11);
    
    // Форматируем номер телефона
    if (phoneDigits.length <= 1) {
      return phoneDigits.length > 0 ? `+7 (${phoneDigits.slice(1)}` : '+7 (';
    } else if (phoneDigits.length <= 4) {
      return `+7 (${phoneDigits.slice(1, 4)}`;
    } else if (phoneDigits.length <= 7) {
      return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4, 7)}`;
    } else if (phoneDigits.length <= 9) {
      return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4, 7)}-${phoneDigits.slice(7, 9)}`;
    } else {
      return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4, 7)}-${phoneDigits.slice(7, 9)}-${phoneDigits.slice(9, 11)}`;
    }
  };

  const handleEditField = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue);
    setEditError(false);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!editingField) {
        Alert.alert('Ошибка', 'Не выбрано поле для редактирования');
        return;
      }

      // Валидация для даты рождения
      if (editingField === 'birthDate') {
        if (editValue.length === 10) {
          const isValid = validateBirthDate(editValue);
          if (!isValid) {
            setEditError(true);
            return;
          }
        } else {
          setEditError(true);
          return;
        }
      }

      // Валидация для ИИН
      if (editingField === 'iin') {
        const isValid = validateIIN(editValue);
        if (!isValid) {
          setEditError(true);
          return;
        }
      }

      // Обновляем локальное состояние
      const updatedUserData = {
        ...userData,
        [editingField]: editValue.trim()
      };
      setUserData(updatedUserData);

      // Сохраняем в локальное хранилище
      const storageData = convertToStorageFormat(updatedUserData);
      const saveSuccess = await StorageService.updateUserData(storageData);

      if (!saveSuccess) {
        Alert.alert('Ошибка', 'Не удалось сохранить изменения');
        return;
      }

      setShowEditModal(false);
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить изменения');
    }
  };

  const convertToStorageFormat = (displayData) => {
    return {
      fullName: displayData.fullName || '',
      phoneNumber: displayData.phone ? displayData.phone.replace(/\D/g, '') : '', // Очищаем от форматирования
      gender: displayData.gender === 'Мужской' ? 'male' : displayData.gender === 'Женский' ? 'female' : '',
      iin: displayData.iin || '',
      birthDate: displayData.birthDate || '',
      address: displayData.address || '',
      email: displayData.email || '',
      registrationDate: displayData.registrationDate || ''
    };
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingField(null);
    setEditValue('');
    setEditError(false);
  };

  const handleEditValueChange = (text) => {
    if (editingField === 'birthDate') {
      const formatted = formatBirthDate(text);
      setEditValue(formatted);
      
      // Проверяем валидность и устанавливаем ошибку
      if (formatted.length === 10) {
        const isValid = validateBirthDate(formatted);
        setEditError(!isValid);
      } else {
        setEditError(false);
      }
    } else if (editingField === 'iin') {
      // Оставляем только цифры
      const cleaned = text.replace(/\D/g, '');
      // Ограничиваем до 12 цифр
      const limited = cleaned.slice(0, 12);
      setEditValue(limited);
      
      // Проверяем валидность и устанавливаем ошибку
      if (limited.length > 0) {
        const isValid = validateIIN(limited);
        setEditError(!isValid);
      } else {
        setEditError(false);
      }
    } else if (editingField === 'phone') {
      const formatted = formatPhoneNumber(text);
      setEditValue(formatted);
      setEditError(false);
    } else {
      setEditValue(text);
      setEditError(false);
    }
  };

  const requestPermissions = async (type = 'media') => {
    if (Platform.OS !== 'web') {
      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Ошибка', 'Необходим доступ к камере для съемки фото');
          return false;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Ошибка', 'Необходимо разрешение на доступ к галерее');
          return false;
        }
      }
    }
    return true;
  };

  const handlePhotoPress = () => {
    setShowPhotoModal(true);
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestPermissions('camera');
      if (!hasPermission) return;

      console.log('Запуск камеры...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        setProfilePhoto(photoUri);
        await StorageService.saveProfilePhoto(photoUri);
        setShowPhotoModal(false);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    }
  };

  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions('media');
      if (!hasPermission) return;

      console.log('Открытие галереи для фото...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        setProfilePhoto(photoUri);
        await StorageService.saveProfilePhoto(photoUri);
        setShowPhotoModal(false);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выбрать фото');
    }
  };

  const removePhoto = async () => {
    try {
      setProfilePhoto(null);
      await StorageService.deleteProfilePhoto();
      setShowPhotoModal(false);
    } catch (error) {
      console.error('Error removing profile photo:', error);
      Alert.alert('Ошибка', 'Не удалось удалить фото');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Выход из аккаунта',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            try {
              const logoutSuccess = await StorageService.logout();
              if (logoutSuccess) {
                // Возвращаемся к экрану авторизации
                if (onBack) {
                  // Сначала возвращаемся к предыдущему экрану
                  onBack();
                  // Через небольшую задержку вызываем onLogout, если он передан
                  setTimeout(() => {
                    if (onLogout) {
                      onLogout();
                    }
                  }, 100);
                }
              } else {
                Alert.alert('Ошибка', 'Не удалось выйти из аккаунта');
              }
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Ошибка', 'Произошла ошибка при выходе из аккаунта');
            }
          },
        },
      ]
    );
  };

  const renderInfoItem = (icon, title, value, isEditable = false) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <LinearGradient colors={['#0863a7', '#074393']} style={styles.iconGradient}>
          {LocalIcons[icon] ? LocalIcons[icon]({ size: 20, color: "#ffffff" }) : 
            <Text style={{ color: "#ffffff", fontSize: 16 }}>?</Text>
          }
        </LinearGradient>
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      {isEditable && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditField(getFieldKey(title), value)}
        >
          {LocalIcons.edit ? LocalIcons.edit({ size: 20, color: "#0863a7" }) : 
            <Text style={{ color: "#0863a7", fontSize: 16 }}>✏️</Text>
          }
        </TouchableOpacity>
      )}
    </View>
  );

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
            <TouchableOpacity style={styles.profileImageContainer} onPress={handlePhotoPress}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
              ) : (
                <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.profileImage}>
                  <Text style={styles.profileInitials}>
                    {userData.fullName.split(' ').map(n => n[0]).join('')}
                  </Text>
                </LinearGradient>
              )}
              <View style={styles.photoEditIcon}>
                {LocalIcons.camera ? LocalIcons.camera({ size: 16, color: '#ffffff' }) : 
                  <Text style={{ color: '#ffffff', fontSize: 12 }}>📷</Text>
                }
              </View>
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Профиль</Text>
              <Text style={styles.headerSubtitle}>Управление аккаунтом</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.scrollContent} 
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Основная информация */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Основная информация</Text>
            
            <View style={styles.infoContainer}>
              {renderInfoItem('user', 'ФИО', userData.fullName, true)}
              {renderInfoItem('call', 'Телефон', userData.phone, true)}
              {renderInfoItem('user', 'Пол', userData.gender, true)}
              {renderInfoItem('document', 'ИИН', userData.iin, true)}
              {renderInfoItem('time', 'Дата рождения', userData.birthDate, true)}
              {renderInfoItem('location', 'Адрес', userData.address, true)}
            </View>
          </View>

          {/* Дополнительная информация */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Дополнительная информация</Text>
            <View style={styles.infoContainer}>
              {renderInfoItem('mail', 'Email', userData.email, true)}
              {renderInfoItem('time', 'Дата регистрации', userData.registrationDate)}
            </View>
          </View>

          {/* Статистика */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Статистика использования</Text>
            <View style={styles.statsContainer}>
              {/* Первый ряд */}
              <View style={styles.statItem}>
                <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.statIcon}>
                  {LocalIcons.analytics ? LocalIcons.analytics({ size: 24, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 20 }}>📊</Text>
                  }
                </LinearGradient>
                <Text style={styles.statNumber}>127</Text>
                <Text style={styles.statLabel}>Анализов</Text>
              </View>
              
              <View style={styles.statItem}>
                <LinearGradient colors={['#60caac', '#9ad0e7']} style={styles.statIcon}>
                  {LocalIcons.time ? LocalIcons.time({ size: 24, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 20 }}>⏰</Text>
                  }
                </LinearGradient>
                <Text style={styles.statNumber}>45</Text>
                <Text style={styles.statLabel}>Часов</Text>
              </View>
              
              <View style={styles.statItem}>
                <LinearGradient colors={['#2571aa', '#0b417a']} style={styles.statIcon}>
                  {LocalIcons.document ? LocalIcons.document({ size: 24, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 20 }}>📄</Text>
                  }
                </LinearGradient>
                <Text style={styles.statNumber}>89</Text>
                <Text style={styles.statLabel}>Отчетов</Text>
              </View>
              
              {/* Второй ряд */}
              <View style={styles.statItem}>
                <LinearGradient colors={['#ff6b35', '#ff8c42']} style={styles.statIcon}>
                  {LocalIcons.medical ? LocalIcons.medical({ size: 24, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 20 }}>🏥</Text>
                  }
                </LinearGradient>
                <Text style={styles.statNumber}>23</Text>
                <Text style={styles.statLabel}>Процедур</Text>
              </View>
              
              <View style={styles.statItem}>
                <LinearGradient colors={['#9c27b0', '#ba68c8']} style={styles.statIcon}>
                  {LocalIcons.chat ? LocalIcons.chat({ size: 24, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 20 }}>💬</Text>
                  }
                </LinearGradient>
                <Text style={styles.statNumber}>67</Text>
                <Text style={styles.statLabel}>Консультаций</Text>
              </View>
              
              <View style={styles.statItem}>
                <LinearGradient colors={['#ff9800', '#ffb74d']} style={styles.statIcon}>
                  {LocalIcons.help ? LocalIcons.help({ size: 24, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 20 }}>❓</Text>
                  }
                </LinearGradient>
                <Text style={styles.statNumber}>156</Text>
                <Text style={styles.statLabel}>Обращений</Text>
              </View>
            </View>
          </View>

          {/* Действия */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Действия</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.actionGradient}>
                  {LocalIcons.upload ? LocalIcons.upload({ size: 20, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 16 }}>⬆️</Text>
                  }
                  <Text style={styles.actionText}>Экспорт данных</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <LinearGradient colors={['#60caac', '#9ad0e7']} style={styles.actionGradient}>
                  {LocalIcons.settings ? LocalIcons.settings({ size: 20, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 16 }}>⚙️</Text>
                  }
                  <Text style={styles.actionText}>Настройки</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
                <LinearGradient colors={['#ff4444', '#d32f2f']} style={styles.actionGradient}>
                  {LocalIcons.logout ? LocalIcons.logout({ size: 20, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 16 }}>🚪</Text>
                  }
                  <Text style={styles.actionText}>Выйти</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Модальное окно редактирования */}
      <Modal
        visible={showEditModal && editingField !== null}
        transparent={true}
        animationType="none"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Редактировать {getFieldTitle(editingField) || editingField}</Text>
            <TextInput
              style={[styles.modalInput, editError && styles.modalInputError]}
              value={editValue}
              onChangeText={handleEditValueChange}
              placeholder={
                editingField === 'birthDate' ? 'Дата рождения (ДД.ММ.ГГГГ)' :
                editingField === 'iin' ? 'ИИН (12 цифр)' :
                editingField === 'phone' ? '+7 (___) ___-__-__' :
                `Введите ${(getFieldTitle(editingField) || editingField || '').toLowerCase()}`
              }
              placeholderTextColor="#999"
              keyboardType={editingField === 'birthDate' || editingField === 'iin' || editingField === 'phone' ? 'numeric' : 'default'}
              maxLength={editingField === 'birthDate' ? 10 : editingField === 'iin' ? 12 : editingField === 'phone' ? 18 : undefined}
            />
            {editError && editingField === 'birthDate' && (
              <Text style={styles.modalErrorText}>
                Введите корректную дату рождения (ДД.ММ.ГГГГ)
              </Text>
            )}
            {editError && editingField === 'iin' && (
              <Text style={styles.modalErrorText}>
                ИИН должен содержать ровно 12 цифр
              </Text>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={handleCancelEdit}>
                <Text style={styles.modalButtonTextCancel}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButtonSave, editError && styles.modalButtonSaveDisabled]} 
                onPress={handleSaveEdit}
                disabled={editError}
              >
                <Text style={[styles.modalButtonTextSave, editError && styles.modalButtonTextSaveDisabled]}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно для работы с фото */}
      <Modal
        visible={showPhotoModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Фото профиля</Text>
            
            {profilePhoto && (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: profilePhoto }} style={styles.photoPreview} />
              </View>
            )}
            
            <View style={styles.photoActionsContainer}>
              <TouchableOpacity style={styles.photoActionButton} onPress={takePhoto}>
                <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.photoActionGradient}>
                  {LocalIcons.camera ? LocalIcons.camera({ size: 20, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 16 }}>📷</Text>
                  }
                  <Text style={styles.photoActionText}>Сделать фото</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.photoActionButton} onPress={pickImage}>
                <LinearGradient colors={['#2571aa', '#0b417a']} style={styles.photoActionGradient}>
                  {LocalIcons.image ? LocalIcons.image({ size: 20, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 16 }}>🖼️</Text>
                  }
                  <Text style={styles.photoActionText}>Выбрать из галереи</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              {profilePhoto && (
                <TouchableOpacity style={styles.photoActionButton} onPress={removePhoto}>
                  <LinearGradient colors={['#ff4444', '#d32f2f']} style={styles.photoActionGradient}>
                    <Text style={{ color: "#ffffff", fontSize: 16 }}>🗑️</Text>
                    <Text style={styles.photoActionText}>Удалить фото</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.photoActionButton} onPress={() => setShowPhotoModal(false)}>
                <LinearGradient colors={['#999', '#666']} style={styles.photoActionGradient}>
                  <Text style={{ color: "#ffffff", fontSize: 16 }}>✕</Text>
                  <Text style={styles.photoActionText}>Закрыть</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Open Sauce',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Open Sauce',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Open Sauce',
    opacity: 0.8,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContentContainer: {
    paddingBottom: 120, // Отступ для нижней панели навигации
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Open Sauce',
    marginBottom: 15,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 15,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Open Sauce',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Open Sauce',
    marginTop: 2,
  },

  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
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
    width: '30%',
    marginBottom: 15,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsIcon: {
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
  actionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    marginBottom: 10,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Open Sauce',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Open Sauce',
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
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontWeight: '600',
    fontFamily: 'Open Sauce',
  },
  modalButtonTextSave: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Open Sauce',
  },
  modalInputError: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  modalErrorText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 5,
    marginBottom: 10,
    fontFamily: 'Open Sauce',
  },
  modalButtonSaveDisabled: {
    backgroundColor: '#cccccc',
  },
  modalButtonTextSaveDisabled: {
    color: '#999999',
  },
  photoEditIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#22ae2c',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  photoPreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#22ae2c',
  },
  photoActionsContainer: {
    gap: 12,
  },
  photoActionButton: {
    marginBottom: 8,
  },
  photoActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  photoActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Open Sauce',
    marginLeft: 10,
  },
});
