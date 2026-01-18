
import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function TabsLayout() {
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol
              ios_icon_name="house.fill"
              android_material_icon_name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
