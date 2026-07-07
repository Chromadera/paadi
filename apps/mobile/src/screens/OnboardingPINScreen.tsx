import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, layout } from '../theme';
import { PinPad } from '../components/PinPad';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingPINScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [pin, setPin] = useState('');

  const handlePress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => navigation.navigate('OnboardingConfirmPIN'), 200);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Header — matches HTML: padding 32px 4px 16px, text-align center */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Create your PIN</Text>
          <Text style={styles.subtitle}>Choose a 4-digit PIN to secure your account</Text>
        </View>

        {/* PinPad — integrated dots + numpad */}
        <View style={styles.pinPadContainer}>
          <PinPad
            onPress={handlePress}
            onDelete={handleDelete}
            pinLength={pin.length}
            maxLength={4}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 60,
  },
  // Header — matches HTML: padding 32px 4px 16px, text-align center
  header: {
    paddingTop: spacing['8'],
    paddingHorizontal: spacing['1'],
    paddingBottom: spacing['4'],
    alignItems: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: -4,
    top: spacing['8'],
  },
  backBtnText: {
    fontSize: typography.sizes.xl,
    color: colors.fg,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.heading,
    color: colors.fg,
    marginTop: spacing['2'],
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    marginTop: spacing['1.5'],
  },
  // PinPad container — matches HTML: padding 0 16px, margin-top 48px
  pinPadContainer: {
    paddingHorizontal: spacing['4'],
    marginTop: spacing['12'],
  },
});
