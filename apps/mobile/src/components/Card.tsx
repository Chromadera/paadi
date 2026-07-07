import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'large' | 'neubrutalist';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', style }) => {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing['4'],
    marginBottom: spacing['2.5'],
  },
  default: {
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  large: {
    borderRadius: radius.lg,
    padding: spacing['5'],
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  neubrutalist: {
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.lg,
    padding: spacing['5'],
    ...shadows.brut,
  },
});
