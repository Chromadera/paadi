import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, typography, shadows, componentSizes, spacing } from '../theme';
import { Icon } from './Icon';

interface PinPadProps {
  onPress: (digit: string) => void;
  onDelete: () => void;
  pinLength?: number;
  maxLength?: number;
  /** Whether to show the built-in PIN dots row. Default true. */
  showDots?: boolean;
}

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'delete'],
] as const;

export const PinPad: React.FC<PinPadProps> = ({
  onPress,
  onDelete,
  pinLength = 0,
  maxLength = 4,
  showDots = true,
}) => {
  const handlePress = (key: string) => {
    if (key === 'delete') {
      onDelete();
    } else if (key !== '' && pinLength < maxLength) {
      onPress(key);
    }
  };

  return (
    <View style={styles.container}>
      {/* PIN dots display — matches HTML: 14×14, 50% radius, 2px border */}
      {showDots && (
        <View style={styles.dotsContainer}>
          {Array.from({ length: maxLength }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < pinLength && styles.dotFilled,
              ]}
            />
          ))}
        </View>
      )}

      {/* Keypad grid — matches HTML: 3-col, gap:12px, max-width:280px */}
      <View style={styles.grid}>
        {ROWS.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((key, keyIdx) => {
              const isSpecial = key === '' || key === 'delete';

              return (
                <Pressable
                  key={keyIdx}
                  style={[
                    styles.key,
                    isSpecial && styles.keySpecial,
                  ]}
                  onPress={() => handlePress(key)}
                  disabled={key === ''}
                >
                  {key === 'delete' ? (
                    <Icon
                      name="delete"
                      size={typography.sizes['2xl']}
                      color={colors.fg}
                      strokeWidth={2}
                    />
                  ) : key !== '' ? (
                    <Text style={styles.keyText}>{key}</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  // PIN dots — HTML: width:14px; height:14px; border-radius:50%;
  // Empty: border:2px solid var(--border); background:var(--surface)
  // Filled: background:var(--fg)
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    marginBottom: spacing['8'],
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.border,
  },
  dotFilled: {
    backgroundColor: colors.fg,
    borderColor: colors.fg,
  },
  // Keypad — HTML: 3-col grid, gap:12px, max-width:280px, centered
  // Keys: height:64px, border:2px solid var(--fg), border-radius:16px,
  //       background:var(--surface), font-size:24px, font-weight:700,
  //       box-shadow:2px 2px 0 0 var(--fg)
  grid: {
    width: '100%',
    maxWidth: 280,
    gap: spacing['3'],
  },
  row: {
    flexDirection: 'row',
    gap: spacing['3'],
  },
  key: {
    flex: 1,
    height: componentSizes.pinKey.height,
    borderRadius: componentSizes.pinKey.radius,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.fg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.brutSm,
  },
  keySpecial: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  keyText: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
});
