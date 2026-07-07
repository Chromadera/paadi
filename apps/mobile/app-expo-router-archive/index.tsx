import { View, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useSessionStore } from "@/lib/auth/session";
import { theme } from "@/lib/theme";

const logoMark = require("../assets/logos/Logomark.png");

export default function Splash() {
  const router = useRouter();
  const hydrated = useSessionStore.persist.hasHydrated();
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated()) {
      router.replace("/home");
    } else {
      router.replace("/welcome");
    }
  }, [hydrated]);

  return (
    <View style={styles.container}>
      <Image source={logoMark} style={styles.logo} resizeMode="contain" />
      <Text style={styles.brand}>Paadi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  brand: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
});
