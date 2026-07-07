import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useOnboardingStore } from "@/features/onboarding/store";
import { theme } from "@/lib/theme";
import { CheckCircle } from "lucide-react-native";

export default function ReadyPage() {
  const router = useRouter();
  const resetOnboarding = useOnboardingStore((s) => s.reset);

  useEffect(() => {
    resetOnboarding();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>Paadi</Text>
        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Checkmark */}
        <View style={styles.checkBox}>
          <CheckCircle
            size={32}
            color={theme.colors.success}
            strokeWidth={2.5}
          />
        </View>

        <Text style={styles.headline}>You are good to go!</Text>
        <Text style={styles.subtext}>
          Your ledger profiles and transactional vaults are ready. Welcome to
          the group.
        </Text>

        {/* Account Level Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelRow}>
            <Text style={styles.levelLabel}>Account Level</Text>
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>Tier 0 Verified</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.checklist}>
            <Text style={styles.checkItem}>
              {"✓"} Unique handle configured
            </Text>
            <Text style={styles.checkItem}>
              {"✓"} Secure access parameters active
            </Text>
            <Text style={styles.checkItem}>
              {"✓"} Transaction pots tracking initialized
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.ctaText}>Enter Dashboard</Text>
          <Text style={styles.ctaArrow}>{"➔"}</Text>
        </TouchableOpacity>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  brand: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkBox: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: "rgba(16,185,129,0.1)",
    borderWidth: 2,
    borderColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[6],
    borderBottomWidth: 2,
  },
  headline: {
    fontSize: theme.fontSize.huge - 2,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    textAlign: "center",
    marginBottom: theme.spacing[6],
  },
  subtext: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.inkMuted,
    textAlign: "center",
    paddingHorizontal: theme.spacing[4],
    lineHeight: 18,
    marginBottom: theme.spacing[6],
  },
  levelCard: {
    width: "100%",
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
    gap: 14,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelLabel: {
    fontSize: theme.fontSize.tiny,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.inkMuted,
    letterSpacing: 1,
  },
  tierBadge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.ink,
    borderBottomWidth: 1,
  },
  tierText: {
    fontSize: theme.fontSize.tiny,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.white,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  checklist: {
    gap: 10,
  },
  checkItem: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
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
});
