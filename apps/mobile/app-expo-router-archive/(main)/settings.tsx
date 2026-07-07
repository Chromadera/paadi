import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useMe, useLogout } from "@/features/settings/profile-hooks";
import { theme } from "@/lib/theme";
import { ChevronRight, User, Lock, Wallet, Bell, LogOut } from "lucide-react-native";

const avatarDefault = require("../../assets/avatars/avatar-1.png");

export default function SettingsPage() {
  const router = useRouter();
  const { data, isPending, error } = useMe();
  const logoutMutation = useLogout();

  const menuItems = [
    { label: "Profile", icon: User, href: "/settings/profile" },
    { label: "Security & PIN", icon: Lock, href: "/settings/security" },
    { label: "Payout accounts", icon: Wallet, href: "/settings/payout" },
    { label: "Notifications", icon: Bell, href: "/settings/notifications" },
  ];

  function handleLogout() {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          logoutMutation.mutate(undefined, {
            onSuccess: () => {
              router.replace("/welcome");
            },
            onError: () => {
              router.replace("/welcome");
            },
          });
        },
      },
    ]);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Settings</Text>

      {/* Identity Card */}
      <View style={styles.identityCard}>
        {isPending && (
          <View style={styles.loadingRow}>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.loadingContent}>
              <View style={styles.namePlaceholder} />
              <View style={styles.handlePlaceholder} />
            </View>
          </View>
        )}

        {error && !isPending && (
          <Text style={styles.errorText}>
            Couldn't load your profile.
          </Text>
        )}

        {data && !isPending && (
          <View style={styles.identityRow}>
            <Image source={avatarDefault} style={styles.avatar} />
            <View style={styles.identityContent}>
              <Text style={styles.identityName} numberOfLines={1}>
                {data.profile.displayName ??
                  `${data.profile.firstName ?? ""} ${data.profile.lastName ?? ""}`.trim()}
              </Text>
              <Text style={styles.identityHandle}>
                @{data.profile.username} ·{" "}
                <Text style={styles.identityTier}>{data.tier.replace("_", " ")}</Text>
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={item.href}
            style={[
              styles.menuItem,
              i !== menuItems.length - 1 && styles.menuItemBorder,
            ]}
            onPress={() => router.push(item.href)}
            activeOpacity={0.6}
          >
            <View style={styles.menuIcon}>
              <item.icon size={20} color="rgba(17,24,39,0.6)" strokeWidth={2.25} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <ChevronRight size={16} color="rgba(17,24,39,0.3)" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={logoutMutation.isPending}
        activeOpacity={0.7}
      >
        {logoutMutation.isPending ? (
          <ActivityIndicator size="small" color={theme.colors.danger} />
        ) : (
          <LogOut size={16} color={theme.colors.danger} strokeWidth={2.5} />
        )}
        <Text style={styles.logoutText}>
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </Text>
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
    padding: theme.spacing[4],
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: "rgba(17,24,39,0.1)",
  },
  loadingContent: {
    flex: 1,
    gap: 8,
  },
  namePlaceholder: {
    width: 120,
    height: 16,
    borderRadius: 6,
    backgroundColor: "rgba(17,24,39,0.1)",
  },
  handlePlaceholder: {
    width: 80,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(17,24,39,0.1)",
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    paddingVertical: 4,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 9999,
  },
  identityContent: {
    flex: 1,
  },
  identityName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  identityHandle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.4)",
    marginTop: 2,
  },
  identityTier: {
    color: theme.colors.secondary,
    fontWeight: theme.fontWeight.bold,
  },
  menuContainer: {
    marginTop: theme.spacing[5],
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing[4],
    paddingVertical: 18,
    gap: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(17,24,39,0.06)",
  },
  menuIcon: {
    padding: 4,
  },
  menuLabel: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.8)",
  },
  logoutButton: {
    marginTop: theme.spacing[5],
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: "rgba(239,68,68,0.2)",
    backgroundColor: theme.colors.white,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  logoutText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.danger,
  },
});
