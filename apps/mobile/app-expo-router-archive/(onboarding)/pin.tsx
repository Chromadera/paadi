import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignupPin } from "@/features/onboarding/hooks";
import { PaadiApiError } from "@paadi/api-client";
import { theme } from "@/lib/theme";
import { Delete } from "lucide-react-native";

export default function PinPage() {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>([]);
  const maxLength = 4;
  const signupPin = useSignupPin();
  const isPending = signupPin.isPending;
  const error = signupPin.error as PaadiApiError | null;

  function handleKeyPress(num: string) {
    if (pin.length < maxLength) {
      setPin((prev) => [...prev, num]);
    }
  }

  function handleDelete() {
    setPin((prev) => prev.slice(0, -1));
  }

  function handleSubmit() {
    if (pin.length !== maxLength || isPending) return;
    signupPin.mutate(pin.join(""), {
      onSuccess: () => router.push("/biometric"),
    });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{"←"}</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>Paadi</Text>
        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconBox}>
          <Text>{"🔢"}</Text>
        </View>

        <Text style={styles.headline}>Create a secure PIN</Text>
        <Text style={styles.subtext}>
          This code protects fast transfers and wallet lock status updates.
        </Text>

        {/* Dot Indicators */}
        <View style={styles.dots}>
          {Array.from({ length: maxLength }).map((_, idx) => {
            const hasDigit = pin[idx] !== undefined;
            return (
              <View
                key={idx}
                style={[
                  styles.dot,
                  hasDigit ? styles.dotFilled : styles.dotEmpty,
                ]}
              />
            );
          })}
        </View>

        {error && (
          <Text style={styles.errorText}>
            {error.statusCode === 401
              ? "That doesn't look right. Try a different PIN."
              : "Couldn't set your PIN. Please try again."}
          </Text>
        )}

        {/* Numeric Keypad */}
        <View style={styles.keypad}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.keyButton}
              onPress={() => handleKeyPress(num)}
            >
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
          {/* Empty spacer */}
          <View style={styles.keyButton} />
          <TouchableOpacity
            style={styles.keyButton}
            onPress={() => handleKeyPress("0")}
          >
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keyButton}
            onPress={handleDelete}
            disabled={pin.length === 0}
          >
            <Delete
              size={20}
              color={pin.length === 0 ? theme.colors.inkMuted : theme.colors.ink}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.ctaButton,
            (pin.length !== maxLength || isPending) && styles.ctaDisabled,
          ]}
          onPress={handleSubmit}
          disabled={pin.length !== maxLength || isPending}
        >
          {isPending ? (
            <ActivityIndicator color={theme.colors.ink} />
          ) : (
            <>
              <Text style={styles.ctaText}>Lock Code & Continue</Text>
              <Text style={styles.ctaArrow}>{"➔"}</Text>
            </>
          )}
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
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  },
  backArrow: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
    padding: theme.spacing[2],
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
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
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
  },
  subtext: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.inkMuted,
    textAlign: "center",
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[8],
  },
  dots: {
    flexDirection: "row",
    gap: 20,
    marginBottom: theme.spacing[8],
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.ink,
  },
  dotFilled: {
    backgroundColor: theme.colors.secondary,
    borderBottomWidth: 2,
  },
  dotEmpty: {
    backgroundColor: theme.colors.white,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
    marginBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: theme.spacing[4],
    gap: 0,
    width: 280,
  },
  keyButton: {
    width: 93,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
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
  ctaDisabled: {
    opacity: 0.4,
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
