import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Icon } from './Icon';

interface KYCBannerProps {
  onPress?: () => void;
}

export const KYCBanner: React.FC<KYCBannerProps> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.icon}>
        <Icon name="shield" size={16} color={colors.warningDark} strokeWidth={2.5} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Verify identity to unlock limits</Text>
        <Text style={styles.subtitle}>
          Complete BVN and selfie check to upgrade your account and start direct payouts.
        </Text>
      </View>
      <Icon name="chevronRight" size={16} color={colors.kycArrow} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    borderRadius: radius.base,
    padding: spacing['4'],
    marginTop: spacing['4'],
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: radius.base,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.black,
    color: colors.warningDark,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.kycArrow,
    marginTop: spacing['1'],
    lineHeight: 14,
  },
});
