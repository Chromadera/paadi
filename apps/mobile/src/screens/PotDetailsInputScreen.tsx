import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { Avatar } from '../components/Avatar';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { usePot } from '@/features/pots/hooks';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = { params: { potId: string } };

const MEMBER_NAMES = ['You', 'Amaka', 'Tunde', 'Ngozi', 'Femi', 'Ada', 'Emeka', 'Chidi'];

export const PotDetailsInputScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute() as RouteProps;
  const potId = route.params?.potId ?? '';
  const { data: apiPot, isPending } = usePot(potId);

  if (isPending || !apiPot) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  const targetAmount = apiPot.totalKobo / 100;
  const memberCount = apiPot.progress.splitCount;
  const paidCount = apiPot.progress.paidCount;
  const perPerson = Math.round(targetAmount / (memberCount || 1));
  const [amount, setAmount] = useState(perPerson.toLocaleString());

  const members = apiPot.splits?.map((split, i) => ({
    avatarIndex: (i % 8) + 1,
    name: split.label || MEMBER_NAMES[i % MEMBER_NAMES.length],
    amount: split.shareKobo / 100,
    paid: split.status === 'paid',
  })) ?? [];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>{apiPot.title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Pot Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>TOTAL POT</Text>
          <Text style={styles.summaryAmount}>₦{targetAmount.toLocaleString()}</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        {/* Meta Card */}
        <View style={styles.sectionWrap}>
          <View style={styles.brutCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Due Date</Text>
              <Text style={styles.metaValue}>{apiPot.deadlineAt ? new Date(apiPot.deadlineAt).toLocaleDateString() : '—'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Split Type</Text>
              <Text style={styles.metaValue}>Custom</Text>
            </View>
            <View style={styles.metaRowLast}>
              <Text style={styles.metaLabel}>Your Share</Text>
              <Text style={styles.metaValue}>₦{perPerson.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Members */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Members</Text>
            <Text style={styles.sectionCount}>{memberCount}</Text>
          </View>
          <View style={styles.brutCardList}>
            {members.map((member, i) => (
              <View key={member.avatarIndex} style={[styles.memberRow, i < members.length - 1 && styles.memberRowBorder]}>
                <Avatar index={member.avatarIndex} size={36} />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberSubtitle}>Share: ₦{member.amount.toLocaleString()}</Text>
                </View>
                <Text style={[styles.memberStatus, member.paid ? styles.statusPaid : styles.statusPending]}>
                  {member.paid ? 'Paid' : 'Pending'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.inputSection}>
          <Input
            label="Amount to Contribute"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            hint="Enter the amount you want to contribute"
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button title="Pay Your Share" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  loadingContainer: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: spacing['5'], paddingBottom: spacing['10'] },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing['2'],
    paddingBottom: spacing['4'],
  },
  backBtn: {
    width: spacing['7'],
    height: spacing['7'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: typography.sizes.xl,
    color: colors.fg,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
    textAlign: 'center',
    letterSpacing: -0.17,
  },
  headerSpacer: {
    width: spacing['7'],
  },

  // Summary
  summary: {
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['1'],
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.sizes['base-'],
    fontWeight: typography.weights.bold,
    color: colors.muted,
    letterSpacing: 0.5,
  },
  summaryAmount: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.black,
    color: colors.fg,
    marginTop: spacing['1'],
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1.5'],
    marginTop: spacing['2'],
    paddingVertical: spacing['1'],
    paddingHorizontal: spacing['3'],
    borderRadius: radius.full,
    backgroundColor: colors.successBg,
  },
  statusDot: {
    width: spacing['1.5'],
    height: spacing['1.5'],
    borderRadius: spacing['1.5'] / 2,
    backgroundColor: colors.successDark,
  },
  statusText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.successDark,
  },

  // Section wrapper
  sectionWrap: {
    paddingHorizontal: spacing['1'],
    marginTop: spacing['4'],
  },

  // Brutalist card
  brutCard: {
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing['4'],
    ...shadows.brutSm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing['3'],
  },
  metaRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: typography.sizes['base-'],
    color: colors.muted,
  },
  metaValue: {
    fontSize: typography.sizes['base-'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  sectionLabel: {
    fontSize: typography.sizes['base-'],
    fontWeight: typography.weights.bold,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: typography.sizes['base-'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },

  // Brutalist card list
  brutCardList: {
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.brutSm,
  },

  // Member row
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
  },
  memberRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  memberSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
  },
  memberStatus: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  statusPaid: {
    color: colors.successDark,
  },
  statusPending: {
    color: colors.warningDark,
  },

  // Input section
  inputSection: {
    paddingHorizontal: spacing['1'],
    marginTop: spacing['5'],
  },

  // Actions
  actions: {
    paddingTop: spacing['6'],
    paddingHorizontal: spacing['1'],
  },
});
