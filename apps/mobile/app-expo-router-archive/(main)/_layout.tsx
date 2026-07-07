import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Tabs, useRouter, usePathname } from "expo-router";
import { useSessionStore } from "@/lib/auth/session";
import { theme } from "@/lib/theme";
import { Home, Layers, Activity, CircleUser, Plus } from "lucide-react-native";

export default function MainLayout() {
  const router = useRouter();
  const hydrated = useSessionStore.persist.hasHydrated();

  useEffect(() => {
    if (hydrated && !useSessionStore.getState().isAuthenticated()) {
      router.replace("/welcome");
    }
  }, [hydrated]);

  if (!hydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading Paadi...</Text>
      </View>
    );
  }

  if (!useSessionStore.getState().isAuthenticated()) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "rgba(17,24,39,0.35)",
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pots/index"
        options={{
          title: "Pots",
          tabBarIcon: ({ color, focused }) => (
            <Layers
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pots/create"
        options={{
          title: "",
          tabBarButton: () => (
            <CenterCreateButton />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, focused }) => (
            <Activity
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <CircleUser
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      {/* Hidden screens accessible via navigation but not in tab bar */}
      <Tabs.Screen
        name="pots/split"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="pots/review"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="pots/[id]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings/security"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings/payout"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings/notifications"
        options={{ href: null }}
      />
    </Tabs>
  );
}

function CenterCreateButton() {
  const router = useRouter();

  return (
    <View style={styles.centerButtonWrapper}>
      <TouchableOpacity
        style={styles.centerButton}
        activeOpacity={0.85}
        onPress={() => router.push("/pots/create")}
      >
        <Plus size={24} color={theme.colors.ink} strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    letterSpacing: 2,
  },
  tabBar: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderTopWidth: 0,
    borderRadius: theme.borderRadius["2xl"],
    marginHorizontal: theme.spacing[5],
    marginBottom: theme.spacing[6],
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.1)",
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  centerButtonWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    elevation: 8,
    shadowColor: "rgba(255,210,0,0.5)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
  },
});
