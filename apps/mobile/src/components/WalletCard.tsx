import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { Badge } from './Badge';
import { Icon } from './Icon';

interface WalletCardProps {
  balance: number;
  bankName: string;
  accountNumber: string;
  isActive?: boolean;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  bankName,
  accountNumber,
  isActive = true,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="wallet" size={16} color={colors.walletIconStroke} strokeWidth={2.25} />
          <Text style={styles.label}>Wallet Balance</Text>
        </View>
        {isActive && <Badge label="Active" variant="open" />}
      </View>
      <Text style={styles.balance}>₦{balance.toLocaleString()}</Text>
      <View style={styles.bankRow}>
        <Icon name="bank" size={12} color={colors.muted} />
        <Text style={styles.bankText}>
          {bankName} · {accountNumber}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.lg,
    padding: spacing['6'],
    marginVertical: spacing['4'],
    ...shadows.brut,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.muted,
  },
  balance: {
    fontSize: 36,
    fontWeight: typography.weights.black,
    letterSpacing: -0.5,
    color: colors.fg,
    marginTop: spacing['1'],
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing['1'],
  },
  bankText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.muted,
  },
});
