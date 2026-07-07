import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  useUsernameAvailable,
  useSignupUsername,
} from "@/features/onboarding/hooks";
import { PaadiApiError } from "@paadi/api-client";
import { theme } from "@/lib/theme";
import { Loader2 } from "lucide-react-native";

export default function UsernamePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedUsername(username),
      400
    );
    return () => clearTimeout(timer);
  }, [username]);

  const availability = useUsernameAvailable(debouncedUsername);
  const isChecking = availability.isFetching;
  const isAvailable = availability.data?.available ?? null;
  const signupUsername = useSignupUsername();
  const isPending = signupUsername.isPending;

  function handleInputChange(value: string) {
    const sanitized = value
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9_]/g, "");
    setUsername(sanitized);
  }

  function handleSubmit() {
    if (
      username.length < 3 ||
      isChecking ||
      isAvailable === false ||
      isPending
    )
      return;
    signupUsername.mutate(username, {
      onSuccess: () => router.push("/password"),
    });
  }

  const error = signupUsername.error as PaadiApiError | null;
  const isTaken = error?.statusCode === 409;

  // Status pill text
  const statusText =
    isAvailable === false
      ? "Already taken!"
      : isAvailable === true
        ? "Looking good!"
        : "Make it catchy!";
  const statusColor =
    isAvailable === false
      ? theme.colors.danger
      : isAvailable === true
        ? theme.colors.success
        : "#F472B6";

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
          <Text style={styles.iconText}>@</Text>
        </View>

        <Text style={styles.headline}>Claim your handle</Text>
        <Text style={styles.subtext}>
          Your @username is how friends find and add you to pots.
        </Text>

        {/* Status Pill */}
        <View style={[styles.statusPill, { backgroundColor: statusColor }]}>
          <Text style={styles.statusPillText}>{statusText}</Text>
        </View>

        {/* Username Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.atPrefix}>@</Text>
          <TextInput
            style={styles.input}
            autoFocus
            autoCapitalize="none"
            placeholder="username"
            placeholderTextColor={theme.colors.inkMuted}
            value={username}
            onChangeText={handleInputChange}
            editable={!isPending}
          />
          {isChecking && (
            <Loader2 size={16} color={theme.colors.inkMuted} />
          )}
        </View>

        {isTaken && (
          <Text style={styles.errorText}>
            That username was just taken -- try another.
          </Text>
        )}

        {/* Preview Card */}
        <View style={styles.previewCard}>
          <Text style={styles.previewHeader}>Preview</Text>
          <View style={styles.previewRow}>
            <View style={styles.previewAvatar}>
              <Text>{"👦🏼"}</Text>
            </View>
            <View>
              <Text style={styles.previewName}>Alex Rivera</Text>
              <Text style={styles.previewHandle}>
                @{username || "username"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.ctaButton,
            (username.length < 3 ||
              isChecking ||
              isAvailable === false ||
              isPending) &&
              styles.ctaDisabled,
          ]}
          onPress={handleSubmit}
          disabled={
            username.length < 3 ||
            isChecking ||
            isAvailable === false ||
            isPending
          }
        >
          {isPending ? (
            <ActivityIndicator color={theme.colors.ink} />
          ) : (
            <Text style={styles.ctaText}>Set Username</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By claiming this handle, you agree to our Community Guidelines and
          Terms of Service.
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
  iconText: {
    fontSize: 28,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
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
    marginBottom: theme.spacing[4],
  },
  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing[2],
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[2],
    borderBottomWidth: 2,
  },
  atPrefix: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.inkMuted,
    marginRight: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    marginBottom: theme.spacing[4],
  },
  previewCard: {
    backgroundColor: "#FCE7F3",
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    padding: 16,
    marginTop: theme.spacing[4],
    gap: 12,
  },
  previewHeader: {
    fontSize: theme.fontSize.tiny,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.inkMuted,
    letterSpacing: 1,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(255,210,0,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,210,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  previewHandle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkMuted,
    marginTop: 2,
  },
  footer: {
    gap: 16,
    flexShrink: 0,
    paddingTop: theme.spacing[4],
    alignItems: "center",
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
  termsText: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.inkMuted,
    maxWidth: 280,
    lineHeight: 16,
  },
});
