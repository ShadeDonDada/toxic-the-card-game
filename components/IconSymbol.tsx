
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface IconSymbolProps {
  _ios_icon_name?: string;
  android_material_icon_name: keyof typeof MaterialIcons.glyphMap;
  size: number;
  color: string;
}

export const IconSymbol: React.FC<IconSymbolProps> = ({
  android_material_icon_name,
  size,
  color,
}) => {
  // For now, we'll use Material Icons on all platforms
  // In a real implementation, you'd use SF Symbols on iOS
  return (
    <MaterialIcons
      name={android_material_icon_name}
      size={size}
      color={color}
    />
  );
};
