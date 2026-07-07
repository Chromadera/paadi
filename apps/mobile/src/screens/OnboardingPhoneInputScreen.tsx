import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { BrandMark } from '../components/BrandMark';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingPhoneInputScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <BrandMark size={56} />
          <Text style={styles.title}>Welcome to Paadi</Text>
          <Text style={styles.subtitle}>
            Split bills, save together, settle automatically.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Phone Number</Text>

          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>🇳🇬</Text>
              <Text style={styles.code}>+234</Text>
              <Text style={styles.chevron}>▾</Text>
            </View>
            <View style={styles.phoneInputWrap}>
              <Input
                value="801 234 5678"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Button
            title="Send Verification Code"
            onPress={() => navigation.navigate('OnboardingOTP')}
            icon={<Text style={styles.arrow}>→</Text>}
          />

          <Text style={styles.terms}>
            By continuing, you agree to Paadi's{' '}
            <Text style={styles.termsBold}>Terms of Service</Text> and{' '}
            <Text style={styles.termsBold}>Privacy Policy</Text>. Standard SMS rates may apply.
          </Text>
        </View>

        {/* Social login */}
        <View style={styles.social}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.socialButtons}>
            <Pressable style={styles.socialBtn}>
              <Text style={styles.socialText}>G</Text>
            </Pressable>
            <Pressable style={styles.socialBtn}>
              <Text style={styles.socialText}></Text>
            </Pressable>
          </View>
        </View>

        {/* Home indicator */}
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing['5'],
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing['12'],
    paddingHorizontal: spacing['2'],
    paddingBottom: spacing['4'],
  },
  title: {
    fontSize: typography.sizes['3xl'],
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
  form: {
    paddingHorizontal: spacing['1'],
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    color: colors.muted,
    marginTop: spacing['4'],
    marginBottom: spacing['2'],
  },
  phoneRow: {
    flexDirection: 'row',
    gap: spacing['2'],
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['3.5'],
    backgroundColor: colors.segmentedBg,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.base,
  },
  flag: {
    fontSize: typography.sizes.lg,
  },
  code: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  chevron: {
    fontSize: typography.sizes.xs,
    color: colors.chevron,
  },
  phoneInputWrap: {
    flex: 1,
  },
  arrow: {
    fontSize: typography.sizes.base,
    color: colors.fg,
  },
  terms: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing['4'],
    lineHeight: 11 * typography.lineHeights.relaxed,
  },
  termsBold: {
    color: colors.fg,
    fontWeight: typography.weights.bold,
  },
  social: {
    marginTop: spacing['8'],
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    marginBottom: spacing['4'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.muted,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing['3'],
    justifyContent: 'center',
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.brutSm,
  },
  socialText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.black,
    color: colors.fg,
  },
  homeIndicator: {
    height: 20,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['6'],
  },
  homeIndicatorBar: {
    width: 120,
    height: 4,
    backgroundColor: colors.fg,
    borderRadius: 2,
  },
});
