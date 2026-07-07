import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, shadows, typography } from '../theme';
import { Button } from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'PreOnboardingPots'>;

export const PreOnboardingPotsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustration}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Trip to Bali 🌴</Text>
            <View style={styles.avatarRow}>
              <Image
                source={require('../../assets/avatars/avatar-2.png')}
                style={[styles.avatar, styles.avatarFirst]}
              />
              <Image
                source={require('../../assets/avatars/avatar-3.png')}
                style={styles.avatar}
              />
              <Image
                source={require('../../assets/avatars/avatar-4.png')}
                style={styles.avatar}
              />
              <Image
                source={require('../../assets/avatars/avatar-5.png')}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.amount}>₦250,000</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Group Pot</Text>
          </View>
        </View>

        <Text style={styles.headline}>Create group pots</Text>
        <Text style={styles.desc}>
          Set up shared savings for anything — rent, trips, or that group gift.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        <Button
          title="Next"
          variant="primary"
          onPress={() => navigation.navigate('PreOnboardingSplit')}
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
    padding: spacing['4'],
    width: 200,
    ...shadows.brutMd,
  },
  cardTitle: {
    fontSize: typography.sizes['base-'],
    fontWeight: typography.weights.extrabold,
    color: colors.fg,
    marginBottom: spacing['2.5'],
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.surface,
    marginLeft: -8,
  },
  avatarFirst: {
    marginLeft: 0,
  },
  amount: {
    fontSize: typography.sizes['2xl-'],
    fontWeight: typography.weights.black,
    color: colors.fg,
    marginTop: spacing['2.5'],
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
