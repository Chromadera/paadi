import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useMe } from "@/features/settings/profile-hooks";
import { theme } from "@/lib/theme";
import { ChevronRight, Settings, ShieldCheck, ShieldAlert, Wallet, Lock, Bell } from "lucide-react-native";

const avatarDefault = require("../../assets/avatars/avatar-1.png");

const quickLinks = [
  { label: "Edit Profile", icon: Settings, href: "/settings/profile" },
  { label: "Payout Accounts", icon: Wallet, href: "/settings/payout" },
  { label: "Security & PIN", icon: Lock, href: "/settings/security" },
  { label: "Notification Preferences", icon: Bell, href: "/settings/notifications" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { data, isPending, error } = useMe();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Profile</Text>

      {/* Identity Card */}
      <View style={styles.identityCard}>
        {isPending && (
          <View style={styles.loadingContainer}>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.namePlaceholder} />
            <View style={styles.handlePlaceholder} />
          </View>
        )}

        {error && !isPending && (
          <Text style={styles.errorText}>
            Couldn't load profile details.
          </Text>
        )}

        {data && !isPending && (
          <>
            <Image source={avatarDefault} style={styles.avatar} />

            <Text style={styles.displayName}>
              {data.profile.displayName?.trim() ||
                `${data.profile.firstName ?? ""} ${data.profile.lastName ?? ""}`.trim() ||
                data.profile.username}
            </Text>

            <Text style={styles.handle}>@{data.profile.username}</Text>

            {/* KYC Banner */}
            <View style={styles.kycContainer}>
              {data.tier === "TIER_0" ? (
                <View style={styles.kycUnverified}>
                  <View style={styles.kycUnverifiedHeader}>
                    <ShieldAlert size={16} color="#92400E" strokeWidth={2.5} />
                    <Text style={styles.kycUnverifiedTitle}>
                      Tier 0 (Unverified)
                    </Text>
                  </View>
                  <Text style={styles.kycUnverifiedDescription}>
                    Verify your identity to increase transaction limits and enable direct bank withdrawals.
                  </Text>
                  <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={() => router.push("/verify")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.verifyButtonText}>Verify Identity</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.kycVerified}>
                  <View style={styles.kycVerifiedLeft}>
                    <View style={styles.kycCheckIcon}>
                      <ShieldCheck size={16} color={theme.colors.success} strokeWidth={2.5} />
                    </View>
                    <View>
                      <Text style={styles.kycLevelLabel}>KYC Level</Text>
                      <Text style={styles.kycLevelValue}>
                        {data.tier.replace("_", " ")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedBadgeText}>Verified</Text>
                  </View>
                </View>
              )}
            </View>
          </>
        )}
      </View>

      {/* Quick Links */}
      <View style={styles.linksContainer}>
        {quickLinks.map((link, i) => (
          <TouchableOpacity
            key={link.href}
            style={[
              styles.linkItem,
              i !== quickLinks.length - 1 && styles.linkItemBorder,
            ]}
            onPress={() => router.push(link.href)}
            activeOpacity={0.6}
          >
            <View style={styles.linkIcon}>
              <link.icon size={20} color="rgba(17,24,39,0.6)" strokeWidth={2.25} />
            </View>
            <Text style={styles.linkLabel}>{link.label}</Text>
            <ChevronRight size={16} color="rgba(17,24,39,0.3)" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings Hub */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/settings")}
        activeOpacity={0.7}
      >
        <Text style={styles.settingsButtonText}>Settings Hub</Text>
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
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    marginTop: theme.spacing[2],
  },
  identityCard: {
    marginTop: theme.spacing[6],
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    padding: theme.spacing[5],
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    gap: 12,
    paddingVertical: theme.spacing[6],
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    backgroundColor: "rgba(17,24,39,0.1)",
  },
  namePlaceholder: {
    width: 120,
    height: 20,
    borderRadius: 8,
    backgroundColor: "rgba(17,24,39,0.1)",
  },
  handlePlaceholder: {
    width: 80,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(17,24,39,0.1)",
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    paddingVertical: theme.spacing[4],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: theme.colors.ink,
  },
  displayName: {
    marginTop: theme.spacing[4],
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  handle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.4)",
    marginTop: 4,
  },
  kycContainer: {
    width: "100%",
    marginTop: theme.spacing[5],
  },
  kycUnverified: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[4],
    alignItems: "center",
    gap: 12,
  },
  kycUnverifiedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  kycUnverifiedTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.extrabold,
    color: "#92400E",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  kycUnverifiedDescription: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(146,64,14,0.6)",
    textAlign: "center",
    lineHeight: 16,
  },
  verifyButton: {
    width: "100%",
    paddingVertical: theme.spacing[2],
    backgroundColor: "#F59E0B",
    borderWidth: 2,
    borderColor: theme.colors.ink,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
  },
  verifyButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  kycVerified: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[4],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kycVerifiedLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  kycCheckIcon: {
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "rgba(16,185,129,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  kycLevelLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeight.extrabold,
    color: "rgba(17,24,39,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  kycLevelValue: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  verifiedBadge: {
    backgroundColor: "rgba(16,185,129,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.xl,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.success,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  linksContainer: {
    marginTop: theme.spacing[5],
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    overflow: "hidden",
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[4],
    gap: 14,
  },
  linkItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(17,24,39,0.06)",
  },
  linkIcon: {
    padding: 4,
  },
  linkLabel: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.8)",
  },
  settingsButton: {
    marginTop: theme.spacing[5],
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: "rgba(17,24,39,0.1)",
    backgroundColor: theme.colors.white,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: "rgba(17,24,39,0.6)",
  },
});
