import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignupPassword } from "@/features/onboarding/hooks";
import { PaadiApiError } from "@paadi/api-client";
import { theme } from "@/lib/theme";
import { Eye, EyeOff, Check, X } from "lucide-react-native";

export default function PasswordPage() {
  const router = useRouter();
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
      onSuccess: () => router.push("/pin"),
    });
  }

  const error = signupPassword.error as PaadiApiError | null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{"←"}</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>Paadi</Text>
        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconBox}>
          <Text>{"🔐"}</Text>
        </View>

        <Text style={styles.headline}>Secure your account</Text>
        <Text style={styles.subtext}>
          Create a strong password to lock down your wallet balances and split
          logs.
        </Text>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showPassword}
              autoFocus
              placeholder="••••••••••••"
              placeholderTextColor={theme.colors.inkMuted}
              value={password}
              onChangeText={setPassword}
              editable={!isPending}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={16} color={theme.colors.inkMuted} />
              ) : (
                <Eye size={16} color={theme.colors.inkMuted} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <Text style={styles.errorText}>
            Couldn't save your password. Please try again.
          </Text>
        )}

        {/* Requirements Card */}
        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsHeader}>Password Rules</Text>

          <View style={styles.rule}>
            <View
              style={[
                styles.ruleIcon,
                hasMinLength ? styles.ruleMet : styles.ruleUnmet,
              ]}
            >
              {hasMinLength ? (
                <Check size={10} color={theme.colors.success} strokeWidth={3} />
              ) : (
                <X size={10} color="#D1D5DB" />
              )}
            </View>
            <Text
              style={[styles.ruleText, hasMinLength && styles.ruleTextMet]}
            >
              At least 8 characters long
            </Text>
          </View>

          <View style={styles.rule}>
            <View
              style={[
                styles.ruleIcon,
                hasLetter ? styles.ruleMet : styles.ruleUnmet,
              ]}
            >
              {hasLetter ? (
                <Check size={10} color={theme.colors.success} strokeWidth={3} />
              ) : (
                <X size={10} color="#D1D5DB" />
              )}
            </View>
            <Text
              style={[styles.ruleText, hasLetter && styles.ruleTextMet]}
            >
              Contains letters (A-Z)
            </Text>
          </View>

          <View style={styles.rule}>
            <View
              style={[
                styles.ruleIcon,
                hasNumber ? styles.ruleMet : styles.ruleUnmet,
              ]}
            >
              {hasNumber ? (
                <Check size={10} color={theme.colors.success} strokeWidth={3} />
              ) : (
                <X size={10} color="#D1D5DB" />
              )}
            </View>
            <Text
              style={[styles.ruleText, hasNumber && styles.ruleTextMet]}
            >
              Contains numbers (0-9)
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaButton, (!isValid || isPending) && styles.ctaDisabled]}
          onPress={handleSubmit}
          disabled={!isValid || isPending}
        >
          {isPending ? (
            <ActivityIndicator color={theme.colors.ink} />
          ) : (
            <>
              <Text style={styles.ctaText}>Continue</Text>
              <Text style={styles.ctaArrow}>{"➔"}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[8],
    paddingTop: theme.spacing[5],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  },
  backArrow: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
    padding: theme.spacing[2],
  },
  brand: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing[6],
    width: "100%",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[6],
    borderBottomWidth: 2,
  },
  headline: {
    fontSize: theme.fontSize.huge - 2,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  subtext: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.inkMuted,
    marginBottom: theme.spacing[6],
  },
  inputGroup: {
    marginBottom: theme.spacing[2],
  },
  label: {
    fontSize: 11,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.inkMuted,
    marginBottom: 6,
    paddingLeft: 4,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
  },
  requirementsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    gap: 10,
    marginTop: theme.spacing[4],
  },
  requirementsHeader: {
    fontSize: theme.fontSize.tiny,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.inkMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  rule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ruleIcon: {
    width: 16,
    height: 16,
    borderRadius: theme.borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  ruleMet: {
    backgroundColor: "rgba(16,185,129,0.1)",
    borderColor: theme.colors.success,
  },
  ruleUnmet: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },
  ruleText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkMuted,
  },
  ruleTextMet: {
    color: theme.colors.ink,
  },
  footer: {
    flexShrink: 0,
    paddingTop: theme.spacing[4],
  },
  ctaButton: {
    width: "100%",
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: theme.spacing[4],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderBottomWidth: 4,
  },
  ctaDisabled: {
    opacity: 0.4,
  },
  ctaText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
  ctaArrow: {
    fontSize: theme.fontSize.base,
  },
});
