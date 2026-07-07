import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCreatePot } from '../../features/create-pot/hooks';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types';
import { Icon } from '../components/Icon';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type SplitType = 'equal' | 'custom';

export const PotCreationOtherScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [potName, setPotName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const createPot = useCreatePot();

  function handleCreatePot() {
    const amountKobo = parseFloat(targetAmount.replace(/,/g, '')) * 100;
    if (!potName.trim() || isNaN(amountKobo) || amountKobo <= 0) return;

    createPot.mutate(
      {
        input: {
          title: potName.trim(),
          description: description.trim() || undefined,
          totalKobo: Math.round(amountKobo),
          settlementType: 'wallet',
          completionRule: 'progressive',
          splitMode: 'weight',
          splits: [{ label: 'Organizer', weight: 1 }],
          ...(dueDate ? { deadlineAt: new Date(dueDate).toISOString() } : {}),
        },
        idempotencyKey: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      },
      {
        onSuccess: () => navigation.navigate('PotsTab' as any),
      },
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Back header: ←  Create Pot  (spacer) ── */}
        <View style={styles.backHeader}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevronLeft" size={20} color={colors.fg} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.backHeaderTitle}>Create Pot</Text>
          <View style={styles.backSpacer} />
        </View>

        {/* ── Tab row: Bill Payment | Other ── */}
        <View style={styles.tabSection}>
          <View style={styles.tabRow}>
            <Pressable
              style={styles.tabInactive}
              onPress={() => navigation.navigate('CreatePot' as any)}
            >
              <Text style={styles.tabTextInactive}>Bill Payment</Text>
            </Pressable>
            <View style={styles.tabActive}>
              <Text style={styles.tabTextActive}>Other</Text>
            </View>
          </View>
        </View>

        {/* ── Form section ── */}
        <View style={styles.formSection}>
          {/* Pot Name */}
          <Text style={[styles.cardLabel, { marginTop: 0 }]}>Pot Name</Text>
          <Input
            placeholder="e.g. Weekend Trip"
            value={potName}
            onChangeText={setPotName}
            containerStyle={styles.fieldSpacing}
          />

          {/* Target Amount */}
          <Text style={styles.cardLabel}>Target Amount</Text>
          <Input
            placeholder="₦0.00"
            keyboardType="numeric"
            value={targetAmount}
            onChangeText={setTargetAmount}
            containerStyle={styles.fieldSpacing}
          />

          {/* Description */}
          <Text style={styles.cardLabel}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="What is this pot for?"
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />

          {/* Due Date */}
          <Text style={styles.cardLabel}>Due Date</Text>
          <Input
            placeholder="YYYY-MM-DD"
            value={dueDate}
            onChangeText={setDueDate}
            containerStyle={styles.fieldSpacing}
          />

          {/* Split Type */}
          <Text style={styles.cardLabel}>Split Type</Text>
          <View style={styles.splitRow}>
            <Pressable
              style={[
                styles.splitBtn,
                splitType === 'equal' ? styles.splitBtnActive : styles.splitBtnInactive,
              ]}
              onPress={() => setSplitType('equal')}
            >
              <Text
                style={[
                  styles.splitBtnText,
                  splitType === 'equal' ? styles.splitBtnTextActive : styles.splitBtnTextInactive,
                ]}
              >
                Equal
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.splitBtn,
                splitType === 'custom' ? styles.splitBtnActive : styles.splitBtnInactive,
              ]}
              onPress={() => setSplitType('custom')}
            >
              <Text
                style={[
                  styles.splitBtnText,
                  splitType === 'custom' ? styles.splitBtnTextActive : styles.splitBtnTextInactive,
                ]}
              >
                Custom
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ── Create button ── */}
        <View style={styles.buttonWrap}>
          <Button
            title="Create Pot"
            onPress={handleCreatePot}
            disabled={!potName.trim() || !targetAmount || createPot.isPending}
            loading={createPot.isPending}
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
  scroll: {
    paddingHorizontal: spacing['5'],
    paddingBottom: spacing['16'],
  },

  // ── Back header (matches ios-header pattern from HTML) ──
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

  // ── Tab row ──
  tabSection: {
    paddingHorizontal: spacing['1'],
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing['2'],
    marginBottom: spacing['4'],
  },
  tabActive: {
    flex: 1,
    paddingVertical: spacing['2.5'],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.base,
    backgroundColor: colors.surface,
    ...shadows.brutSm,
  },
  tabInactive: {
    flex: 1,
    paddingVertical: spacing['2.5'],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.base,
    backgroundColor: colors.surface,
  },
  tabTextActive: {
    fontSize: typography.sizes['base-'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  tabTextInactive: {
    fontSize: typography.sizes['base-'],
    fontWeight: typography.weights.bold,
    color: colors.muted,
  },

  // ── Form ──
  formSection: {
    paddingHorizontal: spacing['1'],
  },
  cardLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    color: colors.muted,
    marginTop: spacing['4'],
    marginBottom: spacing['1'],
  },
  fieldSpacing: {
    marginTop: spacing['2'],
  },

  // ── Textarea ──
  textArea: {
    width: '100%',
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['3.5'],
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.base,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.fg,
    backgroundColor: colors.surface,
    marginTop: spacing['2'],
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // ── Split type ──
  splitRow: {
    flexDirection: 'row',
    gap: spacing['2'],
    marginTop: spacing['2'],
  },
  splitBtn: {
    flex: 1,
    paddingVertical: spacing['3'],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.base,
  },
  splitBtnActive: {
    borderWidth: 2,
    borderColor: colors.fg,
    backgroundColor: colors.surface,
    ...shadows.brutSm,
  },
  splitBtnInactive: {
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  splitBtnText: {
    fontSize: typography.sizes['base-'],
    fontWeight: typography.weights.bold,
  },
  splitBtnTextActive: {
    color: colors.fg,
  },
  splitBtnTextInactive: {
    color: colors.muted,
  },

  // ── Button wrap ──
  buttonWrap: {
    paddingTop: spacing['4'],
    paddingHorizontal: spacing['1'],
  },
});
