import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useKycStatus } from "@/features/kyc/hooks";
import { theme } from "@/lib/theme";

export default function KycPage() {
  const router = useRouter();
  const { data, isPending, error } = useKycStatus();

  if (isPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Checking KYC status...</Text>
      </View>
    );
  }

  if (error && !isPending) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Couldn't check verification status.
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.goBack}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{"←"}</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>Paadi</Text>
        <View style={styles.spacer} />
      </View>

      {/* Core display */}
      <View style={styles.coreArea}>
        {data && (
          <View style={styles.statusSection}>
            {/* Status icon */}
            <View style={styles.statusIconContainer}>
              {data.kycStatus === "VERIFIED" ? (
                <Text style={styles.statusEmoji}>{""}</Text>
              ) : data.kycStatus === "PENDING" ? (
                <ActivityIndicator size="large" color={theme.colors.ink} />
              ) : (
                <Text style={styles.statusEmoji}>{""}</Text>
              )}
            </View>

            <Text style={styles.statusTitle}>
              {data.kycStatus === "VERIFIED"
                ? "Identity Verified"
                : data.kycStatus === "PENDING"
                ? "Verification Pending"
                : "Verify Identity"}
            </Text>
            <Text style={styles.statusDescription}>
              {data.kycStatus === "VERIFIED"
                ? "Your account is fully upgraded to Tier 1. Enjoy unlimited splits and high settlement limits."
                : data.kycStatus === "PENDING"
                ? "We are currently processing your KYC documents. This usually takes less than 3 minutes."
                : "To unlock full transfers, high settlement caps, and payouts, please verify your details."}
            </Text>

            {/* Checklist */}
            <View style={styles.checklist}>
              <View style={styles.checklistHeader}>
                <Text style={styles.checklistLabel}>
                  VERIFICATION CHECKLIST
                </Text>
                <View style={styles.tierBadge}>
                  <Text style={styles.tierBadgeText}>Tier 1 limit</Text>
                </View>
              </View>
              <View style={styles.divider} />

              {/* BVN step */}
              <View style={styles.checklistItem}>
                <Text
                  style={
                    data.bvnVerified
                      ? styles.checkDone
                      : styles.checkPending
                  }
                >
                  {data.bvnVerified ? "✓" : "○"}
                </Text>
                <Text style={styles.checklistItemText}>
                  1. Bank Verification Number (BVN)
                </Text>
                {data.bvnVerified && (
                  <Text style={styles.checkDoneLabel}>Done</Text>
                )}
              </View>

              {/* Selfie step */}
              <View style={styles.checklistItem}>
                <Text
                  style={
                    data.kycStatus === "VERIFIED"
                      ? styles.checkDone
                      : styles.checkPending
                  }
                >
                  {data.kycStatus === "VERIFIED" ? "✓" : "○"}
                </Text>
                <Text style={styles.checklistItemText}>
                  2. Liveness Selfie Verification
                </Text>
                {data.kycStatus === "VERIFIED" && (
                  <Text style={styles.checkDoneLabel}>Done</Text>
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Action footer */}
      <View style={styles.footer}>
        {data && (
          <>
            {data.kycStatus === "NONE" || data.kycStatus === "FAILED" ? (
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => router.push("/verify/bvn")}
                activeOpacity={0.7}
              >
                <Text style={styles.ctaText}>Start Verification</Text>
                <Text style={styles.ctaArrow}>{"➔"}</Text>
              </TouchableOpacity>
            ) : data.kycStatus === "PENDING" ? (
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => router.push("/verify/pending")}
                activeOpacity={0.7}
              >
                <Text style={styles.ctaText}>Check Pending Status</Text>
                <Text style={styles.ctaArrow}>{"➔"}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.ctaSecondary}
                onPress={() => router.push("/home")}
                activeOpacity={0.7}
              >
                <Text style={styles.ctaSecondaryText}>Back to Dashboard</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[8],
    paddingTop: theme.spacing[5],
    flexGrow: 1,
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
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: theme.spacing[6],
  },
  loadingText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
  },
  goBack: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.secondary,
    textAlign: "center",
    marginTop: 8,
  },
  coreArea: {
    flex: 1,
    justifyContent: "center",
  },
  statusSection: {
    alignItems: "center",
    gap: theme.spacing[2],
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius["3xl"],
    backgroundColor: "rgba(255,210,0,0.15)",
    borderWidth: 2,
    borderColor: theme.colors.ink,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[4],
  },
  statusEmoji: {
    fontSize: 32,
  },
  statusTitle: {
    fontSize: 26,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    textAlign: "center",
  },
  statusDescription: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.5)",
    textAlign: "center",
    paddingHorizontal: theme.spacing[6],
    lineHeight: 18,
  },
  checklist: {
    width: "100%",
    marginTop: theme.spacing[6],
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    padding: theme.spacing[5],
    gap: theme.spacing[4],
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checklistLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    letterSpacing: 1,
  },
  tierBadge: {
    backgroundColor: "rgba(255,210,0,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "#92400E",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(17,24,39,0.06)",
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkDone: {
    color: theme.colors.success,
    fontWeight: theme.fontWeight.extrabold,
    fontSize: theme.fontSize.xs,
  },
  checkPending: {
    color: "rgba(17,24,39,0.3)",
    fontWeight: theme.fontWeight.extrabold,
    fontSize: theme.fontSize.xs,
  },
  checklistItemText: {
    flex: 1,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.8)",
  },
  checkDoneLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
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
  ctaText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
  ctaArrow: {
    fontSize: theme.fontSize.base,
  },
  ctaSecondary: {
    width: "100%",
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: theme.colors.white,
    paddingVertical: 16,
    paddingHorizontal: theme.spacing[4],
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.ink,
  },
  ctaSecondaryText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
});
