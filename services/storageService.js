import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_KEY = '@user_data';
const AUTH_STATUS_KEY = '@auth_status';
const REQUESTS_KEY = '@user_requests';
const PROFILE_PHOTO_KEY = '@profile_photo';

class StorageService {
  // Сохранение данных пользователя при регистрации
  async saveUserData(userData) {
    try {
      const userDataString = JSON.stringify(userData);
      await AsyncStorage.setItem(USER_DATA_KEY, userDataString);
      await AsyncStorage.setItem(AUTH_STATUS_KEY, 'true');
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  // Получение данных пользователя
  async getUserData() {
    try {
      const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);
      if (userDataString) {
        return JSON.parse(userDataString);
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Проверка статуса аутентификации
  async isAuthenticated() {
    try {
      const authStatus = await AsyncStorage.getItem(AUTH_STATUS_KEY);
      return authStatus === 'true';
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  }

  // Обновление данных пользователя
  async updateUserData(updates) {
    try {
      const currentData = await this.getUserData();
      if (currentData) {
        const updatedData = { ...currentData, ...updates };
        const updatedDataString = JSON.stringify(updatedData);
        await AsyncStorage.setItem(USER_DATA_KEY, updatedDataString);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  }

  // Выход из аккаунта (очистка данных)
  async logout() {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
      await AsyncStorage.removeItem(AUTH_STATUS_KEY);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  }

  // Сохранение обращения
  async saveRequest(request) {
    try {
      const existingRequests = await this.getRequests();
      const updatedRequests = [request, ...existingRequests]; // Новое обращение в начало списка

      const requestsString = JSON.stringify(updatedRequests);
      await AsyncStorage.setItem(REQUESTS_KEY, requestsString);
      return true;
    } catch (error) {
      console.error('Error saving request:', error);
      return false;
    }
  }

  // Получение всех обращений
  async getRequests() {
    try {
      const requestsString = await AsyncStorage.getItem(REQUESTS_KEY);
      if (requestsString) {
        return JSON.parse(requestsString);
      }
      return [];
    } catch (error) {
      console.error('Error getting requests:', error);
      return [];
    }
  }


  // Получение количества обращений
  async getRequestsCount() {
    try {
      const requests = await this.getRequests();
      return requests.length;
    } catch (error) {
      console.error('Error getting requests count:', error);
      return 0;
    }
  }

  // Наполнение хранилища дамми-обращениями
  async populateDummyRequests() {
    try {
      // Проверяем, есть ли уже обращения
      const existingRequests = await this.getRequests();
      if (existingRequests.length > 10) {
        return true; // Уже есть достаточное количество данных, не наполняем
      }

      // Функция для генерации уникального ID
      const generateUniqueId = () => Date.now() + Math.random();

      // Создаем дамми-данные с уникальными ID
      const dummyRequests = [
        // Сентябрь 2024
        {
          id: generateUniqueId(),
          date: '15.09.2024',
          time: '10:30',
          userQuery: 'Головная боль и усталость',
          aiResponse: 'Ваши симптомы могут указывать на переутомление или стресс. Рекомендую полноценный отдых и прогулки на свежем воздухе.',
          symptoms: ['Головная боль', 'Усталость', 'Раздражительность'],
          category: 'Неврология',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '22.09.2024',
          time: '14:15',
          userQuery: 'Боль в горле при глотании',
          aiResponse: 'Симптомы указывают на возможное воспаление горла. Рекомендую полоскания солевым раствором и консультацию ЛОР-врача.',
          symptoms: ['Боль в горле', 'Затрудненное глотание', 'Першение'],
          category: 'ЛОР',
          status: 'completed'
        },

        // Октябрь 2024
        {
          id: generateUniqueId(),
          date: '05.10.2024',
          time: '09:45',
          userQuery: 'Боли в спине после работы',
          aiResponse: 'Боль в спине после физической нагрузки может быть связана с перенапряжением мышц. Рекомендую легкую разминку и отдых.',
          symptoms: ['Боль в спине', 'Мышечное напряжение', 'Ограничение подвижности'],
          category: 'Ортопедия',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '18.10.2024',
          time: '16:20',
          userQuery: 'Кашель и насморк',
          aiResponse: 'Симптомы простуды. Рекомендую постельный режим, обильное питье и симптоматическое лечение.',
          symptoms: ['Кашель', 'Насморк', 'Слабость'],
          category: 'Терапия',
          status: 'completed'
        },

        // Ноябрь 2024
        {
          id: generateUniqueId(),
          date: '08.11.2024',
          time: '11:30',
          userQuery: 'Боли в животе после еды',
          aiResponse: 'Боль в животе после приема пищи может указывать на проблемы с пищеварением. Обратитесь к гастроэнтерологу.',
          symptoms: ['Боль в животе', 'Тяжесть', 'Отрыжка'],
          category: 'Гастроэнтерология',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '25.11.2024',
          time: '13:10',
          userQuery: 'Головокружение и тошнота',
          aiResponse: 'Головокружение может быть вызвано различными причинами. Рекомендую обратиться к неврологу для обследования.',
          symptoms: ['Головокружение', 'Тошнота', 'Нестабильность'],
          category: 'Неврология',
          status: 'completed'
        },

        // Декабрь 2024
        {
          id: generateUniqueId(),
          date: '03.12.2024',
          time: '08:45',
          userQuery: 'Проблемы со сном',
          aiResponse: 'Нарушения сна могут быть связаны со стрессом или образом жизни. Рекомендую режим дня и консультацию сомнолога.',
          symptoms: ['Бессонница', 'Дневная сонливость', 'Разбитость'],
          category: 'Неврология',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '17.12.2024',
          time: '15:25',
          userQuery: 'Боль в суставах',
          aiResponse: 'Боль в суставах может указывать на артрит или артроз. Рекомендую консультацию ревматолога.',
          symptoms: ['Боль в суставах', 'Скованность', 'Ограничение движений'],
          category: 'Ревматология',
          status: 'completed'
        },

        // Январь 2025
        {
          id: generateUniqueId(),
          date: '12.01.2025',
          time: '10:15',
          userQuery: 'Высокая температура и озноб',
          aiResponse: 'Повышенная температура может указывать на инфекцию. Рекомендую измерять температуру и обратиться к терапевту.',
          symptoms: ['Температура', 'Озноб', 'Слабость'],
          category: 'Терапия',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '28.01.2025',
          time: '14:40',
          userQuery: 'Проблемы с кожей',
          aiResponse: 'Кожные проблемы могут иметь различную природу. Рекомендую консультацию дерматолога.',
          symptoms: ['Высыпания', 'Зуд', 'Покраснение'],
          category: 'Дерматология',
          status: 'completed'
        },

        // Февраль 2025
        {
          id: generateUniqueId(),
          date: '06.02.2025',
          time: '09:20',
          userQuery: 'Боль в груди',
          aiResponse: 'Боль в груди требует обязательного обследования. Рекомендую незамедлительно обратиться к кардиологу.',
          symptoms: ['Боль в груди', 'Одышка', 'Сердцебиение'],
          category: 'Кардиология',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '19.02.2025',
          time: '16:55',
          userQuery: 'Усталость и слабость',
          aiResponse: 'Хроническая усталость может быть признаком различных заболеваний. Рекомендую комплексное обследование.',
          symptoms: ['Усталость', 'Слабость', 'Снижение работоспособности'],
          category: 'Эндокринология',
          status: 'completed'
        },

        // Март 2025
        {
          id: generateUniqueId(),
          date: '07.03.2025',
          time: '11:05',
          userQuery: 'Проблемы со зрением',
          aiResponse: 'Снижение зрения требует консультации офтальмолога для определения причины и назначения лечения.',
          symptoms: ['Снижение зрения', 'Усталость глаз', 'Головная боль'],
          category: 'Офтальмология',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '22.03.2025',
          time: '13:35',
          userQuery: 'Боль в ногах',
          aiResponse: 'Боль в ногах может быть связана с сосудами или суставами. Рекомендую консультацию сосудистого хирурга.',
          symptoms: ['Боль в ногах', 'Отеки', 'Судороги'],
          category: 'Сосудистая хирургия',
          status: 'completed'
        },

        // Апрель 2025
        {
          id: generateUniqueId(),
          date: '04.04.2025',
          time: '08:50',
          userQuery: 'Тревожность и беспокойство',
          aiResponse: 'Повышенная тревожность может требовать консультации психотерапевта или психиатра.',
          symptoms: ['Тревожность', 'Беспокойство', 'Нарушения сна'],
          category: 'Психиатрия',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '18.04.2025',
          time: '15:10',
          userQuery: 'Боль в ушах',
          aiResponse: 'Боль в ушах требует осмотра ЛОР-врача для исключения инфекции или других проблем.',
          symptoms: ['Боль в ушах', 'Шум в ушах', 'Заложенность'],
          category: 'ЛОР',
          status: 'completed'
        },

        // Май 2025
        {
          id: generateUniqueId(),
          date: '09.05.2025',
          time: '10:40',
          userQuery: 'Проблемы с пищеварением',
          aiResponse: 'Нарушения пищеварения могут иметь различную причину. Рекомендую консультацию гастроэнтеролога.',
          symptoms: ['Боль в животе', 'Тошнота', 'Изменения стула'],
          category: 'Гастроэнтерология',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '25.05.2025',
          time: '14:25',
          userQuery: 'Аллергическая реакция',
          aiResponse: 'Аллергические реакции требуют определения аллергена и назначения соответствующего лечения.',
          symptoms: ['Кожные высыпания', 'Зуд', 'Отек'],
          category: 'Аллергология',
          status: 'completed'
        },

        // Июнь 2025
        {
          id: generateUniqueId(),
          date: '06.06.2025',
          time: '09:15',
          userQuery: 'Боль в шее',
          aiResponse: 'Боль в шее может быть связана с остеохондрозом или перенапряжением. Рекомендую консультацию невролога.',
          symptoms: ['Боль в шее', 'Ограничение подвижности', 'Головная боль'],
          category: 'Неврология',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '21.06.2025',
          time: '16:30',
          userQuery: 'Повышенное давление',
          aiResponse: 'Повышенное артериальное давление требует регулярного контроля и лечения под наблюдением кардиолога.',
          symptoms: ['Повышенное давление', 'Головная боль', 'Головокружение'],
          category: 'Кардиология',
          status: 'completed'
        },

        // Июль 2025
        {
          id: generateUniqueId(),
          date: '08.07.2025',
          time: '11:20',
          userQuery: 'Боль в коленях',
          aiResponse: 'Боль в коленях может указывать на проблемы с суставами. Рекомендую консультацию ортопеда.',
          symptoms: ['Боль в коленях', 'Хруст', 'Ограничение подвижности'],
          category: 'Ортопедия',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '24.07.2025',
          time: '13:45',
          userQuery: 'Частые простуды',
          aiResponse: 'Частые простудные заболевания могут указывать на снижение иммунитета. Рекомендую обследование.',
          symptoms: ['Частые простуды', 'Слабость', 'Усталость'],
          category: 'Иммунология',
          status: 'completed'
        },

        // Август 2025
        {
          id: generateUniqueId(),
          date: '05.08.2025',
          time: '10:10',
          userQuery: 'Боль в пояснице',
          aiResponse: 'Боль в пояснице требует внимания. Может быть связана с позвоночником или почками.',
          symptoms: ['Боль в пояснице', 'Ограничение движений', 'Иррадиация боли'],
          category: 'Неврология',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '19.08.2025',
          time: '15:50',
          userQuery: 'Проблемы с памятью',
          aiResponse: 'Нарушения памяти в молодом возрасте требуют обследования для исключения серьезных причин.',
          symptoms: ['Забывчивость', 'Снижение концентрации', 'Рассеянность'],
          category: 'Неврология',
          status: 'completed'
        },

        // Ранний август-сентябрь 2025 (до 2 сентября)
        {
          id: generateUniqueId(),
          date: '28.08.2025',
          time: '12:30',
          userQuery: 'Боль в зубах',
          aiResponse: 'Зубная боль требует срочного обращения к стоматологу для предотвращения осложнений.',
          symptoms: ['Зубная боль', 'Отек десны', 'Чувствительность'],
          category: 'Стоматология',
          status: 'completed'
        },
        {
          id: generateUniqueId(),
          date: '01.09.2025',
          time: '09:40',
          userQuery: 'Кожный зуд',
          aiResponse: 'Кожный зуд может быть аллергического характера или связан с другими причинами.',
          symptoms: ['Кожный зуд', 'Высыпания', 'Беспокойство'],
          category: 'Дерматология',
          status: 'completed'
        }
      ];

      // Добавляем дамми-данные к существующим обращениям
      const allRequests = [...existingRequests, ...dummyRequests];

      // Сохраняем все обращения
      const requestsString = JSON.stringify(allRequests);
      await AsyncStorage.setItem(REQUESTS_KEY, requestsString);
      return true;
    } catch (error) {
      console.error('Error populating dummy requests:', error);
      return false;
    }
  }

  // Сохранение аватарки профиля
  async saveProfilePhoto(photoUri) {
    try {
      await AsyncStorage.setItem(PROFILE_PHOTO_KEY, photoUri);
      return true;
    } catch (error) {
      console.error('Error saving profile photo:', error);
      return false;
    }
  }

  // Получение аватарки профиля
  async getProfilePhoto() {
    try {
      const photoUri = await AsyncStorage.getItem(PROFILE_PHOTO_KEY);
      return photoUri;
    } catch (error) {
      console.error('Error getting profile photo:', error);
      return null;
    }
  }

  // Удаление аватарки профиля
  async deleteProfilePhoto() {
    try {
      await AsyncStorage.removeItem(PROFILE_PHOTO_KEY);
      return true;
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      return false;
    }
  }

  // Очистка всех данных (для отладки)
  async clearAllData() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

export default new StorageService();
