import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useResendOtp, useVerifyPhone } from "@/features/onboarding/hooks";
import { PaadiApiError } from "@paadi/api-client";
import { theme } from "@/lib/theme";
import { Clock } from "lucide-react-native";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_S = 45;

export default function OtpPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const verifyPhone = useVerifyPhone();
  const resendOtp = useResendOtp();

  // Countdown timer
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const code = digits.join("");

  // Auto-submit code when complete
  useEffect(() => {
    if (code.length === CODE_LENGTH && !verifyPhone.isPending) {
      verifyPhone.mutate(code, {
        onSuccess: () => router.push("/name"),
      });
    }
  }, [code]);

  function handleChange(index: number, value: string) {
    const sanitized = value.replace(/\D/g, "");
    if (!sanitized) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }
    const next = [...digits];
    next[index] = sanitized.slice(-1);
    setDigits(next);

    if (index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key === "Backspace") {
      if (!digits[index] && index > 0) {
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
        inputRefs.current[index - 1]?.focus();
      } else {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      }
    }
  }

  function handleResend() {
    if (cooldown > 0 || resendOtp.isPending) return;
    resendOtp.mutate(undefined, {
      onSuccess: () => {
        setCooldown(RESEND_COOLDOWN_S);
        setDigits(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      },
    });
  }

  const error = verifyPhone.error as PaadiApiError | null;
  const isWrongCode = error?.statusCode === 401;
  const resendError = resendOtp.error as PaadiApiError | null;
  const isResendThrottled = resendError?.statusCode === 429;

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
        <Text style={styles.headline}>Enter the code</Text>
        <Text style={styles.subtext}>
          We sent a 6-digit verification code via SMS. Enter it below.
        </Text>

        {/* Input Cells */}
        <View style={styles.codeRow}>
          {digits.map((digit, i) => (
            <TextInput
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              style={[
                styles.codeCell,
                isWrongCode && styles.codeCellError,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(v) => handleChange(i, v)}
              // NOTE: React Native does not support onKeyPress for key names.
              // We handle focus/blur via onChangeText logic above.
              // Backspace handling is done by checking if the new value is empty.
              editable={!verifyPhone.isPending}
            />
          ))}
        </View>

        {/* Error Messages */}
        {isWrongCode && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              That code didn't work. Check it and try again.
            </Text>
          </View>
        )}
        {isResendThrottled && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              Please wait a moment before requesting another SMS.
            </Text>
          </View>
        )}

        {/* Resend Section */}
        <View style={styles.resendSection}>
          <Text style={styles.resendLabel}>Didn't get a code?</Text>
          {cooldown > 0 ? (
            <View style={styles.cooldownBadge}>
              <Clock size={14} color={theme.colors.secondary} />
              <Text style={styles.cooldownText}>
                {String(Math.floor(cooldown / 60)).padStart(2, "0")}:
                {String(cooldown % 60).padStart(2, "0")}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.resendButton,
                resendOtp.isPending && styles.resendDisabled,
              ]}
              onPress={handleResend}
              disabled={resendOtp.isPending}
            >
              <Text style={styles.resendButtonText}>
                {resendOtp.isPending ? "Resending..." : "Resend code"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Privacy Footer */}
      <View style={styles.privacyBox}>
        <View style={styles.privacyIcon}>
          <Text style={styles.privacyIconText}>{"✓"}</Text>
        </View>
        <View>
          <Text style={styles.privacyTitle}>Encrypted & Secure</Text>
          <Text style={styles.privacySubtext}>
            We use bank-grade encryption to protect your account setup.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[6],
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
    alignItems: "center",
    paddingTop: theme.spacing[6],
    width: "100%",
  },
  headline: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  subtext: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.inkMuted,
    textAlign: "center",
  },
  codeRow: {
    marginTop: theme.spacing[8],
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    paddingHorizontal: theme.spacing[2],
  },
  codeCell: {
    height: 48,
    width: 40,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    textAlign: "center",
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 2,
  },
  codeCellError: {
    borderColor: theme.colors.danger,
    backgroundColor: "rgba(239,68,68,0.05)",
  },
  errorBox: {
    marginTop: theme.spacing[4],
    width: "100%",
    paddingHorizontal: theme.spacing[2],
  },
  errorText: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
    backgroundColor: "#FEF2F2",
    paddingVertical: 8,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    overflow: "hidden",
  },
  resendSection: {
    marginTop: 40,
    alignItems: "center",
    gap: 10,
  },
  resendLabel: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkMuted,
    letterSpacing: 1,
  },
  cooldownBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 2,
  },
  cooldownText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.inkMuted,
  },
  resendButton: {
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderBottomWidth: 2,
  },
  resendDisabled: {
    opacity: 0.4,
  },
  resendButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  privacyBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    backgroundColor: "#FCE7F3",
    padding: 14,
    flexShrink: 0,
  },
  privacyIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.secondary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    justifyContent: "center",
    alignItems: "center",
  },
  privacyIconText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  privacyTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  privacySubtext: {
    fontSize: theme.fontSize.tiny,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkMuted,
    marginTop: 2,
    lineHeight: 16,
  },
});
