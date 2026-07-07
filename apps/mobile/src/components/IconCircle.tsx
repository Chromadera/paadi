import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadows, iconContainers } from '../theme';

interface IconCircleProps {
  variant: 'yellow' | 'outline';
  size?: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const IconCircle: React.FC<IconCircleProps> = ({
  variant,
  size = iconContainers.quickAction.size,
  children,
  style,
}) => {
  return (
    <View
      style={[
        styles.base,
        { width: size, height: size },
        variant === 'yellow' ? styles.yellow : styles.outline,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yellow: {
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.fg,
    ...shadows.brutSm,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.borderSubtle,
  },
});
