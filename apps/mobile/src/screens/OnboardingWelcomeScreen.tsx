import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types';
import { illustrationOnboarding } from '../data/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const slides = [
  {
    title: "Splitting money shouldn't mean chasing people on WhatsApp.",
    body: 'No more "who has paid" spreadsheets or chasing people in group chats. Paadi makes collective savings effortless.',
  },
  {
    title: 'Create a pot, split a bill, settle automatically',
    body: "Set up a pot in seconds. Invite your crew. Paadi handles the tracking, reminders, and settlement — so you don't have to.",
  },
  {
    title: 'Your money, your rules',
    body: 'Every pot is protected by PIN verification. Funds are only released when the group agrees — no single person controls the payout.',
  },
];

export const OnboardingWelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigation.navigate('OnboardingPhone');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Slide area — tap to advance */}
        <Pressable onPress={nextSlide}>
          {/* Illustration — 280px height, gradient bg, brut shadow */}
          <View style={styles.illustration}>
            <Image
              source={illustrationOnboarding}
              style={styles.illustrationImg}
              resizeMode="contain"
            />
          </View>

          <View style={styles.slide}>
            <Text style={styles.title}>
              {current === 0 ? (
                <>
                  Splitting money shouldn't mean chasing people on{' '}
                  <Text style={styles.pinkText}>WhatsApp.</Text>
                </>
              ) : (
                slides[current].title
              )}
            </Text>
            <Text style={styles.body}>{slides[current].body}</Text>
          </View>

          {/* Dots — 8x8 circles, active = 24px wide pill */}
          <View style={styles.dots}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === current && styles.dotActive]}
              />
            ))}
          </View>
        </Pressable>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title={current < slides.length - 1 ? 'Next' : 'Get Started'}
            onPress={nextSlide}
          />
          {current < slides.length - 1 && (
            <Pressable
              onPress={() => navigation.navigate('OnboardingPhone')}
              style={styles.skip}
            >
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>

        {/* Home indicator */}
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
  illustration: {
    width: '100%',
    height: 280,
    backgroundColor: colors.warningBg,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.lg,
    marginTop: spacing['10'],
    marginBottom: spacing['6'],
    overflow: 'hidden',
    ...shadows.brut,
  },
  illustrationImg: {
    width: '100%',
    height: '100%',
  },
  slide: {
    alignItems: 'center',
    paddingTop: spacing['10'],
    paddingHorizontal: spacing['2'],
    paddingBottom: spacing['5'],
  },
  title: {
    fontSize: typography.sizes['2xl-'],
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.heading,
    textAlign: 'center',
    color: colors.fg,
    marginBottom: spacing['2'],
  },
  pinkText: {
    color: colors.pink,
  },
  body: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing['2'],
    justifyContent: 'center',
    marginBottom: spacing['5'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderSubtle,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
    backgroundColor: colors.fg,
  },
  actions: {
    paddingHorizontal: spacing['2'],
  },
  skip: {
    alignSelf: 'center',
    marginTop: spacing['4'],
    padding: spacing['2'],
  },
  skipText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.muted,
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
