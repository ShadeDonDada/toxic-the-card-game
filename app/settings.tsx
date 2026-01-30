
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { usePurchase } from '@/contexts/PurchaseContext';
import { getColors } from '@/styles/commonStyles';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';

export default function SettingsScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode, effectiveColorScheme } = useTheme();
  const { isFullVersion, productPrice, purchaseFullVersion, restorePurchases } = usePurchase();
  const colors = getColors(effectiveColorScheme);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const themeOptions: Array<{ value: 'light' | 'dark' | 'system'; label: string; icon: string; androidIcon: string }> = [
    { value: 'light', label: 'Light Mode', icon: 'lightbulb.fill', androidIcon: 'lightbulb' },
    { value: 'dark', label: 'Dark Mode', icon: 'moon.fill', androidIcon: 'nightlight' },
    { value: 'system', label: 'System Default', icon: 'gear', androidIcon: 'settings' },
  ];

  const handlePurchase = async () => {
    console.log('User tapped Buy me a drink button');
    setPurchasing(true);
    try {
      await purchaseFullVersion();
      // Success alert is shown by the purchase listener in PurchaseContext
      console.log('Purchase flow initiated successfully');
    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      // Only show error if it's not a user cancellation
      if (!error.userCancelled) {
        Alert.alert(
          'Purchase Failed',
          'Something went wrong. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    console.log('User tapped Restore Purchases button');
    setRestoring(true);
    try {
      const restored = await restorePurchases();
      console.log('Restore completed, result:', restored);
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setRestoring(false);
    }
  };

  const handleBackToHome = () => {
    console.log('User pressed Back to Home from settings - navigating to home and resetting game state');
    // Navigate to home screen and reset any game state
    router.replace('/(tabs)/(home)/');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <IconSymbol
            ios_icon_name="gear"
            android_material_icon_name="settings"
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
                    android_material_icon_name="check-circle"
                    size={24}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
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
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Unlock Full Version</Text>
          {!isFullVersion && (
            <View style={[styles.demoNotice, { backgroundColor: colors.accent + '20', borderColor: colors.accent }]}>
              <IconSymbol
                ios_icon_name="lock.fill"
                android_material_icon_name="lock"
                size={32}
                color={colors.accent}
              />
              <View style={styles.demoNoticeTextContainer}>
                <Text style={[styles.demoNoticeTitle, { color: colors.accent }]}>Demo Version Active</Text>
                <Text style={[styles.demoNoticeText, { color: colors.text }]}>
                  You&apos;re currently using the demo version (3 rounds, 3 cards per player). Purchase or restore to unlock unlimited gameplay!
                </Text>
              </View>
            </View>
          )}
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            {isFullVersion 
              ? 'Thank you for your support! You have full access to all features.' 
              : 'Purchase the full version or restore a previous purchase to unlock unlimited rounds and all cards.'}
          </Text>

          <View style={styles.purchaseContainer}>
            <TouchableOpacity
              style={[
                styles.purchaseCard,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.primary,
                  borderWidth: 2,
                  opacity: (purchasing || isFullVersion) ? 0.6 : 1,
                }
              ]}
              onPress={handlePurchase}
              disabled={purchasing || isFullVersion}
              activeOpacity={0.7}
            >
              <View style={styles.purchaseContent}>
                <IconSymbol
                  ios_icon_name="cup.and.saucer.fill"
                  android_material_icon_name="local-cafe"
                  size={40}
                  color={isFullVersion ? colors.textSecondary : colors.primary}
                />
                <View style={styles.purchaseTextContainer}>
                  <Text style={[
                    styles.purchaseTitle,
                    { color: isFullVersion ? colors.textSecondary : colors.text }
                  ]}>
                    {isFullVersion ? 'Thank You!' : purchasing ? 'Processing...' : 'Buy me a drink'}
                  </Text>
                  <Text style={[styles.purchasePrice, { color: colors.primary }]}>
                    {isFullVersion ? 'Already purchased ✓' : productPrice}
                  </Text>
                  {!isFullVersion && (
                    <Text style={[styles.purchaseFeatures, { color: colors.textSecondary }]}>
                      Unlock unlimited rounds & all cards
                    </Text>
                  )}
                </View>
              </View>
              {!isFullVersion && (
                <IconSymbol
                  ios_icon_name="arrow.right"
                  android_material_icon_name="arrow-forward"
                  size={24}
                  color={colors.primary}
                />
              )}
              {isFullVersion && (
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={24}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>

            <Button
              title={restoring ? "Restoring..." : "Restore Purchases"}
              onPress={handleRestore}
              variant="secondary"
              disabled={restoring}
              style={styles.restoreButton}
            />
            
            {!isFullVersion && (
              <View style={[styles.helpCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <IconSymbol
                  ios_icon_name="questionmark.circle.fill"
                  android_material_icon_name="help"
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.helpText, { color: colors.textSecondary }]}>
                  Already purchased? Tap &quot;Restore Purchases&quot; to verify and unlock full access.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { backgroundColor: colors.background }]}>
        <Button
          title="Back to Home"
          onPress={handleBackToHome}
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
    lineHeight: 20,
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
  purchaseContainer: {
    gap: 12,
  },
  purchaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  purchaseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  purchaseTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  purchaseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  purchasePrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  purchaseFeatures: {
    fontSize: 12,
    marginTop: 4,
  },
  restoreButton: {
    width: '100%',
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
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
  },
  helpText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  demoNoticeTextContainer: {
    flex: 1,
  },
  demoNoticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  demoNoticeText: {
    fontSize: 14,
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
