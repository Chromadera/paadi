import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const VerificationErrorScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Error content */}
        <View style={styles.errorContent}>
          <View style={styles.warningCircle}>
            <Text style={styles.warningIcon}>⚠️</Text>
          </View>
          <Text style={styles.title}>Verification Failed</Text>
          <Text style={styles.message}>
            We couldn't verify your identity with the provided information.
            Please check your details and try again.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {/* Error details card */}
          <View style={styles.errorDetails}>
            <Text style={styles.errorLabel}>Error code</Text>
            <Text style={styles.errorCode}>VER_001_BVN_MISMATCH</Text>

            <Text style={[styles.errorLabel, styles.errorLabelSpaced]}>
              Reason
            </Text>
            <Text style={styles.errorReason}>
              BVN does not match phone number records
            </Text>
          </View>

          <Button
            title="Try Again"
            onPress={() => navigation.navigate('Verification')}
          />

          <Pressable
            style={({ pressed }) => [
              styles.contactSupportBtn,
              pressed && styles.contactSupportPressed,
            ]}
            onPress={() => {}}
          >
            <Text style={styles.contactSupportText}>Contact Support</Text>
          </Pressable>
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
    paddingHorizontal: spacing['5'],
    paddingBottom: 60,
  },
  // ── Error content ──
  errorContent: {
    paddingTop: spacing['8'],
    paddingBottom: spacing['4'],
    alignItems: 'center',
  },
  warningCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['4'],
  },
  warningIcon: {
    fontSize: typography.sizes['4xl-'],
  },
  title: {
    fontSize: typography.sizes['2xl-'],
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.heading,
    color: colors.fg,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    textAlign: 'center',
    marginTop: spacing['2'],
    maxWidth: 280,
    lineHeight: 1.5,
  },
  // ── Actions ──
  actions: {
    marginTop: spacing['6'],
  },
  // ── Error details card ──
  errorDetails: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing['4'],
    marginBottom: spacing['4'],
  },
  errorLabel: {
    fontSize: typography.sizes['base-'],
    color: colors.muted,
    marginBottom: spacing['1'],
  },
  errorLabelSpaced: {
    marginTop: spacing['3'],
  },
  errorCode: {
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  errorReason: {
    fontSize: typography.sizes.base,
    color: colors.fg,
  },
  // ── Contact Support button ──
  contactSupportBtn: {
    width: '100%',
    paddingVertical: spacing['3.5'],
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['3'],
    ...shadows.brutSm,
  },
  contactSupportPressed: {
    transform: [{ translateY: 1 }],
    shadowOpacity: 0,
    elevation: 2,
  },
  contactSupportText: {
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
});
