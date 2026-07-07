import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../theme';
import { PinPad } from '../components/PinPad';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ChangePINScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [pin, setPin] = useState('');

  const handlePress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) setTimeout(() => navigation.navigate('ChangePINInput'), 200);
    }
  };

  const handleDelete = () => setPin(pin.slice(0, -1));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header — matches HTML: back ← (20px), title (17px bold), 20px spacer */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.backArrow}>&#8592;</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Change PIN</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Form area — HTML: padding:24px 4px 0 */}
      <View style={styles.form}>
        {/* Current PIN row — HTML: card-label + 4 empty dots */}
        <Text style={styles.label}>Current PIN</Text>
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[styles.dot, i < pin.length && styles.dotFilled]}
            />
          ))}
        </View>

        {/* New PIN row — HTML: card-label + mt-6 + 4 empty placeholder dots */}
        <Text style={[styles.label, styles.labelSpaced]}>New PIN</Text>
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      </View>

      {/* Numpad — HTML: padding 0 16px, margin-top 40px */}
      <View style={styles.numpadWrap}>
        <PinPad
          onPress={handlePress}
          onDelete={handleDelete}
          pinLength={pin.length}
          maxLength={4}
          showDots={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingBottom: spacing['16'],
  },
  // Header — matches HTML .ios-header pattern
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing['2'],
    paddingBottom: spacing['4'],
    paddingHorizontal: spacing['5'],
  },
  backArrow: {
    fontSize: typography.sizes.xl,
    color: colors.fg,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  headerSpacer: {
    width: 20,
  },
  // Form area — HTML: padding:24px 4px 0
  form: {
    paddingTop: spacing['6'],
    paddingHorizontal: spacing['1'],
  },
  // Card label — HTML: font-size:10px; font-weight:800; text-transform:uppercase;
  //                  letter-spacing:1px; color:var(--muted); margin-bottom:4px
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing['1'],
  },
  labelSpaced: {
    marginTop: spacing['6'],
  },
  // Dots — HTML: 14×14, 50% radius, gap 12px, centered, margin-top 12px
  dotsRow: {
    flexDirection: 'row',
    gap: spacing['3'],
    justifyContent: 'center',
    marginTop: spacing['3'],
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dotFilled: {
    backgroundColor: colors.fg,
    borderColor: colors.fg,
  },
  // Numpad wrapper — HTML: padding:0 16px; margin-top:40px
  numpadWrap: {
    paddingHorizontal: spacing['4'],
    marginTop: spacing['10'],
  },
});
