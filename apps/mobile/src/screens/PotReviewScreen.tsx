import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCreatePotStore } from '../../features/create-pot/store';
import { useCreatePot } from '../../features/create-pot/hooks';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { RootStackParamList } from '../types';

const avatarSources = [
  require('../../assets/avatars/avatar-1.png'),
  require('../../assets/avatars/avatar-2.png'),
  require('../../assets/avatars/avatar-3.png'),
  require('../../assets/avatars/avatar-4.png'),
  require('../../assets/avatars/avatar-5.png'),
  require('../../assets/avatars/avatar-6.png'),
  require('../../assets/avatars/avatar-7.png'),
  require('../../assets/avatars/avatar-8.png'),
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PotReviewScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const store = useCreatePotStore();
  const createPotMutation = useCreatePot();

  const [errorMsg, setErrorMsg] = useState('');
  const isPending = createPotMutation.isPending;

  const totalNaira = store.totalKobo / 100;

  function getMemberShare(index: number): number {
    const split = store.splits[index];
    if (!split) return 0;
    if (store.splitMode === 'amount') return (split.amountKobo || 0) / 100;
    if (store.splitMode === 'percent') return ((split.percent || 0) / 100) * totalNaira;
    // weight: relative share
    const totalWeight = store.splits.reduce((sum, s) => sum + (s.weight || 1), 0);
    return ((split.weight || 1) / totalWeight) * totalNaira;
  }

  const daysRemaining = store.deadlineAt
    ? Math.ceil((new Date(store.deadlineAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  function handleConfirm() {
    setErrorMsg('');

    // If bill_payment fields were never filled, fall back to wallet
    let settlementType = store.settlementType || 'wallet';
    if (
      settlementType === 'bill_payment' &&
      (!store.billerCategory || !store.billerProductCode || !store.billerCustomerId)
    ) {
      settlementType = 'wallet';
    }
    const totalKobo = store.totalKobo;
    const sm = store.splitMode || 'weight';

    const input: Record<string, any> = {
      title: store.title,
      description: store.description || undefined,
      totalKobo,
      settlementType,
      completionRule: 'progressive',
      splitMode: sm,
      splits: store.splits.map((s) => {
        const split: Record<string, any> = { label: s.label };
        if (sm === 'weight') split.weight = s.weight || 1;
        else if (sm === 'amount') split.amountKobo = s.amountKobo || Math.round(totalKobo / store.splits.length);
        else if (sm === 'percent') split.percent = s.percent || Math.round(100 / store.splits.length);
        return split;
      }),
    };

    if (store.deadlineAt) input.deadlineAt = store.deadlineAt;
    if (settlementType === 'bill_payment') {
      input.billerCategory = store.billerCategory;
      input.billerProductCode = store.billerProductCode;
      input.billerCustomerId = store.billerCustomerId;
      input.meterType = store.meterType;
    } else if (settlementType === 'bank_payout') {
      input.payoutAccountId = store.payoutAccountId;
    }

    const idempotencyKey = Math.random().toString(36).substring(2) + Date.now().toString(36);

    createPotMutation.mutate(
      { input: input as any, idempotencyKey },
      {
        onSuccess: (potDetail: any) => {
          store.reset();
          navigation.navigate('PotDetails', { potId: potDetail.id });
        },
        onError: (err: any) => {
          const issues = err?.issues;
          if (issues?.length) {
            setErrorMsg(issues.map((i: any) => `${i.path}: ${i.message}`).join('\n'));
          } else {
            setErrorMsg(err.message || 'Failed to create pot.');
          }
        },
      },
    );
  }

  const getInitial = (label: string) => (label || '?')[0].toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Pot</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.content}>
          {/* Pot Identity Card */}
          <View style={styles.identityCard}>
            <View style={styles.identityBody}>
              {/* Avatars */}
              <View style={styles.avatarRow}>
                {store.splits.slice(0, 3).map((s, i) => (
                  <View
                    key={i}
                    style={[
                      styles.avatar,
                      i === 0 ? styles.avatarOrganizer : null,
                      { zIndex: 3 - i, marginLeft: i > 0 ? -6 : 0 },
                    ]}
                  >
                    {i === 0 ? (
                      <Text style={styles.avatarTextOrg}>{getInitial(s.label)}</Text>
                    ) : (
                      <Image
                        source={avatarSources[(i + 3) % avatarSources.length]}
                        style={styles.avatarImg}
                      />
                    )}
                  </View>
                ))}
              </View>

              <Text style={styles.potLabel}>Pot Name</Text>
              <Text style={styles.potName}>{store.title || 'Untitled Pot'}</Text>
              <Text style={styles.potAmount}>₦{totalNaira.toLocaleString()}</Text>

              <View style={styles.readyBadge}>
                <View style={styles.readyDot} />
                <Text style={styles.readyText}>Ready to create</Text>
              </View>
            </View>

            <View style={styles.identityDivider} />
            <View style={styles.identityFooter}>
              <Text style={styles.dueLabel}>Due</Text>
              <View style={styles.dueRight}>
                <Text style={styles.dueDate}>
                  {store.deadlineAt
                    ? new Date(store.deadlineAt).toLocaleDateString()
                    : 'No deadline'}
                </Text>
                {daysRemaining != null && daysRemaining > 0 && (
                  <View style={styles.daysBadge}>
                    <Text style={styles.daysBadgeText}>{daysRemaining}d</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Detail Card */}
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Target Amount</Text>
              <Text style={styles.detailValue}>₦{totalNaira.toLocaleString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Split Type</Text>
              <View style={styles.splitBadge}>
                <Text style={styles.splitBadgeText}>
                  {store.splitMode === 'weight' ? 'Equal' : 'Custom'}
                </Text>
              </View>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Your Share</Text>
              <Text style={styles.detailValue}>₦{Math.round(getMemberShare(0)).toLocaleString()}</Text>
            </View>
          </View>

          {/* Members Card */}
          <View style={styles.membersCard}>
            <View style={styles.membersHeader}>
              <Text style={styles.membersTitle}>Members · {store.splits.length}</Text>
              <Pressable onPress={() => navigation.goBack()} style={styles.membersAddBtn}>
                <Text style={styles.membersAdd}>+ Add</Text>
              </Pressable>
            </View>
            {store.splits.map((s, i) => (
              <View
                key={i}
                style={[
                  styles.memberRow,
                  i < store.splits.length - 1 && styles.memberRowBorder,
                ]}
              >
                <Image
                  source={avatarSources[(i + 3) % avatarSources.length]}
                  style={i === 0 ? styles.memberAvatarOrgImg : styles.memberAvatarImg}
                />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{s.label}</Text>
                  <Text style={styles.memberAmount}>₦{Math.round(getMemberShare(i)).toLocaleString()}</Text>
                </View>
                {i === 0 ? (
                  <View style={styles.organizerBadge}>
                    <Text style={styles.organizerText}>Organizer</Text>
                  </View>
                ) : (
                  <Text style={styles.memberHandle}>@{(s.label || 'user').toLowerCase().replace(/\s/g, '')}</Text>
                )}
              </View>
            ))}
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Confirm Button */}
          <View style={styles.ctaWrap}>
            <Button
              title="Confirm Pot"
              onPress={handleConfirm}
              loading={isPending}
              disabled={isPending}
              icon={<Icon name="check" size={18} color={colors.fg} strokeWidth={2.5} />}
              textStyle={styles.confirmBtnText}
            />
          </View>

          <Text style={styles.note}>
            Members will be notified once created. You can edit until the first contribution is made.
          </Text>
        </View>

        {/* Home indicator */}
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 60 },
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing['5'] + 4, paddingTop: spacing['2'], paddingBottom: spacing['4'] },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radius.base },
  backArrow: { fontSize: 22, color: colors.fg },
  headerTitle: { fontSize: 17, fontWeight: typography.weights.black, color: colors.fg, letterSpacing: -0.17 },
  // Content
  content: { paddingHorizontal: spacing['5'] + 4 },
  // Identity Card
  identityCard: { borderWidth: 2, borderColor: colors.fg, borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden', ...shadows.brutMd, marginBottom: spacing['4'] },
  identityBody: { padding: spacing['5'], paddingBottom: spacing['4'], alignItems: 'center' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing['3'] },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.fg, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarOrganizer: { backgroundColor: colors.accent },
  avatarTextOrg: { fontSize: 15, fontWeight: typography.weights.black, color: colors.fg },
  avatarImg: { width: '100%', height: '100%', borderRadius: 18 },
  potLabel: { fontSize: 12, fontWeight: typography.weights.bold, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1 },
  potName: { fontSize: 20, fontWeight: typography.weights.black, color: colors.fg, marginTop: 2, letterSpacing: -0.3 },
  potAmount: { fontSize: 28, fontWeight: typography.weights.black, color: colors.fg, marginTop: 4 },
  readyBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing['1.5'], paddingVertical: 3, paddingHorizontal: 10, borderRadius: 12, backgroundColor: '#DCFCE7' },
  readyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#166534' },
  readyText: { fontSize: 11, fontWeight: typography.weights.bold, color: '#166534' },
  identityDivider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing['5'] },
  identityFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: spacing['5'] },
  dueLabel: { fontSize: 12, fontWeight: '600', color: colors.muted },
  dueRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dueDate: { fontSize: 12, fontWeight: typography.weights.bold, color: colors.fg },
  daysBadge: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, backgroundColor: '#FEF2F2' },
  daysBadgeText: { fontSize: 10, fontWeight: typography.weights.bold, color: colors.danger },
  // Detail Card
  detailCard: { borderWidth: 2, borderColor: colors.fg, borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden', ...shadows.brutMd, marginBottom: spacing['4'] },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLabel: { fontSize: 13, fontWeight: '600', color: colors.muted },
  detailValue: { fontSize: 15, fontWeight: typography.weights.black, color: colors.fg },
  splitBadge: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 6, backgroundColor: 'rgba(17,24,39,0.05)' },
  splitBadgeText: { fontSize: 13, fontWeight: typography.weights.bold, color: colors.fg, letterSpacing: 0.26 },
  // Members Card
  membersCard: { borderWidth: 2, borderColor: colors.fg, borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden', ...shadows.brutSm, marginBottom: spacing['6'] },
  membersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: 'rgba(17,24,39,0.02)' },
  membersTitle: { fontSize: 11, fontWeight: typography.weights.extrabold, textTransform: 'uppercase', letterSpacing: 0.88, color: colors.fg },
  membersAddBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  membersAdd: { fontSize: 12, fontWeight: typography.weights.bold, color: colors.fg },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 18 },
  memberRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  memberAvatarImg: { width: 36, height: 36, borderRadius: 18 },
  memberAvatarOrgImg: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.fg },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 13, fontWeight: typography.weights.bold, color: colors.fg },
  memberAmount: { fontSize: 11, color: colors.muted },
  organizerBadge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4, backgroundColor: 'rgba(17,24,39,0.05)' },
  organizerText: { fontSize: 10, fontWeight: typography.weights.bold, color: colors.muted, letterSpacing: 0.2 },
  memberHandle: { fontSize: 11, fontWeight: '600', color: colors.muted },
  // Error
  errorText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.danger, textAlign: 'center', marginBottom: spacing['2'] },
  // CTA
  ctaWrap: { marginBottom: spacing['2.5'] },
  confirmBtnText: { fontSize: 15, letterSpacing: 0.3 },
  note: { fontSize: 11, color: colors.muted, textAlign: 'center', lineHeight: 16.5, letterSpacing: 0.11 },
  // Home indicator
  homeIndicator: { height: 20, alignItems: 'center', justifyContent: 'center' },
  homeIndicatorBar: { width: 120, height: 4, backgroundColor: colors.fg, borderRadius: 2 },
});
