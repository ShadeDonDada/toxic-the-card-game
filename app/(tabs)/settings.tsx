
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { usePurchase } from '@/contexts/PurchaseContext';
import { useTheme } from '@react-navigation/native';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isFullVersion, purchaseFullVersion, restorePurchases } = usePurchase();
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      await purchaseFullVersion();
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    await restorePurchases();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Version Status */}
        <View style={[styles.section, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
          <View style={styles.statusRow}>
            <IconSymbol 
              ios_icon_name={isFullVersion ? "checkmark.circle.fill" : "exclamationmark.circle.fill"} 
              android_material_icon_name={isFullVersion ? "check-circle" : "info"} 
              size={24} 
              color={isFullVersion ? '#4CAF50' : '#FF9800'} 
            />
            <View style={styles.statusText}>
              <Text style={[styles.statusTitle, { color: theme.colors.text }]}>
                {isFullVersion ? 'Full Version' : 'Demo Mode'}
              </Text>
              <Text style={[styles.statusSubtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
                {isFullVersion ? 'All features unlocked' : 'Limited to 3 rounds'}
              </Text>
            </View>
          </View>
        </View>

        {/* Purchase Section */}
        {!isFullVersion && (
          <View style={[styles.section, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Upgrade to Full Version</Text>
            <Text style={[styles.sectionDescription, { color: theme.dark ? '#98989D' : '#666' }]}>
              Unlock unlimited rounds, all cards, and remove ads
            </Text>
            
            <TouchableOpacity 
              style={[styles.purchaseButton, purchasing && styles.purchaseButtonDisabled]} 
              onPress={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <IconSymbol ios_icon_name="cup.and.saucer.fill" android_material_icon_name="local-cafe" size={20} color="#fff" />
                  <Text style={styles.purchaseButtonText}>Buy Me a Coffee - $2.99</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Restore Purchases */}
        <TouchableOpacity 
          style={[styles.section, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
          onPress={handleRestore}
        >
          <View style={styles.settingRow}>
            <IconSymbol ios_icon_name="arrow.clockwise" android_material_icon_name="refresh" size={20} color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>Restore Purchases</Text>
          </View>
        </TouchableOpacity>

        {/* About */}
        <View style={[styles.section, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
          <Text style={[styles.aboutText, { color: theme.dark ? '#98989D' : '#666' }]}>
            Toxic - The Card Game{'\n'}
            Version 1.0.0{'\n\n'}
            "Extracting the poison out of you"
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  purchaseButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
