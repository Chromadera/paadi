import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme';

interface SegmentedControlProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(option)}
          style={[styles.button, selected === option && styles.active]}
        >
          <Text style={[styles.text, selected === option && styles.activeText]}>
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing['1'],
    backgroundColor: colors.segmentedBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.base,
    padding: spacing['1'],
    marginVertical: spacing['4'],
  },
  button: {
    flex: 1,
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['1.5'],
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  active: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.segmentedActive,
  },
  text: {
    fontSize: typography.sizes['sm-'],
    fontWeight: typography.weights.extrabold,
    color: colors.muted,
  },
  activeText: {
    color: colors.fg,
  },
});
