import React, { useRef, useState, useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../theme';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  error?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  error = false,
}) => {
  const refs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = useCallback(
    (text: string, index: number) => {
      const chars = value.split('');
      chars[index] = text.slice(-1);
      const joined = chars.join('').slice(0, length);
      onChange(joined);

      // Auto-advance to next field when a digit is entered
      if (text && index < length - 1) {
        refs.current[index + 1]?.focus();
      }
    },
    [value, length, onChange],
  );

  const handleKeyPress = useCallback(
    (e: any, index: number) => {
      // On backspace with empty field, jump to previous field
      if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    },
    [value],
  );

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, i) => {
        const char = value[i] || '';
        const isFocused = focusedIndex === i;
        const isFilled = char !== '';

        return (
          <TextInput
            key={i}
            ref={(ref) => {
              refs.current[i] = ref;
            }}
            style={[
              styles.input,
              isFocused && styles.inputFocused,
              isFilled && styles.inputFilled,
              error && styles.inputError,
            ]}
            value={char}
            onChangeText={(text) => handleChange(text, i)}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex(null)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            caretHidden
            selectTextOnFocus
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 48,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.base,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.black,
    color: colors.fg,
    backgroundColor: colors.surface,
    textAlign: 'center',
    padding: 0,
  },
  inputFocused: {
    borderColor: colors.accent,
  },
  inputFilled: {
    backgroundColor: colors.accentSoft,
  },
  inputError: {
    borderColor: colors.danger,
  },
});
