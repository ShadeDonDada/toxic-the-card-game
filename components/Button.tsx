
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  const { theme } = useTheme();
  const colors = getColors(theme);

  const getButtonStyle = () => {
    if (disabled) {
      return [styles.button, styles.disabled, style];
    }

    switch (variant) {
      case 'primary':
        return [styles.button, { backgroundColor: colors.primary }, style];
      case 'secondary':
        return [styles.button, { backgroundColor: colors.secondary }, style];
      case 'outline':
        return [
          styles.button,
          {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary,
          },
          style,
        ];
      default:
        return [styles.button, { backgroundColor: colors.primary }, style];
    }
  };

  const getTextStyle = () => {
    if (variant === 'outline') {
      return [styles.buttonText, { color: colors.primary }];
    }
    return [styles.buttonText, { color: '#FFFFFF' }];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
});
