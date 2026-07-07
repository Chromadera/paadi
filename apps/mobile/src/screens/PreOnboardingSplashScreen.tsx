import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, shadows, typography } from '../theme';
import { Button } from '../components/Button';
import { SvgXml } from 'react-native-svg';
import onboardinSvg from '../../assets/onboardin-svg';

const { width: SCREEN_W } = Dimensions.get('window');
const IMG_SIZE = Math.min(SCREEN_W - 48, 340);

type Props = NativeStackScreenProps<RootStackParamList, 'PreOnboardingSplash'>;

export const PreOnboardingSplashScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>Paadi</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OnboardingStart')}>
          <Text style={styles.skip}>skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.imgWrap}>
          <SvgXml
            xml={onboardinSvg}
            width="100%"
            height="100%"
          />
        </View>

        {/* Narrative */}
        <View style={styles.textBlock}>
          <Text style={styles.headline}>
            Splitting money shouldn't mean chasing people on{' '}
            <Text style={styles.highlight}>WhatsApp.</Text>
          </Text>
          <Text style={styles.body}>
            Collect contributions, track who's paid, and pay out all in one link.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Button
          title="Next"
          variant="primary"
          onPress={() => navigation.navigate('PreOnboardingPots')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing['6'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing['2'],
    paddingBottom: spacing['4'],
  },
  brand: {
    fontSize: typography.sizes['2xl-'],
    fontWeight: typography.weights.extrabold,
    letterSpacing: -0.4,
    color: colors.fg,
  },
  skip: {
    fontSize: typography.sizes['lg-'],
    fontWeight: typography.weights.bold,
    color: colors.accent,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgWrap: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.fg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.brut,
    marginBottom: spacing['8'],
  },
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing['2'],
    gap: spacing['3'],
  },
  headline: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.extrabold,
    lineHeight: 32,
    letterSpacing: typography.letterSpacing.heading,
    textAlign: 'center',
    color: colors.fg,
  },
  highlight: {
    color: '#A43073',
  },
  body: {
    fontSize: typography.sizes['lg-'],
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
    color: colors.muted60,
    maxWidth: 320,
  },
  footer: {
    paddingBottom: spacing['2'],
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
});
