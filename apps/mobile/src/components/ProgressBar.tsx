import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors, radius, componentSizes, animation } from '../theme';

interface ProgressBarProps {
  progress: number; // 0-100
  style?: any;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, style }) => {
  const clamped = Math.max(0, Math.min(100, progress));
  const widthAnim = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: clamped,
      duration: animation.progress.duration,
      useNativeDriver: false,
    }).start();
  }, [clamped, widthAnim]);

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.fill, { width: widthInterpolated }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: componentSizes.progressBar.height,
    backgroundColor: colors.surfaceBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.full,
  },
});
