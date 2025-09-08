import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  Image,
  Dimensions,
  Alert,
  Linking,
  BackHandler
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';

const { width, height } = Dimensions.get('window');

export default function AnalysisDetailScreen({ route, navigation, onBack }) {
  const { analysis } = route.params;
  
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

    // Обработчик системной кнопки "Назад" на Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onBack) {
        onBack();
        return true; // Предотвращаем закрытие приложения
      }
      return false; // Позволяем системе обработать кнопку "Назад"
    });

    return () => {
      backHandler.remove();
    };
  }, [onBack]);

  const handleViewFile = () => {
    if (analysis.file.type === 'pdf') {
      // Для PDF файлов открываем в браузере или приложении для просмотра PDF
      Alert.alert(
        'Просмотр PDF',
        'Открыть PDF документ?',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Открыть',
            onPress: () => {
              // Здесь можно добавить логику для открытия PDF
              Alert.alert('Информация', 'PDF документ будет открыт в приложении для просмотра');
            },
          },
        ]
      );
    } else {
      // Для изображений показываем в полноэкранном режиме
      Alert.alert(
        'Просмотр изображения',
        'Открыть изображение в полноэкранном режиме?',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Открыть',
            onPress: () => {
              // Здесь можно добавить логику для полноэкранного просмотра
              Alert.alert('Информация', 'Изображение будет открыто в полноэкранном режиме');
            },
          },
        ]
      );
    }
  };

  const renderFilePreview = () => {
    if (analysis.file.type === 'pdf') {
      return (
        <View style={styles.pdfPreview}>
          <LinearGradient colors={['#ff4444', '#d32f2f']} style={styles.pdfIconContainer}>
            {LocalIcons.document({ size: 64, color: "#ffffff" })}
          </LinearGradient>
          <Text style={styles.fileName}>{analysis.file.name}</Text>
          <Text style={styles.fileType}>PDF документ</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.imagePreview}>
          <Image
            source={{ uri: analysis.file.uri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.fileName}>{analysis.file.name}</Text>
            <Text style={styles.fileType}>Фотография</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Заголовок */}
        <LinearGradient colors={['#0863a7', '#074393']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              {LocalIcons.arrow({ size: 24, color: "#ffffff" })}
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Детали анализа</Text>
            
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.scrollContent} 
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Основная информация */}
          <View style={styles.mainInfo}>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                {LocalIcons.time({ size: 20, color: "#0863a7" })}
                <Text style={styles.dateTimeText}>Дата анализа: {analysis.date}</Text>
              </View>
              <View style={styles.dateTimeItem}>
                {LocalIcons.time({ size: 20, color: "#0863a7" })}
                <Text style={styles.dateTimeText}>Загружено: {analysis.uploadDate}</Text>
              </View>
            </View>

            {analysis.clinicName && (
              <View style={styles.clinicContainer}>
                <LinearGradient colors={['#0863a7', '#074393']} style={styles.clinicBadge}>
                  <Text style={styles.clinicText}>{analysis.clinicName}</Text>
                </LinearGradient>
              </View>
            )}
          </View>

          {/* Предварительный просмотр файла */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.sectionIcon}>
                {analysis.file.type === 'pdf' ? 
                  LocalIcons.document({ size: 20, color: "#ffffff" }) :
                  LocalIcons.image({ size: 20, color: "#ffffff" })
                }
              </LinearGradient>
              <Text style={styles.sectionTitle}>Файл анализа</Text>
            </View>
            <View style={styles.sectionContent}>
              {renderFilePreview()}
            </View>
          </View>

          {/* Комментарий */}
          {analysis.comment && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.sectionIcon}>
                  {LocalIcons.star({ size: 20, color: "#ffffff" })}
                </LinearGradient>
                <Text style={styles.sectionTitle}>Комментарий</Text>
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.commentText}>{analysis.comment}</Text>
              </View>
            </View>
          )}

          {/* Действия */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <LinearGradient colors={['#0863a7', '#074393']} style={styles.sectionIcon}>
                {LocalIcons.eye({ size: 20, color: "#ffffff" })}
              </LinearGradient>
              <Text style={styles.sectionTitle}>Действия</Text>
            </View>
            <View style={styles.sectionContent}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleViewFile}
              >
                <LinearGradient colors={['#22ae2c', '#5cc72f']} style={styles.actionButtonGradient}>
                  <Text style={styles.actionButtonText}>
                    {analysis.file.type === 'pdf' ? 'Открыть PDF' : 'Просмотреть изображение'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
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
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 34,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 120, // Отступ снизу для корректного скроллинга
  },
  mainInfo: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateTimeContainer: {
    marginBottom: 15,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#333333',
    marginLeft: 8,
    fontWeight: '600',
  },
  clinicContainer: {
    alignSelf: 'flex-start',
  },
  clinicBadge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  clinicText: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#ffffff',
    fontWeight: '600',
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
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
    color: '#333333',
  },
  sectionContent: {
    paddingLeft: 52,
  },
  pdfPreview: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  pdfIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  fileName: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
    textAlign: 'center',
  },
  fileType: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: '#666666',
    textAlign: 'center',
  },
  commentText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    color: '#333333',
    lineHeight: 24,
  },
  actionButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
  },
});



