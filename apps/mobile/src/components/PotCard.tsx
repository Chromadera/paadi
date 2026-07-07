import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Pot } from '../types';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';
import { AvatarStack } from './Avatar';
import { Icon } from './Icon';

interface PotCardProps {
  pot: Pot;
  onPress?: () => void;
}

export const PotCard: React.FC<PotCardProps> = ({ pot, onPress }) => {
  const progress = Math.round((pot.collectedAmount / pot.targetAmount) * 100);
  const isSettled = pot.status === 'settled';

  return (
    <Pressable onPress={onPress} style={[styles.card, isSettled && styles.settled]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{pot.title}</Text>
          <View style={styles.metaRow}>
            <Icon name="calendar" size={12} color={colors.calendarIconStroke} strokeWidth={2.5} />
            <Text style={styles.meta}>
              {isSettled ? `Settled ${pot.endDate}` : `Ends ${pot.endDate}`}
            </Text>
          </View>
        </View>
        <Badge
          label={pot.status}
          variant={isSettled ? 'settled' : 'open'}
        />
      </View>

      <View style={styles.amounts}>
        <View>
          <Text style={styles.label}>Collected</Text>
          <Text style={styles.amount}>
            ₦{pot.collectedAmount.toLocaleString()}{' '}
            <Text style={styles.amountMuted}>/ ₦{pot.targetAmount.toLocaleString()}</Text>
          </Text>
        </View>
        <View style={styles.percentage}>
          {isSettled ? (
            <Text style={styles.completed}>Completed</Text>
          ) : (
            <>
              <Text style={styles.targetLabel}>Target</Text>
              <View style={styles.percentageBadge}>
                <Text style={styles.percentageText}>{progress}%</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <ProgressBar progress={progress} style={styles.progress} />

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <AvatarStack indices={pot.avatarIndices} size={26} overlap={10} />
          <Text style={styles.paidText}>
            {isSettled ? 'All paid' : `${pot.paidCount} of ${pot.memberCount} paid`}
          </Text>
        </View>
        <Text style={styles.statusText}>
          {isSettled ? 'Settled' : 'Active Collective'}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing['4.5'],
    marginBottom: spacing['2.5'],
    borderWidth: 1,
    borderColor: colors.border,
  },
  settled: {
    opacity: 0.65,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.extrabold,
    color: colors.fg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing['1'],
  },
  meta: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.muted,
  },
  amounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBgAlt,
    paddingTop: spacing['3.5'],
    marginTop: spacing['3'],
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.muted,
    marginBottom: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: typography.weights.black,
    color: colors.fg,
  },
  amountMuted: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: colors.muted,
  },
  percentage: {
    alignItems: 'flex-end',
  },
  targetLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.muted,
    marginBottom: 2,
  },
  percentageBadge: {
    backgroundColor: colors.pinkSoft,
    paddingVertical: 2,
    paddingHorizontal: spacing['2'],
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.pinkBorder,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: typography.weights.black,
    color: colors.pink,
  },
  completed: {
    fontSize: 12,
    fontWeight: typography.weights.black,
    color: colors.success,
  },
  progress: {
    marginTop: spacing['3'],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing['2'],
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paidText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.muted,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.successDark,
  },
});
