import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, Linking, Alert, Image, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import LocalIcons from '../components/LocalIcons';

// Импорт экранов
import ClinicsScreen from './ClinicsScreen';
import AnalysesScreen from './AnalysesScreen';
import RequestsScreen from './RequestsScreen';
import ProfileScreen from './ProfileScreen';
import ClinicDetailScreen from './ClinicDetailScreen';
import SpecialistDetailScreen from './SpecialistDetailScreen';
import RequestDetailScreen from './RequestDetailScreen';
import AnalysisDetailScreen from './AnalysisDetailScreen';
import HistoryScreen from './HistoryScreen';

export default function HomeScreen() {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeHistoryTab, setActiveHistoryTab] = useState('treatment');
  const [clinicDetail, setClinicDetail] = useState(null);
  const [specialistDetail, setSpecialistDetail] = useState(null);
  const [requestDetail, setRequestDetail] = useState(null);
  const [analysisDetail, setAnalysisDetail] = useState(null);
  const [attachedPhotos, setAttachedPhotos] = useState([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sosPulseAnim = useRef(new Animated.Value(1)).current;

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

    // Пульсация кнопки SOS
    const sosPulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sosPulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sosPulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    sosPulseAnimation.start();
  }, []);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Начинаем запись (имитация)
      Speech.speak('Начинаю запись голоса', {
        language: 'ru-RU',
        pitch: 1,
        rate: 0.8,
        onDone: () => {
          // После завершения речи имитируем обработку
          setTimeout(() => {
            setIsRecording(false);
            setInputText('Привет! Я готов помочь вам с анализом данных.');
          }, 1000);
        }
      });
    } else {
      // Останавливаем запись
      Speech.stop();
      setIsRecording(false);
    }
  };

  const handleAnalyze = () => {
    if (inputText.trim()) {
      // Здесь будет логика анализа
      console.log('Анализируем:', inputText);
    }
  };

  const handleProfilePress = () => {
    setActiveTab('profile');
  };

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
      const newPhoto = {
        id: Date.now(),
        uri: result.assets[0].uri,
        name: `Фото_${new Date().toISOString().split('T')[0]}.jpg`
      };
      setAttachedPhotos([...attachedPhotos, newPhoto]);
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
      const newPhoto = {
        id: Date.now(),
        uri: result.assets[0].uri,
        name: `Фото_${new Date().toISOString().split('T')[0]}.jpg`
      };
      setAttachedPhotos([...attachedPhotos, newPhoto]);
    }
  };

  const removePhoto = (photoId) => {
    setAttachedPhotos(attachedPhotos.filter(photo => photo.id !== photoId));
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Прикрепить фото',
      'Выберите способ добавления фотографии',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Сделать фото', onPress: takePhoto },
        { text: 'Выбрать из галереи', onPress: pickImage },
      ]
    );
  };

  const renderTabIcon = (tabName, iconName, label) => (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={() => setActiveTab(tabName)}
    >
      <View style={[
        styles.tabIcon,
        { backgroundColor: activeTab === tabName ? '#22ae2c' : '#f0f0f0' }
      ]}>
        {LocalIcons[iconName] ? 
          LocalIcons[iconName]({ 
            size: 24, 
            color: activeTab === tabName ? "#ffffff" : "#666666" 
          }) : 
          <Text style={{ 
            color: activeTab === tabName ? "#ffffff" : "#666666", 
            fontSize: 16 
          }}>?</Text>
        }
      </View>
      <Text style={[
        styles.tabLabel,
        { color: activeTab === tabName ? '#22ae2c' : '#666666' }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'clinics':
        return <ClinicsScreen navigation={{ navigate: (screen, params) => {
          if (screen === 'ClinicDetail') {
            setActiveTab('clinicDetail');
            setClinicDetail(params.clinic);
          } else if (screen === 'SpecialistDetail') {
            setActiveTab('specialistDetail');
            setSpecialistDetail(params.specialist);
          }
        }}} />;
      case 'clinicDetail':
        return <ClinicDetailScreen route={{ params: { clinic: clinicDetail } }} navigation={{ goBack: () => setActiveTab('clinics') }} />;
      case 'specialistDetail':
        return <SpecialistDetailScreen route={{ params: { specialist: specialistDetail } }} navigation={{ goBack: () => setActiveTab('clinics') }} />;
      case 'analyses':
        return <AnalysesScreen navigation={{ navigate: (screen, params) => {
          if (screen === 'AnalysisDetail') {
            setActiveTab('analysisDetail');
            setAnalysisDetail(params.analysis);
          }
        }}} />;
      case 'analysisDetail':
        return <AnalysisDetailScreen route={{ params: { analysis: analysisDetail } }} navigation={{ goBack: () => setActiveTab('analyses') }} />;
      case 'analytics':
        return <RequestsScreen navigation={{ navigate: (screen, params) => {
          if (screen === 'RequestDetail') {
            setActiveTab('requestDetail');
            setRequestDetail(params.request);
          }
        }}} />;
      case 'requestDetail':
        return <RequestDetailScreen route={{ params: { request: requestDetail } }} navigation={{ goBack: () => setActiveTab('analytics') }} />;
      case 'history':
        return <HistoryScreen 
          activeTab={activeHistoryTab} 
          setActiveTab={setActiveHistoryTab}
          onBack={() => setActiveTab('home')} 
        />;
      case 'profile':
        return <ProfileScreen onBack={() => setActiveTab('home')} />;
      default:
        return (
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Заголовок */}
            <LinearGradient
              colors={['#0863a7', '#074393']}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                                            <View style={styles.headerLeft}>
                              <View style={styles.headerIconContainer}>
                                <Image 
                                  source={require('../image.png')}
                                  style={styles.headerLogo}
                                  fadeDuration={0}
                                  resizeMode="contain"
                                />
                              </View>
                              <View style={styles.headerText}>
                                <Text style={styles.title}>AI-CLINIKA</Text>
                              </View>
      </View>

                {/* Кнопка профиля */}
                <TouchableOpacity 
                  style={styles.profileButton}
                  onPress={handleProfilePress}
                >
                  <LinearGradient
                    colors={['#22ae2c', '#5cc72f']}
                    style={styles.profileButtonGradient}
                  >
                    {LocalIcons.user({ size: 24, color: "#ffffff" })}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Основной контент */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.mainContent}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
              >
                <ScrollView 
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                >
              {/* Кнопка микрофона */}
              <TouchableOpacity 
                style={styles.micButton}
                onPress={handleVoiceInput}
              >
                <Animated.View
                  style={[
                    styles.micButtonInner,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={isRecording ? ['#ff4444', '#d32f2f'] : ['#22ae2c', '#5cc72f']}
                    style={styles.micGradient}
                  >
                    {LocalIcons[isRecording ? "stop" : "mic"]({ size: 72, color: "#ffffff" })}
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>

              {/* Поле ввода текста */}
              <View style={styles.textInputContainer}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Введите ваш запрос..."
                    placeholderTextColor="#999999"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <TouchableOpacity 
                    style={styles.attachButton}
                    onPress={showPhotoOptions}
                  >
                    <LinearGradient
                      colors={['#0863a7', '#074393']}
                      style={styles.attachButtonGradient}
                    >
                      {LocalIcons.attach({ size: 20, color: "#ffffff" })}
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.sendButton}
                    onPress={handleAnalyze}
                    disabled={!inputText.trim()}
                  >
                    <LinearGradient
                      colors={inputText.trim() ? ['#22ae2c', '#5cc72f'] : ['#cccccc', '#999999']}
                      style={styles.sendButtonGradient}
                    >
                      {LocalIcons.send({ size: 20, color: "#ffffff" })}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* Прикрепленные фотографии */}
                {attachedPhotos.length > 0 && (
                  <View style={styles.attachedPhotosContainer}>
                    <View style={styles.photosGrid}>
                      {attachedPhotos.map((photo) => (
                        <View key={photo.id} style={styles.photoItem}>
                          <Image
                            source={{ uri: photo.uri }}
                            style={styles.photoThumbnail}
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            style={styles.removePhotoButton}
                            onPress={() => removePhoto(photo.id)}
                          >
                            <LinearGradient
                              colors={['#ff4444', '#d32f2f']}
                              style={styles.removePhotoGradient}
                            >
                              {LocalIcons.close({ size: 16, color: "#ffffff" })}
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>


            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

            {/* Кнопка скорой помощи */}
        <Animated.View 
          style={[
            styles.emergencyButton,
            {
              transform: [{ scale: sosPulseAnim }],
            },
          ]}
        >
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                'Скорая помощь',
                'Вы хотите вызвать скорую помощь?',
                [
                  {
                    text: 'Отмена',
                    style: 'cancel',
                  },
                  {
                    text: 'Вызвать',
                    style: 'destructive',
                    onPress: () => {
                      Linking.openURL('tel:103');
                    },
                  },
                ]
              );
            }}
          >
            <LinearGradient
              colors={['#ff4444', '#d32f2f']}
              style={styles.emergencyButtonGradient}
            >
              <Text style={styles.emergencyButtonText}>SOS</Text>
              <Text style={styles.emergencyButtonSubtext}>103</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
          </Animated.View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}

      {/* Панель управления */}
      <View style={styles.bottomPanel}>
        <LinearGradient
          colors={['#ffffff', '#f8f9fa']}
          style={styles.bottomPanelGradient}
        >
          {renderTabIcon('home', 'home', 'Главная')}
          {renderTabIcon('clinics', 'medical', 'Клиники')}
          {renderTabIcon('analyses', 'analytics', 'Анализы')}
          {renderTabIcon('analytics', 'document', 'Обращения')}
          {renderTabIcon('history', 'time', 'История')}
        </LinearGradient>
      </View>
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
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileButton: {
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 50,
    height: 50,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 25,
  },
  headerLogo: {
    width: 50,
    height: 50,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 20,
  },
  mainContent: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    minHeight: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  micButton: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  micButtonInner: {
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  micGradient: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#333333',
    minHeight: 50,
    maxHeight: 120,
    textAlignVertical: 'top',
    padding: 0,
  },



  attachButton: {
    borderRadius: 18,
    overflow: 'hidden',
    flexShrink: 0,
  },
  attachButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    borderRadius: 18,
    overflow: 'hidden',
    flexShrink: 0,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachedPhotosContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoItem: {
    position: 'relative',
  },
  photoThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 10,
    overflow: 'hidden',
  },
  removePhotoGradient: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomPanel: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  bottomPanelGradient: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
  },
  emergencyButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
  },
  emergencyButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyButtonText: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emergencyButtonSubtext: {
    fontSize: 10,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    marginTop: 2,
  },
});
