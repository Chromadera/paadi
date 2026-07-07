import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useQuery } from '@tanstack/react-query';
import { getAuthedClient } from '@/lib/api/client';
import { useMe } from '@/features/settings/profile-hooks';
import { usePots } from '@/features/pots/hooks';
import { colors, spacing, typography, radius } from '../theme';
import { WalletCard } from '../components/WalletCard';
import { KYCBanner } from '../components/KYCBanner';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { IconCircle } from '../components/IconCircle';
import { RootStackParamList, MainTabParamList } from '../types';

type NavigationProp = BottomTabNavigationProp<MainTabParamList> &
  NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const { data: me, isPending: loadingMe } = useMe();
  const { data: potsData, isPending: loadingPots } = usePots({ status: 'open', limit: 3 });

  const { data: wallet } = useQuery({
    queryKey: ['me', 'wallet'],
    queryFn: () => getAuthedClient().getWallet(),
    retry: false,
  });

  const firstName = me?.profile.firstName ?? me?.profile.username ?? 'User';
  const activePots = potsData?.items ?? [];

  const quickActions = [
    { icon: 'send' as const, label: 'Send', variant: 'yellow' as const },
    { icon: 'request' as const, label: 'Request', variant: 'outline' as const },
    { icon: 'bills' as const, label: 'Pay Bills', variant: 'outline' as const },
    { icon: 'airtime' as const, label: 'Airtime', variant: 'outline' as const },
  ];

  if (loadingMe || loadingPots) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Greeting Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {firstName}!</Text>
            <Text style={styles.tagline}>
              Let's split and settle bills together
            </Text>
          </View>
          <View style={styles.logo}>
            <Icon name="home" size={20} color={colors.fg} />
          </View>
        </View>

        {/* ── Wallet Card ── */}
        <View style={styles.walletSpacing}>
          <WalletCard
            balance={wallet ? wallet.balanceKobo / 100 : 0}
            bankName={wallet?.virtualAccount?.bankName ?? ''}
            accountNumber={wallet?.virtualAccount?.accountNumber ?? ''}
          />
        </View>

        {/* ── KYC Banner ── */}
        {me?.tier === 'TIER_0' && (
          <View style={styles.kycSpacing}>
            <KYCBanner onPress={() => navigation.navigate('Verification')} />
          </View>
        )}

        {/* ── Quick Actions ── */}
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <Pressable key={action.label} style={styles.quickAction}>
              <IconCircle variant={action.variant} size={40}>
                <Icon
                  name={action.icon}
                  size={18}
                  color={colors.fg}
                  strokeWidth={2.5}
                />
              </IconCircle>
              <Text style={styles.qaLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── Active Pots ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>
            Active Pots ({activePots.length})
          </Text>
          <Pressable onPress={() => navigation.navigate('PotsTab')}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        {activePots.map((pot) => {
          const collected = (pot as any).collectedKobo / 100;
          const target = (pot as any).totalKobo / 100;
          const pct = target > 0 ? Math.round((collected / target) * 100) : 0;
          return (
            <Pressable
              key={pot.id}
              style={styles.potRow}
              onPress={() =>
                navigation.navigate('PotDetails', { potId: pot.id })
              }
            >
              <View style={styles.potRowLeft}>
                <Text style={styles.potRowTitle}>{pot.title}</Text>
                <Text style={styles.potRowMeta}>
                  ₦{collected.toLocaleString()} of ₦{target.toLocaleString()}
                </Text>
              </View>
              <View style={styles.potRowRight}>
                <Text style={styles.potRowPct}>{pct}%</Text>
                <Icon
                  name="chevronRight"
                  size={16}
                  color={colors.chevronMuted}
                  strokeWidth={2}
                />
              </View>
            </Pressable>
          );
        })}

        {/* ── Create Pot CTA ── */}
        <View style={styles.createBtnWrapper}>
          <Button
            title="Create New Split Pot"
            onPress={() => navigation.navigate('CreatePot')}
            variant="primary"
            icon={<Icon name="plus" size={20} color={colors.fg} strokeWidth={2.5} />}
          />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingHorizontal: spacing['5'],
    paddingBottom: 120,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['1'],
    paddingTop: spacing['2'],
  },
  greeting: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.heading,
    color: colors.fg,
  },
  tagline: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.muted,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.fg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Wallet
  walletSpacing: {
    marginTop: spacing['4'],
  },
  kycSpacing: {
    marginTop: spacing['4'],
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: spacing['2.5'],
    marginTop: spacing['3'],
    marginBottom: spacing['5'],
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: spacing['1.5'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['1.5'],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  qaLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['4'],
  },
  sectionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    color: colors.muted,
  },
  viewAll: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    color: colors.warning,
  },
  // Compact pot rows (Home screen specific)
  potRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing['4'],
    marginBottom: spacing['2.5'],
  },
  potRowLeft: {
    flex: 1,
    marginRight: spacing['2'],
  },
  potRowTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.fg,
  },
  potRowMeta: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.muted,
    marginTop: spacing['1'],
  },
  potRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  potRowPct: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.muted60,
  },
  // Create button
  createBtnWrapper: {
    marginTop: spacing['4'],
  },
});
