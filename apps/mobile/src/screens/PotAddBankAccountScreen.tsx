import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCreatePotStore } from '../../features/create-pot/store';
import { useLookupPayoutAccount, useCreatePayoutAccount } from '../../features/settings/payout-hooks';
import { colors, spacing, typography, radius } from '../theme';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PotAddBankAccountScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const store = useCreatePotStore();

  const bank = route.params?.bank;
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [verified, setVerified] = useState(false);

  const lookupAccount = useLookupPayoutAccount();
  const createAccount = useCreatePayoutAccount();

  function handleVerify() {
    if (accountNumber.length < 10) return;
    lookupAccount.mutate(
      { bankCode: bank.id, accountNumber },
      { onSuccess: (data) => { setVerified(true); setAccountName(data.accountName); } },
    );
  }

  function handleContinue() {
    store.setField('payoutAccountId', bank.id);
    const returnTo = route.params?.returnTo || 'PotSplit';
    if (returnTo === 'PotAddBankPayout') {
      navigation.pop(2);
    } else {
      navigation.navigate('PotSplit' as any);
    }
  }

  const isVerifying = lookupAccount.isPending;
  const isValid = accountNumber.length === 10;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Bank Account</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.card}>
          <Text style={styles.bankName}>{bank?.name}</Text>

          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.input}
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="0123456789"
            placeholderTextColor={colors.placeholder}
            keyboardType="number-pad"
            maxLength={10}
            editable={!verified}
          />

          {!verified ? (
            <Button
              title="Verify Account"
              onPress={handleVerify}
              loading={isVerifying}
              disabled={!isValid || isVerifying}
              style={{ marginTop: spacing['4'] }}
            />
          ) : (
            <View style={styles.verifiedSection}>
              <Text style={styles.verifiedLabel}>Account Name</Text>
              <Text style={styles.verifiedName}>{accountName}</Text>
            </View>
          )}
        </View>

        {verified && (
          <View style={styles.ctaWrap}>
            <Button title="Continue" onPress={handleContinue} icon={<Text>→</Text>} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing['5'], paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing['2'], paddingBottom: spacing['4'] },
  backArrow: { fontSize: 20, color: colors.fg },
  title: { fontSize: typography.sizes['2xl'], fontWeight: typography.weights.black, color: colors.fg },
  spacer: { width: 24 },
  card: { marginTop: spacing['6'], backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing['4'] },
  bankName: { fontSize: typography.sizes.base, fontWeight: typography.weights.extrabold, color: colors.fg, marginBottom: spacing['4'] },
  label: { fontSize: 10, fontWeight: typography.weights.extrabold, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  input: { borderRadius: radius.base, borderWidth: 2, borderColor: colors.fg, backgroundColor: colors.surface, paddingHorizontal: spacing['4'], paddingVertical: 12, fontSize: typography.sizes.base, fontWeight: '600', color: colors.fg },
  verifiedSection: { marginTop: spacing['4'], padding: spacing['4'], backgroundColor: colors.successBg, borderRadius: radius.base, borderWidth: 1, borderColor: colors.successBorder },
  verifiedLabel: { fontSize: 10, fontWeight: typography.weights.extrabold, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1 },
  verifiedName: { fontSize: typography.sizes.base, fontWeight: typography.weights.extrabold, color: colors.fg, marginTop: 4 },
  ctaWrap: { marginTop: spacing['6'] },
});
