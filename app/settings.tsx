
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';

export default function SettingsScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode, effectiveColorScheme } = useTheme();
  const colors = getColors(effectiveColorScheme);

  const themeOptions: Array<{ value: 'light' | 'dark' | 'system'; label: string; icon: string; androidIcon: string }> = [
    { value: 'light', label: 'Light Mode', icon: 'sun.max.fill', androidIcon: 'wb_sunny' },
    { value: 'dark', label: 'Dark Mode', icon: 'moon.fill', androidIcon: 'nightlight' },
    { value: 'system', label: 'System Default', icon: 'gear', androidIcon: 'settings' },
  ];

  const getSelectedIcon = () => {
    if (themeMode === 'light') {
      return { ios: 'sun.max.fill', android: 'wb_sunny' };
    } else if (themeMode === 'dark') {
      return { ios: 'moon.fill', android: 'nightlight' };
    } else {
      return effectiveColorScheme === 'dark' 
        ? { ios: 'moon.fill', android: 'nightlight' }
        : { ios: 'sun.max.fill', android: 'wb_sunny' };
    }
  };

  const selectedIcon = getSelectedIcon();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <IconSymbol
            ios_icon_name={selectedIcon.ios}
            android_material_icon_name={selectedIcon.android}
            size={60}
            color={colors.primary}
          />
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Choose how the app looks
          </Text>

          <View style={styles.optionsContainer}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionCard,
                  { 
                    backgroundColor: colors.card,
                    borderColor: themeMode === option.value ? colors.primary : colors.cardBorder,
                    borderWidth: themeMode === option.value ? 3 : 2,
                  }
                ]}
                onPress={() => setThemeMode(option.value)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <IconSymbol
                    ios_icon_name={option.icon}
                    android_material_icon_name={option.androidIcon}
                    size={32}
                    color={themeMode === option.value ? colors.primary : colors.text}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={[
                      styles.optionLabel,
                      { color: themeMode === option.value ? colors.primary : colors.text }
                    ]}>
                      {option.label}
                    </Text>
                    {option.value === 'system' && (
                      <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                        Currently: {effectiveColorScheme === 'dark' ? 'Dark' : 'Light'}
                      </Text>
                    )}
                  </View>
                </View>
                {themeMode === option.value && (
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check_circle"
                    size={24}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.accent}
          />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Your theme preference will be saved and applied across the app
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { backgroundColor: colors.background }]}>
        <Button
          title="Back to Home"
          onPress={() => router.back()}
          variant="secondary"
          style={styles.backButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    width: '100%',
  },
});
