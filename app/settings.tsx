
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
  const { isPremium, purchaseFullVersion, restorePurchases } = usePurchase();
  const colors = getColors(effectiveColorScheme);
  const [isProcessing, setIsProcessing] = useState(false);

  const themeOptions: Array<{ value: 'light' | 'dark' | 'system'; label: string; icon: string; androidIcon: string }> = [
    { value: 'light', label: 'Light Mode', icon: 'lightbulb.fill', androidIcon: 'lightbulb' },
    { value: 'dark', label: 'Dark Mode', icon: 'moon.fill', androidIcon: 'nightlight' },
    { value: 'system', label: 'System Default', icon: 'gear', androidIcon: 'settings' },
  ];

  const handlePurchase = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await purchaseFullVersion();
      Alert.alert(
        'Success!',
        'Thank you for upgrading to the full version! All features are now unlocked.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      if (error.message !== 'User cancelled') {
        Alert.alert(
          'Purchase Failed',
          'Unable to complete purchase. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await restorePurchases();
      Alert.alert(
        'Restore Complete',
        isPremium 
          ? 'Your purchase has been restored successfully!' 
          : 'No previous purchases found.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
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

        {/* Premium Status Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Premium Status</Text>
          <View style={[
            styles.premiumCard,
            { 
              backgroundColor: isPremium ? colors.primary : colors.card,
              borderColor: isPremium ? colors.primary : colors.cardBorder,
            }
          ]}>
            <IconSymbol
              ios_icon_name={isPremium ? 'checkmark.seal.fill' : 'lock.fill'}
              android_material_icon_name={isPremium ? 'verified' : 'lock'}
              size={40}
              color={isPremium ? '#ffffff' : colors.text}
            />
            <Text style={[
              styles.premiumText,
              { color: isPremium ? '#ffffff' : colors.text }
            ]}>
              {isPremium ? 'Full Version Unlocked' : 'Demo Mode'}
            </Text>
            {!isPremium && (
              <Text style={[styles.premiumSubtext, { color: colors.textSecondary }]}>
                Limited to 3 scenarios and 3 response cards
              </Text>
            )}
          </View>

          {!isPremium && (
            <>
              <Button
                title="Buy Full Version – $5"
                onPress={handlePurchase}
                variant="primary"
                disabled={isProcessing}
                style={styles.purchaseButton}
              />
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={[styles.featureText, { color: colors.text }]}>
                    Unlimited scenarios
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={[styles.featureText, { color: colors.text }]}>
                    Unlimited response cards
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={[styles.featureText, { color: colors.text }]}>
                    No ads
                  </Text>
                </View>
              </View>
            </>
          )}

          <Button
            title="Restore Purchase"
            onPress={handleRestore}
            variant="secondary"
            disabled={isProcessing}
            style={styles.restoreButton}
          />
        </View>

        {/* Appearance Section */}
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
        </View>

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.accent}
          />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Your preferences will be saved and applied across the app
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
  premiumCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  premiumSubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  purchaseButton: {
    width: '100%',
    marginBottom: 16,
  },
  restoreButton: {
    width: '100%',
  },
  featuresContainer: {
    marginBottom: 16,
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
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
