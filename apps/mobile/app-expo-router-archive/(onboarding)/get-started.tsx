import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/lib/theme";

const illustrationImg = require("../../assets/get.jpg");

export default function GetStartedPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>Paadi</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>Step 1/3</Text>
        </View>
      </View>

      {/* Illustration */}
      <View style={styles.illustration}>
        <Image source={illustrationImg} style={styles.illustrationImg} resizeMode="contain" />
      </View>

      {/* Typography */}
      <View style={styles.textSection}>
        <Text style={styles.headline}>
          Let's set up your{"\n"}first split
        </Text>
        <Text style={styles.subtext}>
          Join 50k+ people splitting bills, rent, and goals without the awkward
          "pay me back" texts.
        </Text>
      </View>

      {/* CTAs */}
      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/phone")}
        >
          <Text style={styles.primaryButtonText}>Get started</Text>
          <Text style={styles.arrow}>{"➔"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.secondaryButtonText}>
            I already have an account
          </Text>
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
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  stepBadge: {
    backgroundColor: "rgba(17,24,39,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  stepText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkMuted,
  },
  illustration: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationImg: {
    width: 260,
    height: 260,
  },
  textSection: {
    alignItems: "center",
    paddingHorizontal: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  headline: {
    fontSize: theme.fontSize.huge,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
    textAlign: "center",
    lineHeight: 34,
  },
  subtext: {
    marginTop: 14,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: "#92400E",
    textAlign: "center",
    paddingHorizontal: theme.spacing[4],
    lineHeight: 22,
  },
  ctaSection: {
    gap: 14,
  },
  primaryButton: {
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
  primaryButtonText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
  arrow: {
    fontSize: theme.fontSize.base,
  },
  secondaryButton: {
    width: "100%",
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: theme.spacing[4],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.ink,
  },
  secondaryButtonText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
});
