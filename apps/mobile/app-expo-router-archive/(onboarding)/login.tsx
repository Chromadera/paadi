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
import { useLogin } from "@/features/auth/login-hooks";
import { theme } from "@/lib/theme";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isPending = loginMutation.isPending;

  function handleSubmit() {
    setErrorMsg("");

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    loginMutation.mutate(
      { identifier, password },
      {
        onSuccess: () => {
          router.replace("/home");
        },
        onError: (err: Error) => {
          setErrorMsg(err.message ?? "Invalid credentials. Please try again.");
        },
      }
    );
  }

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
        <Text style={styles.headline}>Welcome back</Text>
        <Text style={styles.subtext}>
          Log in to manage your pots and payouts
        </Text>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {"❌"} {errorMsg}
            </Text>
          </View>
        ) : null}

        {/* Identifier Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone, Username or Email</Text>
          <TextInput
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            editable={!isPending}
            placeholder="e.g. @tunde or +234..."
            placeholderTextColor={theme.colors.inkMuted}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity onPress={() => router.push("/forgot-password")}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            editable={!isPending}
            placeholder="Enter password"
            placeholderTextColor={theme.colors.inkMuted}
            secureTextEntry
          />
        </View>

        {/* Login CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, isPending && styles.ctaDisabled]}
          onPress={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <ActivityIndicator color={theme.colors.ink} />
              <Text style={styles.ctaText}>Logging in...</Text>
            </>
          ) : (
            <>
              <Text style={styles.ctaText}>Log in</Text>
              <Text style={styles.ctaArrow}>{"➔"}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          New to Paadi?{" "}
          <Text
            style={styles.footerLink}
            onPress={() => router.push("/get-started")}
          >
            Create an account
          </Text>
        </Text>
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
    justifyContent: "center",
    width: "100%",
  },
  headline: {
    fontSize: theme.fontSize.huge,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    textAlign: "center",
  },
  subtext: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkMuted,
    textAlign: "center",
    marginBottom: theme.spacing[4],
  },
  errorBox: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    borderRadius: theme.borderRadius.xl,
    padding: 12,
    marginBottom: theme.spacing[4],
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: theme.spacing[4],
  },
  label: {
    fontSize: theme.fontSize.tiny,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.inkMuted,
    paddingLeft: 4,
    letterSpacing: 1,
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingLeft: 4,
  },
  forgotText: {
    fontSize: theme.fontSize.tiny,
    fontWeight: theme.fontWeight.bold,
    color: "#F59E0B",
  },
  input: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: 14,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
    borderBottomWidth: 2,
  },
  ctaButton: {
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
    marginTop: theme.spacing[4],
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
  ctaArrow: {
    fontSize: theme.fontSize.base,
  },
  footer: {
    flexShrink: 0,
    paddingTop: theme.spacing[4],
    alignItems: "center",
  },
  footerText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkMuted,
  },
  footerLink: {
    fontWeight: theme.fontWeight.bold,
    color: "#F59E0B",
  },
});
