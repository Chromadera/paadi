import React from 'react';
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { getAuthedClient } from '@/lib/api/client';
import { colors, spacing, radius } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { ActivityRow } from '../components/ActivityRow';
import { RootStackParamList, MainTabParamList } from '../types';

type NavigationProp = BottomTabNavigationProp<MainTabParamList> &
  NativeStackNavigationProp<RootStackParamList>;

export const ActivityScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const { data, isPending, error } = useQuery({
    queryKey: ['me', 'activity'],
    queryFn: () => getAuthedClient().getActivity(),
  });

  const items = data?.items ?? [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <ScreenHeader title="Activity" />

        {isPending && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        )}

        {error && !isPending && (
          <View style={styles.stateContainer}>
            <Text style={styles.errorText}>Failed to load activity</Text>
          </View>
        )}

        {!isPending && items.length === 0 && (
          <View style={styles.stateContainer}>
            <Text style={styles.emptyText}>No activity yet</Text>
          </View>
        )}

        {!isPending && items.length > 0 && (
          <View style={styles.card}>
            {items.map((item, i) => (
              <ActivityRow
                key={item.id}
                item={{
                  id: item.id,
                  title: item.headline,
                  time: new Date(item.occurredAt).toLocaleDateString(),
                  amount: item.amountKobo ? item.amountKobo / 100 : 0,
                  type: item.type.includes('credit') || item.type.includes('received') ? 'credit' as const : 'debit' as const,
                  icon: 'activity',
                }}
                style={i === items.length - 1 ? styles.lastRow : undefined}
              />
            ))}
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
    paddingBottom: 120,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    paddingHorizontal: spacing['4'],
  },
  lastRow: {
    borderBottomWidth: 0,
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
