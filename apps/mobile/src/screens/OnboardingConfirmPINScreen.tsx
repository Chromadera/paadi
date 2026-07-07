import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSignupPin } from '../../features/onboarding/hooks';
import { useOnboardingStore } from '../../features/onboarding/store';
import { colors, spacing, typography, layout } from '../theme';
import { PinPad } from '../components/PinPad';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingConfirmPINScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const storedPin = useOnboardingStore((s) => s.pin);
  const signupPin = useSignupPin();

  const handlePress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === storedPin) {
          signupPin.mutate(newPin, {
            onSuccess: () => navigation.navigate('OnboardingBiometrics'),
          });
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Header — matches HTML: padding 32px 4px 16px, text-align center */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Confirm your PIN</Text>
          <Text style={styles.subtitle}>Re-enter your 4-digit PIN to confirm</Text>
        </View>

        {/* PinPad — integrated dots + 3-col numpad grid */}
        <View style={styles.pinPadContainer}>
          <PinPad
            onPress={handlePress}
            onDelete={handleDelete}
            pinLength={pin.length}
            maxLength={4}
          />
        </View>

        {/* Error message */}
        {error && <Text style={styles.error}>PINs don't match. Try again.</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 60,
  },
  // Header — matches HTML: padding 32px 4px 16px, text-align center
  header: {
    paddingTop: spacing['8'],
    paddingHorizontal: spacing['1'],
    paddingBottom: spacing['4'],
    alignItems: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: -4,
    top: spacing['8'],
  },
  backBtnText: {
    fontSize: typography.sizes.xl,
    color: colors.fg,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.heading,
    color: colors.fg,
    marginTop: spacing['2'],
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    marginTop: spacing['1.5'],
  },
  // PinPad container — matches HTML: padding 0 16px, margin-top 48px
  pinPadContainer: {
    paddingHorizontal: spacing['4'],
    marginTop: spacing['12'],
  },
  error: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing['4'],
  },
});
