import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Animated, 
  ScrollView, 
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';

export default function AuthScreen({ onAuthSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [iin, setIin] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [isRegistration, setIsRegistration] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedPersonalData, setAcceptedPersonalData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showPersonalDataModal, setShowPersonalDataModal] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatPhoneNumber = (text) => {
    // Удаляем все нецифровые символы
    const cleaned = text.replace(/\D/g, '');
    
    // Форматируем номер телефона
    if (cleaned.length <= 1) {
      return `+7 (${cleaned}`;
    } else if (cleaned.length <= 4) {
      return `+7 (${cleaned.slice(1, 4)}`;
    } else if (cleaned.length <= 7) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}`;
    } else if (cleaned.length <= 9) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}`;
    } else {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
    }
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    
    // Проверяем, если номер полностью введен (11 цифр)
    const cleaned = formatted.replace(/\D/g, '');
    if (cleaned.length === 11) {
      Keyboard.dismiss();
    }
  };

  const validatePhoneNumber = () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length === 11 && cleaned.startsWith('7');
  };

  const validateIIN = () => {
    return iin.length === 12 && /^\d+$/.test(iin);
  };

  const validateFullName = () => {
    return fullName.trim().length >= 3;
  };

  const validateBirthDate = () => {
    return birthDate.length === 10; // DD.MM.YYYY
  };

  const validateAddress = () => {
    return address.trim().length >= 10;
  };

  const handleSubmit = () => {
    if (!validatePhoneNumber()) {
      Alert.alert('Ошибка', 'Введите корректный номер телефона');
      return;
    }

    if (isRegistration) {
      if (!validateFullName()) {
        Alert.alert('Ошибка', 'Введите корректное ФИО (минимум 3 символа)');
        return;
      }

      if (!gender) {
        Alert.alert('Ошибка', 'Выберите пол');
        return;
      }

      if (!validateIIN()) {
        Alert.alert('Ошибка', 'Введите корректный ИИН (12 цифр)');
        return;
      }

      if (!validateBirthDate()) {
        Alert.alert('Ошибка', 'Введите корректную дату рождения');
        return;
      }

      if (!validateAddress()) {
        Alert.alert('Ошибка', 'Введите корректный адрес (минимум 10 символов)');
        return;
      }

      if (!acceptedPrivacy || !acceptedPersonalData) {
        Alert.alert('Ошибка', 'Необходимо принять условия политики конфиденциальности и обработки персональных данных');
        return;
      }
    }

    setIsLoading(true);
    
    // Симуляция процесса авторизации/регистрации
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Успешно',
        isRegistration ? 'Регистрация завершена!' : 'Вход выполнен!',
        [
          {
            text: 'OK',
            onPress: () => onAuthSuccess(),
          },
        ]
      );
    }, 2000);
  };

  const canSubmit = () => {
    if (!validatePhoneNumber()) return false;
    if (isRegistration) {
      if (!validateFullName()) return false;
      if (!gender) return false;
      if (!validateIIN()) return false;
      if (!validateBirthDate()) return false;
      if (!validateAddress()) return false;
      if (!acceptedPrivacy || !acceptedPersonalData) return false;
    }
    return true;
  };

  const renderModal = (visible, onClose, title, content) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              {LocalIcons.close({ size: 24, color: "#0863a7" })}
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalText}>{content}</Text>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <LinearGradient
              colors={['#0863a7', '#074393']}
              style={styles.modalButtonGradient}
            >
              <Text style={styles.modalButtonText}>Понятно</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.background}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ],
              },
            ]}
          >
            {/* Логотип */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../ai.png')}
                style={styles.logo}
                resizeMode="contain"
                fadeDuration={0}
              />
            </View>

            {/* Заголовок */}
            <Text style={styles.title}>AI-CLINIKA</Text>
            <Text style={styles.subtitle}>
              {isRegistration ? 'Создайте аккаунт' : 'Войдите в аккаунт'}
            </Text>

            {/* Форма */}
            <View style={styles.formContainer}>
              {/* Номер телефона */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  {LocalIcons.call({ size: 20, color: "#0863a7" })}
                  <TextInput
                    style={styles.input}
                    placeholder="+7 (___) ___-__-__"
                    placeholderTextColor="#9ad0e7"
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    maxLength={18}
                  />
                </View>
              </View>

              {/* Дополнительные поля для регистрации */}
              {isRegistration && (
                <>
                  {/* ФИО */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      {LocalIcons.user({ size: 20, color: "#0863a7" })}
                      <TextInput
                        style={styles.input}
                        placeholder="ФИО"
                        placeholderTextColor="#9ad0e7"
                        value={fullName}
                        onChangeText={setFullName}
                        maxLength={100}
                      />
                    </View>
                  </View>

                  {/* Пол */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.fieldLabel}>Пол</Text>
                    <View style={styles.genderContainer}>
                      <TouchableOpacity
                        style={[
                          styles.genderButton,
                          gender === 'male' && styles.genderButtonActive
                        ]}
                        onPress={() => setGender('male')}
                      >
                        <Text style={[
                          styles.genderButtonText,
                          gender === 'male' && styles.genderButtonTextActive
                        ]}>Мужской</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.genderButton,
                          gender === 'female' && styles.genderButtonActive
                        ]}
                        onPress={() => setGender('female')}
                      >
                        <Text style={[
                          styles.genderButtonText,
                          gender === 'female' && styles.genderButtonTextActive
                        ]}>Женский</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* ИИН */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      {LocalIcons.document({ size: 20, color: "#0863a7" })}
                      <TextInput
                        style={styles.input}
                        placeholder="ИИН (12 цифр)"
                        placeholderTextColor="#9ad0e7"
                        value={iin}
                        onChangeText={setIin}
                        keyboardType="numeric"
                        maxLength={12}
                      />
                    </View>
                  </View>

                  {/* Дата рождения */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      {LocalIcons.time({ size: 20, color: "#0863a7" })}
                      <TextInput
                        style={styles.input}
                        placeholder="Дата рождения (ДД.ММ.ГГГГ)"
                        placeholderTextColor="#9ad0e7"
                        value={birthDate}
                        onChangeText={setBirthDate}
                        maxLength={10}
                      />
                    </View>
                  </View>

                  {/* Адрес */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      {LocalIcons.location({ size: 20, color: "#0863a7" })}
                      <TextInput
                        style={styles.addressInput}
                        placeholder="Адрес места жительства"
                        placeholderTextColor="#9ad0e7"
                        value={address}
                        onChangeText={setAddress}
                        maxLength={200}
                        multiline={true}
                        numberOfLines={2}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Переключатель режима */}
              <TouchableOpacity
                style={styles.modeSwitch}
                onPress={() => setIsRegistration(!isRegistration)}
              >
                <Text style={styles.modeSwitchText}>
                  {isRegistration ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                </Text>
              </TouchableOpacity>

              {/* Политики (только для регистрации) */}
              {isRegistration && (
                <View style={styles.policiesContainer}>
                  <TouchableOpacity
                    style={styles.policyItem}
                    onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
                  >
                    <View style={styles.checkbox}>
                      {acceptedPrivacy && (
                        LocalIcons.checkmark({ size: 16, color: "#ffffff" })
                      )}
                    </View>
                    <Text style={styles.policyText}>
                      Я принимаю{' '}
                      <Text 
                        style={styles.policyLink}
                        onPress={() => setShowPrivacyModal(true)}
                      >
                        Политику конфиденциальности
                      </Text>
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.policyItem}
                    onPress={() => setAcceptedPersonalData(!acceptedPersonalData)}
                  >
                    <View style={styles.checkbox}>
                      {acceptedPersonalData && (
                        LocalIcons.checkmark({ size: 16, color: "#ffffff" })
                      )}
                    </View>
                    <Text style={styles.policyText}>
                      Я согласен на{' '}
                      <Text 
                        style={styles.policyLink}
                        onPress={() => setShowPersonalDataModal(true)}
                      >
                        обработку персональных данных
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Кнопка отправки */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !canSubmit() && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!canSubmit() || isLoading}
              >
                <LinearGradient
                  colors={canSubmit() ? ['#0863a7', '#074393'] : ['#cccccc', '#999999']}
                  style={styles.submitButtonGradient}
                >
                  {isLoading ? (
                    <Text style={styles.submitButtonText}>Загрузка...</Text>
                  ) : (
                    <>
                      {LocalIcons[isRegistration ? "person-add" : "log-in"]({ size: 20, color: "#ffffff" })}
                      <Text style={styles.submitButtonText}>
                        {isRegistration ? 'Зарегистрироваться' : 'Войти'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Дополнительная информация */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                {isRegistration 
                  ? 'Регистрируясь, вы соглашаетесь с условиями использования'
                  : 'Вход осуществляется через SMS-код'
                }
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>

      {/* Модальные окна */}
      {renderModal(
        showPrivacyModal,
        () => setShowPrivacyModal(false),
        'Политика конфиденциальности',
        'Настоящая Политика конфиденциальности описывает, как AI-CLINIKA собирает, использует и защищает вашу личную информацию.\n\n1. Сбор информации\nМы собираем информацию, которую вы предоставляете при регистрации и использовании приложения.\n\n2. Использование информации\nВаша информация используется для предоставления услуг, улучшения приложения и связи с вами.\n\n3. Защита информации\nМы принимаем соответствующие меры для защиты вашей личной информации от несанкционированного доступа.\n\n4. Передача информации\nМы не продаем, не обмениваем и не передаем вашу личную информацию третьим лицам.\n\n5. Изменения в политике\nМы можем время от времени обновлять эту политику конфиденциальности.'
      )}

      {renderModal(
        showPersonalDataModal,
        () => setShowPersonalDataModal(false),
        'Обработка персональных данных',
        'Согласие на обработку персональных данных\n\nНастоящим я даю согласие AI-CLINIKA на обработку моих персональных данных в соответствии с Федеральным законом "О персональных данных".\n\nОбрабатываемые данные:\n• Номер телефона\n• Данные об использовании приложения\n• Техническая информация об устройстве\n\nЦели обработки:\n• Предоставление услуг приложения\n• Улучшение качества сервиса\n• Техническая поддержка\n• Безопасность и предотвращение мошенничества\n\nСпособы обработки:\n• Сбор, запись, систематизация\n• Накопление, хранение, уточнение\n• Извлечение, использование, передача\n• Обезличивание, блокирование, удаление\n\nСрок действия согласия:\nСогласие действует с момента его предоставления до момента отзыва.\n\nПрава субъекта персональных данных:\n• Право на получение информации об обработке\n• Право на уточнение, блокирование, уничтожение\n• Право на отзыв согласия\n• Право на обжалование действий или бездействия'
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#0863a7',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    marginLeft: 15,
  },
  addressInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    marginLeft: 15,
    textAlignVertical: 'top',
    paddingTop: 10,
    paddingBottom: 10,
  },
  modeSwitch: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modeSwitchText: {
    fontSize: 14,
    color: '#0863a7',
    textDecorationLine: 'underline',
  },
  policiesContainer: {
    marginBottom: 20,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0863a7',
    backgroundColor: '#0863a7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  policyText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  policyLink: {
    color: '#0863a7',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  genderButtonActive: {
    borderColor: '#0863a7',
    backgroundColor: '#0863a7',
  },
  genderButtonText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#666666',
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  submitButtonIcon: {
    marginRight: 10,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Стили для модальных окон
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0863a7',
    flex: 1,
  },
  modalCloseButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  modalText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
  },
  modalButton: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
