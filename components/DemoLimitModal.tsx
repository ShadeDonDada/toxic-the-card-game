
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';
import { getColors } from '@/styles/commonStyles';
import { useTheme } from '@/contexts/ThemeContext';

interface DemoLimitModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  limitType: 'scenarios' | 'cards';
}

export function DemoLimitModal({ visible, onClose, onUpgrade, limitType }: DemoLimitModalProps) {
  const { effectiveColorScheme } = useTheme();
  const colors = getColors(effectiveColorScheme);

  const title = limitType === 'scenarios' 
    ? 'Demo Scenario Limit Reached' 
    : 'Demo Card Limit Reached';
  
  const message = limitType === 'scenarios'
    ? 'You\'ve played all 3 demo scenarios! Upgrade to the full version to unlock unlimited scenarios and continue playing.'
    : 'You\'ve used all 3 demo response cards! Upgrade to the full version to unlock unlimited cards and responses.';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.accent }]}>
          <View style={styles.iconContainer}>
            <IconSymbol
              ios_icon_name="lock.fill"
              android_material_icon_name="lock"
              size={64}
              color={colors.accent}
            />
          </View>
          
          <Text style={[styles.title, { color: colors.accent }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={24}
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
                size={24}
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
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.featureText, { color: colors.text }]}>
                No ads
              </Text>
            </View>
          </View>

          <Button
            title="Unlock Full Version - $5"
            onPress={onUpgrade}
            variant="primary"
            style={styles.upgradeButton}
          />
          
          <Button
            title="Continue Demo"
            onPress={onClose}
            variant="secondary"
            style={styles.closeButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 3,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
  },
  upgradeButton: {
    width: '100%',
    marginBottom: 12,
  },
  closeButton: {
    width: '100%',
  },
});
