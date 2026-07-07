import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, typography, spacing } from '../theme';

interface BadgeProps {
  label: string;
  variant?: 'open' | 'kyc' | 'new' | 'settled' | 'custom';
  customBg?: string;
  customColor?: string;
  customBorder?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'open',
  customBg,
  customColor,
  customBorder,
}) => {
  const variantStyles = {
    open: { backgroundColor: colors.badgeOpenBg, color: colors.successDark, borderColor: colors.badgeOpenBorder, fontWeight: typography.weights.extrabold as '800' },
    kyc: { backgroundColor: colors.accentSoft, color: colors.warningDark, borderColor: 'transparent', fontWeight: typography.weights.extrabold as '800' },
    new: { backgroundColor: 'transparent', color: colors.pink, borderColor: 'transparent', fontWeight: typography.weights.black as '900' },
    settled: { backgroundColor: colors.badgeSettledBg, color: colors.successDark, borderColor: 'transparent', fontWeight: typography.weights.extrabold as '800' },
    custom: { backgroundColor: customBg || 'transparent', color: customColor || colors.fg, borderColor: customBorder || 'transparent', fontWeight: typography.weights.extrabold as '800' },
  };

  const v = variantStyles[variant];

  return (
    <View style={[styles.badge, { backgroundColor: v.backgroundColor, borderColor: v.borderColor, borderWidth: variant === 'open' ? 1 : 0 }]}>
      <Text style={[styles.text, { color: v.color, fontWeight: v.fontWeight }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: spacing['0.5'],
    paddingHorizontal: spacing['2'],
    borderRadius: 4,
  },
  text: {
    fontSize: typography.sizes['2xs'],
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
