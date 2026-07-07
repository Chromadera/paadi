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
import { useForgotPassword } from "@/features/auth/login-hooks";
import { theme } from "@/lib/theme";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const forgotMutation = useForgotPassword();
  const [identifier, setIdentifier] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isPending = forgotMutation.isPending;

  function handleSubmit() {
    setErrorMsg("");
    setSuccessMsg("");

    if (!identifier.trim()) {
      setErrorMsg("Please enter your identifier.");
      return;
    }

    forgotMutation.mutate(
      { identifier },
      {
        onSuccess: (data: any) => {
          setSuccessMsg(
            data.message ??
              "If the account exists, a reset code has been sent."
          );
          setTimeout(() => {
            router.push("/reset-password");
          }, 3000);
        },
        onError: (err: any) => {
          setErrorMsg(
            err.message ?? "Something went wrong. Please try again."
          );
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
        <Text style={styles.headline}>Forgot password</Text>
        <Text style={styles.subtext}>
          Enter your details to receive a 6-digit recovery code
        </Text>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {"❌"} {errorMsg}
            </Text>
          </View>
        ) : null}

        {successMsg ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              {"✅"} {successMsg}
            </Text>
            <Text style={styles.redirectText}>
              Redirecting you to reset page...
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
            editable={!isPending && !successMsg}
            placeholder="e.g. @tunde or +234..."
            placeholderTextColor={theme.colors.inkMuted}
            autoCapitalize="none"
          />
        </View>

        {/* Send Code CTA */}
        <TouchableOpacity
          style={[
            styles.ctaButton,
            (isPending || !!successMsg) && styles.ctaDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isPending || !!successMsg}
        >
          {isPending ? (
            <>
              <ActivityIndicator color={theme.colors.ink} />
              <Text style={styles.ctaText}>Sending code...</Text>
            </>
          ) : (
            <>
              <Text style={styles.ctaText}>Send Code</Text>
              <Text style={styles.ctaArrow}>{"➔"}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Remember password?{" "}
          <Text
            style={styles.footerLink}
            onPress={() => router.push("/login")}
          >
            Log in
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
  successBox: {
    backgroundColor: "rgba(16,185,129,0.1)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
    borderRadius: theme.borderRadius.xl,
    padding: 12,
    marginBottom: theme.spacing[4],
    alignItems: "center",
  },
  successText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
    textAlign: "center",
  },
  redirectText: {
    fontSize: theme.fontSize.tiny,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.success,
    opacity: 0.7,
    marginTop: 4,
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
