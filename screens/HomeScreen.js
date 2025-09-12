import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, Linking, Alert, Image, TouchableWithoutFeedback, Keyboard, ScrollView, Modal, BackHandler, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
// Удаляем старый Voice модуль - используем OpenAI Speech-to-Text API
import LocalIcons from '../components/LocalIcons';
import { API_KEYS, API_URLS } from '../config/api';
import StorageService from '../services/storageService';
import { useTheme } from '../themes/useTheme';

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
import CheckupDetailScreen from './CheckupDetailScreen';
import ExpensesScreen from './ExpensesScreen';

export default function HomeScreen({ onLogout }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeHistoryTab, setActiveHistoryTab] = useState('treatment');
  const [clinicDetail, setClinicDetail] = useState(null);
  const [specialistDetail, setSpecialistDetail] = useState(null);
  const [requestDetail, setRequestDetail] = useState(null);
  const [analysisDetail, setAnalysisDetail] = useState(null);
  const [checkupDetail, setCheckupDetail] = useState(null);
  const [attachedPhotos, setAttachedPhotos] = useState([]);
  const [attachedVideos, setAttachedVideos] = useState([]);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [speechRecognitionText, setSpeechRecognitionText] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('RU');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sosPulseAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Загружаем фото профиля
    loadProfilePhoto();

    // Очистка при размонтировании
    return () => {
      if (window.currentRecording) {
        window.currentRecording.stopAndUnloadAsync().then(() => {
          const uri = window.currentRecording.getURI();
          if (uri) {
            cleanupAudioFile(uri);
          }
        }).catch(console.error);
        window.currentRecording = null;
      }
    };
  }, []);

  useEffect(() => {
    // Простая анимация появления
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

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

    // Очистка анимаций при размонтировании
    return () => {
      sosPulseAnimation.stop();
    };
  }, []);

  // Анимация вращения для спиннера загрузки
  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
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

  // Обработка системной кнопки "Назад"
  useEffect(() => {
    const backAction = () => {
      // На главном экране показываем диалог выхода
      Alert.alert(
        'Выход из приложения',
        'Вы уверены, что хотите выйти?',
        [
          {
            text: 'Отмена',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Выйти',
            onPress: () => BackHandler.exitApp(),
          },
        ]
      );
      return true; // Предотвращаем стандартное поведение
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  // Функция для записи аудио
  const startAudioRecording = async () => {
    try {
      console.log('Starting audio recording...');
      
      // Запрашиваем разрешения
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Microphone permission not granted');
      }

      // Настраиваем аудио режим
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Создаем запись с настройками HIGH_QUALITY (создает .m4a файлы)
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      
      console.log('Recording started');
      return recording;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  };

  // Функция для остановки записи и получения URI
  const stopAudioRecording = async (recording) => {
    try {
      console.log('Stopping audio recording...');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped, URI:', uri);
      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  };

  // Функция для очистки аудио файла после использования
  const cleanupAudioFile = async (audioUri) => {
    try {
      if (audioUri && audioUri.startsWith('file://')) {
        console.log('Cleaning up audio file:', audioUri);
        const fileExists = await FileSystem.getInfoAsync(audioUri);
        if (fileExists.exists) {
          await FileSystem.deleteAsync(audioUri);
          console.log('Audio file deleted successfully');
        } else {
          console.log('Audio file does not exist, skipping cleanup');
        }
      }
    } catch (error) {
      console.error('Error cleaning up audio file:', error);
      // Не выбрасываем ошибку, так как это не критично
    }
  };



  // Функция для отправки аудио в OpenAI Whisper
  const transcribeAudio = async (audioUri) => {
    try {
      console.log('Transcribing audio with OpenAI Whisper...');
      console.log('Audio file URI:', audioUri);

      // Создаем правильный объект файла для React Native
      const audioFile = {
        uri: audioUri,
        name: 'audio.m4a',
        type: 'audio/m4a'
      };

      // Создаем FormData для отправки в OpenAI
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', 'whisper-1');
      formData.append('language', 'ru');

      console.log('Sending to OpenAI Whisper...');

      const response = await fetch(API_URLS.OPENAI_WHISPER, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`,
          // НЕ устанавливаем Content-Type - fetch сам добавит boundary
        },
        body: formData,
      });

      console.log('OpenAI response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI Whisper error:', response.status, errorData);
        throw new Error(`OpenAI Whisper error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('OpenAI Whisper result:', result);

      if (result.text) {
        return result.text.trim();
      } else {
        throw new Error('No text returned from OpenAI Whisper');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  };

  const ensureMicPermission = async () => {
    try {
      console.log('Checking microphone permissions...');
      const { status } = await Audio.getPermissionsAsync();
      console.log('Current microphone permission status:', status);
      
      if (status !== 'granted') {
        console.log('Requesting microphone permissions...');
        const req = await Audio.requestPermissionsAsync();
        console.log('Permission request result:', req.status);
        
        if (req.status !== 'granted') {
          console.log('Microphone permission denied by user');
          return false;
      }
      }
      
      console.log('Microphone permission granted');
      return true;
    } catch (error) {
      console.error('Error with microphone permissions:', error);
      return false;
    }
  };

  const handleVoiceInput = async () => {
    try {
      console.log('handleVoiceInput called');
      console.log('Platform:', Platform.OS);
      
      // Проверка платформы
      if (Platform.OS === 'web') {
        console.log('Web platform detected, voice input not supported');
        Alert.alert('Голосовой ввод недоступен', 'Голосовой ввод не поддерживается в веб-версии.');
        return;
      }

      if (!isRecording) {
        // Начинаем запись
        console.log('Starting voice recording...');
        setSpeechRecognitionText('Записываю... Говорите в микрофон. Нажмите кнопку еще раз для остановки');
        setIsRecording(true);
        
        try {
          // Запускаем запись
          const recording = await startAudioRecording();
          
          // Сохраняем ссылку на запись для остановки
          window.currentRecording = recording;
          
        } catch (error) {
          console.error('Error starting recording:', error);
          setIsRecording(false);
          setSpeechRecognitionText('');
          
          let errorMessage = 'Не удалось начать запись. Проверьте разрешения микрофона.';
          if (error.message.includes('permission')) {
            errorMessage = 'Нет доступа к микрофону. Разрешите доступ в настройках приложения.';
          }
          
          Alert.alert('Ошибка', errorMessage);
        }
      } else {
        // Останавливаем запись (повторное нажатие кнопки)
        console.log('Stopping recording via button press');
        setSpeechRecognitionText('Останавливаю запись...');
        
        try {
          if (window.currentRecording) {
            // Останавливаем запись
            const audioUri = await stopAudioRecording(window.currentRecording);
            window.currentRecording = null;
            
            // Отправляем на распознавание
            setSpeechRecognitionText('OpenAI Whisper обрабатывает...');
            const transcribedText = await transcribeAudio(audioUri);
            
            // Очищаем аудио файл после использования
            await cleanupAudioFile(audioUri);
            
            // Устанавливаем результат
            setInputText(transcribedText);
        setSpeechRecognitionText('');
            setIsRecording(false);
            
            console.log('Voice input completed:', transcribedText);
          } else {
            // Если запись не найдена, просто останавливаем
            setIsRecording(false);
            setSpeechRecognitionText('');
          }
        } catch (error) {
          console.error('Error in voice processing:', error);
          setIsRecording(false);
          setSpeechRecognitionText('');
          
          // Очищаем аудио файл в случае ошибки
          if (window.currentRecording) {
            try {
              const audioUri = await stopAudioRecording(window.currentRecording);
              await cleanupAudioFile(audioUri);
            } catch (cleanupError) {
              console.error('Error during cleanup:', cleanupError);
            }
            window.currentRecording = null;
          }
          
          let errorMessage = 'Не удалось распознать речь. Попробуйте еще раз.';
          if (error.message.includes('Invalid file format')) {
            errorMessage = 'Неподдерживаемый формат аудио. Попробуйте еще раз.';
          } else if (error.message.includes('OpenAI Whisper error')) {
            errorMessage = 'Ошибка OpenAI Whisper. Проверьте подключение к интернету.';
          } else if (error.message.includes('permission')) {
            errorMessage = 'Нет доступа к микрофону. Разрешите доступ в настройках.';
          } else if (error.message.includes('No speech detected')) {
            errorMessage = 'Речь не обнаружена. Попробуйте говорить громче и четче.';
          } else if (error.message.includes('too quiet or silent')) {
            errorMessage = 'Аудио слишком тихое. Говорите ближе к микрофону.';
          }
          
          Alert.alert('Ошибка', errorMessage);
        }
      }
    } catch (error) {
      console.error('Voice input general error:', error);
      setIsRecording(false);
      setSpeechRecognitionText('');
      Alert.alert('Ошибка', `Не удалось запустить голосовой ввод: ${error.message || 'Неизвестная ошибка'}`);
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
    }
  };

  const callChatGPT = async (userQuery, retryCount = 0) => {
    const maxRetries = 2;
    const retryDelay = 2000; // 2 секунды

    try {
      const response = await fetch(API_URLS.OPENAI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `Ты медицинский ИИ-ассистент. Анализируй симптомы пользователя и давай рекомендации. 

ОТВЕЧАЙ СТРОГО В СЛЕДУЮЩЕМ JSON ФОРМАТЕ БЕЗ КАВЫЧЕК И ДОПОЛНИТЕЛЬНОГО ТЕКСТА:

{
  "category": "Название медицинской категории",
  "aiResponse": "Подробный анализ симптомов на русском языке",
  "symptoms": ["Симптом 1", "Симптом 2", "Симптом 3"],
  "recommendations": ["Рекомендация 1", "Рекомендация 2", "Рекомендация 3"]
}

ПРАВИЛА:
1. Отвечай ТОЛЬКО JSON кодом
2. НЕ используй markdown разметку
3. НЕ добавляй объяснения до или после JSON
4. НЕ используй обратные кавычки
5. Используй двойные кавычки для строк
// 6. Категории: Неврология, Кардиология, Гастроэнтерология, Ортопедия, Общая медицина, Дерматология, Офтальмология, Урология, Гематология, Хирургия, Стоматология`
            },
            {
              role: 'user',
              content: `Проанализируй мои симптомы: ${userQuery}`
            }
          ],
          temperature: 0.1,
          max_tokens: 800,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        // Обработка ошибки 429 (Too Many Requests)
        if (response.status === 429 && retryCount < maxRetries) {
          console.log(`Получена ошибка 429, повторная попытка ${retryCount + 1}/${maxRetries} через ${retryDelay}ms`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return callChatGPT(userQuery, retryCount + 1);
        }
        
        // Обработка других ошибок
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (response.status === 429) {
          errorMessage = 'Превышен лимит запросов к ИИ. Попробуйте позже.';
        } else if (response.status === 401) {
          errorMessage = 'Ошибка авторизации API ключа.';
        } else if (response.status === 500) {
          errorMessage = 'Временная ошибка сервера ИИ.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const aiContent = data.choices[0].message.content;
      
      console.log('Получен ответ от ChatGPT:', aiContent);
      
      // Парсим JSON ответ
      try {
        // Очищаем ответ от возможных markdown разметок
        let cleanContent = aiContent.trim();
        
        // Убираем возможные markdown блоки
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/```\s*/, '').replace(/```\s*$/, '');
        }
        
        // Убираем возможные лишние символы
        cleanContent = cleanContent.replace(/^[`\s]+/, '').replace(/[`\s]+$/, '');
        
        console.log('Очищенный контент для парсинга:', cleanContent);
        
        const parsedResponse = JSON.parse(cleanContent);
        console.log('Успешно распарсен JSON:', parsedResponse);
        
        // Проверяем, что все необходимые поля присутствуют
        if (!parsedResponse.category || !parsedResponse.aiResponse || !parsedResponse.symptoms || !parsedResponse.recommendations) {
          console.warn('JSON не содержит все необходимые поля:', parsedResponse);
          throw new Error('Неполный JSON ответ');
        }
        
        return parsedResponse;
      } catch (parseError) {
        console.error('Ошибка парсинга JSON:', parseError);
        console.error('Проблемный контент:', aiContent);
        
        // Возвращаем fallback ответ
        return {
          category: 'Общая медицина',
          aiResponse: 'ИИ проанализировал ваши симптомы. Рекомендуется обратиться к специалисту для точной диагностики.',
          symptoms: ['Общие симптомы'],
          recommendations: [
            'Обратитесь к терапевту для первичного осмотра',
            'Пройдите необходимые лабораторные исследования',
            'Ведите дневник симптомов для отслеживания динамики'
          ]
        };
      }
    } catch (error) {
      console.error('Ошибка при вызове ChatGPT:', error);
      // Возвращаем fallback ответ при ошибке
      return {
        category: 'Общая медицина',
        aiResponse: 'Произошла ошибка при анализе. Рекомендуется обратиться к специалисту для точной диагностики.',
        symptoms: ['Общие симптомы'],
        recommendations: [
          'Обратитесь к терапевту для первичного осмотра',
          'Пройдите необходимые лабораторные исследования',
          'Ведите дневник симптомов для отслеживания динамики'
        ]
      };
    }
  };

  const handleAnalyze = async () => {
    if (inputText.trim()) {
      setIsLoadingAI(true);
      setShowAIRecommendation(true);
      
      try {
        // Вызываем ChatGPT API
        const aiResult = await callChatGPT(inputText);
        
        const recommendation = {
          id: Date.now(),
          date: new Date().toLocaleDateString('ru-RU'),
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          userQuery: inputText,
          aiResponse: aiResult.aiResponse,
          symptoms: aiResult.symptoms,
          category: aiResult.category,
          status: 'completed',
          recommendations: aiResult.recommendations
        };

        // Сохраняем обращение в локальное хранилище
        await StorageService.saveRequest(recommendation);

        setAiRecommendation(recommendation);
        setInputText(''); // Очищаем поле ввода
      } catch (error) {
        console.error('Ошибка при анализе:', error);
        
        // Показываем более детальное сообщение об ошибке
        let errorMessage = 'Не удалось получить рекомендацию ИИ. Попробуйте еще раз.';
        
        if (error.message.includes('429') || error.message.includes('лимит запросов')) {
          errorMessage = 'Превышен лимит запросов к ИИ. Подождите несколько минут и попробуйте снова.';
        } else if (error.message.includes('401') || error.message.includes('авторизации')) {
          errorMessage = 'Ошибка авторизации API. Обратитесь к администратору.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Временная ошибка сервера ИИ. Попробуйте позже.';
        }
        
        Alert.alert('Ошибка', errorMessage);
      } finally {
        setIsLoadingAI(false);
      }
    }
  };

  const handleProfilePress = () => {
    setActiveTab('profile');
  };

  const handleMenuPress = () => {
    console.log('Menu button pressed, current state:', showMenuDropdown);
    setShowMenuDropdown(!showMenuDropdown);
    console.log('Menu dropdown state changed to:', !showMenuDropdown);
  };

  const handleMenuOptionPress = (option) => {
    setShowMenuDropdown(false);
    // Кнопки не ведут никуда - просто закрывают список
    console.log('Menu option pressed:', option);
  };

  const handleLanguagePress = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
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
          Alert.alert('Ошибка', 'Необходим доступ к галерее для загрузки файлов');
          return false;
        }
      }
    }
    return true;
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestPermissions('camera');
      if (!hasPermission) return;

      console.log('Запуск камеры...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('Результат камеры:', result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto = {
          id: Date.now(),
          uri: result.assets[0].uri,
          name: `Фото_${new Date().toISOString().split('T')[0]}.jpg`
        };
        setAttachedPhotos([...attachedPhotos, newPhoto]);
        console.log('Фото добавлено:', newPhoto);
      }
    } catch (error) {
      console.error('Ошибка при съемке фото:', error);
      Alert.alert('Ошибка', 'Не удалось открыть камеру. Попробуйте еще раз.');
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
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('Результат выбора фото:', result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto = {
          id: Date.now(),
          uri: result.assets[0].uri,
          name: `Фото_${new Date().toISOString().split('T')[0]}.jpg`
        };
        setAttachedPhotos([...attachedPhotos, newPhoto]);
        console.log('Фото добавлено:', newPhoto);
      }
    } catch (error) {
      console.error('Ошибка при выборе фото:', error);
      Alert.alert('Ошибка', 'Не удалось открыть галерею. Попробуйте еще раз.');
    }
  };

  const removePhoto = (photoId) => {
    setAttachedPhotos(attachedPhotos.filter(photo => photo.id !== photoId));
  };

  const takeVideo = async () => {
    try {
      const hasPermission = await requestPermissions('camera');
      if (!hasPermission) return;

      console.log('Запуск камеры для видео...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        videoMaxDuration: 60, // Максимум 60 секунд
      });

      console.log('Результат камеры для видео:', result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newVideo = {
          id: Date.now(),
          uri: result.assets[0].uri,
          name: `Видео_${new Date().toISOString().split('T')[0]}.mp4`,
          type: 'video',
          duration: result.assets[0].duration || 0,
        };
        setAttachedVideos([...attachedVideos, newVideo]);
        console.log('Видео добавлено:', newVideo);
      }
    } catch (error) {
      console.error('Ошибка при съемке видео:', error);
      Alert.alert('Ошибка', 'Не удалось открыть камеру для съемки видео. Попробуйте еще раз.');
    }
  };

  const pickVideo = async () => {
    try {
      const hasPermission = await requestPermissions('media');
      if (!hasPermission) return;

      console.log('Открытие галереи для видео...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        videoMaxDuration: 60, // Максимум 60 секунд
      });

      console.log('Результат выбора видео:', result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newVideo = {
          id: Date.now(),
          uri: result.assets[0].uri,
          name: `Видео_${new Date().toISOString().split('T')[0]}.mp4`,
          type: 'video',
          duration: result.assets[0].duration || 0,
        };
        setAttachedVideos([...attachedVideos, newVideo]);
        console.log('Видео добавлено:', newVideo);
      }
    } catch (error) {
      console.error('Ошибка при выборе видео:', error);
      Alert.alert('Ошибка', 'Не удалось открыть галерею. Попробуйте еще раз.');
    }
  };

  const removeVideo = (videoId) => {
    setAttachedVideos(attachedVideos.filter(video => video.id !== videoId));
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Прикрепить файл',
      'Выберите способ добавления файла',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Камера', onPress: takePhoto },
        { text: 'Фото из галереи', onPress: pickImage },
        { text: 'Видео из галереи', onPress: pickVideo },
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
        { backgroundColor: activeTab === tabName ? colors.secondary : colors.backgroundTertiary }
      ]}>
        {LocalIcons[iconName] ? 
          LocalIcons[iconName]({ 
            size: 24, 
            color: activeTab === tabName ? colors.textInverse : colors.textSecondary 
          }) : 
          <Text style={{ 
            color: activeTab === tabName ? colors.textInverse : colors.textSecondary, 
            fontSize: 16 
          }}>?</Text>
        }
      </View>
      <Text style={[
        styles.tabLabel,
        { color: activeTab === tabName ? colors.secondary : colors.textSecondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'clinics':
        return <ClinicsScreen 
          navigation={{ navigate: (screen, params) => {
            if (screen === 'ClinicDetail') {
              setActiveTab('clinicDetail');
              setClinicDetail(params.clinic);
            } else if (screen === 'SpecialistDetail') {
              setActiveTab('specialistDetail');
              setSpecialistDetail(params.specialist);
            } else if (screen === 'CheckupDetail') {
              setActiveTab('checkupDetail');
              setCheckupDetail(params.checkup);
            }
          }}}
          onBack={() => setActiveTab('home')}
          onLogout={onLogout}
        />;
      case 'clinicDetail':
        return <ClinicDetailScreen 
          route={{ params: { clinic: clinicDetail } }} 
          navigation={{ goBack: () => setActiveTab('clinics') }}
          onBack={() => setActiveTab('clinics')}
        />;
      case 'specialistDetail':
        return <SpecialistDetailScreen 
          route={{ params: { specialist: specialistDetail } }} 
          navigation={{ goBack: () => setActiveTab('clinics') }}
          onBack={() => setActiveTab('clinics')}
        />;
      case 'analyses':
        return <AnalysesScreen 
          navigation={{ navigate: (screen, params) => {
            if (screen === 'AnalysisDetail') {
              setActiveTab('analysisDetail');
              setAnalysisDetail(params.analysis);
            }
          }}}
          onBack={() => setActiveTab('home')}
        />;
      case 'analysisDetail':
        return <AnalysisDetailScreen 
          route={{ params: { analysis: analysisDetail } }} 
          navigation={{ goBack: () => setActiveTab('analyses') }}
          onBack={() => setActiveTab('analyses')}
        />;
      case 'analytics':
        return <RequestsScreen 
          navigation={{ navigate: (screen, params) => {
            console.log('Navigation navigate called:', screen, params);
            if (screen === 'RequestDetail') {
              console.log('Setting request detail:', params.request);
              console.log('Current activeTab before change:', activeTab);
              setRequestDetail(params.request);
              setActiveTab('requestDetail');
              console.log('ActiveTab changed to requestDetail');
            }
          }}}
          onBack={() => setActiveTab('home')}
        />;
      case 'requestDetail':
        console.log('Rendering RequestDetailScreen with request:', requestDetail);
        return <RequestDetailScreen 
          route={{ params: { request: requestDetail } }} 
          navigation={{ goBack: () => setActiveTab('analytics') }}
          onBack={() => setActiveTab('analytics')}
        />;
      case 'checkupDetail':
        return <CheckupDetailScreen 
          route={{ params: { checkup: checkupDetail } }} 
          navigation={{ goBack: () => setActiveTab('clinics') }}
          onBack={() => setActiveTab('clinics')}
        />;
      case 'expenses':
        return <ExpensesScreen onBack={() => setActiveTab('home')} />;
      case 'history':
        return <HistoryScreen 
          activeTab={activeHistoryTab} 
          setActiveTab={setActiveHistoryTab}
          onBack={() => setActiveTab('home')} 
        />;
      case 'profile':
        return <ProfileScreen onBack={() => setActiveTab('home')} onLogout={onLogout} />;
      default:
        return (
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            {/* Заголовок */}
            <LinearGradient
              colors={isDarkMode ? [colors.primary, colors.primaryDark] : ['#0863a7', '#074393']}
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
                    <Text style={styles.subtitle}>Цифровая медицина рядом</Text>
                  </View>
                </View>

                {/* Кнопки в заголовке */}
                <View style={styles.headerButtons}>
                  {/* Кнопка меню */}
                  <View style={styles.menuButtonContainer}>
                    <TouchableOpacity 
                      style={styles.menuButton}
                      onPress={handleMenuPress}
                    >
                      <View style={styles.menuButtonContent}>
                        <View style={styles.menuLine} />
                        <View style={styles.menuLine} />
                      </View>
                    </TouchableOpacity>
                    
                  </View>

                  {/* Кнопка профиля */}
                  <TouchableOpacity 
                    style={styles.profileButton}
                    onPress={handleProfilePress}
                  >
                    {profilePhoto ? (
                      <Image 
                        source={{ uri: profilePhoto }} 
                        style={styles.profileButtonImage}
                      />
                    ) : (
                      <LinearGradient
                        colors={['#22ae2c', '#5cc72f']}
                        style={styles.profileButtonGradient}
                      >
                        {LocalIcons.user({ size: 24, color: "#ffffff" })}
                      </LinearGradient>
                    )}
                  </TouchableOpacity>
                </View>
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
                {/* Промежуточный текст распознавания */}
                {speechRecognitionText && (
                  <View style={styles.speechRecognitionContainer}>
                    <Text style={styles.speechRecognitionText}>{speechRecognitionText}</Text>
                  </View>
                )}
                
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
                    scrollEnabled={true}
                  />
                  <TouchableOpacity 
                    style={styles.attachButton}
                    onPress={showPhotoOptions}
                    accessibilityLabel="Прикрепить файл (фото или видео)"
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

                {/* Кнопки-плитки - прямо под окном ввода */}
                <View style={styles.tilesContainer}>
                  <View style={styles.tilesRow}>
                    <TouchableOpacity 
                      style={styles.tile}
                      onPress={() => {
                        Alert.alert(
                          'Онлайн-прием',
                          'Функция онлайн-приема будет доступна в ближайшее время',
                          [{ text: 'Понятно' }]
                        );
                      }}
                    >
                      <LinearGradient
                        colors={['#4CAF50', '#45a049']}
                        style={styles.tileGradient}
                      >
                        <View style={styles.tileIcon}>
                          {LocalIcons.video ? LocalIcons.video({ size: 20, color: "#ffffff" }) : 
                            LocalIcons.camera ? LocalIcons.camera({ size: 20, color: "#ffffff" }) :
                            LocalIcons.call ? LocalIcons.call({ size: 20, color: "#ffffff" }) : null
                          }
                        </View>
                        <Text style={styles.tileText}>Онлайн-прием</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.tile}
                      onPress={() => {
                        Alert.alert(
                          'Связь с гаджетами',
                          'Функция синхронизации с медицинскими гаджетами будет доступна в ближайшее время',
                          [{ text: 'Понятно' }]
                        );
                      }}
                    >
                      <LinearGradient
                        colors={['#2196F3', '#1976D2']}
                        style={styles.tileGradient}
                      >
                        <View style={styles.tileIcon}>
                          {LocalIcons.bluetooth ? LocalIcons.bluetooth({ size: 20, color: "#ffffff" }) : 
                            LocalIcons.wifi ? LocalIcons.wifi({ size: 20, color: "#ffffff" }) :
                            LocalIcons.settings ? LocalIcons.settings({ size: 20, color: "#ffffff" }) : null
                          }
                        </View>
                        <Text style={styles.tileText}>Связь с гаджетами</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.tilesRow}>
                    <TouchableOpacity 
                      style={styles.tile}
                      onPress={() => {
                        Alert.alert(
                          'Результаты лечения',
                          'Функция отслеживания результатов лечения будет доступна в ближайшее время',
                          [{ text: 'Понятно' }]
                        );
                      }}
                    >
                      <LinearGradient
                        colors={['#FF9800', '#F57C00']}
                        style={styles.tileGradient}
                      >
                        <View style={styles.tileIcon}>
                          {LocalIcons.chart ? LocalIcons.chart({ size: 20, color: "#ffffff" }) : 
                            LocalIcons.analytics ? LocalIcons.analytics({ size: 20, color: "#ffffff" }) :
                            LocalIcons.document ? LocalIcons.document({ size: 20, color: "#ffffff" }) : null
                          }
                        </View>
                        <Text style={styles.tileText}>Результаты лечения</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.tile}
                      onPress={() => {
                        Alert.alert(
                          'Поделиться данными с врачом',
                          'Функция передачи медицинских данных врачу будет доступна в ближайшее время',
                          [{ text: 'Понятно' }]
                        );
                      }}
                    >
                      <LinearGradient
                        colors={['#9C27B0', '#7B1FA2']}
                        style={styles.tileGradient}
                      >
                        <View style={styles.tileIcon}>
                          {LocalIcons.share ? LocalIcons.share({ size: 20, color: "#ffffff" }) : 
                            LocalIcons.user ? LocalIcons.user({ size: 20, color: "#ffffff" }) :
                            LocalIcons.medical ? LocalIcons.medical({ size: 20, color: "#ffffff" }) : null
                          }
                        </View>
                        <Text style={styles.tileText}>Поделиться данными с врачом</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.tilesRow}>
                    <TouchableOpacity 
                      style={styles.tile}
                      onPress={() => setActiveTab('expenses')}
                    >
                      <LinearGradient
                        colors={['#E91E63', '#C2185B']}
                        style={styles.tileGradient}
                      >
                        <View style={styles.tileIcon}>
                          {LocalIcons.wallet ? LocalIcons.wallet({ size: 20, color: "#ffffff" }) : 
                            LocalIcons.money ? LocalIcons.money({ size: 20, color: "#ffffff" }) :
                            LocalIcons.creditCard ? LocalIcons.creditCard({ size: 20, color: "#ffffff" }) : null
                          }
                        </View>
                        <Text style={styles.tileText}>Бюджет</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.tile}
                      onPress={() => {
                        Alert.alert(
                          'AI-диагностика',
                          'Функция AI-диагностики будет доступна в ближайшее время',
                          [{ text: 'Понятно' }]
                        );
                      }}
                    >
                      <LinearGradient
                        colors={['#00BCD4', '#0097A7']}
                        style={styles.tileGradient}
                      >
                        <View style={styles.tileIcon}>
                          {LocalIcons.brain ? LocalIcons.brain({ size: 20, color: "#ffffff" }) : 
                            LocalIcons.ai ? LocalIcons.ai({ size: 20, color: "#ffffff" }) :
                            LocalIcons.robot ? LocalIcons.robot({ size: 20, color: "#ffffff" }) : null
                          }
                        </View>
                        <Text style={styles.tileText}>AI-диагностика</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Прикрепленные файлы */}
                {(attachedPhotos.length > 0 || attachedVideos.length > 0) && (
                  <View style={styles.attachedFilesContainer}>
                    {/* Фотографии */}
                    {attachedPhotos.length > 0 && (
                      <View style={styles.filesSection}>
                        <Text style={styles.filesSectionTitle}>Фотографии</Text>
                        <View style={styles.filesGrid}>
                          {attachedPhotos.map((photo) => (
                            <View key={photo.id} style={styles.fileItem}>
                              <Image
                                source={{ uri: photo.uri }}
                                style={styles.fileThumbnail}
                                resizeMode="cover"
                              />
                              <TouchableOpacity
                                style={styles.removeFileButton}
                                onPress={() => removePhoto(photo.id)}
                              >
                                <LinearGradient
                                  colors={['#ff4444', '#d32f2f']}
                                  style={styles.removeFileGradient}
                                >
                                  {LocalIcons.close({ size: 16, color: "#ffffff" })}
                                </LinearGradient>
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                    
                    {/* Видео */}
                    {attachedVideos.length > 0 && (
                      <View style={styles.filesSection}>
                        <Text style={styles.filesSectionTitle}>Видео</Text>
                        <View style={styles.filesGrid}>
                          {attachedVideos.map((video) => (
                            <View key={video.id} style={styles.fileItem}>
                              <View style={styles.videoThumbnail}>
                                <View style={styles.videoPlayIcon}>
                                  {LocalIcons.play({ size: 24, color: "#ffffff" })}
                                </View>
                                <Text style={styles.videoDuration}>
                                  {Math.round(video.duration)}с
                                </Text>
                              </View>
                              <TouchableOpacity
                                style={styles.removeFileButton}
                                onPress={() => removeVideo(video.id)}
                              >
                                <LinearGradient
                                  colors={['#ff4444', '#d32f2f']}
                                  style={styles.removeFileGradient}
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
                )}
              </View>


            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

          </Animated.View>
        );
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {renderContent()}
      </KeyboardAvoidingView>

      {/* Панель управления - фиксированная внизу */}
      <View style={styles.bottomPanel}>
        <LinearGradient
          colors={isDarkMode ? [colors.background, colors.backgroundSecondary] : ['#ffffff', '#f8f9fa']}
          style={styles.bottomPanelGradient}
        >
          {renderTabIcon('home', 'home', 'Главная')}
          {renderTabIcon('clinics', 'medical', 'Клиники')}
          {renderTabIcon('analyses', 'analytics', 'Анализы')}
          {renderTabIcon('analytics', 'document', 'Обращения')}
          {renderTabIcon('history', 'time', 'История')}
        </LinearGradient>
      </View>

      {/* Кнопка SOS - только на главной странице */}
      {activeTab === 'home' && (
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
      )}

      {/* Модальное окно "Рекомендация ИИ" */}
      <Modal
        visible={showAIRecommendation}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#0863a7', '#074393']} style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAIRecommendation(false)}
              >
                {LocalIcons.close({ size: 24, color: "#ffffff" })}
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Рекомендация ИИ</Text>
              <View style={styles.placeholder} />
            </View>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            {/* Дисклеймер */}
            <View style={styles.disclaimerContainer}>
              <LinearGradient colors={['#ff6b35', '#ff8c42']} style={styles.disclaimerGradient}>
                <Text style={styles.disclaimerText}>
                  ⚠️ Важно! Это исключительно рекомендация ИИ-системы. Для медицинской диагностики обратитесь к специалисту.
                </Text>
              </LinearGradient>
            </View>

            {/* Анимация загрузки */}
            {isLoadingAI ? (
              <View style={styles.loadingContainer}>
                <Animated.View style={[styles.loadingSpinner, { transform: [{ rotate: spinAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })}] }]}>
                  <LinearGradient colors={['#0863a7', '#074393']} style={styles.spinnerGradient}>
                    {LocalIcons.brain({ size: 40, color: "#ffffff" })}
                  </LinearGradient>
                </Animated.View>
                <Text style={styles.loadingText}>ИИ анализирует ваши симптомы...</Text>
                <Text style={styles.loadingSubtext}>Пожалуйста, подождите</Text>
              </View>
            ) : aiRecommendation ? (
              <>
                {/* Основная информация */}
                <View style={styles.mainInfo}>
                  <View style={styles.dateTimeContainer}>
                    <View style={styles.dateTimeItem}>
                      {LocalIcons.time({ size: 20, color: "#0863a7" })}
                      <Text style={styles.dateTimeText}>{aiRecommendation.date}</Text>
                    </View>
                    <View style={styles.dateTimeItem}>
                      {LocalIcons.time({ size: 20, color: "#0863a7" })}
                      <Text style={styles.dateTimeText}>{aiRecommendation.time}</Text>
                    </View>
                  </View>

                  <View style={styles.categoryContainer}>
                    <LinearGradient colors={['#0863a7', '#074393']} style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{aiRecommendation.category}</Text>
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
                    <Text style={styles.userQuery}>{aiRecommendation.userQuery}</Text>
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
                    <Text style={styles.aiResponse}>{aiRecommendation.aiResponse}</Text>
                  </View>
                </View>

                {/* Выявленные симптомы */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <LinearGradient colors={['#ff4444', '#d32f2f']} style={styles.sectionIcon}>
                      {LocalIcons.medical({ size: 20, color: "#ffffff" })}
                    </LinearGradient>
                    <Text style={styles.sectionTitle}>Выявленные симптомы</Text>
                  </View>
                  <View style={styles.sectionContent}>
                    {aiRecommendation.symptoms.map((symptom, index) => (
                      <View key={index} style={styles.symptomItem}>
                        <View style={styles.symptomIcon}>
                          <LinearGradient colors={['#0863a7', '#074393']} style={styles.iconGradient}>
                            {LocalIcons.medical({ size: 16, color: "#ffffff" })}
                          </LinearGradient>
                        </View>
                        <Text style={styles.symptomText}>{symptom}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Рекомендации ИИ */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.sectionIcon}>
                      {LocalIcons.star({ size: 20, color: "#ffffff" })}
                    </LinearGradient>
                    <Text style={styles.sectionTitle}>Рекомендации ИИ</Text>
                  </View>
                  <View style={styles.sectionContent}>
                    {aiRecommendation.recommendations.map((recommendation, index) => (
                      <View key={index} style={styles.recommendationItem}>
                        <Text style={styles.recommendationText}>• {recommendation}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Статус обращения */}
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
              </>
            ) : null}
          </ScrollView>
        </View>
      </Modal>

      {/* Выпадающий список меню - поверх всех элементов */}
      {showMenuDropdown && (
        <View style={styles.menuDropdownOverlay}>
          <TouchableOpacity 
            style={styles.menuDropdownOverlayTouchable}
            onPress={() => setShowMenuDropdown(false)}
            activeOpacity={1}
          />
          <View style={styles.menuDropdown}>
            {console.log('Rendering dropdown menu')}
            <TouchableOpacity 
              style={styles.menuDropdownOption} 
              onPress={() => handleMenuOptionPress('clinics')}
            >
              <Text style={styles.menuDropdownText}>Клиникам</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuDropdownOption} 
              onPress={() => handleMenuOptionPress('doctors')}
            >
              <Text style={styles.menuDropdownText}>Врачам</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuDropdownOption} 
              onPress={() => handleMenuOptionPress('specialists')}
            >
              <Text style={styles.menuDropdownText}>Специалистам</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Кнопка выбора языка - поверх всех элементов, только на главной странице */}
      {activeTab === 'home' && (
        <View style={styles.languageButtonContainer}>
        <TouchableOpacity 
          style={styles.languageButton}
          onPress={handleLanguagePress}
        >
          <Text style={styles.languageButtonText}>{selectedLanguage}</Text>
          <View style={styles.languageButtonArrow}>
            <Text style={styles.languageButtonArrowText}>{showLanguageDropdown ? '▲' : '▼'}</Text>
          </View>
        </TouchableOpacity>
        
        {showLanguageDropdown && (
          <View style={styles.languageDropdown}>
            <TouchableOpacity 
              style={[styles.languageDropdownOption, selectedLanguage === 'KZ' && styles.languageDropdownOptionSelected]} 
              onPress={() => handleLanguageSelect('KZ')}
            >
              <Text style={[styles.languageDropdownText, selectedLanguage === 'KZ' && styles.languageDropdownTextSelected]}>
                KZ
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.languageDropdownOption, selectedLanguage === 'RU' && styles.languageDropdownOptionSelected]} 
              onPress={() => handleLanguageSelect('RU')}
            >
              <Text style={[styles.languageDropdownText, selectedLanguage === 'RU' && styles.languageDropdownTextSelected]}>
                RU
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.languageDropdownOption, selectedLanguage === 'ENG' && styles.languageDropdownOptionSelected]} 
              onPress={() => handleLanguageSelect('ENG')}
            >
              <Text style={[styles.languageDropdownText, selectedLanguage === 'ENG' && styles.languageDropdownTextSelected]}>
                ENG
              </Text>
            </TouchableOpacity>
          </View>
        )}
        </View>
      )}
    </View>
  );
}

// Функция для создания стилей с темой
const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    marginTop: 0,
    paddingTop: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 0,
    paddingTop: 0,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    marginTop: 0,
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
  profileButtonImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ffffff',
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
    paddingTop: 0,
    paddingBottom: 80, // Отступ для нижней панели
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
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
    backgroundColor: colors.background,
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
  speechRecognitionContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0863a7',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  speechRecognitionText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#0863a7',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
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
    color: colors.textPrimary,
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
  attachedFilesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  filesSection: {
    marginBottom: 16,
  },
  filesSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  filesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fileItem: {
    position: 'relative',
  },
  fileThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  videoThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoPlayIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    fontSize: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  removeFileButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 10,
    overflow: 'hidden',
  },
  removeFileGradient: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomPanel: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 0 : 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingBottom: Platform.OS === 'android' ? 0 : 0,
  },
  bottomPanelGradient: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingBottom: Platform.OS === 'android' ? 15 : 15,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    minWidth: 70,
    paddingHorizontal: 2,
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
    fontSize: 11,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    textAlign: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  emergencyButton: {
    position: 'absolute',
    bottom: 120, // Поднимаем кнопку выше
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    zIndex: 1000, // Высокий z-index для отображения поверх всех элементов
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

  // Стили для модального окна "Рекомендация ИИ"
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
  disclaimerContainer: {
    marginBottom: 20,
  },
  disclaimerGradient: {
    padding: 15,
    borderRadius: 12,
  },
  disclaimerText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
  },
  mainInfo: {
    padding: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
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
    color: colors.textPrimary,
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
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
  },
  sectionContent: {
    paddingLeft: 52,
  },
  userQuery: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    flex: 1,
  },
  recommendationItem: {
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: colors.textPrimary,
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

  // Стили для анимации загрузки
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingSpinner: {
    marginBottom: 30,
  },
  spinnerGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Стили для кнопок-плиток
  tilesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tilesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tile: {
    width: '48%', // Фиксированная ширина для одинакового размера
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tileGradient: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80, // Фиксированная высота для одинакового размера
  },
  tileIcon: {
    marginBottom: 6,
  },
  tileText: {
    fontSize: 11,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },

  // Стили для кнопок в заголовке
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuButtonContainer: {
    position: 'relative',
    zIndex: 9999,
  },
  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  menuDropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
  },
  menuDropdownOverlayTouchable: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuDropdown: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
    minWidth: 150,
  },
  menuDropdownOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuDropdownText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    fontFamily: 'Open Sauce',
  },
  languageButtonContainer: {
    position: 'absolute',
    top: 160,
    left: Dimensions.get('window').width - 45,
    zIndex: 9999,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Open Sauce',
    marginRight: 8,
  },
  languageButtonArrow: {
    marginLeft: 4,
  },
  languageButtonArrowText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  languageDropdown: {
    position: 'absolute',
    top: 40,
    right: -50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    minWidth: 80,
    zIndex: 10000,
  },
  languageDropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageDropdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    fontFamily: 'Open Sauce',
    textAlign: 'center',
  },
  languageDropdownOptionSelected: {
    backgroundColor: '#e8f5e8',
  },
  languageDropdownTextSelected: {
    color: '#22ae2c',
    fontWeight: '600',
  },
});
