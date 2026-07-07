import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, shadows, typography } from '../theme';
import { Button } from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'PreOnboardingSplit'>;

export const PreOnboardingSplitScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustration}>
          <View style={styles.card}>
            {/* Card header */}
            <View style={styles.cardHeader}>
              <Image
                source={require('../../assets/avatars/avatar-6.png')}
                style={styles.cardAvatar}
              />
              <Text style={styles.cardHeaderText}>Dinner at Yellow Chili</Text>
            </View>

            <Text style={styles.total}>₦45,000</Text>

            {/* Row 1: You — no top border */}
            <View style={[styles.row, styles.rowFirst]}>
              <View style={styles.rowLeft}>
                <Image
                  source={require('../../assets/avatars/avatar-6.png')}
                  style={styles.rowAvatar}
                />
                <Text style={styles.rowName}>You</Text>
              </View>
              <Text style={styles.rowAmount}>₦15,000</Text>
            </View>

            {/* Row 2: Ade — Paid */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Image
                  source={require('../../assets/avatars/avatar-2.png')}
                  style={styles.rowAvatar}
                />
                <Text style={styles.rowName}>Ade</Text>
              </View>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>Paid</Text>
              </View>
            </View>

            {/* Row 3: Tolu — Paid */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Image
                  source={require('../../assets/avatars/avatar-3.png')}
                  style={styles.rowAvatar}
                />
                <Text style={styles.rowName}>Tolu</Text>
              </View>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>Paid</Text>
              </View>
            </View>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Split</Text>
          </View>
        </View>

        <Text style={styles.headline}>Split bills instantly</Text>
        <Text style={styles.desc}>
          No more awkward reminders. Everyone pays their fair share.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>

        <Button
          title="Get started"
          variant="primary"
          onPress={() => navigation.navigate('OnboardingStart')}
          trailingIcon={<Text style={styles.arrow}>→</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

const ILLUSTRATION_BG = colors.warningBg;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing['5'],
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: 280,
    marginTop: spacing['10'],
    marginBottom: spacing['8'],
    backgroundColor: ILLUSTRATION_BG,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.fg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadows.brut,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.base,
    paddingVertical: spacing['3.5'],
    paddingHorizontal: spacing['4'],
    width: 220,
    ...shadows.brutMd,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginBottom: spacing['2.5'],
  },
  cardAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  cardHeaderText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  total: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.black,
    color: colors.fg,
    marginBottom: spacing['2.5'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing['1.5'],
    borderTopWidth: 1,
    borderColor: colors.borderSubtle,
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1.5'],
  },
  rowAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  rowName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  rowAmount: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  paidBadge: {
    backgroundColor: colors.successBg,
    paddingVertical: spacing['0.5'],
    paddingHorizontal: spacing['2'],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  paidText: {
    fontSize: typography.sizes['sm-'],
    fontWeight: typography.weights.extrabold,
    color: colors.successDark,
  },
  badge: {
    position: 'absolute',
    top: spacing['6'],
    right: spacing['6'],
    backgroundColor: colors.accent,
    paddingVertical: spacing['1.5'],
    paddingHorizontal: spacing['3'],
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.full,
    ...shadows.brutSm,
  },
  badgeText: {
    fontSize: typography.sizes['sm-'],
    fontWeight: typography.weights.extrabold,
    color: colors.fg,
  },
  headline: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: 31,
    textAlign: 'center',
    color: colors.fg,
  },
  desc: {
    fontSize: typography.sizes.base,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.muted60,
    marginTop: spacing['3'],
    textAlign: 'center',
    maxWidth: 260,
  },
  footer: {
    paddingBottom: spacing['4'],
    gap: spacing['5'],
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing['2'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.xs,
    backgroundColor: colors.borderSubtle,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.fg,
  },
  arrow: {
    fontSize: 18,
    color: colors.fg,
  },
});
