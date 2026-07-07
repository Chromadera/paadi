import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Share,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  usePot,
  useCancelPot,
  useDeletePot,
  usePotSettlement,
  usePotActivity,
} from "@/features/pots/hooks";
import { theme } from "@/lib/theme";
import { Calendar, Copy, CheckCircle, Receipt } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

export default function PotDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: pot, isPending, error } = usePot(id);
  const { data: settlement } = usePotSettlement(id);
  const { data: activity } = usePotActivity(id);

  const cancelPotMutation = useCancelPot(id);
  const deletePotMutation = useDeletePot(id);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const isMutating = cancelPotMutation.isPending || deletePotMutation.isPending;

  function handleCopyLink(token: string, index: number) {
    const payLink = `https://paadi.vercel.app/pay/${token}`;
    Clipboard.setStringAsync(payLink);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function handleShare(token: string) {
    const payLink = `https://paadi.vercel.app/pay/${token}`;
    Share.share({ message: `Pay your share: ${payLink}` });
  }

  function handleCancel() {
    Alert.alert(
      "Cancel Pot",
      "Are you sure you want to cancel this pot? This will stop collections.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            cancelPotMutation.mutate(undefined, {
              onError: (err: any) =>
                setErrorMsg(err.message ?? "Failed to cancel pot."),
            });
          },
        },
      ]
    );
  }

  function handleDelete() {
    Alert.alert(
      "Delete Pot",
      "Are you sure you want to delete this pot permanently?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: () => {
            deletePotMutation.mutate(undefined, {
              onSuccess: () => {
                router.push("/pots");
              },
              onError: (err: any) =>
                setErrorMsg(err.message ?? "Failed to delete pot."),
            });
          },
        },
      ]
    );
  }

  if (isPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading Pot details...</Text>
      </View>
    );
  }

  if (error || !pot) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Pot not found or access denied.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/pots")}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Back to Pots</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progressPct =
    pot.totalKobo > 0
      ? Math.min(
          100,
          Math.round((pot.progress.collectedKobo / pot.totalKobo) * 100)
        )
      : 0;
  const deadline = pot.deadlineAt
    ? new Date(pot.deadlineAt).toLocaleDateString()
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/pots")}
          style={styles.backAction}
        >
          <Text style={styles.backArrow}>{"<-"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pot Overview</Text>
        <View style={styles.headerSpacer} />
      </View>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorBoxText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* Core Detail */}
      <View style={styles.card}>
        <View style={styles.detailHeader}>
          <View style={styles.detailHeaderLeft}>
            <Text style={styles.potTitle}>{pot.title}</Text>
            {deadline && (
              <View style={styles.deadlineRow}>
                <Calendar size={12} color="rgba(17,24,39,0.4)" />
                <Text style={styles.deadlineText}>Ends {deadline}</Text>
              </View>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              pot.status === "open"
                ? styles.statusOpen
                : pot.status === "settled"
                  ? styles.statusSettled
                  : styles.statusOther,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                pot.status === "open"
                  ? styles.statusTextOpen
                  : pot.status === "settled"
                    ? styles.statusTextSettled
                    : styles.statusTextOther,
              ]}
            >
              {pot.status}
            </Text>
          </View>
        </View>

        {pot.description ? (
          <Text style={styles.description}>{pot.description}</Text>
        ) : null}

        <View style={styles.divider} />

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Collection Progress ({pot.progress.paidCount}/
              {pot.progress.splitCount} paid)
            </Text>
            <Text style={styles.progressAmount}>
              N{(pot.progress.collectedKobo / 100).toLocaleString()} / N
              {(pot.totalKobo / 100).toLocaleString()}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPct}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Settlement Status */}
      {settlement?.settlement && (
        <View style={styles.settlementCard}>
          <View style={styles.settlementHeader}>
            <Receipt size={16} color="#92400E" strokeWidth={2.25} />
            <Text style={styles.settlementTitle}>Settlement status</Text>
          </View>
          <Text style={styles.settlementDetail}>
            Status:{" "}
            <Text style={styles.settlementBold}>
              {settlement.settlement.status}
            </Text>
          </Text>
          {(settlement.settlement as any).vend && (
            <View style={styles.vendBox}>
              <Text style={styles.vendLabel}>Electricity Token</Text>
              <Text style={styles.vendToken} selectable>
                {(settlement.settlement as any).vend.token || "Generating..."}
              </Text>
              <Text style={styles.vendUnits}>
                {(settlement.settlement as any).vend.units || "0"} units vended
              </Text>
            </View>
          )}
          {(settlement.settlement as any).destination && (
            <Text style={styles.settlementDetail}>
              Destination:{" "}
              <Text style={styles.settlementBold}>
                {(settlement.settlement as any).destination.bankName} (*
                {(settlement.settlement as any).destination.accountNumberLast4})
              </Text>
            </Text>
          )}
        </View>
      )}

      {/* Splits List */}
      <View style={styles.splitsSection}>
        <Text style={styles.splitsTitle}>
          Split Links for Contributors
        </Text>
        <View style={styles.splitsList}>
          {pot.splits.map((split, i) => (
            <View key={split.id} style={styles.splitItem}>
              <View style={styles.splitInfo}>
                <Text style={styles.splitLabel}>{split.label}</Text>
                <Text style={styles.splitShare}>
                  N{(split.shareKobo / 100).toLocaleString()} ·{" "}
                  {split.status}
                </Text>
              </View>

              <View style={styles.splitActions}>
                <View
                  style={[
                    styles.splitStatusBadge,
                    split.status === "paid"
                      ? styles.splitPaid
                      : styles.splitPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.splitStatusText,
                      split.status === "paid"
                        ? styles.splitStatusPaidText
                        : styles.splitStatusPendingText,
                    ]}
                  >
                    {split.status}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.copyButton,
                    copiedIndex === i && styles.copyButtonActive,
                  ]}
                  onPress={() => handleCopyLink(split.payToken, i)}
                  onLongPress={() => handleShare(split.payToken)}
                  activeOpacity={0.7}
                >
                  {copiedIndex === i ? (
                    <CheckCircle size={14} color={theme.colors.success} />
                  ) : (
                    <Copy size={14} color="rgba(17,24,39,0.5)" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Activity */}
      {activity?.items && activity.items.length > 0 && (
        <View style={styles.activitySection}>
          <Text style={styles.splitsTitle}>Recent activity</Text>
          <View style={styles.activityList}>
            {activity.items.slice(0, 3).map((act) => (
              <View key={act.id} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityHeadline}>{act.headline}</Text>
                  <Text style={styles.activityTime}>
                    {new Date(act.occurredAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Management Actions */}
      <View style={styles.actionsSection}>
        {pot.status === "open" && pot.progress.collectedKobo === 0 && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isMutating}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>
              Delete Pot Permanently
            </Text>
          </TouchableOpacity>
        )}

        {pot.status === "open" && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isMutating}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>
              Cancel Pot (Stop collections)
            </Text>
          </TouchableOpacity>
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
    paddingHorizontal: theme.spacing[5],
    paddingBottom: theme.spacing[8] + 80,
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
  backButton: {
    marginTop: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderRadius: theme.borderRadius.xl,
  },
  backButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing[2],
  },
  backAction: {
    padding: 8,
  },
  backArrow: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.75)",
  },
  headerTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.ink,
    textTransform: "uppercase",
  },
  headerSpacer: {
    width: 40,
  },
  errorBox: {
    marginTop: theme.spacing[4],
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    borderRadius: theme.borderRadius.xl,
    padding: 12,
  },
  errorBoxText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
  },
  card: {
    marginTop: theme.spacing[4],
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[5],
    gap: theme.spacing[4],
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailHeaderLeft: {
    flex: 1,
  },
  potTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  deadlineText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusOpen: {
    backgroundColor: "rgba(16,185,129,0.1)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
  statusSettled: {
    backgroundColor: "rgba(255,210,0,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,210,0,0.2)",
  },
  statusOther: {
    backgroundColor: "rgba(17,24,39,0.04)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.1)",
  },
  statusText: {
    fontSize: 9,
    fontWeight: theme.fontWeight.black,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statusTextOpen: {
    color: "#047857",
  },
  statusTextSettled: {
    color: "#92400E",
  },
  statusTextOther: {
    color: "rgba(17,24,39,0.4)",
  },
  description: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.6)",
    lineHeight: 18,
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
    fontSize: 11,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
  },
  progressAmount: {
    fontSize: 11,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.ink,
  },
  progressBar: {},
  progressBarBg: {
    width: "100%",
    height: 12,
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
  settlementCard: {
    marginTop: theme.spacing[4],
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[4],
    gap: 6,
  },
  settlementHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  settlementTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: "#92400E",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  settlementDetail: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(146,64,14,0.8)",
  },
  settlementBold: {
    fontWeight: theme.fontWeight.extrabold,
  },
  vendBox: {
    marginTop: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 10,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.5)",
    gap: 4,
  },
  vendLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: "#92400E",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  vendToken: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    marginTop: 2,
  },
  vendUnits: {
    fontSize: 10,
    color: "rgba(17,24,39,0.4)",
  },
  splitsSection: {
    marginTop: theme.spacing[4],
  },
  splitsTitle: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  splitsList: {
    gap: 8,
  },
  splitItem: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius.xl,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  splitInfo: {
    flex: 1,
  },
  splitLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.ink,
  },
  splitShare: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
    marginTop: 2,
    textTransform: "capitalize",
  },
  splitActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  splitStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  splitPaid: {
    backgroundColor: "rgba(16,185,129,0.1)",
  },
  splitPending: {
    backgroundColor: "rgba(17,24,39,0.04)",
  },
  splitStatusText: {
    fontSize: 9,
    fontWeight: theme.fontWeight.black,
    textTransform: "uppercase",
  },
  splitStatusPaidText: {
    color: "#047857",
  },
  splitStatusPendingText: {
    color: "rgba(17,24,39,0.4)",
  },
  copyButton: {
    padding: 8,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: "rgba(17,24,39,0.04)",
  },
  copyButtonActive: {
    backgroundColor: "rgba(16,185,129,0.15)",
  },
  activitySection: {
    marginTop: theme.spacing[5],
  },
  activityList: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[4],
    gap: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  activityDot: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    backgroundColor: "rgba(17,24,39,0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityHeadline: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.ink,
  },
  activityTime: {
    fontSize: 10,
    color: "rgba(17,24,39,0.4)",
    marginTop: 2,
  },
  actionsSection: {
    marginTop: theme.spacing[6],
    gap: 10,
  },
  deleteButton: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 2,
    borderColor: "rgba(239,68,68,0.2)",
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.danger,
  },
  cancelButton: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
});
