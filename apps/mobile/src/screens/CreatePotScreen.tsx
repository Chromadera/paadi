import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useElectricityProviders, useLookupElectricityCustomer, useCableProviders, useLookupCableCustomer } from '../../features/create-pot/hooks';
import { useCreatePotStore } from '../../features/create-pot/store';
import { usePayoutAccounts } from '../../features/settings/payout-hooks';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types';
import { Icon } from '../components/Icon';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type SettlementType = 'billpay' | 'bank';
type BillCategory = 'electricity' | 'cable';
type MeterType = 'prepaid' | 'postpaid';

export const CreatePotScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const store = useCreatePotStore();

  const [settlementType, setSettlementType] = useState<SettlementType>('billpay');
  const [billCategory, setBillCategory] = useState<BillCategory>('electricity');
  const [provider, setProvider] = useState<string>(store.billerProductCode || '');
  const [meterType, setMeterType] = useState<MeterType>('prepaid');
  const [meterNumber, setMeterNumber] = useState('');
  const [verified, setVerified] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const { data: electricityData } = useElectricityProviders();
  const { data: cableData } = useCableProviders();
  const lookupElectricity = useLookupElectricityCustomer();
  const lookupCable = useLookupCableCustomer();
  const { data: payoutData } = usePayoutAccounts();

  const providers = billCategory === 'electricity'
    ? electricityData ?? []
    : cableData ?? [];

  function handleContinue() {
    store.setField('settlementType', settlementType === 'billpay' ? 'bill_payment' : 'bank_payout');
    store.setField('billerCategory', billCategory);
    store.setField('billerProductCode', provider);
    store.setField('billerCustomerId', meterNumber);
    store.setField('meterType', meterType);
    navigation.navigate('PotSplit' as any);
  }

  const handleVerify = () => {
    if (meterNumber.trim().length === 0) return;
    if (billCategory === 'electricity') {
      lookupElectricity.mutate(
        { disco: provider, customerId: meterNumber.trim(), meterType: meterType === 'prepaid' ? 'PREPAID' : 'POSTPAID' },
        { onSuccess: (data) => { setVerified(true); setCustomerName(data.customerName); } },
      );
    } else {
      lookupCable.mutate(
        { cableTvType: provider, customerId: meterNumber.trim() },
        { onSuccess: (data) => { setVerified(true); setCustomerName(data.customerName); } },
      );
    }
  };

  const savedAccounts = payoutData?.accounts ?? [];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header with step pill ── */}
        <ScreenHeader
          title="Create Pot"
          rightElement={<View style={styles.stepPill}><Text style={styles.stepPillText}>Step 1/3</Text></View>}
        />

        {/* ── Settlement type label ── */}
        <Text style={styles.cardLabel}>How will collected funds be settled?</Text>

        {/* ── Settlement grid (2-col cards) ── */}
        <View style={styles.settlementGrid}>
          <Pressable
            style={[
              styles.settlementCard,
              settlementType === 'billpay' && styles.settlementCardSelected,
            ]}
            onPress={() => setSettlementType('billpay')}
          >
            <View style={styles.scIcon}>
              <Icon name="bills" size={20} color={colors.fg} strokeWidth={2} />
            </View>
            <Text style={styles.scTitle}>Bill Payment</Text>
            <Text style={styles.scDesc}>Pay electricity/cable directly</Text>
          </Pressable>

          <Pressable
            style={[
              styles.settlementCard,
              settlementType === 'bank' && styles.settlementCardSelected,
            ]}
            onPress={() => setSettlementType('bank')}
          >
            <View style={styles.scIcon}>
              <Icon name="bank" size={20} color={colors.fg} strokeWidth={2} />
            </View>
            <Text style={styles.scTitle}>Bank Payout</Text>
            <Text style={styles.scDesc}>Withdraw settled cash to bank</Text>
          </Pressable>
        </View>

        {/* ── Bill Payment details card ── */}
        {settlementType === 'billpay' && (
          <View style={styles.detailsCard}>
            {/* Bill Category */}
            <Text style={[styles.cardLabel, { marginTop: 0 }]}>Bill Category</Text>
            <View style={styles.toggleRow}>
              <Pressable
                style={[
                  styles.toggleBtn,
                  billCategory === 'electricity' && styles.toggleBtnActive,
                ]}
                onPress={() => setBillCategory('electricity')}
              >
                <Icon
                  name="bills"
                  size={14}
                  color={billCategory === 'electricity' ? colors.fg : colors.muted}
                  strokeWidth={billCategory === 'electricity' ? 2.5 : 2}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    billCategory === 'electricity' && styles.toggleBtnTextActive,
                  ]}
                >
                  Electricity
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleBtn,
                  billCategory === 'cable' && styles.toggleBtnActive,
                ]}
                onPress={() => setBillCategory('cable')}
              >
                <Icon
                  name="bills"
                  size={14}
                  color={billCategory === 'cable' ? colors.fg : colors.muted}
                  strokeWidth={billCategory === 'cable' ? 2.5 : 2}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    billCategory === 'cable' && styles.toggleBtnTextActive,
                  ]}
                >
                  Cable TV
                </Text>
              </Pressable>
            </View>

            {/* Provider */}
            <Text style={styles.cardLabel}>Provider</Text>
            <View style={styles.optionList}>
              {providers.map((p) => (
                <Pressable
                  key={p.code}
                  style={[
                    styles.optionItem,
                    provider === p.code && styles.optionItemSelected,
                  ]}
                  onPress={() => setProvider(p.code)}
                >
                  <Text
                    style={[
                      styles.optionItemText,
                      provider === p.code && styles.optionItemTextSelected,
                    ]}
                  >
                    {p.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Meter Type */}
            <Text style={styles.cardLabel}>Meter Type</Text>
            <View style={styles.toggleRow}>
              <Pressable
                style={[
                  styles.toggleBtn,
                  meterType === 'prepaid' && styles.toggleBtnActive,
                ]}
                onPress={() => setMeterType('prepaid')}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    meterType === 'prepaid' && styles.toggleBtnTextActive,
                  ]}
                >
                  PREPAID
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleBtn,
                  meterType === 'postpaid' && styles.toggleBtnActive,
                ]}
                onPress={() => setMeterType('postpaid')}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    meterType === 'postpaid' && styles.toggleBtnTextActive,
                  ]}
                >
                  POSTPAID
                </Text>
              </Pressable>
            </View>

            {/* Meter Number */}
            <Text style={styles.cardLabel}>Meter Number</Text>
            <View style={styles.meterRow}>
              <Input
                placeholder="e.g. 0101234567"
                value={meterNumber}
                onChangeText={(text) => {
                  setMeterNumber(text);
                  if (verified) setVerified(false);
                }}
                containerStyle={{ flex: 1 }}
              />
              <Button
                title="Verify"
                variant="small"
                onPress={handleVerify}
                loading={lookupElectricity.isPending || lookupCable.isPending}
                disabled={!meterNumber.trim()}
                disabled={meterNumber.trim().length === 0}
              />
            </View>

            {/* Verified banner */}
            {verified && (
              <View style={styles.verifiedBanner}>
                <Icon name="check" size={16} color={colors.verifiedText} strokeWidth={2.5} />
                <View>
                  <Text style={styles.verifiedLabel}>Account Verified</Text>
                  <Text style={styles.verifiedName}>Chidi Nwosu</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ── Bank Payout (when bank is selected) ── */}
        {settlementType === 'bank' && (
          <View style={styles.detailsCard}>
            <Text style={[styles.cardLabel, { marginTop: 0 }]}>Bank Account</Text>
            <Pressable
              style={styles.optionItem}
              onPress={() => navigation.navigate('PotBankPicker' as any, { returnTo: 'PotSplit' })}
            >
              <Text style={styles.optionItemText}>Select a bank account...</Text>
            </Pressable>
          </View>
        )}

        {/* ── Continue button ── */}
        <Button
          title="Continue to Splits"
          onPress={handleContinue}
          style={{ marginTop: spacing['4'] }}
        />
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
    paddingBottom: spacing['8'],
  },

  // ── Step pill ──
  stepPill: {
    backgroundColor: colors.stepPillBg,
    paddingVertical: spacing['1'],
    paddingHorizontal: spacing['3'],
    borderRadius: radius.full,
  },
  stepPillText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.stepPillText,
  },

  // ── Card label ──
  cardLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    color: colors.muted,
    marginBottom: spacing['1'],
    marginTop: spacing['4'],
  },

  // ── Settlement grid ──
  settlementGrid: {
    flexDirection: 'row',
    gap: spacing['2.5'],
    marginTop: spacing['2'],
  },
  settlementCard: {
    flex: 1,
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
  scIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.base,
    backgroundColor: colors.settlementIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2.5'],
  },
  scTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.fg,
  },
  scDesc: {
    fontSize: typography.sizes.xs,
    color: colors.muted,
    marginTop: spacing['0.5'],
  },

  // ── Details card ──
  detailsCard: {
    marginTop: spacing['4'],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing['5'],
    ...shadows.card,
  },

  // ── Toggle row ──
  toggleRow: {
    flexDirection: 'row',
    gap: spacing['1.5'],
    backgroundColor: colors.segmentedBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.base,
    padding: spacing['1'],
    marginTop: spacing['2'],
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['1.5'],
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['1.5'],
    borderRadius: radius.sm,
  },
  toggleBtnActive: {
    backgroundColor: colors.surface,
  },
  toggleBtnText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.muted,
  },
  toggleBtnTextActive: {
    color: colors.fg,
  },

  // ── Option list ──
  optionList: {
    gap: spacing['1.5'],
    marginTop: spacing['2'],
  },
  optionItem: {
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['3.5'],
    backgroundColor: colors.segmentedBg,
    borderRadius: radius.base,
  },
  optionItemSelected: {
    backgroundColor: colors.accentSoft,
  },
  optionItemText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.muted60,
  },
  optionItemSubtext: {
    fontSize: typography.sizes.xs,
    color: colors.muted,
    marginTop: 2,
  },
  optionItemTextSelected: {
    color: colors.fg,
    fontWeight: typography.weights.bold,
  },

  // ── Meter row ──
  meterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing['2'],
    marginTop: spacing['2'],
  },

  // ── Verified banner ──
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.successBorder,
    borderRadius: radius.base,
    paddingVertical: spacing['2.5'],
    paddingHorizontal: spacing['3.5'],
    marginTop: spacing['2.5'],
  },
  verifiedLabel: {
    fontSize: typography.sizes['2xs'],
    fontWeight: typography.weights.bold,
    color: colors.verifiedText,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
  },
  verifiedName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.verifiedText,
  },
});
