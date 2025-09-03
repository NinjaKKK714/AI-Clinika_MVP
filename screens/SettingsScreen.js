import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocalIcons from '../components/LocalIcons';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [voiceInput, setVoiceInput] = useState(true);
  const [autoAnalyze, setAutoAnalyze] = useState(false);

  const settingsSections = [
    {
      title: 'Уведомления',
      items: [
        {
          id: 'notifications',
          title: 'Push-уведомления',
          subtitle: 'Получать уведомления о результатах анализа',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
          icon: 'notifications',
          color: ['#22ae2c', '#5cc72f']
        },
        {
          id: 'sound',
          title: 'Звуковые уведомления',
          subtitle: 'Звуковые сигналы для уведомлений',
          type: 'switch',
          value: true,
          onValueChange: () => {},
          icon: 'volume-high',
          color: ['#60caac', '#9ad0e7']
        }
      ]
    },
    {
      title: 'Интерфейс',
      items: [
        {
          id: 'darkMode',
          title: 'Темная тема',
          subtitle: 'Использовать темный режим',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
          icon: 'moon',
          color: ['#2571aa', '#0b417a']
        }
      ]
    },
    {
      title: 'AI функции',
      items: [
        {
          id: 'voiceInput',
          title: 'Голосовой ввод',
          subtitle: 'Разрешить голосовой ввод текста',
          type: 'switch',
          value: voiceInput,
          onValueChange: setVoiceInput,
          icon: 'mic',
          color: ['#22ae2c', '#5cc72f']
        },
        {
          id: 'autoAnalyze',
          title: 'Автоанализ',
          subtitle: 'Автоматически анализировать введенный текст',
          type: 'switch',
          value: autoAnalyze,
          onValueChange: setAutoAnalyze,
          icon: 'flash',
          color: ['#60caac', '#9ad0e7']
        }
      ]
    }
  ];

  const actionItems = [
    {
      id: 'clearCache',
      title: 'Очистить кэш',
      subtitle: 'Освободить место на устройстве',
      icon: 'refresh',
      color: ['#22ae2c', '#5cc72f']
    },
    {
      id: 'exportData',
      title: 'Экспорт данных',
      subtitle: 'Сохранить результаты анализа',
      icon: 'download',
      color: ['#60caac', '#9ad0e7']
    },
    {
      id: 'about',
      title: 'О приложении',
      subtitle: 'Версия 1.0.0',
      icon: 'information-circle',
      color: ['#2571aa', '#0b417a']
    }
  ];

  const handleActionPress = (actionId) => {
    console.log('Действие:', actionId);
  };

  const renderSettingItem = (item) => (
    <View key={item.id} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <LinearGradient
          colors={item.color}
          style={styles.settingIcon}
        >
          {LocalIcons[item.icon] ? 
            LocalIcons[item.icon]({ size: 20, color: "#ffffff" }) : 
            <Text style={{ color: "#ffffff", fontSize: 16 }}>?</Text>
          }
        </LinearGradient>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onValueChange}
          trackColor={{ false: '#e0e0e0', true: '#22ae2c' }}
          thumbColor={item.value ? '#ffffff' : '#f4f3f4'}
        />
      ) : (
        LocalIcons['chevron-forward']({ size: 20, color: "#9ad0e7" })
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0863a7', '#074393']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Настройки</Text>
        <Text style={styles.headerSubtitle}>Персонализируйте приложение</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Настройки */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map(renderSettingItem)}
          </View>
        ))}

        {/* Действия */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Действия</Text>
          {actionItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingItem}
              onPress={() => handleActionPress(item.id)}
            >
              <View style={styles.settingLeft}>
                <LinearGradient
                  colors={item.color}
                  style={styles.settingIcon}
                >
                  {LocalIcons[item.icon] ? 
                    LocalIcons[item.icon]({ size: 20, color: "#ffffff" }) : 
                    <Text style={{ color: "#ffffff", fontSize: 16 }}>?</Text>
                  }
                </LinearGradient>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              {LocalIcons['chevron-forward']({ size: 20, color: "#9ad0e7" })}
            </TouchableOpacity>
          ))}
        </View>

        {/* Информация о приложении */}
        <View style={styles.appInfoSection}>
          <LinearGradient
            colors={['#0863a7', '#074393']}
            style={styles.appInfoCard}
          >
            <View style={styles.appInfoContent}>
              <LinearGradient
                colors={['#22ae2c', '#5cc72f']}
                style={styles.appLogo}
              >
                <Text style={styles.appLogoText}>AI</Text>
              </LinearGradient>
              <View style={styles.appInfoText}>
                <Text style={styles.appName}>AI-CLINIKA</Text>
                <Text style={styles.appVersion}>Версия 1.0.0</Text>
                <Text style={styles.appDescription}>
                  Ваш персональный AI-ассистент для анализа данных
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0863a7',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0863a7',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  appInfoSection: {
    marginBottom: 30,
  },
  appInfoCard: {
    borderRadius: 20,
    padding: 25,
    shadowColor: '#013e61',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  appInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  appLogoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appInfoText: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 5,
  },
  appDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 20,
  },
});
