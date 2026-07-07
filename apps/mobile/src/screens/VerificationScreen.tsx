import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const VerificationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={8}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Verify your identity</Text>
          <Text style={styles.subtitle}>
            Complete verification to unlock all features
          </Text>
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {/* BVN — Active */}
          <Pressable style={styles.stepCardActive} onPress={() => {}}>
            <View style={styles.stepRow}>
              <View style={styles.stepIconContainer}>
                <Text style={styles.stepIcon}>🆔</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepTitle}>BVN Verification</Text>
                <Text style={styles.stepDesc}>
                  Link your Bank Verification Number
                </Text>
              </View>
              <View style={styles.badgeStart}>
                <Text style={styles.badgeStartText}>Start</Text>
              </View>
            </View>
          </Pressable>

          {/* NIN — Locked */}
          <View style={styles.stepCardLocked}>
            <View style={styles.stepRow}>
              <View style={styles.stepIconContainer}>
                <Text style={styles.stepIcon}>🪪</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepTitle}>NIN Verification</Text>
                <Text style={styles.stepDesc}>
                  National Identity Number
                </Text>
              </View>
              <View style={styles.badgeLocked}>
                <Text style={styles.badgeLockedText}>Locked</Text>
              </View>
            </View>
          </View>

          {/* ID Document — Locked */}
          <View style={styles.stepCardLocked}>
            <View style={styles.stepRow}>
              <View style={styles.stepIconContainer}>
                <Text style={styles.stepIcon}>📷</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepTitle}>ID Document</Text>
                <Text style={styles.stepDesc}>
                  Upload a valid government ID
                </Text>
              </View>
              <View style={styles.badgeLocked}>
                <Text style={styles.badgeLockedText}>Locked</Text>
              </View>
            </View>
          </View>
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
  // ── Header ──
  header: {
    paddingTop: spacing['8'],
    paddingBottom: spacing['4'],
  },
  backBtn: {
    width: 28,
    height: 28,
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
  // ── Steps ──
  steps: {
    paddingHorizontal: spacing['1'],
    marginTop: spacing['4'],
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  stepBody: {
    flex: 1,
  },
  // ── Step card (active) ──
  stepCardActive: {
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing['4'],
    marginBottom: spacing['3'],
    ...shadows.brutSm,
  },
  // ── Step card (locked) ──
  stepCardLocked: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing['4'],
    marginBottom: spacing['3'],
    opacity: 0.6,
  },
  // ── Step icon ──
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.base,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIcon: {
    fontSize: typography.sizes.lg,
  },
  stepTitle: {
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  stepDesc: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
    marginTop: spacing['0.5'],
  },
  // ── Badge: Start ──
  badgeStart: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  badgeStartText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.accent,
  },
  // ── Badge: Locked ──
  badgeLocked: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  badgeLockedText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.muted,
  },
});
