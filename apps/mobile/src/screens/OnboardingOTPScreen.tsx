import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius } from '../theme';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types';
import { useVerifyPhone, useResendOtp } from '../../features/onboarding/hooks';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OTP_LENGTH = 6;

export const OnboardingOTPScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputs = useRef<Array<TextInput | null>>([]);
  const verifyPhone = useVerifyPhone();
  const resendOtp = useResendOtp();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = useCallback((text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.slice(-1);
    setCode(newCode);
    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }, [code]);

  const handleKeyPress = useCallback(
    (e: any, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    },
    [code],
  );

  const isComplete = code.every((c) => c !== '');

  const formatTimer = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Back button */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>

        {/* Header */}
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{' '}
          <Text style={styles.phone}>+234 801 234 5678</Text>
        </Text>

        {/* OTP boxes */}
        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              style={[styles.codeInput, digit ? styles.codeInputFilled : undefined]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              textAlign="center"
              caretHidden
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify button */}
        <Button
          title="Verify"
          onPress={() => {
            const joinedCode = code.join('');
            verifyPhone.mutate(joinedCode, {
              onSuccess: () => navigation.navigate('OnboardingName'),
            });
          }}
          disabled={!isComplete || verifyPhone.isPending}
          loading={verifyPhone.isPending}
        />

        {/* Resend */}
        <View style={styles.resend}>
          {timer > 0 ? (
            <Text style={styles.resendText}>
              Didn't receive it?{' '}
              <Text style={styles.resendAction}>Resend code</Text> in {formatTimer(timer)}
            </Text>
          ) : (
            <Pressable onPress={() => { resendOtp.mutate(); setTimer(59); }}>
              <Text style={styles.resendLink}>Resend code</Text>
            </Pressable>
          )}
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
    padding: spacing['5'],
  },
  backBtn: {
    paddingTop: spacing['8'],
    paddingBottom: spacing['2'],
  },
  backText: {
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
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
  },
  phone: {
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  codeRow: {
    flexDirection: 'row',
    gap: spacing['2'],
    justifyContent: 'center',
    marginVertical: spacing['6'],
  },
  codeInput: {
    width: 44,
    height: 52,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.base,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.fg,
    backgroundColor: colors.surface,
    textAlign: 'center',
    padding: 0,
  },
  codeInputFilled: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  resend: {
    alignItems: 'center',
    marginTop: spacing['6'],
  },
  resendText: {
    fontSize: 13,
    color: colors.muted,
  },
  resendAction: {
    color: colors.fg,
    fontWeight: typography.weights.bold,
  },
  resendLink: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
});
