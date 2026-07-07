import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { usePots } from '@/features/pots/hooks';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { PotCard } from '../components/PotCard';
import { RootStackParamList, MainTabParamList, Pot } from '../types';
import { Icon } from '../components/Icon';

type NavigationProp = BottomTabNavigationProp<MainTabParamList> &
  NativeStackNavigationProp<RootStackParamList>;

const filters = ['All', 'Open', 'Settled', 'Cancelled'];

export const PotsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [filter, setFilter] = useState('All');

  const statusParam =
    filter === 'All' ? undefined : (filter.toLowerCase() as 'open' | 'settled' | 'cancelled');

  const { data, isPending, error } = usePots({
    status: statusParam,
    limit: 20,
  });

  const potsData = data?.items ?? [];

  const items: Pot[] = potsData.map((p) => ({
    id: p.id,
    title: p.title,
    targetAmount: p.totalKobo / 100,
    collectedAmount: (p as any).collectedKobo / 100,
    endDate: (p as any).deadlineAt ?? '',
    status: p.status as Pot['status'],
    memberCount: (p as any).splitCount ?? 0,
    paidCount: (p as any).paidCount ?? 0,
    avatarIndices: [],
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="My Pots"
          subtitle="Track your group split targets"
          rightElement={
            <View style={styles.brandMark}>
              <Icon name="plus" size={18} color={colors.fg} />
            </View>
          }
        />

        <SegmentedControl options={filters} selected={filter} onSelect={setFilter} />

        {isPending && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        )}

        {error && !isPending && (
          <View style={styles.stateContainer}>
            <Text style={styles.errorText}>Failed to load pots</Text>
          </View>
        )}

        {!isPending && items.length === 0 && (
          <View style={styles.stateContainer}>
            <Text style={styles.emptyText}>No pots found</Text>
          </View>
        )}

        {!isPending && items.map((pot) => (
          <PotCard
            key={pot.id}
            pot={pot}
            onPress={() => navigation.navigate('PotDetails', { potId: pot.id })}
          />
        ))}

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
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: radius.base,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.fg,
    ...shadows.brutSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateContainer: {
    marginTop: spacing['6'],
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
  },
});
