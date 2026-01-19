
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from './IconSymbol';
import { Button } from './Button';

interface DemoLimitModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DemoLimitModal({ visible, onClose }: DemoLimitModalProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.dark ? 'rgba(255,152,0,0.2)' : 'rgba(255,152,0,0.1)' }]}>
            <IconSymbol ios_icon_name="lock.fill" android_material_icon_name="lock" size={48} color="#FF9800" />
          </View>
          
          <Text style={[styles.title, { color: theme.colors.text }]}>Demo Limit Reached</Text>
          <Text style={[styles.message, { color: theme.dark ? '#98989D' : '#666' }]}>
            You&apos;ve completed the 3 demo rounds!{'\n\n'}
            The full version includes:
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
          </View>

          <Button
            title="Go to Settings to Purchase"
            onPress={onClose}
            variant="primary"
            style={styles.purchaseButton}
          />
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
  purchaseButton: {
    width: '100%',
  },
});
