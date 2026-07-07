import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types';
import { SvgXml } from 'react-native-svg';
import getSvg from '../../assets/get-svg';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingStartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Illustration — 260px height, gradient bg, brut shadow */}
          <View style={styles.illustration}>
            <SvgXml
              xml={getSvg}
              width="100%"
              height="100%"
            />
          </View>

          <Text style={styles.title}>Let's set up your first split</Text>
          <Text style={styles.subtitle}>
            Join 50k+ people splitting bills, rent, and goals without the awkward "pay me back" texts.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Create account"
            onPress={() => navigation.navigate('OnboardingPhone')}
            icon={<Text style={styles.arrow}>→</Text>}
          />
          <View style={styles.secondaryBtn}>
            <Button
              title="I already have an account"
              variant="secondary"
              onPress={() => navigation.navigate('Relogin')}
            />
          </View>
        </View>

        {/* Home indicator (Android style) */}
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
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
    flexGrow: 1,
    paddingHorizontal: spacing['5'],
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing['8'],
    paddingHorizontal: spacing['2'],
    paddingBottom: spacing['4'],
  },
  illustration: {
    width: '100%',
    height: 260,
    backgroundColor: colors.warningBg,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.lg,
    marginBottom: spacing['6'],
    overflow: 'hidden',
    ...shadows.brut,
  },
  illustrationImg: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeights.snug * 26,
    textAlign: 'center',
    color: colors.fg,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    fontWeight: '500' as const,
    color: colors.muted60,
    marginTop: spacing['3'],
    textAlign: 'center',
    maxWidth: 256,
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
  },
  actions: {
    paddingHorizontal: spacing['2'],
    marginTop: spacing['6'],
  },
  secondaryBtn: {
    marginTop: spacing['3'],
  },
  arrow: {
    fontSize: typography.sizes.lg,
    color: colors.fg,
  },
  homeIndicator: {
    height: 20,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['6'],
  },
  homeIndicatorBar: {
    width: 120,
    height: 4,
    backgroundColor: colors.fg,
    borderRadius: 2,
  },
});
