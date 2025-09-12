import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../themes/useTheme';
import LocalIcons from '../components/LocalIcons';

export default function SettingsScreen({ onBack }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <LinearGradient
        colors={isDarkMode ? [colors.primary, colors.primaryDark] : ['#0863a7', '#074393']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            {LocalIcons.arrowLeft({ size: 24, color: "#ffffff" })}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Настройки</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* Контент */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Внешний вид */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Внешний вид</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIcon}>
                {isDarkMode ? 
                  LocalIcons.moon({ size: 20, color: colors.primary }) : 
                  LocalIcons.sun({ size: 20, color: colors.primary })
                }
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Темная тема</Text>
                <Text style={styles.settingDescription}>
                  {isDarkMode ? 'Включена' : 'Выключена'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDarkMode ? colors.background : colors.textSecondary}
            />
          </View>
        </View>

        {/* Уведомления */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Уведомления</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIcon}>
                {LocalIcons.bell({ size: 20, color: colors.primary })}
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push-уведомления</Text>
                <Text style={styles.settingDescription}>Получать уведомления о новых ответах</Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>

        {/* Приложение */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Приложение</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIcon}>
                {LocalIcons.info({ size: 20, color: colors.primary })}
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>О приложении</Text>
                <Text style={styles.settingDescription}>Версия 1.0.0</Text>
              </View>
            </View>
            {LocalIcons.chevronRight({ size: 20, color: colors.textSecondary })}
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIcon}>
                {LocalIcons.help({ size: 20, color: colors.primary })}
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Помощь и поддержка</Text>
                <Text style={styles.settingDescription}>FAQ и контакты</Text>
              </View>
            </View>
            {LocalIcons.chevronRight({ size: 20, color: colors.textSecondary })}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
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
    fontSize: 20,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 34,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -10,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Open Sauce',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Open Sauce',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Open Sauce',
    color: colors.textSecondary,
  },
});
