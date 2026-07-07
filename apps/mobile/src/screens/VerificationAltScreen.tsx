import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const VerificationAltScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.shieldCircle}>
            <Text style={styles.shieldEmoji}>🛡️</Text>
          </View>
          <Text style={styles.title}>Identity Verification</Text>
          <Text style={styles.subtitle}>
            We need to verify your identity to comply with regulations
          </Text>
        </View>

        {/* Options */}
        <View style={styles.options}>
          {/* BVN — Active */}
          <Pressable style={styles.optionActive} onPress={() => {}}>
            <View style={styles.optionRow}>
              <View style={styles.optionIconContainer}>
                <Text style={styles.optionIcon}>🏦</Text>
              </View>
              <View style={styles.optionBody}>
                <Text style={styles.optionTitle}>BVN</Text>
                <Text style={styles.optionDesc}>
                  Bank Verification Number
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </Pressable>

          {/* NIN — Default */}
          <Pressable style={styles.optionDefault} onPress={() => {}}>
            <View style={styles.optionRow}>
              <View style={styles.optionIconContainer}>
                <Text style={styles.optionIcon}>🪪</Text>
              </View>
              <View style={styles.optionBody}>
                <Text style={styles.optionTitle}>NIN</Text>
                <Text style={styles.optionDesc}>
                  National Identity Number
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
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
  // ── Header ──
  header: {
    paddingTop: spacing['8'],
    paddingBottom: spacing['4'],
    alignItems: 'center',
  },
  shieldCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['4'],
  },
  shieldEmoji: {
    fontSize: typography.sizes['4xl-'],
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.heading,
    color: colors.fg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    marginTop: spacing['1.5'],
    textAlign: 'center',
  },
  // ── Options ──
  options: {
    marginTop: spacing['6'],
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  optionBody: {
    flex: 1,
  },
  // ── Option (active) ──
  optionActive: {
    width: '100%',
    padding: spacing['4'],
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginBottom: spacing['3'],
    ...shadows.brutSm,
  },
  // ── Option (default) ──
  optionDefault: {
    width: '100%',
    padding: spacing['4'],
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  // ── Option icon ──
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.base,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIcon: {
    fontSize: typography.sizes.xl,
  },
  optionTitle: {
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  optionDesc: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
  },
  chevron: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.black,
    color: colors.fg,
  },
});
