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
import { useSignupProfile } from "@/features/onboarding/hooks";
import { PaadiApiError } from "@paadi/api-client";
import { theme } from "@/lib/theme";

export default function NamePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const signupProfile = useSignupProfile();
  const isPending = signupProfile.isPending;

  function handleContinue() {
    if (!firstName.trim() || !lastName.trim() || isPending) return;
    signupProfile.mutate(
      { firstName: firstName.trim(), lastName: lastName.trim() },
      {
        onSuccess: () => router.push("/username"),
      }
    );
  }

  const isValid = firstName.trim().length >= 2 && lastName.trim().length >= 2;
  const error = signupProfile.error as PaadiApiError | null;

  const getInitials = () => {
    const f = firstName.trim().charAt(0).toUpperCase();
    const l = lastName.trim().charAt(0).toUpperCase();
    return `${f}${l}` || "P";
  };

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
        <Text style={styles.headline}>What should we call you?</Text>
        <Text style={styles.subtext}>
          Use your real name so your companions recognize you on bill splits.
        </Text>

        {/* First Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            autoFocus
            placeholder="e.g., Tunde"
            placeholderTextColor={theme.colors.inkMuted}
            value={firstName}
            onChangeText={setFirstName}
            editable={!isPending}
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Adebayo"
            placeholderTextColor={theme.colors.inkMuted}
            value={lastName}
            onChangeText={setLastName}
            editable={!isPending}
          />
        </View>

        {error && (
          <Text style={styles.errorText}>
            Couldn't save your name. Please try again.
          </Text>
        )}

        {/* Preview Card */}
        <View style={styles.previewCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <View style={styles.previewInfo}>
            <Text style={styles.previewLabel}>Profile Preview</Text>
            <Text style={styles.previewName}>
              {firstName || lastName
                ? `${firstName} ${lastName}`
                : "Your Name Here"}
            </Text>
            <Text style={styles.previewRole}>Paadi Partner</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaButton, (!isValid || isPending) && styles.ctaDisabled]}
          onPress={handleContinue}
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

        <Text style={styles.termsText}>
          By continuing, you agree to Paadi's Terms of Service & Privacy Policy.
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
  headline: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    textAlign: "center",
  },
  subtext: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.inkMuted,
    textAlign: "center",
    marginBottom: theme.spacing[6],
  },
  inputGroup: {
    marginBottom: theme.spacing[4],
  },
  label: {
    fontSize: 11,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.inkMuted,
    marginBottom: 6,
    paddingLeft: 4,
    letterSpacing: 1,
  },
  input: {
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: 12,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
    borderBottomWidth: 2,
  },
  errorText: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: theme.colors.ink,
    padding: 16,
    marginTop: theme.spacing[6],
    borderBottomWidth: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.secondary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
  },
  avatarText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.white,
  },
  previewInfo: {
    flex: 1,
  },
  previewLabel: {
    fontSize: theme.fontSize.tiny,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.secondary,
    letterSpacing: 1,
  },
  previewName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    marginTop: 2,
  },
  previewRole: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkMuted,
    marginTop: 2,
  },
  footer: {
    gap: 16,
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
  termsText: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.inkMuted,
    paddingHorizontal: theme.spacing[4],
    lineHeight: 16,
  },
});
