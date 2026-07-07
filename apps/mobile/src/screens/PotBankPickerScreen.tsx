import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBanks, usePayoutAccounts } from '@/features/settings/payout-hooks';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { Input } from '../components/Input';
import { RootStackParamList } from '../types';
import { Icon } from '../components/Icon';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BankItem {
  id: string;
  name: string;
  initials: string;
  bgColor: string;
  textColor: string;
  accountMasked?: string;
}

const BG_COLORS = ['#FEF3C7', '#DBEAFE', '#F3E8FF', '#ECFDF5', '#FFF1F2', '#F0F9FF'];
const TEXT_COLORS = ['#92400E', '#1E40AF', '#7C3AED', '#047857', '#BE123C', '#0369A1'];

export const PotBankPickerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { data: savedAccounts } = usePayoutAccounts();
  const { data: banksData } = useBanks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState<string>('');

  const savedBanks: BankItem[] = (savedAccounts?.accounts ?? []).map((a, i) => ({
    id: a.id,
    name: a.bankName,
    initials: a.bankName.slice(0, 2).toUpperCase(),
    bgColor: BG_COLORS[i % BG_COLORS.length],
    textColor: TEXT_COLORS[i % TEXT_COLORS.length],
    accountMasked: a.accountNumberLast4,
  }));

  const allBanks: BankItem[] = (banksData?.banks ?? []).map((b, i) => ({
    id: b.code,
    name: b.name,
    initials: b.name.slice(0, 2).toUpperCase(),
    bgColor: BG_COLORS[i % BG_COLORS.length],
    textColor: TEXT_COLORS[i % TEXT_COLORS.length],
  }));

  const filteredSaved = savedBanks.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredAll = allBanks.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Back header: ←  Select Bank  (spacer) ── */}
        <View style={styles.backHeader}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevronLeft" size={20} color={colors.fg} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.backHeaderTitle}>Select Bank</Text>
          <View style={styles.backSpacer} />
        </View>

        {/* ── Search ── */}
        <View style={styles.searchWrap}>
          <View style={styles.searchIconWrap}>
            <Icon name="search" size={16} color={colors.muted} strokeWidth={2} />
          </View>
          <Input
            placeholder="Search banks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchInput}
            style={styles.searchInputField}
          />
        </View>

        {/* ── Saved Accounts ── */}
        {filteredSaved.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Saved Accounts</Text>
            <View style={styles.savedList}>
              {filteredSaved.map((bank, index) => {
                const isSelected = selectedBank === bank.id;
                const isLast = index === filteredSaved.length - 1;

                return (
                  <Pressable
                    key={bank.id}
                    style={[styles.savedRow, !isLast && styles.savedRowBorder]}
                    onPress={() => {
                      const returnTo = route.params?.returnTo || 'PotSplit';
                      if (returnTo === 'PotSplit') {
                        navigation.navigate('PotAddBankAccount' as any, { bank, returnTo });
                      } else {
                        navigation.navigate(returnTo as any, { selectedBank: bank });
                      }
                    }}
                  >
                    {/* Saved account — tap to select and go back */}
                    <View style={[styles.bankIconLarge, { backgroundColor: bank.bgColor }]}>
                      <Text style={[styles.bankIconLargeText, { color: bank.textColor }]}>
                        {bank.initials}
                      </Text>
                    </View>

                    {/* Bank info */}
                    <View style={styles.bankInfo}>
                      <Text style={styles.bankNameLarge}>{bank.name}</Text>
                      {bank.accountMasked && (
                        <Text style={styles.bankAccount}>{'•••• '}{bank.accountMasked}</Text>
                      )}
                    </View>

                    {/* Radio button */}
                    <View
                      style={[
                        styles.radio,
                        isSelected ? styles.radioSelected : styles.radioUnselected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* ── All Banks ── */}
        {filteredAll.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>All Banks</Text>
            <View style={styles.allBanksList}>
              {filteredAll.map((bank, index) => {
                const isLast = index === filteredAll.length - 1;

                return (
                  <Pressable
                    key={bank.id}
                    style={[styles.allBankRow, !isLast && styles.allBankRowBorder]}
                    onPress={() => {
                      const returnTo = route.params?.returnTo || 'PotSplit';
                      navigation.navigate('PotAddBankAccount' as any, { bank, returnTo });
                    }}
                  >
                    {/* Bank icon (small, 36x36) */}
                    <View style={[styles.bankIconSmall, { backgroundColor: bank.bgColor }]}>
                      <Text style={[styles.bankIconSmallText, { color: bank.textColor }]}>
                        {bank.initials}
                      </Text>
                    </View>

                    {/* Bank name */}
                    <Text style={styles.bankNameSmall}>{bank.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
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
    paddingBottom: spacing['16'],
  },

  // ── Back header ──
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing['2'],
    paddingBottom: spacing['2'],
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHeaderTitle: {
    fontSize: 17,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  backSpacer: {
    width: 20,
  },

  // ── Search ──
  searchWrap: {
    position: 'relative',
    paddingHorizontal: spacing['1'],
    paddingTop: spacing['2'],
  },
  searchIconWrap: {
    position: 'absolute',
    left: spacing['3'] + spacing['1'],
    top: spacing['2'] + spacing['3'] + 2,
    zIndex: 1,
  },
  searchInput: {
    // container takes full width
  },
  searchInputField: {
    paddingLeft: 36,
  },

  // ── Section ──
  section: {
    paddingHorizontal: spacing['1'],
    marginTop: spacing['4'],
  },
  sectionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing['2'],
  },

  // ── Saved accounts list (brut card) ──
  savedList: {
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.brutSm,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    paddingVertical: spacing['3.5'],
    paddingHorizontal: spacing['4'],
  },
  savedRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // ── Large bank icon (40x40) ──
  bankIconLarge: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankIconLargeText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.black,
  },

  // ── Bank info ──
  bankInfo: {
    flex: 1,
  },
  bankNameLarge: {
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  bankAccount: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
  },

  // ── Radio button ──
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderWidth: 2,
    borderColor: colors.fg,
  },
  radioUnselected: {
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.fg,
  },

  // ── All banks list ──
  allBanksList: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  allBankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
  },
  allBankRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // ── Small bank icon (36x36) ──
  bankIconSmall: {
    width: 36,
    height: 36,
    borderRadius: spacing['2'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankIconSmallText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.black,
  },

  // ── Bank name (all banks section) ──
  bankNameSmall: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
});
