
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  const { effectiveColorScheme } = useTheme();
  const colors = getColors(effectiveColorScheme);

  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.secondary;
      case 'accent':
        return colors.accent;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.primary;
      default:
        return colors.black;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor(), borderColor: variant === 'secondary' ? colors.cardBorder : colors.primary },
        Platform.OS === 'ios' && styles.shadowIOS,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: getTextColor() }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    elevation: 3,
    borderWidth: 2,
  },
  shadowIOS: {
    shadowColor: 'rgba(0, 255, 65, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
