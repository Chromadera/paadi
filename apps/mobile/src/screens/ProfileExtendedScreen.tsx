import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icon';
import { useMe } from '@/features/settings/profile-hooks';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileExtendedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data: me } = useMe();
  const displayName = me?.profile?.displayName ?? `${me?.profile?.firstName ?? ''} ${me?.profile?.lastName ?? ''}`.trim();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <ScreenHeader
          title="Profile"
          rightElement={
            <Pressable onPress={() => navigation.navigate('Settings')}>
              <Icon name="settings" size={18} color={colors.fg} strokeWidth={2.5} />
            </Pressable>
          }
        />

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Avatar
            index={1}
            size={72}
            showBorder
            style={styles.profileAvatar}
          />
          <Text style={styles.profileName}>{displayName || 'User'}</Text>
          <Text style={styles.profileHandle}>{me?.phoneMasked ?? ''}</Text>

          {/* KYC Unverified Badge */}
          {me?.tier === 'TIER_0' && (
            <View style={styles.kycBadge}>
              <View style={styles.kycDot} />
              <Text style={styles.kycBadgeText}>Unverified</Text>
            </View>
          )}
        </View>

        {/* Stats Card */}
        <View style={styles.statsWrapper}>
          <View style={styles.statsCard}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>POTS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>₦284K</Text>
              <Text style={styles.statLabel}>PAID</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>FRIENDS</Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuWrapper}>
          <View style={styles.menuCard}>
            {[
              { icon: 'settings' as const, label: 'Settings', screen: 'Settings' as const, subLabel: undefined },
              { icon: 'shield' as const, label: 'Verification', screen: 'Verification' as const, subLabel: 'Incomplete' },
              { icon: 'gift' as const, label: 'Refer & Earn', screen: undefined, subLabel: undefined },
              { icon: 'info' as const, label: 'Support', screen: undefined, subLabel: undefined },
            ].map((item, i, arr) => (
              <Pressable
                key={item.label}
                style={[
                  styles.menuItem,
                  i < arr.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => item.screen && navigation.navigate(item.screen)}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconContainer}>
                    <Icon name={item.icon} size={16} color={colors.fg} strokeWidth={2} />
                  </View>
                  {item.subLabel ? (
                    <View>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      <Text style={styles.menuSubLabel}>{item.subLabel}</Text>
                    </View>
                  ) : (
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  )}
                </View>
                <Icon name="chevronRight" size={18} color={colors.muted} strokeWidth={2} />
              </Pressable>
            ))}
          </View>
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
    paddingBottom: 60,
  },

  // Profile Section (matches HTML: padding: 16px 4px, text-align: center)
  profileSection: {
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['1'],
    alignItems: 'center',
  },
  profileAvatar: {
    borderWidth: 3,
    borderColor: colors.fg,
    // Override brutMd shadow from Avatar component — HTML has no shadow
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  profileName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.black,
    color: colors.fg,
    marginTop: spacing['3'],
  },
  profileHandle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing['0.5'],
  },

  // KYC Badge (red pill)
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1.5'],
    marginTop: spacing['2'],
    paddingVertical: spacing['1'],
    paddingHorizontal: spacing['3'],
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
  },
  kycDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#991B1B',
  },
  kycBadgeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#991B1B',
  },

  // Stats Card (matches HTML: border 2px fg, radius 16px, shadow 2px 2px 0 0)
  statsWrapper: {
    paddingHorizontal: spacing['1'],
    marginTop: spacing['4'],
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    padding: spacing['4'],
    ...shadows.brutSm,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.black,
    color: colors.fg,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.muted,
    letterSpacing: 0.3,
    marginTop: 2,
  },

  // Menu Section (matches HTML: border 2px fg, radius 16px, shadow 2px 2px 0 0)
  menuWrapper: {
    paddingHorizontal: spacing['1'],
    marginTop: spacing['5'],
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.brutSm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing['4'],
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  menuSubLabel: {
    fontSize: typography.sizes.sm,
    color: colors.accent,
    marginTop: 1,
  },
});
