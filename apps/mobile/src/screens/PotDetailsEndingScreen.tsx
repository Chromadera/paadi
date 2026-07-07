import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows, iconSizes, iconContainers } from '../theme';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Icon, IconName } from '../components/Icon';
import { usePot } from '@/features/pots/hooks';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = { params: { potId: string } };

const MEMBER_NAMES = ['You', 'Amaka', 'Tunde', 'Ngozi', 'Femi', 'Ada', 'Emeka', 'Chidi'];

interface SettlementType {
  id: string;
  icon: IconName;
  title: string;
  description: string;
}

const settlementTypes: SettlementType[] = [
  {
    id: 'bank',
    icon: 'bank',
    title: 'Bank Transfer',
    description: 'Withdraw to your bank account',
  },
  {
    id: 'wallet',
    icon: 'wallet',
    title: 'Wallet Credit',
    description: 'Add funds to your Paadi wallet',
  },
  {
    id: 'split',
    icon: 'send',
    title: 'Split & Return',
    description: 'Return funds to all members',
  },
  {
    id: 'reuse',
    icon: 'pot',
    title: 'New Pot',
    description: 'Roll into a new pot',
  },
];

export const PotDetailsEndingScreen: React.FC = () => {
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
  const collectedAmount = apiPot.progress.collectedKobo / 100;
  const memberCount = apiPot.progress.splitCount;
  const perPerson = Math.round(targetAmount / (memberCount || 1));
  const [selectedSettlement, setSelectedSettlement] = useState<string | null>(null);

  const members = apiPot.splits?.map((split, i) => ({
    avatarIndex: (i % 8) + 1,
    name: split.label || MEMBER_NAMES[i % MEMBER_NAMES.length],
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
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>

        {/* Meta Card */}
        <View style={styles.sectionWrap}>
          <View style={styles.brutCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Ended On</Text>
              <Text style={styles.metaValue}>{apiPot.deadlineAt ? new Date(apiPot.deadlineAt).toLocaleDateString() : '—'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Split Type</Text>
              <Text style={styles.metaValue}>Equal</Text>
            </View>
            <View style={styles.metaRowLast}>
              <Text style={styles.metaLabel}>Total Collected</Text>
              <Text style={styles.metaValue}>₦{collectedAmount.toLocaleString()}</Text>
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
                  <Text style={styles.memberSubtitle}>Paid ₦{perPerson.toLocaleString()}</Text>
                </View>
                <Text style={[styles.memberStatus, styles.statusPaid]}>Paid</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settlement Type Selection */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Settlement Type</Text>
          </View>
          <View style={styles.settlementGrid}>
            {settlementTypes.map((st) => {
              const isSelected = selectedSettlement === st.id;
              return (
                <Pressable
                  key={st.id}
                  style={[styles.settlementCard, isSelected && styles.settlementCardSelected]}
                  onPress={() => setSelectedSettlement(st.id)}
                >
                  <View style={styles.settlementIcon}>
                    <Icon
                      name={st.icon}
                      size={iconSizes.lg}
                      color={colors.fg}
                      strokeWidth={2}
                    />
                  </View>
                  <Text style={styles.settlementTitle}>{st.title}</Text>
                  <Text style={styles.settlementDesc}>{st.description}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Payout to Bank"
            onPress={() => navigation.navigate('PotAddBankPayout', { potId })}
            disabled={!selectedSettlement}
          />
          <Pressable
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
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
    marginTop: spacing['5'],
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

  // Settlement grid
  settlementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['2.5'],
  },
  settlementCard: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '48%',
    padding: spacing['4'],
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  settlementCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  settlementIcon: {
    width: iconContainers.settlement.size,
    height: iconContainers.settlement.size,
    borderRadius: iconContainers.settlement.radius,
    backgroundColor: colors.settlementIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2.5'],
  },
  settlementTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.fg,
  },
  settlementDesc: {
    fontSize: typography.sizes.xs,
    color: colors.muted,
    marginTop: spacing['0.5'],
  },

  // Actions
  actions: {
    paddingTop: spacing['6'],
    paddingHorizontal: spacing['1'],
  },
  cancelBtn: {
    marginTop: spacing['3'],
    paddingVertical: spacing['3.5'],
    paddingHorizontal: spacing['5'],
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    ...shadows.brutSm,
  },
  cancelBtnText: {
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
});
