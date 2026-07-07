import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLogin } from '@/features/auth/login-hooks';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ReloginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const loginMutation = useLogin();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isPending = loginMutation.isPending;

  function handleSubmit() {
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    loginMutation.mutate(
      { identifier, password },
      {
        onSuccess: () => {
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        },
        onError: (err: Error) => {
          setErrorMsg(err.message ?? 'Invalid credentials. Please try again.');
        },
      },
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>P</Text>
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Username or Email</Text>
            <TextInput
              style={styles.input}
              placeholder="seunade or seun@email.com"
              placeholderTextColor={colors.placeholder}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isPending}
            />

            <Text style={[styles.label, { marginTop: spacing['4'] }]}>Password</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={[styles.input, { paddingRight: 48 }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isPending}
              />
              <TouchableOpacity
                style={styles.showBtn}
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
              >
                <Text style={styles.showBtnText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <Pressable style={styles.forgotBtn} onPress={() => {}}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <View style={styles.signInWrapper}>
              <Button
                title="Sign In"
                onPress={handleSubmit}
                disabled={isPending}
                loading={isPending}
                icon={<Text style={styles.arrow}>→</Text>}
              />
            </View>

            <Pressable
              style={styles.signupPrompt}
              onPress={() => navigation.navigate('OnboardingStart')}
            >
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text style={styles.signupLink}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Home indicator */}
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['5'],
  },
  // Header
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: spacing['4'],
    paddingHorizontal: spacing['2'],
  },
  brandMark: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.fg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['4'],
    ...shadows.brutSm,
  },
  brandMarkText: {
    fontSize: 24,
    fontWeight: typography.weights.black,
    color: colors.fg,
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.heading,
    color: colors.fg,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    marginTop: spacing['1.5'],
  },
  // Form
  form: {
    paddingHorizontal: spacing['1'],
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    color: colors.muted,
    marginBottom: spacing['1'],
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: radius.base,
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.fg,
    backgroundColor: colors.surface,
    marginTop: spacing['2'],
  },
  passwordWrap: {
    position: 'relative',
    marginTop: spacing['2'],
  },
  showBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 4,
  },
  showBtnText: {
    fontSize: typography.sizes['base-'],
    fontWeight: typography.weights.bold,
    color: colors.muted,
  },
  forgotBtn: {
    alignItems: 'flex-end',
    marginTop: spacing['2'],
    paddingVertical: spacing['1'],
  },
  forgotText: {
    fontSize: typography.sizes['base-'],
    fontWeight: typography.weights.bold,
    color: colors.fg,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing['2'],
  },
  signInWrapper: {
    marginTop: spacing['4'],
  },
  arrow: {
    fontSize: 16,
    color: colors.fg,
  },
  signupPrompt: {
    alignItems: 'center',
    marginTop: spacing['5'],
    paddingVertical: spacing['2'],
  },
  signupText: {
    fontSize: typography.sizes['base-'],
    color: colors.muted,
  },
  signupLink: {
    color: colors.fg,
    fontWeight: typography.weights.bold,
  },
  // Home indicator
  homeIndicator: {
    height: 20,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicatorBar: {
    width: 120,
    height: 4,
    backgroundColor: colors.fg,
    borderRadius: 2,
  },
});
