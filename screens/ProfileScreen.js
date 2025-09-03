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
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';

export default function ProfileScreen({ onBack }) {
  const [userData, setUserData] = useState({
    fullName: 'Иванов Иван Иванович',
    phone: '+7 (777) 123-45-67',
    gender: 'Мужской',
    iin: '123456789012',
    birthDate: '15.03.1990',
    address: 'г. Алматы, ул. Абая, д. 150, кв. 25',
    email: 'ivanov@example.com',
    registrationDate: '01.01.2024'
  });

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  
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



  const handleEditField = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      setUserData(prev => ({
        ...prev,
        [editingField]: editValue.trim()
      }));
      setShowEditModal(false);
      setEditingField(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingField(null);
    setEditValue('');
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Необходимо разрешение на доступ к галерее');
      return false;
    }
    return true;
  };

  const handlePhotoPress = () => {
    setShowPhotoModal(true);
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePhoto(result.assets[0].uri);
        setShowPhotoModal(false);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePhoto(result.assets[0].uri);
        setShowPhotoModal(false);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выбрать фото');
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setShowPhotoModal(false);
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
          onPress: () => {
            // Здесь будет логика выхода
            console.log('Выход из аккаунта');
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
          onPress={() => handleEditField(title.toLowerCase().replace(/\s+/g, ''), value)}
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

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
        visible={showEditModal}
        transparent={true}
        animationType="none"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Редактировать {editingField}</Text>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Введите ${editingField}`}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={handleCancelEdit}>
                <Text style={styles.modalButtonTextCancel}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonSave} onPress={handleSaveEdit}>
                <Text style={styles.modalButtonTextSave}>Сохранить</Text>
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
