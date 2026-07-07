import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export type TabName = 'home' | 'pots' | 'activity' | 'profile';

interface BottomNavProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  onCenterPress?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabPress,
  onCenterPress,
}) => {
  const tabs: { name: TabName; label: string; icon: IconName }[] = [
    { name: 'home', label: 'Home', icon: 'home' },
    { name: 'pots', label: 'Pots', icon: 'grid' },
    { name: 'activity', label: 'Activity', icon: 'activity' },
    { name: 'profile', label: 'Profile', icon: 'user' },
  ];

  return (
    <View style={styles.container}>
      {tabs.slice(0, 2).map((tab) => (
        <Pressable
          key={tab.name}
          onPress={() => onTabPress(tab.name)}
          style={styles.tab}
        >
          <Icon
            name={tab.icon}
            size={22}
            color={activeTab === tab.name ? colors.navActive : colors.navInactive}
            strokeWidth={activeTab === tab.name ? 2.5 : 2}
          />
          <Text
            style={[
              styles.label,
              { color: activeTab === tab.name ? colors.navActive : colors.navInactive },
            ]}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}

      <View style={styles.centerWrapper}>
        <Pressable onPress={onCenterPress} style={styles.centerBtn}>
          <Icon name="plus" size={24} color={colors.fg} strokeWidth={3} />
        </Pressable>
      </View>

      {tabs.slice(2).map((tab) => (
        <Pressable
          key={tab.name}
          onPress={() => onTabPress(tab.name)}
          style={styles.tab}
        >
          <Icon
            name={tab.icon}
            size={22}
            color={activeTab === tab.name ? colors.navActive : colors.navInactive}
            strokeWidth={activeTab === tab.name ? 2.5 : 2}
          />
          <Text
            style={[
              styles.label,
              { color: activeTab === tab.name ? colors.navActive : colors.navInactive },
            ]}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing['5'],
    left: spacing['4'],
    right: spacing['4'],
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.navBg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    zIndex: 20,
    ...shadows.nav,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing['1'],
    paddingHorizontal: spacing['2.5'],
    borderRadius: radius.sm,
  },
  label: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
  centerWrapper: {
    marginTop: -24,
  },
  centerBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow,
  },
});
