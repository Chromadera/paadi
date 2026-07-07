import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography, iconContainers } from '../theme';
import { ActivityItem } from '../types';
import { Icon } from './Icon';

interface ActivityRowProps {
  item: ActivityItem;
  style?: any;
}

export const ActivityRow: React.FC<ActivityRowProps> = ({ item, style }) => {
  const isCredit = item.type === 'credit';

  return (
    <View style={[styles.container, style]}>
      <View style={styles.icon}>
        <Icon name={item.icon as any} size={18} color={colors.fg} strokeWidth={2.5} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={[styles.amount, isCredit ? styles.credit : styles.debit]}>
        {isCredit ? '+' : ''}₦{Math.abs(item.amount).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    paddingVertical: spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBg,
  },
  icon: {
    width: iconContainers.activity.size,
    height: iconContainers.activity.size,
    borderRadius: iconContainers.activity.radius,
    backgroundColor: colors.surfaceBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.fg,
  },
  time: {
    fontSize: typography.sizes.xs,
    color: colors.muted,
    marginTop: 2,
  },
  amount: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.black,
    textAlign: 'right',
  },
  credit: {
    color: colors.success,
  },
  debit: {
    color: colors.fg,
  },
});
