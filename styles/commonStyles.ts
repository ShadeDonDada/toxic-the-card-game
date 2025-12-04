
import { StyleSheet, ViewStyle, TextStyle, useColorScheme } from 'react-native';

export const getColors = (colorScheme: 'light' | 'dark' | null | undefined) => {
  const isDark = colorScheme === 'dark';
  
  return {
    background: isDark ? '#0a0a0a' : '#f5f5f5',
    text: isDark ? '#00ff41' : '#006622',
    textSecondary: isDark ? '#00cc33' : '#008833',
    primary: isDark ? '#00ff41' : '#00cc33',
    secondary: isDark ? '#1a1a1a' : '#e0e0e0',
    accent: isDark ? '#39ff14' : '#00aa22',
    card: isDark ? '#1a1a1a' : '#ffffff',
    highlight: isDark ? '#00ff41' : '#00cc33',
    cardBorder: isDark ? '#00cc33' : '#00aa22',
    darkGreen: '#006622',
    black: isDark ? '#000000' : '#1a1a1a',
    white: isDark ? '#ffffff' : '#000000',
  };
};

// Legacy export for backward compatibility
export const colors = {
  background: '#0a0a0a',
  text: '#00ff41',
  textSecondary: '#00cc33',
  primary: '#00ff41',
  secondary: '#1a1a1a',
  accent: '#39ff14',
  card: '#1a1a1a',
  highlight: '#00ff41',
  cardBorder: '#00cc33',
  darkGreen: '#006622',
  black: '#000000',
};

export const getButtonStyles = (colorScheme: 'light' | 'dark' | null | undefined) => {
  const themeColors = getColors(colorScheme);
  
  return StyleSheet.create({
    instructionsButton: {
      backgroundColor: themeColors.primary,
      alignSelf: 'center',
      width: '100%',
    },
    backButton: {
      backgroundColor: themeColors.secondary,
      alignSelf: 'center',
      width: '100%',
    },
  });
};

// Legacy export for backward compatibility
export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export const getCommonStyles = (colorScheme: 'light' | 'dark' | null | undefined) => {
  const themeColors = getColors(colorScheme);
  
  return StyleSheet.create({
    wrapper: {
      backgroundColor: themeColors.background,
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 800,
      width: '100%',
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      textAlign: 'center',
      color: themeColors.text,
      marginBottom: 10
    },
    text: {
      fontSize: 16,
      fontWeight: '500',
      color: themeColors.text,
      marginBottom: 8,
      lineHeight: 24,
      textAlign: 'center',
    },
    section: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    buttonContainer: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: themeColors.card,
      borderColor: themeColors.cardBorder,
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      marginVertical: 8,
      width: '100%',
      boxShadow: colorScheme === 'dark' ? '0px 4px 6px rgba(0, 255, 65, 0.3)' : '0px 4px 6px rgba(0, 170, 34, 0.3)',
      elevation: 4,
    },
    icon: {
      width: 60,
      height: 60,
      tintColor: themeColors.primary,
    },
  });
};

// Legacy export for backward compatibility
export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 4px 6px rgba(0, 255, 65, 0.3)',
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});
