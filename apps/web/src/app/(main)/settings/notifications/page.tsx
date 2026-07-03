"use client";

import { useState } from "react";
import {
  useNotificationPrefs,
  useUpdateNotificationPrefs,
} from "@/features/settings/notifications-hooks";
import { NotificationEvent, NotificationChannel, NotificationPreference } from "@/lib/api/notifications";
import { Loader2, BellRing, Smartphone, MessageSquare, Phone } from "lucide-react";

const EVENT_LABELS: Record<
  NotificationEvent,
  { title: string; description: string }
> = {
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

const CHANNEL_META: Record<
  NotificationChannel,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  PUSH:     { label: "Push",     icon: Smartphone    },
  SMS:      { label: "SMS",      icon: Phone         },
  WHATSAPP: { label: "WhatsApp", icon: MessageSquare },
};

// Toggle component — extracted for cleanliness
function Toggle({
  enabled,
  pending,
  onToggle,
}: {
  enabled: boolean;
  pending: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      disabled={pending}
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full border-2 border-ink transition-all shrink-0 outline-none
        ${enabled
          ? "bg-primary shadow-[1px_1px_0px_0px_#111827]"
          : "bg-ink/8 shadow-none"
        }
        ${pending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <div
        className={`absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white border border-ink/20 transition-all duration-200
          ${enabled ? "left-[20px]" : "left-[2px]"}
        `}
      />
    </button>
  );
}

export default function NotificationsPage() {
  const { data, isPending, error } = useNotificationPrefs();
  const updateMutation = useUpdateNotificationPrefs();
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  function handleToggle(
    targetEvent: NotificationEvent,
    channel: NotificationChannel,
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

  // Group rows by event so each event = one card
  const grouped = data?.preferences.reduce<Record<string, NotificationPreference[]>>(
    (acc, pref) => {
      if (!acc[pref.event]) acc[pref.event] = [];
      acc[pref.event]!.push(pref as NotificationPreference);
      return acc;
    }, {} as Record<string, NotificationPreference[]>
  )

  return (
    <div className="w-full flex flex-col gap-4">

      {/* ERROR */}
      {error && !isPending && (
        <div className="rounded-2xl border-2 border-danger/20 bg-danger/5 p-4 text-center">
          <p className="text-xs font-bold text-danger">
            ❌ Failed to fetch preferences. Try again later.
          </p>
        </div>
      )}

      {/* LOADING */}
      {isPending && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-6 w-6 text-secondary animate-spin stroke-[2.5]" />
          <p className="text-xs font-bold text-ink/40">Loading preferences...</p>
        </div>
      )}

      {/* EVENT CARDS — one per event type, channels as rows inside */}
      {!isPending && grouped && Object.entries(grouped).map(([event, prefs]) => {
        const copy = EVENT_LABELS[event as NotificationEvent] ?? {
          title: event.replace(/_/g, " "),
          description: "System notification event.",
        };

        return (
          <div
            key={event}
            className="rounded-2xl border border-ink/8 bg-surface p-4 shadow-sm flex flex-col gap-3"
          >
            {/* Event header */}
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-black text-ink leading-tight">
                {copy.title}
              </h3>
              <p className="text-[11px] font-semibold text-ink/40 leading-normal">
                {copy.description}
              </p>
            </div>

            {/* Channel rows */}
            <div className="flex flex-col gap-2 pt-1 border-t border-ink/6">
              {prefs.map((pref) => {
                const channelKey = `${event}:${pref.channel}`;
                const meta = CHANNEL_META[pref.channel as NotificationChannel];
                const Icon = meta?.icon;

                return (
                  <div
                    key={channelKey}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 text-ink/50">
                      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                      <span className="text-xs font-bold">
                        {meta?.label ?? pref.channel}
                      </span>
                    </div>
                    <Toggle
                      enabled={pref.enabled}
                      pending={pendingKey === channelKey}
                      onToggle={() =>
                        handleToggle(
                          pref.event as NotificationEvent,
                          pref.channel as NotificationChannel,
                          pref.enabled
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* CONTEXT FOOTER */}
      {!isPending && !error && (
        <div className="mt-2 rounded-2xl border-2 border-dashed border-ink/10 p-4 flex items-start gap-3 bg-ink/2">
          <BellRing className="h-4 w-4 text-ink/35 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-ink/45 leading-relaxed">
            High-priority alerts are routed via Push by default. SMS and WhatsApp can be configured per event above.
          </p>
        </div>
      )}

    </div>
  );
}