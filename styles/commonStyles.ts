
import { StyleSheet, ViewStyle, TextStyle, useColorScheme } from 'react-native';

export const colors = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#1A1A2E',
  backgroundLight: '#FFFFFF',
  text: '#FFFFFF',
  textLight: '#1A1A2E',
  textSecondary: '#A0A0A0',
  textSecondaryLight: '#666666',
  cardBackground: '#16213E',
  cardBackgroundLight: '#F5F5F5',
  border: '#2E3A59',
  borderLight: '#E0E0E0',
};

export const getColors = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    return {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      background: '#1A1A2E',
      text: '#FFFFFF',
      textSecondary: '#A0A0A0',
      cardBackground: '#16213E',
      border: '#2E3A59',
    };
  } else {
    return {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      background: '#FFFFFF',
      text: '#1A1A2E',
      textSecondary: '#666666',
      cardBackground: '#F5F5F5',
      border: '#E0E0E0',
    };
  }
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
    fontSize: 16,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
