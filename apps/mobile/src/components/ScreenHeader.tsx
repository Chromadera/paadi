import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { Icon } from './Icon';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightElement,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Icon name="chevronLeft" size={28} color={colors.fg} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <Text style={styles.title}>{title}</Text>
        {rightElement ? (
          <View style={styles.right}>{rightElement}</View>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing['2'],
    paddingBottom: spacing['4'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 28,
    height: 28,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.heading,
    color: colors.fg,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.muted,
    marginTop: spacing['1'],
  },
  right: {
    minWidth: 28,
    alignItems: 'flex-end',
  },
});
