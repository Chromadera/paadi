import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, shadows } from '../theme';

interface BrandMarkProps {
  size?: number;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ size = 32 }) => {
  const fontSize = size * 0.5;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { fontSize },
        ]}
      >
        P
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.brutSm,
  },
  text: {
    color: colors.fg,
    fontWeight: '900',
  },
});
