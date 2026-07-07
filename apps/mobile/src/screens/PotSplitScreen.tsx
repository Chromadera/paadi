import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Modal, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCreatePotStore, SplitInput } from '../../features/create-pot/store';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { Icon } from '../components/Icon';
import { RootStackParamList } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function DatePickerModal({
  visible,
  date,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  date: Date;
  onConfirm: (d: Date) => void;
  onCancel: () => void;
}) {
  const [d, setD] = React.useState(date);
  React.useEffect(() => { setD(date); }, [date]);

  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();

  const years = Array.from({ length: 10 }, (_, i) => year - 2 + i);
  const days = Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => i + 1);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={dateStyles.overlay}>
        <View style={dateStyles.sheet}>
          <View style={dateStyles.header}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={dateStyles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConfirm(d)}>
              <Text style={dateStyles.doneBtn}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={dateStyles.pickers}>
            <View style={dateStyles.column}>
              <Text style={dateStyles.colLabel}>Month</Text>
              <ScrollView style={dateStyles.scrollCol}>
                {MONTHS.map((m, i) => (
                  <TouchableOpacity
                    key={m}
                    style={[dateStyles.item, i === month && dateStyles.itemActive]}
                    onPress={() => setD(new Date(year, i, Math.min(day, new Date(year, i + 1, 0).getDate())))}
                  >
                    <Text style={[dateStyles.itemText, i === month && dateStyles.itemTextActive]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={dateStyles.column}>
              <Text style={dateStyles.colLabel}>Day</Text>
              <ScrollView style={dateStyles.scrollCol}>
                {days.map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={[dateStyles.item, v === day && dateStyles.itemActive]}
                    onPress={() => setD(new Date(year, month, v))}
                  >
                    <Text style={[dateStyles.itemText, v === day && dateStyles.itemTextActive]}>{v}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={dateStyles.column}>
              <Text style={dateStyles.colLabel}>Year</Text>
              <ScrollView style={dateStyles.scrollCol}>
                {years.map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={[dateStyles.item, v === year && dateStyles.itemActive]}
                    onPress={() => setD(new Date(v, month, Math.min(day, new Date(v, month + 1, 0).getDate())))}
                  >
                    <Text style={[dateStyles.itemText, v === year && dateStyles.itemTextActive]}>{v}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const dateStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { backgroundColor: colors.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing['4'], borderBottomWidth: 1, borderBottomColor: colors.border },
  cancelBtn: { fontSize: typography.sizes.base, color: colors.muted },
  doneBtn: { fontSize: typography.sizes.base, fontWeight: typography.weights.bold, color: colors.fg },
  pickers: { flexDirection: 'row', padding: spacing['2'] },
  column: { flex: 1, alignItems: 'center' },
  colLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.muted, textTransform: 'uppercase', marginBottom: 4 },
  scrollCol: { maxHeight: 200 },
  item: { paddingVertical: 10, paddingHorizontal: spacing['4'], borderRadius: 10 },
  itemActive: { backgroundColor: colors.accent },
  itemText: { fontSize: typography.sizes.base, color: colors.fg },
  itemTextActive: { fontWeight: typography.weights.bold },
});

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

type SplitMode = 'weight' | 'amount' | 'percent';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PotSplitScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const store = useCreatePotStore();

  const [potTitle, setPotTitle] = useState(store.title);
  const [description, setDescription] = useState(store.description);
  const [totalAmount, setTotalAmount] = useState(
    store.totalKobo ? (store.totalKobo / 100).toString() : '',
  );
  const [dueDate, setDueDate] = useState<Date | null>(
    store.deadlineAt ? new Date(store.deadlineAt) : null,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [splitMode, setSplitMode] = useState<SplitMode>(store.splitMode as SplitMode);
  const [splits, setSplits] = useState<SplitInput[]>(
    store.splits.length > 0 ? store.splits : [
      { label: 'Organizer', weight: 1 },
      { label: 'Friend 1', weight: 1 },
    ],
  );

  useEffect(() => {
    const kobo = Math.round((parseFloat(totalAmount) || 0) * 100);
    store.setField('title', potTitle);
    store.setField('description', description);
    store.setField('totalKobo', kobo);
    if (dueDate && !isNaN(dueDate.getTime())) {
      store.setField('deadlineAt', dueDate.toISOString());
    }
    store.setField('splitMode', splitMode);
    store.setField('splits', splits);
  }, [potTitle, description, totalAmount, splitMode, splits]);

  function handleSplitChange(index: number, key: keyof SplitInput, val: any) {
    const next = [...splits];
    next[index] = { ...next[index], [key]: val };
    setSplits(next);
  }

  function handleRemoveFriend(index: number) {
    if (splits.length <= 2) return;
    setSplits(splits.filter((_, i) => i !== index));
  }

  function handleAddFriend() {
    if (splits.length >= 50) return;
    setSplits([...splits, { label: `Friend ${splits.length}`, weight: 1 }]);
  }

  function handleContinue() {
    navigation.navigate('PotReview' as any);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* App Header Bar */}
      <View style={styles.appHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back"
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.appHeaderLabel}>Pot Details</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Page Title Row — pinned outside scroll */}
      <View style={styles.pageTitleRow}>
        <Text style={styles.pageTitle}>Pot Details</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Step 2/3</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Pot Details Card */}
        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Pot Title</Text>
            <TextInput
              style={styles.input}
              value={potTitle}
              onChangeText={setPotTitle}
              placeholder="e.g. IKEDC Bill, Data Subscription"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Description <Text style={styles.labelOptional}>(optional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="What's this pot for?"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <View style={[styles.field, { marginBottom: spacing['2'] }]}>
            <Text style={styles.label}>
              Due Date <Text style={styles.labelOptional}>(optional)</Text>
            </Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={dueDate ? styles.inputText : styles.inputPlaceholder}>
                {dueDate ? dueDate.toLocaleDateString() : 'Select a date'}
              </Text>
            </TouchableOpacity>
            <DatePickerModal
              visible={showDatePicker}
              date={dueDate || new Date()}
              onConfirm={(d) => { setDueDate(d); setShowDatePicker(false); }}
              onCancel={() => setShowDatePicker(false)}
            />
          </View>

          <View style={[styles.field, { marginBottom: spacing['2'] }]}>
            <Text style={styles.label}>Total Pot Amount (₦)</Text>
            <TextInput
              style={styles.input}
              value={totalAmount}
              onChangeText={setTotalAmount}
              placeholder="0.00"
              placeholderTextColor={colors.placeholder}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Split Formula Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Split Formula</Text>

          {/* Split Mode Tabs */}
          <View style={styles.tabRow}>
            {(['weight', 'amount', 'percent'] as SplitMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.tab, splitMode === mode && styles.tabActive]}
                onPress={() => {
                  setSplitMode(mode);
                  setSplits(splits.map((s) => {
                    if (mode === 'weight') return { label: s.label, weight: s.weight || 1 };
                    if (mode === 'amount') return { label: s.label, amountKobo: s.amountKobo || 0 };
                    return { label: s.label, percent: s.percent || 0 };
                  }));
                }}
              >
                <Text style={[styles.tabText, splitMode === mode && styles.tabTextActive]}>
                  {mode === 'weight' ? 'Weight (Equal)' : mode === 'amount' ? 'Amount (Naira)' : 'Percent (%)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Friends Header */}
          <Text style={styles.friendsHeader}>Friends ({splits.length}/50)</Text>

          {/* Friends List */}
          <View style={styles.friendsList}>
            {splits.map((s, i) => (
              <View key={i} style={styles.friendRow}>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemoveFriend(i)}
                  disabled={splits.length <= 2}
                  accessibilityLabel={`Remove ${s.label}`}
                >
                  <Icon
                    name="trash"
                    size={14}
                    color={splits.length <= 2 ? colors.borderSubtle : colors.muted}
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>

                {/* Avatar — uses Image for all rows (matches HTML) */}
                <Image
                  source={avatarSources[(i + 3) % avatarSources.length]}
                  style={styles.avatarImg}
                />

                <TextInput
                  style={i === 0 ? styles.friendNameInputOrg : styles.friendNameInput}
                  value={s.label}
                  onChangeText={(t) => handleSplitChange(i, 'label', t)}
                  placeholder={i === 0 ? 'Organizer' : `Friend ${i}`}
                  placeholderTextColor={colors.placeholder}
                />

                {/* Stepper Input */}
                <View style={styles.stepperWrap}>
                  <TextInput
                    style={styles.stepperInput}
                    value={splitMode === 'weight' ? (s.weight || 1).toString()
                      : splitMode === 'amount' ? ((s.amountKobo || 0) / 100).toString()
                      : (s.percent || 0).toString()}
                    onChangeText={(t) => {
                      const v = parseFloat(t) || 0;
                      if (splitMode === 'weight') handleSplitChange(i, 'weight', v);
                      else if (splitMode === 'amount') handleSplitChange(i, 'amountKobo', Math.round(v * 100));
                      else handleSplitChange(i, 'percent', Math.round(v));
                    }}
                    keyboardType="numeric"
                    placeholderTextColor={colors.placeholder}
                  />
                  <View style={styles.stepperArrows}>
                    <TouchableOpacity
                      onPress={() => {
                        const v = splitMode === 'weight' ? (s.weight || 1) + 1
                          : splitMode === 'amount' ? Math.round((s.amountKobo || 0) / 100) + 100
                          : (s.percent || 0) + 1;
                        if (splitMode === 'weight') handleSplitChange(i, 'weight', v);
                        else if (splitMode === 'amount') handleSplitChange(i, 'amountKobo', Math.round(v * 100));
                        else handleSplitChange(i, 'percent', Math.round(v));
                      }}
                    >
                      <Icon name="chevronUp" size={12} color={colors.muted} strokeWidth={2} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        const v = Math.max(0, (splitMode === 'weight' ? (s.weight || 1) - 1
                          : splitMode === 'amount' ? Math.round((s.amountKobo || 0) / 100) - 100
                          : (s.percent || 0) - 1));
                        if (splitMode === 'weight') handleSplitChange(i, 'weight', v);
                        else if (splitMode === 'amount') handleSplitChange(i, 'amountKobo', Math.round(v * 100));
                        else handleSplitChange(i, 'percent', Math.round(v));
                      }}
                    >
                      <Icon name="chevronDown" size={12} color={colors.muted} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Add Friend Button */}
          <TouchableOpacity style={styles.addFriendBtn} onPress={handleAddFriend}>
            <Text style={styles.addFriendText}>+ Add Friend</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Pill Button */}
        <TouchableOpacity style={styles.pillBtn} onPress={handleContinue}>
          <Text style={styles.pillBtnText}>Continue to Review</Text>
          <Icon name="arrowRight" size={16} color={colors.fg} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={{ height: 64 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  // App Header
  appHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing['1'], paddingTop: spacing['2'], paddingBottom: 10 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: typography.sizes.xl, color: colors.fg },
  appHeaderLabel: { fontSize: typography.sizes['sm-'], fontWeight: typography.weights.semibold, color: colors.muted, letterSpacing: 0.88, textTransform: 'uppercase' },
  // Page Title Row — pinned above scroll
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: spacing['1'], marginBottom: spacing['4'] },
  pageTitle: { fontSize: typography.sizes['2xl-'], fontWeight: typography.weights.black, color: colors.fg, letterSpacing: -0.22 },
  stepBadge: { backgroundColor: colors.settlementIconBg, paddingVertical: spacing['1'], paddingHorizontal: spacing['3'], borderRadius: 20 },
  stepBadgeText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.fg, letterSpacing: 0.24 },
  // Scroll
  scroll: { paddingHorizontal: 12 },
  // Cards
  card: { borderWidth: 1, borderColor: 'rgba(17,24,39,0.08)', borderRadius: 16, backgroundColor: colors.surface, padding: spacing['4'], paddingBottom: spacing['2'], marginBottom: spacing['4'] },
  cardTitle: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: spacing['3'] },
  // Fields
  field: { marginBottom: spacing['4'] },
  label: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: spacing['1.5'] },
  labelOptional: { fontWeight: '500', textTransform: 'none', letterSpacing: 0 },
  input: { width: '100%', paddingVertical: 12, paddingHorizontal: 14, borderWidth: 2, borderColor: colors.fg, borderRadius: 10, fontSize: typography.sizes.base, fontWeight: typography.weights.semibold, color: colors.fg, backgroundColor: colors.surface },
  inputText: { fontSize: typography.sizes.base, fontWeight: typography.weights.semibold, color: colors.fg },
  inputPlaceholder: { fontSize: typography.sizes.base, fontWeight: typography.weights.semibold, color: colors.placeholder },
  // Tabs
  tabRow: { flexDirection: 'row', gap: 4, backgroundColor: colors.segmentedBg, borderRadius: 10, padding: 3, marginBottom: spacing['4'] },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing['2'], paddingHorizontal: spacing['1'], borderRadius: 8 },
  tabActive: { backgroundColor: colors.settlementIconBg },
  tabText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.muted },
  tabTextActive: { fontWeight: typography.weights.bold, color: colors.fg },
  // Friends
  friendsHeader: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  friendsList: { gap: 8, marginBottom: spacing['3'] },
  friendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  removeBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  avatarImg: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: colors.fg },
  friendNameInput: { flex: 1, fontSize: typography.sizes.base, fontWeight: typography.weights.bold, color: colors.fg, paddingVertical: 4, paddingHorizontal: 0 },
  friendNameInputOrg: { flex: 1, fontSize: typography.sizes.base, fontWeight: typography.weights.extrabold, color: colors.fg, paddingVertical: 4, paddingHorizontal: 0 },
  stepperWrap: { flexDirection: 'row', alignItems: 'center', width: 100 },
  stepperInput: { flex: 1, paddingVertical: 8, paddingLeft: 12, paddingRight: 32, borderWidth: 2, borderColor: colors.fg, borderRadius: 8, fontSize: typography.sizes['base-'], fontWeight: typography.weights.bold, color: colors.fg, backgroundColor: colors.surface, textAlign: 'right' },
  stepperArrows: { position: 'absolute', right: 6, top: 0, bottom: 0, justifyContent: 'center' },
  // Add Friend
  addFriendBtn: { width: '100%', paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1.5, borderColor: 'rgba(17,24,39,0.15)', borderStyle: 'dashed', borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center' },
  addFriendText: { fontSize: typography.sizes['base-'], fontWeight: typography.weights.bold, color: colors.muted, letterSpacing: 0.13 },
  // Pill Button
  pillBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', paddingVertical: 15, backgroundColor: colors.accent, borderWidth: 2, borderColor: colors.fg, borderRadius: radius.full, ...shadows.brutSm },
  pillBtnText: { fontSize: typography.sizes['lg-'], fontWeight: typography.weights.black, color: colors.fg, letterSpacing: 0.3 },
});
