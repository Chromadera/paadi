import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { getAuthedClient } from "@/lib/api/client";
import { theme } from "@/lib/theme";
import { ArrowDownLeft, ArrowUpRight, ShieldAlert, Sparkles, UserPlus } from "lucide-react-native";
import { useState, useCallback } from "react";

function getActivityIcon(type: string) {
  switch (type) {
    case "contribution_received":
    case "wallet_credit":
    case "wallet_settlement_in":
      return <ArrowDownLeft size={20} color={theme.colors.success} strokeWidth={2.5} />;
    case "wallet_withdrawal":
    case "pot_settled_bank":
    case "pot_settled_bill":
    case "pot_settled_wallet":
      return <ArrowUpRight size={20} color="#D97706" strokeWidth={2.5} />;
    case "reminder_sent":
    case "pot_expired":
      return <ShieldAlert size={20} color={theme.colors.danger} strokeWidth={2.5} />;
    case "friend_request":
      return <UserPlus size={20} color={theme.colors.secondary} strokeWidth={2.5} />;
    default:
      return <Sparkles size={20} color={theme.colors.primary} strokeWidth={2.5} />;
  }
}

export default function ActivityPage() {
  const [refreshing, setRefreshing] = useState(false);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["me", "activity"],
    queryFn: () => getAuthedClient().getActivity(),
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
      <Text style={styles.title}>Activity</Text>

      {isPending && (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.stateText}>Loading activity feed...</Text>
        </View>
      )}

      {error && !isPending && (
        <View style={styles.stateContainer}>
          <Text style={styles.errorText}>
            Failed to retrieve activity records.
          </Text>
        </View>
      )}

      {data && data.items.length === 0 && !isPending && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}></Text>
          <Text style={styles.emptyTitle}>No activity yet</Text>
          <Text style={styles.emptyDescription}>
            Your transaction history, contributions, and settlements will show up here.
          </Text>
        </View>
      )}

      {data && data.items.length > 0 && !isPending && (
        <View style={styles.activityList}>
          {data.items.map((item, i) => {
            const occurred = new Date(item.occurredAt).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            const isCredit =
              item.type.includes("credit") || item.type.includes("received");

            return (
              <View
                key={item.id}
                style={[
                  styles.activityItem,
                  i !== data.items.length - 1 && styles.activityItemBorder,
                ]}
              >
                <View style={styles.activityIcon}>
                  {getActivityIcon(item.type)}
                </View>

                <View style={styles.activityContent}>
                  <Text style={styles.activityHeadline}>{item.headline}</Text>
                  <Text style={styles.activityTime}>{occurred}</Text>
                </View>

                {item.amountKobo != null && (
                  <Text
                    style={[
                      styles.activityAmount,
                      isCredit && styles.activityAmountCredit,
                    ]}
                  >
                    {isCredit ? "+" : "-"}₦
                    {(item.amountKobo / 100).toLocaleString()}
                  </Text>
                )}
              </View>
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
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    marginTop: theme.spacing[2],
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
    gap: 8,
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptyTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    marginTop: 4,
  },
  emptyDescription: {
    fontSize: theme.fontSize.xs,
    color: "rgba(17,24,39,0.4)",
    textAlign: "center",
    maxWidth: 220,
    lineHeight: 18,
  },
  activityList: {
    marginTop: theme.spacing[5],
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius["2xl"],
    overflow: "hidden",
  },
  activityItem: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[4],
    alignItems: "flex-start",
    gap: 12,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(17,24,39,0.06)",
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.xl,
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
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 10,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
    marginTop: 4,
  },
  activityAmount: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  activityAmountCredit: {
    color: theme.colors.success,
  },
});
