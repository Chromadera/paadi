import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthedClient } from "@/lib/api/client";
import { theme } from "@/lib/theme";

const QUERY_KEY = ["settings", "notifications"] as const;

type NotificationEvent =
  | "NEW_CONTRIBUTION"
  | "POT_SETTLED"
  | "PAYOUT_ALERT"
  | "NEW_LOGIN"
  | "ORGANIZER_REMINDER"
  | "FRIEND_REQUEST";

type NotificationChannel = "PUSH" | "SMS" | "WHATSAPP";

// Loose preference row matching the API response shape
interface PrefRow {
  event: string;
  channel: string;
  enabled: boolean;
}

const EVENT_LABELS: Record<string, { title: string; description: string }> = {
  NEW_CONTRIBUTION: {
    title: "New Contribution",
    description: "When someone drops cash into a pot you're in.",
  },
  POT_SETTLED: {
    title: "Pot Settled",
    description: "Alert me the exact second a money group payout hits.",
  },
  PAYOUT_ALERT: {
    title: "Payout Status",
    description: "Instant verification alerts for bank payout logs.",
  },
  NEW_LOGIN: {
    title: "Account Security",
    description: "Get notified if a new device logs into your profile.",
  },
  ORGANIZER_REMINDER: {
    title: "Organizer Reminders",
    description: "Nudges from organizers when payment deadlines approach.",
  },
  FRIEND_REQUEST: {
    title: "Paadi Requests",
    description: "When someone adds your username to their active circles.",
  },
};

const CHANNEL_LABELS: Record<string, string> = {
  PUSH: "Push",
  SMS: "SMS",
  WHATSAPP: "WhatsApp",
};

export default function NotificationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getAuthedClient().getNotificationPreferences() as Promise<{ preferences: PrefRow[] }>,
  });

  const updateMutation = useMutation({
    mutationFn: (updatedList: PrefRow[]) =>
      getAuthedClient().updateNotificationPreferences({
        preferences: updatedList as any,
      }),
    onMutate: async (updatedList) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData<{ preferences: PrefRow[] }>(QUERY_KEY);
      queryClient.setQueryData(QUERY_KEY, { preferences: updatedList });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if ((context as any)?.previous) {
        queryClient.setQueryData(QUERY_KEY, (context as any).previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const [pendingKey, setPendingKey] = useState<string | null>(null);

  function handleToggle(
    targetEvent: string,
    channel: string,
    currentStatus: boolean
  ) {
    if (!data?.preferences) return;
    const key = `${targetEvent}:${channel}`;
    setPendingKey(key);

    const updated = data.preferences.map((row) =>
      row.event === targetEvent && row.channel === channel
        ? { ...row, enabled: !currentStatus }
        : row
    );

    updateMutation.mutate(updated, {
      onSettled: () => setPendingKey(null),
    });
  }

  const grouped = data?.preferences.reduce<Record<string, PrefRow[]>>(
    (acc, pref) => {
      if (!acc[pref.event]) acc[pref.event] = [];
      acc[pref.event]!.push(pref);
      return acc;
    },
    {} as Record<string, PrefRow[]>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backArrow}>{"←"}</Text>
        <Text style={styles.backLabel}>Notifications</Text>
      </TouchableOpacity>

      {/* Error */}
      {error && !isPending && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>
            Failed to fetch preferences. Try again later.
          </Text>
        </View>
      )}

      {/* Loading */}
      {isPending && (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="small" color={theme.colors.secondary} />
          <Text style={styles.loadingText}>Loading preferences...</Text>
        </View>
      )}

      {/* Event Cards */}
      {!isPending &&
        grouped &&
        Object.entries(grouped).map(([event, prefs]) => {
          const copy = EVENT_LABELS[event] ?? {
            title: event.replace(/_/g, " "),
            description: "System notification event.",
          };

          return (
            <View key={event} style={styles.eventCard}>
              {/* Header */}
              <Text style={styles.eventTitle}>{copy.title}</Text>
              <Text style={styles.eventDescription}>{copy.description}</Text>

              {/* Channel rows */}
              <View style={styles.channelRows}>
                {prefs.map((pref) => {
                  const key = `${event}:${pref.channel}`;
                  return (
                    <View key={key} style={styles.channelRow}>
                      <Text style={styles.channelLabel}>
                        {CHANNEL_LABELS[pref.channel] ?? pref.channel}
                      </Text>
                      <Switch
                        value={pref.enabled}
                        disabled={pendingKey === key}
                        onValueChange={() =>
                          handleToggle(
                            pref.event,
                            pref.channel,
                            pref.enabled
                          )
                        }
                        trackColor={{
                          false: "rgba(17,24,39,0.06)",
                          true: "rgba(255,210,0,0.4)",
                        }}
                        thumbColor={
                          pref.enabled
                            ? theme.colors.primary
                            : "rgba(17,24,39,0.2)"
                        }
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

      {/* Footer note */}
      {!isPending && !error && (
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            High-priority alerts are routed via Push by default. SMS and
            WhatsApp can be configured per event above.
          </Text>
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
    gap: theme.spacing[4],
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  backArrow: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
    padding: 4,
  },
  backLabel: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  errorBanner: {
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: "rgba(239,68,68,0.2)",
    backgroundColor: "rgba(239,68,68,0.05)",
    padding: theme.spacing[4],
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
  },
  centerLoading: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  loadingText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
  },
  eventCard: {
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    padding: theme.spacing[4],
    gap: 12,
  },
  eventTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  eventDescription: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
    lineHeight: 16,
  },
  channelRows: {
    gap: 8,
    paddingTop: theme.spacing[1],
    borderTopWidth: 1,
    borderTopColor: "rgba(17,24,39,0.04)",
  },
  channelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  channelLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.5)",
  },
  footerNote: {
    marginTop: theme.spacing[2],
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: "rgba(17,24,39,0.08)",
    borderStyle: "dashed",
    padding: theme.spacing[4],
    backgroundColor: "rgba(17,24,39,0.02)",
  },
  footerNoteText: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.45)",
    lineHeight: 17,
  },
});
