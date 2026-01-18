
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { getColors } from '@/styles/commonStyles';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  getColors: (theme: Theme) => ReturnType<typeof getColors>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  getColors: (theme: Theme) => getColors(theme),
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    console.log('ThemeProvider: System color scheme changed to:', systemColorScheme);
    if (systemColorScheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    console.log('ThemeProvider: Toggling theme from', theme);
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        getColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
