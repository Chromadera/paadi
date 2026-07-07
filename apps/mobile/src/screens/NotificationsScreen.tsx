import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows, componentSizes } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NotifSetting {
  id: string;
  label: string;
  section: 'push' | 'email';
  enabled: boolean;
}

// ── Toggle Switch ──────────────────────────────────────────────────────
// Matches HTML: 48×28 track, 24px handle, 14px radius
// On: fg background, handle at right. Off: border color, handle at left.
const ToggleSwitch: React.FC<{ value: boolean; onToggle: () => void }> = ({ value, onToggle }) => (
  <Pressable
    onPress={onToggle}
    style={[
      toggleStyles.track,
      { backgroundColor: value ? colors.fg : colors.border },
    ]}
  >
    <View
      style={[
        toggleStyles.handle,
        value ? toggleStyles.handleOn : toggleStyles.handleOff,
      ]}
    />
  </Pressable>
);

const toggleStyles = StyleSheet.create({
  track: {
    width: componentSizes.toggleTrack.width,
    height: componentSizes.toggleTrack.height,
    borderRadius: 14,
    justifyContent: 'center',
    flexShrink: 0,
  },
  handle: {
    width: componentSizes.toggleHandle.size,
    height: componentSizes.toggleHandle.size,
    borderRadius: componentSizes.toggleHandle.size / 2,
    backgroundColor: colors.surface,
    position: 'absolute',
    top: 2,
  },
  handleOn: { right: 2 },
  handleOff: { left: 2 },
});

// ── Section Card ───────────────────────────────────────────────────────

const SectionCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={sectionStyles.card}>
    {children}
  </View>
);

const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.brutSm,
    marginBottom: spacing['4'],
  },
});

// ── Screen ─────────────────────────────────────────────────────────────

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [settings, setSettings] = useState<NotifSetting[]>([
    { id: 'payments', label: 'Payment Updates', section: 'push', enabled: true },
    { id: 'invites', label: 'Pot Invites', section: 'push', enabled: true },
    { id: 'reminders', label: 'Due Date Reminders', section: 'push', enabled: true },
    { id: 'promotions', label: 'Promotions', section: 'push', enabled: false },
    { id: 'weekly', label: 'Weekly Summary', section: 'email', enabled: true },
    { id: 'marketing', label: 'Marketing', section: 'email', enabled: false },
  ]);

  const toggle = (id: string) => {
    setSettings(settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const pushItems = settings.filter((s) => s.section === 'push');
  const emailItems = settings.filter((s) => s.section === 'email');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ScreenHeader title="Notifications" onBack={() => navigation.goBack()} />

        {/* Push Notifications */}
        <SectionCard>
          <Text style={styles.sectionHeader}>Push Notifications</Text>
          {pushItems.map((item, i) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                i < pushItems.length - 1 && styles.itemDivider,
              ]}
            >
              <Text style={styles.itemLabel}>{item.label}</Text>
              <ToggleSwitch
                value={item.enabled}
                onToggle={() => toggle(item.id)}
              />
            </View>
          ))}
        </SectionCard>

        {/* Email Notifications */}
        <SectionCard>
          <Text style={styles.sectionHeader}>Email Notifications</Text>
          {emailItems.map((item, i) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                i < emailItems.length - 1 && styles.itemDivider,
              ]}
            >
              <Text style={styles.itemLabel}>{item.label}</Text>
              <ToggleSwitch
                value={item.enabled}
                onToggle={() => toggle(item.id)}
              />
            </View>
          ))}
        </SectionCard>
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
    paddingHorizontal: layoutScreenPadding,
    paddingBottom: spacing['8'],
    paddingTop: spacing['0'],
  },

  // ── Section Header ───────────────────────────────────────────────────
  sectionHeader: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBg,
  },

  // ── Item Row ─────────────────────────────────────────────────────────
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['4'],
    gap: spacing['3'],
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBg,
  },
  itemLabel: {
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.bold,
    color: colors.settingsText,
    flex: 1,
  },
});

const layoutScreenPadding = 20;
