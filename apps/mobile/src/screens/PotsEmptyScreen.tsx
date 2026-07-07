import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { Icon } from '../components/Icon';
import { RootStackParamList, MainTabParamList } from '../types';

type NavigationProp = BottomTabNavigationProp<MainTabParamList> &
  NativeStackNavigationProp<RootStackParamList>;

export const PotsEmptyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header (ios-header style) ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pots</Text>
        <Pressable
          onPress={() => navigation.navigate('CreatePot')}
          hitSlop={8}
        >
          <Text style={styles.headerPlus}>+</Text>
        </Pressable>
      </View>

      {/* ── Empty State ── */}
      <View style={styles.emptyContainer}>
        <View style={styles.iconCircle}>
          <Icon name="grid" size={36} color={colors.muted} strokeWidth={1.5} />
        </View>
        <Text style={styles.emptyTitle}>No pots yet</Text>
        <Text style={styles.emptySubtitle}>
          Create your first pot to start splitting bills and saving with
          friends.
        </Text>
        <Pressable
          onPress={() => navigation.navigate('CreatePot')}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <Text style={styles.ctaButtonText}>Create a Pot</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing['5'],
    paddingBottom: 60,
  },
  // Header — matches ios-header inline styles from HTML
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing['2'],
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  headerPlus: {
    fontSize: 20,
    color: colors.fg,
  },
  // Empty state container — flex:1, centered, padding:32px 4px
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['8'],
    paddingHorizontal: spacing['1'],
  },
  // Icon circle — 80x80, white bg, border border, no shadow
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['5'],
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.black,
    color: colors.fg,
  },
  emptySubtitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    color: colors.muted60,
    textAlign: 'center',
    marginTop: spacing['2'],
    maxWidth: 240,
    lineHeight: typography.sizes.base * 1.5,
  },
  // CTA button — custom style matching HTML exactly
  // padding:12px 24px, border:2px solid fg, border-radius:14px, bg:surface,
  // font-size:15px, font-weight:700, shadow:2px 2px 0 0 fg
  ctaButton: {
    marginTop: spacing['5'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['6'],
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: 14,
    backgroundColor: colors.surface,
    ...shadows.brutSm,
  },
  ctaButtonPressed: {
    transform: [{ translateY: 1 }],
    ...shadows.btnSmActive,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
});
