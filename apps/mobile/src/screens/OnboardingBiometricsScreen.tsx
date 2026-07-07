import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRegisterDevice } from '../../features/onboarding/hooks';
import { colors, spacing, typography, radius, shadows, layout } from '../theme';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingBiometricsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const registerDevice = useRegisterDevice();

  function handleEnable() {
    registerDevice.mutate(
      { deviceId: Platform.OS, biometricEnabled: true },
      { onSuccess: () => navigation.navigate('MainTabs') },
    );
  }

  function handleSkip() {
    registerDevice.mutate(
      { deviceId: Platform.OS, biometricEnabled: false },
      { onSuccess: () => navigation.navigate('MainTabs') },
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Wrapper — matches device-screen: paddingHorizontal 20px, paddingBottom 60px */}
      <View style={styles.wrapper}>
        {/* Content area — matches HTML: flex 1, column, center, padding 32px 4px */}
        <View style={styles.content}>
          {/* Icon container — matches HTML: 80x80, 2px fg border, 24px radius, surface bg, brutMd shadow */}
          <View style={styles.iconContainer}>
            <Icon name="shield" size={40} color={colors.fg} strokeWidth={1.5} />
          </View>

          <Text style={styles.title}>Enable Face ID</Text>
          <Text style={styles.description}>
            Unlock Paadi and authorize payments quickly and securely with Face ID.
          </Text>
        </View>

        {/* Actions — matches HTML: padding 0 4px 16px */}
        <View style={styles.actions}>
          <Button
            title="Enable Face ID"
            onPress={handleEnable}
            loading={registerDevice.isPending}
          />
          <Button
            title="Maybe Later"
            onPress={handleSkip}
            disabled={registerDevice.isPending}
            variant="secondary"
            style={styles.skipBtn}
            textStyle={styles.skipBtnText}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  // Wrapper — matches device-screen CSS: padding 0 20px 60px
  wrapper: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 60,
  },
  // Content area — matches HTML: flex 1, column, center, padding 32px 4px
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['1'],
    paddingVertical: spacing['8'],
  },
  // Icon — matches HTML: 80x80, 2px fg border, 24px radius, surface bg, brutMd shadow, margin-bottom 24px
  iconContainer: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['6'],
    ...shadows.brutMd,
  },
  // Title — matches HTML: 24px black 900, -0.3px tracking
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.heading,
    color: colors.fg,
    textAlign: 'center',
  },
  // Description — matches HTML: 14px muted60, margin-top 8px, max-width 260px, line-height 1.5
  description: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    textAlign: 'center',
    marginTop: spacing['2'],
    maxWidth: 260,
    lineHeight: typography.sizes.base * 1.5,
  },
  // Actions — matches HTML: padding 0 4px 16px
  actions: {
    paddingHorizontal: spacing['1'],
    paddingBottom: spacing['4'],
  },
  // Skip button — matches HTML: 100% width, 14px padding, 2px fg border, 14px radius, surface bg, brutSm shadow, 12px margin-top
  skipBtn: {
    borderRadius: 14,
    backgroundColor: colors.surface,
    marginTop: spacing['3'],
    ...shadows.brutSm,
  },
  // Skip button text — matches HTML: 15px font, 700 weight
  skipBtnText: {
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.bold,
  },
});
