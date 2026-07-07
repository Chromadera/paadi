import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { publicClient } from "@/lib/api/client";
import { theme } from "@/lib/theme";
import { ShieldCheck, CreditCard, ExternalLink } from "lucide-react-native";

export default function PayPage() {
  const { token } = useLocalSearchParams<{ token: string }>();

  const { data: view, isPending, error } = useQuery({
    queryKey: ["pay", token],
    queryFn: () => publicClient.getPayerView(token),
    refetchInterval: (query) => {
      const currentView = query.state.data;
      if (
        currentView &&
        (currentView.shareStatus === "pending" ||
          currentView.shareStatus === "partially_paid")
      ) {
        return 3500;
      }
      return false;
    },
  });

  if (isPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading Payment Link...</Text>
      </View>
    );
  }

  if (error || !view) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          Payment link not found or expired.
        </Text>
        <Text style={styles.errorDescription}>
          Contact the pot organizer to check if this split link is still valid.
        </Text>
      </View>
    );
  }

  const isPaid =
    view.shareStatus === "paid" || view.shareStatus === "overpaid";
  const overallProgressPct =
    view.progress.targetKobo > 0
      ? Math.min(
          100,
          Math.round(
            (view.progress.collectedKobo / view.progress.targetKobo) * 100
          )
        )
      : 0;

  const handleOpenCheckout = () => {
    if (view.checkoutUrl) {
      Linking.openURL(view.checkoutUrl);
    }
  };

  return (
    <View style={styles.container}>
      {/* Branding */}
      <View style={styles.brandingHeader}>
        <Text style={styles.brand}>Paadi</Text>
      </View>

      {/* Core Payment Area */}
      <View style={styles.coreArea}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.label}>Contribution Split</Text>
          <Text style={styles.potTitle}>{view.potTitle}</Text>
        </View>

        {/* Organizer Card */}
        <View style={styles.organizerCard}>
          <View style={styles.organizerAvatar}>
            <Text style={styles.organizerAvatarText}>
              {view.organizerName[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.organizerInfo}>
            <Text style={styles.organizerLabel}>Organizer</Text>
            <Text style={styles.organizerName}>{view.organizerName}</Text>
            <Text style={styles.organizerHandle}>
              @{view.organizerHandle}
            </Text>
          </View>
        </View>

        {/* Amount Card */}
        <View style={styles.amountCard}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>
              Your Split Share ({view.splitLabel})
            </Text>
            <Text style={styles.amountValue}>
              N{(view.shareKobo / 100).toLocaleString()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Overall pot progress</Text>
              <Text style={styles.progressAmount}>
                N{(view.progress.collectedKobo / 100).toLocaleString()} / N
                {(view.progress.targetKobo / 100).toLocaleString()}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${overallProgressPct}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {isPaid ? (
          <View style={styles.paidBanner}>
            <View style={styles.paidIconContainer}>
              <ShieldCheck
                size={24}
                color={theme.colors.success}
                strokeWidth={2.5}
              />
            </View>
            <Text style={styles.paidTitle}>Contribution Paid!</Text>
            <Text style={styles.paidDescription}>
              Thank you. The organizer has been notified of your payment.
            </Text>
          </View>
        ) : view.potStatus === "cancelled" ? (
          <View style={styles.cancelledBanner}>
            <Text style={styles.cancelledText}>
              This split pot has been cancelled by the organizer.
            </Text>
          </View>
        ) : view.checkoutUrl ? (
          <TouchableOpacity
            style={styles.payButton}
            onPress={handleOpenCheckout}
            activeOpacity={0.7}
          >
            <CreditCard size={20} color={theme.colors.ink} strokeWidth={2} />
            <Text style={styles.payButtonText}>
              Pay with Nomba Checkout
            </Text>
            <ExternalLink size={16} color={theme.colors.ink} strokeWidth={2} />
          </TouchableOpacity>
        ) : (
          <View style={styles.cancelledBanner}>
            <Text style={styles.cancelledText}>
              Checkout session is not initialized. Try again.
            </Text>
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
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[8],
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing[6],
  },
  errorTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
  },
  errorDescription: {
    fontSize: theme.fontSize.xs,
    color: "rgba(17,24,39,0.4)",
    textAlign: "center",
    marginTop: 4,
    maxWidth: 240,
  },
  brandingHeader: {
    alignItems: "center",
    paddingVertical: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius["2xl"],
  },
  brand: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  coreArea: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: theme.spacing[6],
  },
  label: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.3)",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  potTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    marginTop: 4,
  },
  organizerCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[4],
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: theme.spacing[4],
  },
  organizerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  organizerAvatarText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  organizerName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.ink,
    marginTop: 2,
  },
  organizerHandle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.3)",
    marginTop: 2,
  },
  amountCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[5],
    gap: theme.spacing[4],
  },
  amountSection: {
    alignItems: "center",
    gap: 4,
  },
  amountLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  amountValue: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(17,24,39,0.06)",
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
  },
  progressAmount: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
  },
  progressBar: {},
  progressBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(17,24,39,0.04)",
    borderRadius: 9999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 9999,
  },
  footer: {
    paddingTop: theme.spacing[4],
  },
  paidBanner: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[4],
    alignItems: "center",
    gap: 10,
  },
  paidIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: "rgba(16,185,129,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  paidTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.extrabold,
    color: "#047857",
  },
  paidDescription: {
    fontSize: 10,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(4,120,87,0.6)",
    textAlign: "center",
  },
  cancelledBanner: {
    backgroundColor: "rgba(17,24,39,0.04)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.1)",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[4],
    alignItems: "center",
  },
  cancelledText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.5)",
  },
  payButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderBottomWidth: 4,
    borderRadius: theme.borderRadius["2xl"],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  payButtonText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
});
