import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows, componentSizes } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icon';
import { useMe } from '@/features/settings/profile-hooks';
import { RootStackParamList, MainTabParamList } from '../types';

type NavigationProp = BottomTabNavigationProp<MainTabParamList> &
  NativeStackNavigationProp<RootStackParamList>;

const menuItems = [
  { icon: 'settings' as const, label: 'Edit Profile', screen: 'EditProfile' },
  { icon: 'bank' as const, label: 'Payout Accounts', screen: 'PotBankPicker' },
  { icon: 'lock' as const, label: 'Security & PIN', screen: 'Security' },
  { icon: 'bell' as const, label: 'Notifications', screen: 'Notifications' },
];

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data: me } = useMe();
  const displayName = me?.profile?.displayName ?? `${me?.profile?.firstName ?? ''} ${me?.profile?.lastName ?? ''}`.trim();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <ScreenHeader title="Profile" />

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Avatar index={1} size={componentSizes.avatar.xl} />
          <Text style={styles.name}>{displayName || 'User'}</Text>
          <Text style={styles.handle}>{me?.phoneMasked ?? ''}</Text>

          {/* KYC Banner */}
          {me?.tier === 'TIER_0' && (
            <View style={styles.kycBanner}>
              <View style={styles.kycTier}>
                <Icon name="shield" size={16} color={colors.warningDark} strokeWidth={2.5} />
                <Text style={styles.kycTierText}>Tier 0 (Unverified)</Text>
              </View>
              <Text style={styles.kycDesc}>
                Verify your identity to increase transaction limits and enable direct bank withdrawals.
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.kycBtn,
                  pressed && styles.kycBtnPressed,
                ]}
                onPress={() => navigation.navigate('Verification')}
              >
                <Text style={styles.kycBtnText}>Verify Identity</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {menuItems.map((item, i) => (
            <Pressable
              key={item.label}
              style={[
                styles.settingsItem,
                i < menuItems.length - 1 && styles.settingsItemBorder,
              ]}
              onPress={() => navigation.navigate(item.screen as any)}
            >
              <Icon name={item.icon} size={18} color={colors.muted60} strokeWidth={2.25} />
              <Text style={styles.settingsLabel}>{item.label}</Text>
              <Icon name="chevronRight" size={16} color={colors.chevronMuted} strokeWidth={2} />
            </Pressable>
          ))}

          {/* Logout */}
          <Pressable
            style={styles.settingsItem}
            onPress={() => navigation.navigate('OnboardingStart')}
          >
            <Icon name="logout" size={18} color={colors.danger} strokeWidth={2.25} />
            <Text style={styles.logoutLabel}>Log Out</Text>
          </Pressable>
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
    paddingBottom: 120,
  },

  // Profile Card (matches card-lg from HTML)
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing['5'],
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    alignItems: 'center',
  },
  name: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.black,
    color: colors.fg,
    marginTop: spacing['4'],
  },
  handle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.muted,
    marginTop: spacing['1'],
  },

  // KYC Banner (inside profile card)
  kycBanner: {
    marginTop: spacing['5'],
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    borderRadius: radius.base,
    padding: spacing['4'],
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  kycTier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1.5'],
  },
  kycTierText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.warningDark,
  },
  kycDesc: {
    fontSize: 11,
    fontWeight: typography.weights.semibold,
    color: colors.kycArrow,
    marginTop: spacing['2'],
    lineHeight: 11 * 1.5,
    textAlign: 'center',
  },
  kycBtn: {
    marginTop: spacing['4'],
    paddingVertical: spacing['2.5'],
    alignSelf: 'stretch',
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    ...shadows.brutSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kycBtnPressed: {
    transform: [{ translateY: 1 }],
    ...shadows.btnSmActive,
  },
  kycBtnText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.black,
    color: colors.fg,
  },

  // Settings List (matches .settings-list from HTML)
  settingsList: {
    marginTop: spacing['5'],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3.5'],
    paddingVertical: 15,
    paddingHorizontal: spacing['4'],
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBg,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: colors.settingsText,
  },
  logoutLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: colors.danger,
  },
});
