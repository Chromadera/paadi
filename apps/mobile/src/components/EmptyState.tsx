import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography, shadows, componentSizes } from '../theme';
import { Icon, IconName } from './Icon';
import { Button } from './Button';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={32} color={colors.fg} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="secondary"
          style={styles.action}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['8'],
  },
  iconBox: {
    width: componentSizes.avatar.lg,
    height: componentSizes.avatar.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.fg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.brutSm,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.black,
    color: colors.fg,
    marginTop: spacing['5'],
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    color: colors.muted60,
    textAlign: 'center',
    marginTop: spacing['2'],
    maxWidth: 240,
  },
  action: {
    marginTop: spacing['5'],
  },
});
