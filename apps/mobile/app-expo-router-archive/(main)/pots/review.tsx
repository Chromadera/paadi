import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useCreatePotStore } from "@/features/create-pot/store";
import { useCreatePot } from "@/features/create-pot/hooks";
import { theme } from "@/lib/theme";
import { Calendar, Lock } from "lucide-react-native";

export default function ReviewPage() {
  const router = useRouter();
  const store = useCreatePotStore();
  const createPotMutation = useCreatePot();

  const [completionRule, setCompletionRule] = useState<"progressive" | "all_or_nothing">("progressive");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isPending = createPotMutation.isPending;

  function handleSubmit() {
    setErrorMsg("");

    const input: any = {
      title: store.title,
      description: store.description || undefined,
      totalKobo: store.totalKobo,
      settlementType: store.settlementType,
      completionRule: completionRule,
      splitMode: store.splitMode,
      splits: store.splits.map((s) => {
        const split: any = { label: s.label };
        if (store.splitMode === "weight") {
          split.weight = s.weight;
        } else if (store.splitMode === "amount") {
          split.amountKobo = s.amountKobo;
        } else if (store.splitMode === "percent") {
          split.percent = s.percent;
        }
        return split;
      }),
    };

    if (deadlineDate) {
      const localDate = new Date(deadlineDate);
      if (isNaN(localDate.getTime())) {
        setErrorMsg("Invalid deadline date.");
        return;
      }
      if (localDate.getTime() <= Date.now()) {
        setErrorMsg("Deadline must be in the future.");
        return;
      }
      input.deadlineAt = localDate.toISOString();
    }

    if (store.settlementType === "bill_payment") {
      input.billerCategory = store.billerCategory;
      input.billerProductCode = store.billerProductCode;
      input.billerCustomerId = store.billerCustomerId;
      input.meterType = store.meterType;
    } else if (store.settlementType === "bank_payout") {
      input.payoutAccountId = store.payoutAccountId;
    }

    // Generate idempotency key
    const idempotencyKey =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    createPotMutation.mutate(
      { input, idempotencyKey },
      {
        onSuccess: (potDetail) => {
          store.reset();
          router.push(`/pots/${potDetail.id}`);
        },
        onError: (err: any) => {
          setErrorMsg(err.message ?? "Failed to create pot. Check your details and try again.");
        },
      }
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
        <Text style={styles.title}>Review Pot</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>Step 3/3</Text>
        </View>
      </View>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* Summary Card */}
      <View style={styles.card}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Title</Text>
            <Text style={styles.summaryTitle}>{store.title}</Text>
          </View>
          <View style={styles.summaryAmount}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <View style={styles.amountBadge}>
              <Text style={styles.amountText}>
                N{(store.totalKobo / 100).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {store.description ? (
          <View>
            <Text style={styles.summaryLabel}>Description</Text>
            <Text style={styles.summaryDescription}>{store.description}</Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        <View>
          <Text style={styles.summaryLabel}>Settlement Details</Text>
          {store.settlementType === "bill_payment" ? (
            <View style={styles.settlementDetails}>
              <Text style={styles.settlementText}>
                Type: <Text style={styles.settlementBold}>Bill Payment ({store.billerCategory})</Text>
              </Text>
              <Text style={styles.settlementText}>
                Provider: <Text style={styles.settlementBold}>{store.billerProductCode}</Text>
              </Text>
              <Text style={styles.settlementText}>
                Number: <Text style={styles.settlementBold}>{store.billerCustomerId}</Text>
              </Text>
              {store.billerCustomerName ? (
                <Text style={[styles.settlementText, { color: theme.colors.success }]}>
                  Name: <Text style={styles.settlementBold}>{store.billerCustomerName}</Text>
                </Text>
              ) : null}
            </View>
          ) : (
            <View style={styles.settlementDetails}>
              <Text style={styles.settlementText}>
                Type: <Text style={styles.settlementBold}>Bank Payout</Text>
              </Text>
              <Text style={[styles.settlementText, { color: theme.colors.success }]}>
                Status: <Text style={styles.settlementBold}>Verified payout account linked</Text>
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Additional Settings */}
      <View style={styles.card}>
        <View>
          <Text style={styles.summaryLabel}>Completion Rule</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                completionRule === "progressive" && styles.toggleButtonActive,
              ]}
              onPress={() => setCompletionRule("progressive")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toggleText,
                  completionRule === "progressive" && styles.toggleTextActive,
                ]}
              >
                Progressive
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                completionRule === "all_or_nothing" && styles.toggleButtonActive,
              ]}
              onPress={() => setCompletionRule("all_or_nothing")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toggleText,
                  completionRule === "all_or_nothing" && styles.toggleTextActive,
                ]}
              >
                All or Nothing
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={styles.deadlineLabelRow}>
            <Calendar size={12} color="rgba(17,24,39,0.4)" />
            <Text style={styles.summaryLabel}>
              Set Collection Deadline (Optional)
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={deadlineDate}
            onChangeText={setDeadlineDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="rgba(17,24,39,0.3)"
            editable={!isPending}
          />
        </View>
      </View>

      {/* Create CTA */}
      <TouchableOpacity
        style={[styles.ctaButton, isPending && styles.ctaButtonDisabled]}
        onPress={handleSubmit}
        disabled={isPending}
        activeOpacity={0.7}
      >
        {isPending ? (
          <>
            <ActivityIndicator size="small" color={theme.colors.ink} />
            <Text style={styles.ctaText}>Creating Pot...</Text>
          </>
        ) : (
          <>
            <Lock size={16} color={theme.colors.ink} strokeWidth={2.5} />
            <Text style={styles.ctaText}>Create & Launch Pot</Text>
          </>
        )}
      </TouchableOpacity>
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
    alignItems: "center",
    marginTop: theme.spacing[2],
  },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  stepBadge: {
    backgroundColor: "rgba(17,24,39,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  stepText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.5)",
  },
  errorBox: {
    marginTop: theme.spacing[4],
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    borderRadius: theme.borderRadius.xl,
    padding: 12,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
  },
  card: {
    marginTop: theme.spacing[5],
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[4],
    gap: theme.spacing[4],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    marginTop: 2,
  },
  summaryAmount: {
    alignItems: "flex-end",
  },
  amountBadge: {
    marginTop: 4,
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.ink,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  amountText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  summaryDescription: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.7)",
    lineHeight: 18,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(17,24,39,0.06)",
  },
  settlementDetails: {
    gap: 4,
    marginTop: 6,
  },
  settlementText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.8)",
  },
  settlementBold: {
    fontWeight: theme.fontWeight.extrabold,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(17,24,39,0.04)",
    padding: 4,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    marginTop: 6,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.xl - 2,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.white,
  },
  toggleText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
  },
  toggleTextActive: {
    color: theme.colors.ink,
  },
  deadlineLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  input: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: 12,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.ink,
  },
  ctaButton: {
    marginTop: theme.spacing[6],
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
  ctaButtonDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
});
