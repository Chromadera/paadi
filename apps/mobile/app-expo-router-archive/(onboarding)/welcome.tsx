import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/lib/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const illustrationImg = require("../../assets/onboardin.jpg");

type Slide = {
  headline: string;
  coloredText?: string;
  subtext: string;
};

const SLIDES: Slide[] = [
  {
    headline: "Splitting money shouldn't mean chasing people on ",
    coloredText: "WhatsApp.",
    subtext:
      "Collect contributions, track who's paid, and pay out all in one link.",
  },
  {
    headline: "Create a split in seconds",
    subtext:
      "Set the amount, add your people, and we generate a dedicated account for each person automatically.",
  },
  {
    headline: "Every naira goes into a ",
    coloredText: "real bank account",
    subtext:
      "Powered by Nomba. Each participant gets their own virtual account nothing pools into one risky wallet.",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === SLIDES.length - 1;
  const slide = SLIDES[activeIndex];

  function handleNext() {
    if (isLastSlide) {
      router.replace("/get-started");
      return;
    }
    setActiveIndex((i) => i + 1);
  }

  function handleSkip() {
    router.replace("/get-started");
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>Paadi</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Illustration Area */}
      <View style={styles.illustration}>
        <Image source={illustrationImg} style={styles.illustrationImg} resizeMode="contain" />
      </View>

      {/* Typography Content */}
      <View style={styles.textSection}>
        <Text style={styles.headline}>
          {slide.headline}
          {slide.coloredText && (
            <Text style={styles.coloredText}>{slide.coloredText}</Text>
          )}
        </Text>
        <Text style={styles.subtext}>{slide.subtext}</Text>
      </View>

      {/* Carousel Controls & CTA */}
      <View style={styles.controls}>
        {/* Dot Indicators */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActiveIndex(i)}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={handleNext}>
          <Text style={styles.ctaText}>
            {isLastSlide ? "Get started" : "Next"}
          </Text>
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
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing[4],
  },
  brand: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  skipText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: "#F59E0B",
  },
  illustration: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationImg: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
  },
  textSection: {
    alignItems: "center",
    paddingHorizontal: theme.spacing[2],
    minHeight: 140,
    justifyContent: "center",
  },
  headline: {
    fontSize: theme.fontSize.huge - 2,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    textAlign: "center",
    lineHeight: 34,
  },
  coloredText: {
    color: theme.colors.secondary,
  },
  subtext: {
    marginTop: 14,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: "#92400E",
    textAlign: "center",
    paddingHorizontal: theme.spacing[2],
    lineHeight: 22,
  },
  controls: {
    marginTop: theme.spacing[8],
    gap: 24,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: theme.borderRadius.full,
  },
  dotActive: {
    width: 28,
    backgroundColor: theme.colors.ink,
  },
  dotInactive: {
    width: 6,
    backgroundColor: "rgba(17,24,39,0.2)",
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
