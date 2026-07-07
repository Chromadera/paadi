import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSignupPassword } from "../../features/onboarding/hooks";
import { PaadiApiError } from "@paadi/api-client";
import { colors, spacing, typography, radius } from "../theme";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BrandMark } from "../components/BrandMark";
import { Icon } from "../components/Icon";
import { RootStackParamList } from "../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const signupPassword = useSignupPassword();
  const isPending = signupPassword.isPending;

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const isValid = hasMinLength && hasNumber && hasLetter;

  function handleSubmit() {
    if (!isValid || isPending) return;
    signupPassword.mutate(password, {
      onSuccess: () => navigation.navigate("OnboardingPIN"),
    });
  }

  const error = signupPassword.error as PaadiApiError | null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <BrandMark />

        <Text style={styles.title}>Create a password</Text>
        <Text style={styles.subtitle}>
          Create a strong password to lock down your wallet and split logs.
        </Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <Input
              containerStyle={styles.inlineInputContainer}
              style={styles.inlineInput}
              secureTextEntry={!showPassword}
              autoFocus
              placeholder="············"
              value={password}
              onChangeText={setPassword}
              editable={!isPending}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon
                name={showPassword ? "eyeOff" : "eye"}
                size={16}
                color={colors.muted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <Text style={styles.errorText}>
            Couldn't save your password. Please try again.
          </Text>
        )}

        <View style={styles.rulesCard}>
          <Text style={styles.rulesHeader}>Password Rules</Text>
          <RuleRow met={hasMinLength} label="At least 8 characters long" />
          <RuleRow met={hasLetter} label="Contains letters (A-Z)" />
          <RuleRow met={hasNumber} label="Contains numbers (0-9)" />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleSubmit}
          disabled={!isValid || isPending}
          loading={isPending}
        />
      </View>
    </SafeAreaView>
  );
};

function RuleRow({ met, label }: { met: boolean; label: string }) {
  return (
    <View style={ruleStyles.row}>
      <View style={[ruleStyles.dot, met ? ruleStyles.met : ruleStyles.unmet]}>
        <Text style={[ruleStyles.mark, met && ruleStyles.markMet]}>
          {met ? "✓" : "✕"}
        </Text>
      </View>
      <Text style={[ruleStyles.label, met && ruleStyles.labelMet]}>{label}</Text>
    </View>
  );
}

const ruleStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2.5"],
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  met: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
  },
  unmet: {
    backgroundColor: colors.surfaceBg,
    borderColor: colors.borderSubtle,
  },
  mark: {
    fontSize: typography.sizes.xs,
    color: colors.chevron,
  },
  markMet: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.success,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.muted,
  },
  labelMet: {
    color: colors.fg,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing["6"],
  },
  content: {
    flex: 1,
    paddingTop: spacing["12"],
    alignItems: "center",
  },
  title: {
    fontSize: typography.sizes["2xl-"],
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.heading,
    color: colors.fg,
    textAlign: "center",
    marginTop: spacing["6"],
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    textAlign: "center",
    marginTop: spacing["1.5"],
    marginBottom: spacing["8"],
  },
  inputWrapper: {
    width: "100%",
    marginBottom: spacing["2"],
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textTransform: "uppercase",
    letterSpacing: typography.letterSpacing.wide,
    color: colors.muted,
    marginBottom: spacing["1"],
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.base,
    borderWidth: 2,
    borderColor: colors.fg,
    backgroundColor: colors.surface,
    paddingRight: spacing["4"],
  },
  inlineInputContainer: {
    flex: 1,
  },
  inlineInput: {
    borderWidth: 0,
    borderRadius: 0,
    paddingVertical: spacing["3.5"],
    paddingHorizontal: spacing["4"],
  },
  eyeBtn: {
    padding: spacing["1"],
  },
  errorText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.danger,
    textAlign: "center",
    marginTop: spacing["3"],
  },
  rulesCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing["4"],
    gap: spacing["2.5"],
    marginTop: spacing["6"],
  },
  rulesHeader: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.muted,
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing["1"],
  },
  footer: {
    paddingBottom: spacing["4"],
  },
});
