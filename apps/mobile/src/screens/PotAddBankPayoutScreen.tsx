import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthedClient } from '@/lib/api/client';
import { colors, spacing, typography, radius, shadows, iconSizes } from '../theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { usePayoutAccounts } from '@/features/settings/payout-hooks';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = { params: { potId: string } };

export const PotAddBankPayoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();
  const { data: payoutData } = usePayoutAccounts();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [amount, setAmount] = useState('45,000');
  const [narration, setNarration] = useState('Dinner Split Payout');
  const potId = route.params?.potId;

  // Refetch payout accounts when screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['payout-accounts'] });
    }, [queryClient]),
  );

  // Receive selected bank from PotBankPicker
  const returnedBank = route.params?.selectedBank;
  if (returnedBank && returnedBank.id !== selectedBank) {
    setSelectedBank(returnedBank.id);
  }

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: () => getAuthedClient().retryPotSettlement(potId),
    onSuccess: () => navigation.popToTop(),
    onError: (err: Error) => {},
  });

  const apiAccount = payoutData?.accounts.find((a) => a.id === selectedBank);
  const selectedBankData = apiAccount
    ? { id: apiAccount.id, bankName: apiAccount.bankName, accountNumber: apiAccount.accountNumberLast4, accountName: apiAccount.accountName }
    : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Payout</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Available to withdraw</Text>
          <Text style={styles.summaryAmount}>₦45,000</Text>
        </View>

        {/* Bank Selection */}
        <View style={styles.sectionWrap}>
          <Text style={styles.cardLabel}>Select Bank Account</Text>
          {selectedBankData ? (
            <Pressable
              style={styles.bankCard}
              onPress={() => navigation.navigate('PotBankPicker' as any, { returnTo: 'PotAddBankPayout' })}
            >
              <View style={styles.bankIconContainer}>
                <Icon name="bank" size={iconSizes.lg} color={colors.fg} strokeWidth={2} />
              </View>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{selectedBankData.bankName}</Text>
                <Text style={styles.bankHint}>{selectedBankData.accountNumber} · {selectedBankData.accountName}</Text>
              </View>
              <Icon name="chevronRight" size={iconSizes.sm + 2} color={colors.muted} />
            </Pressable>
          ) : (
            <Pressable
              style={styles.bankCard}
              onPress={() => navigation.navigate('PotBankPicker' as any, { returnTo: 'PotAddBankPayout' })}
            >
              <View style={styles.bankIconContainer}>
                <Icon name="bank" size={iconSizes.lg} color={colors.fg} strokeWidth={2} />
              </View>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>Add Bank Account</Text>
                <Text style={styles.bankHint}>Choose from your saved accounts</Text>
              </View>
              <Icon name="chevronRight" size={iconSizes.sm + 2} color={colors.muted} />
            </Pressable>
          )}
        </View>

        {/* Form */}
        <View style={styles.sectionWrap}>
          <Input
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            hint="Minimum withdrawal: ₦1,000"
            containerStyle={styles.inputGroup}
          />
          <Input
            label="Narration"
            value={narration}
            onChangeText={setNarration}
            maxLength={50}
            hint="Max 50 characters"
            containerStyle={styles.inputGroup}
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Withdraw to Bank"
            onPress={() => withdrawMutation.mutate()}
            disabled={!selectedBank || withdrawMutation.isPending}
            loading={withdrawMutation.isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
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
    fontSize: typography.sizes['sm-'],
    fontWeight: typography.weights.extrabold,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.88,
  },
  summaryAmount: {
    fontSize: typography.sizes['5xl'],
    fontWeight: typography.weights.black,
    color: colors.fg,
    marginTop: spacing['1.5'],
    letterSpacing: -1.2,
  },

  // Section wrapper
  sectionWrap: {
    paddingHorizontal: spacing['1'],
  },

  // Card label
  cardLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    color: colors.muted,
    marginBottom: spacing['1'],
  },

  // Bank card
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    paddingVertical: spacing['3.5'],
    paddingHorizontal: spacing['4'],
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginTop: spacing['2'],
    ...shadows.brutSm,
  },
  bankIconContainer: {
    width: iconSizes['2xl'] + 16,
    height: iconSizes['2xl'] + 16,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bankInfo: {
    flex: 1,
    minWidth: 0,
  },
  bankName: {
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.extrabold,
    color: colors.fg,
    letterSpacing: -0.15,
  },
  bankHint: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.muted,
    marginTop: spacing['0.5'],
  },

  // Input groups
  inputGroup: {
    marginTop: spacing['5'],
  },

  // Actions
  actions: {
    paddingTop: spacing['6'],
    paddingHorizontal: spacing['1'],
  },
});
