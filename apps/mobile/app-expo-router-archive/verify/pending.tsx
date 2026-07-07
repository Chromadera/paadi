import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthedClient } from "@/lib/api/client";
import { theme } from "@/lib/theme";

export default function KycPendingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["me", "kyc"],
    queryFn: () => getAuthedClient().getKyc(),
    refetchInterval: (query) => {
      const kycData = query.state.data as { kycStatus: string } | undefined;
      if (kycData && kycData.kycStatus === "PENDING") {
        return 3000;
      }
      return false;
    },
  });

  const kycStatus = data?.kycStatus;

  // Invalidate main me query when verification completes
  useEffect(() => {
    if (kycStatus === "VERIFIED") {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    }
  }, [kycStatus, queryClient]);

  function handleFinish() {
    router.push("/home");
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.spacer} />
        <Text style={styles.brand}>Paadi</Text>
        <View style={styles.spacer} />
      </View>

      {/* Core display */}
      <View style={styles.coreArea}>
        {kycStatus === "PENDING" || isPending ? (
          <View style={styles.statusSection}>
            <View style={styles.spinnerBox}>
              <ActivityIndicator size="large" color={theme.colors.ink} />
            </View>
            <Text style={styles.statusTitle}>Processing KYC</Text>
            <Text style={styles.statusDescription}>
              We are checking your selfie against your BVN records. Please do
              not close this window.
            </Text>
            <View style={styles.dotRow}>
              <View style={[styles.pulseDot, styles.pulseDot1]} />
              <View style={[styles.pulseDot, styles.pulseDot2]} />
              <View style={[styles.pulseDot, styles.pulseDot3]} />
            </View>
          </View>
        ) : kycStatus === "VERIFIED" ? (
          <View style={styles.statusSection}>
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>{""}</Text>
            </View>
            <Text style={[styles.statusTitle, { color: theme.colors.success }]}>
              Verification Successful!
            </Text>
            <Text style={styles.statusDescription}>
              Congratulations! Your identity has been verified. Your account is
              now upgraded to{" "}
              <Text style={styles.boldText}>{data?.tier}</Text>.
            </Text>
          </View>
        ) : (
          <View style={styles.statusSection}>
            <View style={styles.failedBox}>
              <Text style={styles.failedIcon}>!</Text>
            </View>
            <Text style={[styles.statusTitle, { color: theme.colors.danger }]}>
              Verification Failed
            </Text>
            <Text style={styles.statusDescription}>
              Unfortunately, we couldn't verify your identity. Please ensure
              your selfie is clear and try again.
            </Text>
          </View>
        )}
      </View>

      {/* Footer actions */}
      <View style={styles.footer}>
        {kycStatus === "VERIFIED" ? (
          <TouchableOpacity
            style={[styles.ctaButton, styles.ctaSuccess]}
            onPress={handleFinish}
            activeOpacity={0.7}
          >
            <Text style={styles.ctaText}>Enter Dashboard</Text>
            <Text style={styles.ctaArrow}>{"➔"}</Text>
          </TouchableOpacity>
        ) : kycStatus === "FAILED" ? (
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/verify")}
            activeOpacity={0.7}
          >
            <Text style={styles.ctaText}>Try Again</Text>
            <Text style={styles.ctaArrow}>{"➔"}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.disabledButton}>
            <Text style={styles.disabledText}>Waiting for outcome...</Text>
          </View>
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
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  spacer: {
    width: 40,
  },
  brand: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  coreArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusSection: {
    alignItems: "center",
  },
  spinnerBox: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius["3xl"],
    backgroundColor: "rgba(255,210,0,0.15)",
    borderWidth: 2,
    borderColor: theme.colors.ink,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[6],
  },
  successBox: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius["3xl"],
    backgroundColor: "rgba(16,185,129,0.15)",
    borderWidth: 2,
    borderColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[6],
  },
  successIcon: {
    fontSize: 32,
  },
  failedBox: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius["3xl"],
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 2,
    borderColor: theme.colors.danger,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[6],
  },
  failedIcon: {
    fontSize: 32,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.danger,
  },
  statusTitle: {
    fontSize: 26,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    textAlign: "center",
  },
  statusDescription: {
    marginTop: 10,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
    textAlign: "center",
    paddingHorizontal: theme.spacing[6],
    lineHeight: 18,
  },
  boldText: {
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.ink,
  },
  dotRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: theme.spacing[6],
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(17,24,39,0.2)",
  },
  pulseDot1: {
    opacity: 1,
  },
  pulseDot2: {
    opacity: 0.6,
  },
  pulseDot3: {
    opacity: 0.3,
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
  ctaSuccess: {
    backgroundColor: theme.colors.success,
  },
  ctaText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
  ctaArrow: {
    fontSize: theme.fontSize.base,
  },
  disabledButton: {
    width: "100%",
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: "rgba(17,24,39,0.04)",
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(17,24,39,0.1)",
  },
  disabledText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: "rgba(17,24,39,0.3)",
  },
});
