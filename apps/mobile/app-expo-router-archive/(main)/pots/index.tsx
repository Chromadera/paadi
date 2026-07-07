import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { usePots } from "@/features/pots/hooks";
import { theme } from "@/lib/theme";
import { Plus, Calendar, Users, ArrowUpRight } from "lucide-react-native";

const filterTabs = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "settled", label: "Settled" },
  { id: "cancelled", label: "Cancelled" },
];

export default function PotsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const { data, isPending, error, refetch } = usePots({
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: 20,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>My Pots</Text>
          <Text style={styles.subtitle}>Track your group split targets</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/pots/create")}
          activeOpacity={0.7}
        >
          <Plus size={20} color={theme.colors.ink} strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {filterTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.filterTab,
              statusFilter === tab.id && styles.filterTabActive,
            ]}
            onPress={() => setStatusFilter(tab.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterTabText,
                statusFilter === tab.id && styles.filterTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {isPending && (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.stateText}>Fetching pots...</Text>
        </View>
      )}

      {error && !isPending && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to retrieve pots list. Pull down to retry.
          </Text>
        </View>
      )}

      {data && data.items.length === 0 && !isPending && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}></Text>
          <Text style={styles.emptyTitle}>No pots active</Text>
          <Text style={styles.emptyDescription}>
            Launch a group split pot to track contributions dynamically.
          </Text>
          <TouchableOpacity
            style={styles.emptyCta}
            onPress={() => router.push("/pots/create")}
            activeOpacity={0.7}
          >
            <Text style={styles.emptyCtaText}>Create first pot</Text>
          </TouchableOpacity>
        </View>
      )}

      {data && data.items.length > 0 && !isPending && (
        <View style={styles.potsList}>
          {data.items.map((pot) => {
            const progressPct =
              pot.totalKobo > 0
                ? Math.min(100, Math.round((pot.collectedKobo / pot.totalKobo) * 100))
                : 0;
            const deadline = pot.deadlineAt
              ? new Date(pot.deadlineAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : null;

            return (
              <TouchableOpacity
                key={pot.id}
                style={styles.potCard}
                onPress={() => router.push(`/pots/${pot.id}`)}
                activeOpacity={0.7}
              >
                {/* Title & Status */}
                <View style={styles.potHeader}>
                  <View style={styles.potHeaderLeft}>
                    <Text style={styles.potTitle} numberOfLines={1}>
                      {pot.title}
                    </Text>
                    {deadline && (
                      <View style={styles.potDeadline}>
                        <Calendar size={12} color="rgba(17,24,39,0.4)" strokeWidth={2.5} />
                        <Text style={styles.potDeadlineText}>Ends {deadline}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.potStatusRow}>
                    <View
                      style={[
                        styles.potStatusBadge,
                        pot.status === "open"
                          ? styles.potStatusOpen
                          : pot.status === "settled"
                            ? styles.potStatusSettled
                            : styles.potStatusOther,
                      ]}
                    >
                      <Text
                        style={[
                          styles.potStatusBadgeText,
                          pot.status === "open"
                            ? styles.potStatusBadgeTextOpen
                            : pot.status === "settled"
                              ? styles.potStatusBadgeTextSettled
                              : styles.potStatusBadgeTextOther,
                        ]}
                      >
                        {pot.status}
                      </Text>
                    </View>
                    <ArrowUpRight size={16} color="rgba(17,24,39,0.2)" />
                  </View>
                </View>

                {/* Financial Metrics */}
                <View style={styles.potMetrics}>
                  <View>
                    <Text style={styles.metricLabel}>Collected</Text>
                    <Text style={styles.metricValue}>
                      ₦{(pot.collectedKobo / 100).toLocaleString()}
                      <Text style={styles.metricTotal}>
                        {" "}
                        / ₦{(pot.totalKobo / 100).toLocaleString()}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.metricProgress}>
                    <Text style={styles.metricLabel}>Target</Text>
                    <View style={styles.progressBadge}>
                      <Text style={styles.progressBadgeText}>{progressPct}%</Text>
                    </View>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBar}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[styles.progressBarFill, { width: `${progressPct}%` }]}
                    />
                  </View>
                  <View style={styles.progressInfo}>
                    <View style={styles.progressPaidCount}>
                      <Users size={14} color="rgba(17,24,39,0.3)" strokeWidth={2} />
                      <Text style={styles.progressPaidText}>
                        {pot.paidCount} of {pot.splitCount} paid
                      </Text>
                    </View>
                    {pot.status === "open" && (
                      <View style={styles.activeDot}>
                        <Text style={styles.activeDotText}>Active</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: theme.spacing[2],
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
    marginTop: 2,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing[2],
  },
  filterTabs: {
    marginTop: theme.spacing[5],
    backgroundColor: "rgba(17,24,39,0.04)",
    padding: 4,
    borderRadius: theme.borderRadius["2xl"],
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.05)",
  },
  filterTab: {
    flex: 1,
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  filterTabActive: {
    backgroundColor: theme.colors.white,
  },
  filterTabText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: "rgba(17,24,39,0.4)",
  },
  filterTabTextActive: {
    color: theme.colors.ink,
  },
  stateContainer: {
    marginTop: theme.spacing[5],
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  stateText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  errorContainer: {
    marginTop: theme.spacing[5],
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[5],
    alignItems: "center",
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
  },
  emptyState: {
    marginTop: theme.spacing[5],
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[6],
    alignItems: "center",
    gap: 12,
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptyTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  emptyDescription: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
    textAlign: "center",
    maxWidth: 200,
    lineHeight: 18,
  },
  emptyCta: {
    marginTop: 8,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderRadius: theme.borderRadius.xl,
  },
  emptyCtaText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  potsList: {
    marginTop: theme.spacing[5],
    gap: 16,
  },
  potCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius["3xl"],
    padding: theme.spacing[5],
    gap: 16,
  },
  potHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  potHeaderLeft: {
    flex: 1,
  },
  potTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  potDeadline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  potDeadlineText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
  },
  potStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  potStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  potStatusOpen: {
    backgroundColor: "rgba(16,185,129,0.1)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
  potStatusSettled: {
    backgroundColor: "rgba(255,210,0,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,210,0,0.3)",
  },
  potStatusOther: {
    backgroundColor: "rgba(17,24,39,0.04)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.1)",
  },
  potStatusBadgeText: {
    fontSize: 9,
    fontWeight: theme.fontWeight.black,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  potStatusBadgeTextOpen: {
    color: "#047857",
  },
  potStatusBadgeTextSettled: {
    color: "#92400E",
  },
  potStatusBadgeTextOther: {
    color: "rgba(17,24,39,0.4)",
  },
  potMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "rgba(17,24,39,0.04)",
    paddingTop: 14,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.black,
    color: "rgba(17,24,39,0.3)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  metricTotal: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
  },
  metricProgress: {
    alignItems: "flex-end",
  },
  progressBadge: {
    marginTop: 2,
    backgroundColor: "rgba(255,45,120,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,45,120,0.1)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  progressBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.secondary,
  },
  progressBar: {
    gap: 8,
  },
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
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressPaidCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  progressPaidText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
  },
  activeDot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  activeDotText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: "#047857",
  },
});
