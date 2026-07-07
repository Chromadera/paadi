import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useMe } from "@/features/settings/profile-hooks";
import { usePots } from "@/features/pots/hooks";
import { useQuery } from "@tanstack/react-query";
import { getAuthedClient } from "@/lib/api/client";
import { theme } from "@/lib/theme";
import { Plus, ShieldAlert, Wallet, Landmark, ChevronRight } from "lucide-react-native";

export default function HomePage() {
  const router = useRouter();

  const { data: me, isPending: loadingMe } = useMe();
  const { data: potsData, isPending: loadingPots } = usePots({ status: "open", limit: 3 });

  const { data: wallet, error: walletError } = useQuery({
    queryKey: ["me", "wallet"],
    queryFn: () => getAuthedClient().getWallet(),
    retry: false,
  });

  const firstName = me?.profile.firstName ?? me?.profile.username ?? "User";

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const isPending = loadingMe || loadingPots;

  if (isPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greeting}>
            {greeting}, {firstName}!
          </Text>
          <Text style={styles.subtext}>
            Let's split and settle bills together
          </Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/pots/create")}
          activeOpacity={0.7}
        >
          <Plus size={20} color={theme.colors.ink} strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* Wallet Balance Card */}
      {wallet && !walletError && (
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletLabel}>
              <Wallet size={16} color="rgba(17,24,39,0.6)" strokeWidth={2.25} />
              <Text style={styles.walletLabelText}>Wallet Balance</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          </View>
          <Text style={styles.walletBalance}>
            ₦{(wallet.balanceKobo / 100).toLocaleString()}
          </Text>
          {wallet.virtualAccount && (
            <View style={styles.walletBank}>
              <Landmark size={12} color="rgba(17,24,39,0.4)" />
              <Text style={styles.walletBankText}>
                {wallet.virtualAccount.bankName} · {wallet.virtualAccount.accountNumber}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* KYC Banner */}
      {me?.tier === "TIER_0" && (
        <TouchableOpacity
          style={styles.kycBanner}
          onPress={() => router.push("/verify")}
          activeOpacity={0.7}
        >
          <View style={styles.kycIconContainer}>
            <ShieldAlert size={16} color="#92400E" strokeWidth={2.5} />
          </View>
          <View style={styles.kycTextContainer}>
            <Text style={styles.kycTitle}>Verify identity to unlock limits</Text>
            <Text style={styles.kycDescription}>
              Complete BVN and selfie check to upgrade your account and start direct payouts.
            </Text>
          </View>
          <ChevronRight size={16} color="rgba(146,64,14,0.6)" />
        </TouchableOpacity>
      )}

      {/* Active Pots Preview */}
      <View style={styles.potsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Active Pots ({potsData?.items.length || 0})
          </Text>
          <TouchableOpacity onPress={() => router.push("/pots")}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {potsData && potsData.items.length === 0 ? (
          <View style={styles.emptyPots}>
            <Text style={styles.emptyIcon}></Text>
            <Text style={styles.emptyTitle}>No active collections</Text>
            <Text style={styles.emptyDescription}>
              Start a new pot to divide bills, dinners, or group gifts.
            </Text>
            <TouchableOpacity
              style={styles.emptyCta}
              onPress={() => router.push("/pots/create")}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyCtaText}>Create Pot</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.potsList}>
            {potsData?.items.slice(0, 3).map((pot) => {
              const progressPct =
                pot.totalKobo > 0
                  ? Math.min(100, Math.round((pot.collectedKobo / pot.totalKobo) * 100))
                  : 0;
              return (
                <TouchableOpacity
                  key={pot.id}
                  style={styles.potCard}
                  onPress={() => router.push(`/pots/${pot.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.potCardLeft}>
                    <Text style={styles.potTitle} numberOfLines={1}>
                      {pot.title}
                    </Text>
                    <Text style={styles.potAmount}>
                      ₦{(pot.collectedKobo / 100).toLocaleString()} of ₦
                      {(pot.totalKobo / 100).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.potCardRight}>
                    <Text style={styles.potProgress}>{progressPct}%</Text>
                    <ChevronRight size={16} color="rgba(17,24,39,0.3)" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => router.push("/pots/create")}
        activeOpacity={0.7}
      >
        <Plus size={20} color={theme.colors.ink} strokeWidth={2.5} />
        <Text style={styles.quickActionText}>Create New Split Pot</Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
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
  greeting: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    letterSpacing: -0.5,
  },
  subtext: {
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
  walletCard: {
    marginTop: theme.spacing[5],
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    padding: theme.spacing[5],
  },
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  walletLabelText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  activeBadge: {
    backgroundColor: "rgba(16,185,129,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xl,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.success,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  walletBalance: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    marginTop: theme.spacing[2],
  },
  walletBank: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: theme.spacing[1],
  },
  walletBankText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
  },
  kycBanner: {
    marginTop: theme.spacing[4],
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: theme.borderRadius["2xl"],
    padding: theme.spacing[4],
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  kycIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  kycTextContainer: {
    flex: 1,
  },
  kycTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: "#92400E",
    lineHeight: 16,
  },
  kycDescription: {
    fontSize: 10,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(146,64,14,0.6)",
    marginTop: 2,
  },
  potsSection: {
    marginTop: theme.spacing[6],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  viewAll: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "#F59E0B",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emptyPots: {
    marginTop: theme.spacing[4],
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
    color: "rgba(17,24,39,0.4)",
    textAlign: "center",
    maxWidth: 200,
    lineHeight: 18,
  },
  emptyCta: {
    marginTop: 8,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[2],
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
    marginTop: theme.spacing[4],
    gap: 12,
  },
  potCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  potCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  potTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.ink,
  },
  potAmount: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
    marginTop: 4,
  },
  potCardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  potProgress: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.6)",
  },
  quickAction: {
    marginTop: theme.spacing[6],
    width: "100%",
    paddingVertical: theme.spacing[4],
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
  quickActionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
});
