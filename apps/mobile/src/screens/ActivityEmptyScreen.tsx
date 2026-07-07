import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { RootStackParamList, MainTabParamList } from '../types';
import { Icon } from '../components/Icon';

type NavigationProp = BottomTabNavigationProp<MainTabParamList> & NativeStackNavigationProp<RootStackParamList>;

export const ActivityEmptyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Header — matches ios-header style from HTML */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
        </View>

        {/* Empty State — centered */}
        <View style={styles.empty}>
          <View style={styles.iconCircle}>
            <Icon name="activity" size={36} color={colors.muted} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>No activity yet</Text>
          <Text style={styles.emptyText}>
            Your transactions, pot invites, and payment updates will appear here.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.exploreBtn,
              pressed && styles.exploreBtnPressed,
            ]}
            onPress={() => navigation.navigate('PotsTab')}
          >
            <Text style={styles.exploreBtnText}>Explore Pots</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['5'],
    paddingBottom: 60,
  },
  header: {
    paddingTop: spacing['3'],
    paddingBottom: spacing['4'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['1'],
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['5'],
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.black,
    color: colors.fg,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    marginTop: spacing['2'],
    maxWidth: 240,
    lineHeight: 21,
    textAlign: 'center',
  },
  exploreBtn: {
    marginTop: spacing['5'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['6'],
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: 14,
    backgroundColor: colors.surface,
    ...shadows.brutSm,
  },
  exploreBtnPressed: {
    transform: [{ translateY: 1 }],
    ...shadows.btnSmActive,
  },
  exploreBtnText: {
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
});
