
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from './IconSymbol';
import { useRouter } from 'expo-router';

interface DemoLimitModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DemoLimitModal({ visible, onClose }: DemoLimitModalProps) {
  const theme = useTheme();
  const router = useRouter();

  const handleUpgrade = () => {
    onClose();
    router.push('/settings');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.dark ? 'rgba(255,152,0,0.2)' : 'rgba(255,152,0,0.1)' }]}>
            <IconSymbol ios_icon_name="lock.fill" android_material_icon_name="lock" size={48} color="#FF9800" />
          </View>
          
          <Text style={[styles.title, { color: theme.colors.text }]}>Demo Limit Reached</Text>
          <Text style={[styles.message, { color: theme.dark ? '#98989D' : '#666' }]}>
            You've completed the 3 demo rounds!{'\n\n'}
            Upgrade to unlock:
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <IconSymbol ios_icon_name="checkmark.circle.fill" android_material_icon_name="check-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>Unlimited rounds</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol ios_icon_name="checkmark.circle.fill" android_material_icon_name="check-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>All scenario cards</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol ios_icon_name="checkmark.circle.fill" android_material_icon_name="check-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>All response cards</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol ios_icon_name="checkmark.circle.fill" android_material_icon_name="check-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>No ads</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.upgradeButton, { backgroundColor: theme.colors.primary }]} onPress={handleUpgrade}>
            <IconSymbol ios_icon_name="cup.and.saucer.fill" android_material_icon_name="local-cafe" size={20} color="#fff" />
            <Text style={styles.upgradeButtonText}>Upgrade for $2.99</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={[styles.closeButtonText, { color: theme.dark ? '#98989D' : '#666' }]}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  featuresList: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 12,
  },
  closeButtonText: {
    fontSize: 16,
  },
});
