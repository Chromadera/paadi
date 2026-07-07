// TODO: integrate expo-camera for real selfie capture
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSubmitSelfie } from "@/features/kyc/hooks";
import { PaadiApiError } from "@paadi/api-client";
import { theme } from "@/lib/theme";

export default function KycSelfiePage() {
  const router = useRouter();
  const submitSelfieMutation = useSubmitSelfie();
  const [captured, setCaptured] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isPending = submitSelfieMutation.isPending;

  function handleCapture() {
    setErrorMsg("");
    setCaptured(true);
    // Simulate capturing a selfie with a placeholder base64 string.
    // TODO: integrate expo-camera and replace this with real image capture.
  }

  function handleSubmit() {
    if (!captured) {
      setErrorMsg("Please capture a selfie first.");
      return;
    }

    // Send a placeholder image string for now
    const placeholderImage =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    submitSelfieMutation.mutate(placeholderImage, {
      onSuccess: () => {
        router.push("/verify/pending");
      },
      onError: (err) => {
        const apiErr = err as PaadiApiError;
        setErrorMsg(
          apiErr.message ??
            "Liveness check failed. Ensure your face is clearly visible and matches the BVN record."
        );
      },
    });
  }

  function handleRetake() {
    setCaptured(false);
    setErrorMsg("");
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

      {/* Core */}
      <View style={styles.coreArea}>
        {errorMsg !== "" && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Camera Preview Area */}
        <TouchableOpacity
          style={styles.cameraFrame}
          onPress={handleCapture}
          disabled={isPending}
          activeOpacity={0.8}
        >
          {captured ? (
            <View style={styles.capturedOverlay}>
              <Text style={styles.capturedEmoji}>{""}</Text>
              <Text style={styles.capturedText}>Selfie Captured!</Text>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <View style={styles.cameraCircle}>
                <Text style={styles.cameraIcon}>{""}</Text>
              </View>
              <Text style={styles.cameraHint}>Tap to Capture</Text>
            </View>
          )}

          {isPending && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.ink} />
            </View>
          )}
        </TouchableOpacity>

        {/* Guidance */}
        <View style={styles.guidance}>
          <Text style={styles.guidanceTitle}>Liveness Check</Text>
          <Text style={styles.guidanceText}>
            Please look directly into the camera in a well-lit room. Ensure your
            face is not covered by glasses or caps.
          </Text>
        </View>
      </View>

      {/* Footer actions */}
      <View style={styles.footer}>
        {captured ? (
          <View style={styles.footerActions}>
            <TouchableOpacity
              style={[styles.ctaButton, isPending && styles.ctaDisabled]}
              onPress={handleSubmit}
              disabled={isPending}
              activeOpacity={0.7}
            >
              <Text style={styles.ctaText}>Submit Selfie</Text>
              <Text style={styles.ctaArrow}>{"➔"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={handleRetake}
              disabled={isPending}
            >
              <Text style={styles.retakeText}>Retake photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleCapture}
            activeOpacity={0.7}
          >
            <Text style={styles.ctaText}>Open Camera</Text>
            <Text style={styles.ctaArrow}>{"➔"}</Text>
          </TouchableOpacity>
        )}
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
    justifyContent: "space-between",
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
  coreArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorBanner: {
    width: "100%",
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    backgroundColor: "rgba(239,68,68,0.1)",
    padding: 12,
    marginBottom: theme.spacing[4],
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
  },
  cameraFrame: {
    width: 192,
    height: 192,
    borderRadius: theme.borderRadius.full,
    borderWidth: 4,
    borderColor: "rgba(17,24,39,0.2)",
    borderStyle: "dashed",
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cameraPlaceholder: {
    alignItems: "center",
    gap: 8,
  },
  cameraCircle: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(17,24,39,0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    fontSize: 24,
  },
  cameraHint: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  capturedOverlay: {
    alignItems: "center",
    gap: 4,
  },
  capturedEmoji: {
    fontSize: 32,
  },
  capturedText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.full,
  },
  guidance: {
    alignItems: "center",
    marginTop: theme.spacing[6],
  },
  guidanceTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  guidanceText: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
    textAlign: "center",
    paddingHorizontal: theme.spacing[6],
    lineHeight: 18,
  },
  footer: {
    flexShrink: 0,
    paddingTop: theme.spacing[4],
  },
  footerActions: {
    gap: 12,
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
  retakeButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  retakeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.5)",
  },
});
