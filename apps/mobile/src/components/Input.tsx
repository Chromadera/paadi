import React from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { colors, radius, typography, spacing } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  error,
  containerStyle,
  style,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused, error && styles.inputError, style]}
        placeholderTextColor={colors.placeholder}
        onFocus={(e) => {
          setIsFocused(true);
          textInputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          textInputProps.onBlur?.(e);
        }}
        {...textInputProps}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    color: colors.muted,
    marginBottom: spacing['1'],
  },
  input: {
    width: '100%',
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['3.5'],
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.base,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.fg,
    backgroundColor: colors.surface,
  },
  inputFocused: {
    borderColor: colors.accent,
  },
  inputError: {
    borderColor: colors.danger,
  },
  hint: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.muted,
    marginTop: spacing['1.5'],
  },
  error: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.danger,
    marginTop: spacing['1.5'],
  },
});
