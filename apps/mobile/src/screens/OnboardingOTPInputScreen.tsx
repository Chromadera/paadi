import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, layout } from '../theme';
import { Button } from '../components/Button';
import { OTPInput } from '../components/OTPInput';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingOTPInputScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [code, setCode] = useState('3827');
  const [timer, setTimer] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = () => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Enter verification code</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to <Text style={styles.phone}>+234 801 234 5678</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <OTPInput length={6} value={code} onChange={setCode} />
        </View>

        {/* Verify Button */}
        <Button title="Verify" onPress={() => navigation.navigate('OnboardingName')} />

        {/* Resend */}
        <View style={styles.resend}>
          <Text style={styles.resendText}>
            Didn't receive it?{' '}
            <Text
              style={styles.resendLink}
              onPress={timer === 0 ? () => setTimer(59) : undefined}
            >
              Resend code
            </Text>
            {' '}in {formatTimer()}
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 60,
  },
  // Header — matches HTML: padding 32px 4px 16px
  header: {
    paddingTop: spacing['8'],
    paddingHorizontal: spacing['1'],
    paddingBottom: spacing['4'],
  },
  backBtn: {
    padding: 0,
    width: typography.sizes.xl,
    height: typography.sizes.xl,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: spacing['4'],
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    marginTop: spacing['1.5'],
  },
  phone: {
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  otpContainer: {
    paddingHorizontal: spacing['1'],
    marginTop: spacing['6'],
  },
  resend: {
    alignItems: 'center',
    marginTop: spacing['6'],
  },
  resendText: {
    fontSize: typography.sizes['base-'],
    color: colors.muted,
    textAlign: 'center',
  },
  resendLink: {
    color: colors.fg,
    fontWeight: typography.weights.bold,
  },
});
