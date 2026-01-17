
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { usePurchase } from '@/contexts/PurchaseContext';
import { getColors } from '@/styles/commonStyles';
import React from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '@/components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  premiumSection: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  premiumDescription: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumFeatureText: {
    fontSize: 14,
    marginLeft: 10,
  },
  premiumBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonSpacing: {
    marginBottom: 12,
  },
});

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { isPremium, isLoading, purchasePremium, restorePurchases } = usePurchase();
  const router = useRouter();
  const colors = getColors(theme);

  const handlePurchase = async () => {
    console.log('SettingsScreen: User tapped Buy Full Version button');
    await purchasePremium();
  };

  const handleRestore = async () => {
    console.log('SettingsScreen: User tapped Restore Purchase button');
    await restorePurchases();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log('SettingsScreen: User tapped back button');
              router.back();
            }}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={28}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>

        {/* Premium Section */}
        <View style={[styles.premiumSection, { borderColor: isPremium ? '#4CAF50' : colors.border }]}>
          {isPremium ? (
            <>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PREMIUM UNLOCKED</Text>
              </View>
              <Text style={[styles.premiumTitle, { color: colors.text }]}>
                Thank You for Your Support! ☕🍩
              </Text>
              <Text style={[styles.premiumDescription, { color: colors.textSecondary }]}>
                You have full access to all features:
              </Text>
              <View style={styles.premiumFeature}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={20}
                  color="#4CAF50"
                />
                <Text style={[styles.premiumFeatureText, { color: colors.text }]}>
                  No ads
                </Text>
              </View>
              <View style={styles.premiumFeature}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={20}
                  color="#4CAF50"
                />
                <Text style={[styles.premiumFeatureText, { color: colors.text }]}>
                  Unlimited scenarios
                </Text>
              </View>
              <View style={styles.premiumFeature}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={20}
                  color="#4CAF50"
                />
                <Text style={[styles.premiumFeatureText, { color: colors.text }]}>
                  Unlimited response cards
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.premiumTitle, { color: colors.text }]}>
                Buy Me a Coffee & Dounut ☕🍩
              </Text>
              <Text style={[styles.premiumDescription, { color: colors.textSecondary }]}>
                Support the game and unlock the full experience:
              </Text>
              <View style={styles.premiumFeature}>
                <IconSymbol
                  ios_icon_name="checkmark.circle"
                  android_material_icon_name="check-circle"
                  size={20}
                  color={colors.text}
                />
                <Text style={[styles.premiumFeatureText, { color: colors.text }]}>
                  Remove all ads
                </Text>
              </View>
              <View style={styles.premiumFeature}>
                <IconSymbol
                  ios_icon_name="checkmark.circle"
                  android_material_icon_name="check-circle"
                  size={20}
                  color={colors.text}
                />
                <Text style={[styles.premiumFeatureText, { color: colors.text }]}>
                  Unlock unlimited scenarios
                </Text>
              </View>
              <View style={styles.premiumFeature}>
                <IconSymbol
                  ios_icon_name="checkmark.circle"
                  android_material_icon_name="check-circle"
                  size={20}
                  color={colors.text}
                />
                <Text style={[styles.premiumFeatureText, { color: colors.text }]}>
                  Unlock unlimited response cards
                </Text>
              </View>
              
              {isLoading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
              ) : (
                <>
                  <View style={styles.buttonSpacing}>
                    <Button
                      title="Buy Full Version – $6.99"
                      onPress={handlePurchase}
                      variant="primary"
                    />
                  </View>
                  <Button
                    title="Restore Purchase"
                    onPress={handleRestore}
                    variant="secondary"
                  />
                </>
              )}
            </>
          )}
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => {
              console.log('SettingsScreen: User toggled theme');
              toggleTheme();
            }}
          >
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <IconSymbol
              ios_icon_name={theme === 'dark' ? 'moon.fill' : 'sun.max.fill'}
              android_material_icon_name={theme === 'dark' ? 'nightlight' : 'wb-sunny'}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => {
              console.log('SettingsScreen: User tapped Rules');
              router.push('/rules');
            }}
          >
            <Text style={[styles.settingLabel, { color: colors.text }]}>Rules</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => {
              console.log('SettingsScreen: User tapped Thank You');
              router.push('/thank-you');
            }}
          >
            <Text style={[styles.settingLabel, { color: colors.text }]}>Thank You</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
