import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Fingerprint } from "lucide-react-native";
import { useRegisterDevice } from "@/features/onboarding/hooks";
import { useOnboardingStore } from "@/features/onboarding/store";
import { theme } from "@/lib/theme";

export default function BiometricPage() {
  const router = useRouter();
  const registerDevice = useRegisterDevice();
  const setBiometricEnabled = useOnboardingStore((s) => s.setBiometricEnabled);
  const isAuthenticating = registerDevice.isPending;

  function getDeviceId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  function handleBiometricAuth() {
    const deviceId = getDeviceId();
    registerDevice.mutate(
      { deviceId, biometricEnabled: true },
      {
        onSuccess: () => {
          setBiometricEnabled(true);
          router.push("/ready");
        },
        onError: () => {
          setBiometricEnabled(true);
          router.push("/ready");
        },
      }
    );
  }

  function handleSkip() {
    const deviceId = getDeviceId();
    registerDevice.mutate(
      { deviceId, biometricEnabled: false },
      {
        onSuccess: () => {
          setBiometricEnabled(false);
          router.push("/ready");
        },
        onError: () => {
          setBiometricEnabled(false);
          router.push("/ready");
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
        {/* Biometric Target */}
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometricAuth}
          disabled={isAuthenticating}
        >
          {isAuthenticating ? (
            <ActivityIndicator
              size="large"
              color={theme.colors.secondary}
            />
          ) : (
            <Fingerprint size={48} color={theme.colors.ink} />
          )}
        </TouchableOpacity>

        <Text style={styles.headline}>Enable biometrics</Text>
        <Text style={styles.subtext}>
          Use Face ID or Touch ID for frictionless entry, quick approvals, and
          instant balance unlocks.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.ctaButton,
            isAuthenticating && styles.ctaDisabled,
          ]}
          onPress={handleBiometricAuth}
          disabled={isAuthenticating}
        >
          <Text style={styles.ctaText}>Enable Biometrics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={isAuthenticating}
        >
          <Text style={styles.skipText}>Skip for now</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  biometricButton: {
    width: 96,
    height: 96,
    backgroundColor: theme.colors.white,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[8],
    borderBottomWidth: 4,
  },
  headline: {
    fontSize: theme.fontSize.huge - 2,
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
    paddingHorizontal: theme.spacing[6],
    lineHeight: 18,
  },
  footer: {
    gap: 12,
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
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  skipText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkMuted,
  },
});
