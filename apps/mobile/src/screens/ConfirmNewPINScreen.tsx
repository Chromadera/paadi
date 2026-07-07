import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../theme';
import { PinPad } from '../components/PinPad';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ConfirmNewPINScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '1234') {
          setTimeout(() => navigation.goBack(), 200);
        } else {
          setError(true);
          setTimeout(() => { setPin(''); setError(false); }, 800);
        }
      }
    }
  };

  const handleDelete = () => { setPin(pin.slice(0, -1)); setError(false); };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header — matches HTML: back ← (20px), title "Confirm PIN" (17px bold), 20px spacer */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.backArrow}>&#8592;</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Confirm PIN</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Form area — HTML: padding:24px 4px 0; text-align:center */}
      <View style={styles.form}>
        {/* Description — HTML: 14px, var(--muted-60), margin-bottom:24px */}
        <Text style={styles.description}>Re-enter your new 4-digit PIN</Text>

        {/* Dots — HTML: 14×14, 50% radius, gap 12px, centered */}
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < pin.length && styles.dotFilled,
                error && styles.dotError,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Error message */}
      {error && <Text style={styles.error}>PINs don't match. Try again.</Text>}

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
  // Form area — HTML: padding:24px 4px 0; text-align:center
  form: {
    paddingTop: spacing['6'],
    paddingHorizontal: spacing['1'],
    alignItems: 'center',
  },
  // Description — HTML: font-size:14px; color:var(--muted-60); margin-bottom:24px
  description: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    textAlign: 'center',
    marginBottom: spacing['6'],
  },
  // Dots — HTML: 14×14, 50% radius, gap 12px, centered
  dotsRow: {
    flexDirection: 'row',
    gap: spacing['3'],
    justifyContent: 'center',
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
  dotError: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  // Error — HTML doesn't have error state, using theme tokens
  error: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing['3'],
    marginBottom: spacing['2'],
  },
  // Numpad wrapper — HTML: padding:0 16px; margin-top:40px
  numpadWrap: {
    paddingHorizontal: spacing['4'],
    marginTop: spacing['10'],
  },
});
