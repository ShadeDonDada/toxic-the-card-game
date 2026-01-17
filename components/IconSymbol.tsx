
import React from 'react';
import { Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface IconSymbolProps {
  ios_icon_name: string;
  android_material_icon_name: string;
  size: number;
  color: string;
}

export const IconSymbol: React.FC<IconSymbolProps> = ({
  ios_icon_name,
  android_material_icon_name,
  size,
  color,
}) => {
  // For now, we'll use Material Icons on all platforms
  // In a real implementation, you'd use SF Symbols on iOS
  return (
    <MaterialIcons
      name={android_material_icon_name as any}
      size={size}
      color={color}
    />
  );
};
