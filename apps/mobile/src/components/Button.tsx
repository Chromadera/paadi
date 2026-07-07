import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { colors, radius, typography, shadows, spacing } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'small';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  trailingIcon,
}) => {
  const isPrimary = variant === 'primary';
  const isSmall = variant === 'small';
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isSecondary ? styles.secondary : styles.primary,
        isSmall && styles.small,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && (
          isSmall ? styles.smallPressed :
          isSecondary ? styles.secondaryPressed :
          styles.primaryPressed
        ),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.fg} />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, isSmall && styles.smallText, textStyle]}>
            {title}
          </Text>
          {trailingIcon}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    width: '100%',
    paddingVertical: spacing['3.5'],
    paddingHorizontal: spacing['5'],
    borderRadius: radius.md,
  },
  primary: {
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.fg,
    ...shadows.btnRest,
  },
  primaryPressed: {
    transform: [{ translateY: 2 }],
    ...shadows.btnActive,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.fg,
  },
  secondaryPressed: {
    backgroundColor: colors.segmentedBg,
  },
  small: {
    width: 'auto',
    paddingVertical: spacing['2.5'],
    paddingHorizontal: spacing['4'],
    alignSelf: 'center',
    ...shadows.btnSmRest,
  },
  smallPressed: {
    transform: [{ translateY: 1 }],
    ...shadows.btnSmActive,
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.black,
    color: colors.fg,
  },
  smallText: {
    fontSize: typography.sizes.sm,
  },
});
