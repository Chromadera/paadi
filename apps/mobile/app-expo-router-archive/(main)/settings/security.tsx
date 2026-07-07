import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useChangePin, useLogout, useLogoutAll, useVerifyPin } from "@/features/settings/profile-hooks";
import { PaadiApiError } from "@paadi/api-client";
import { theme } from "@/lib/theme";
import { Delete, CheckCircle2 } from "lucide-react-native";

type ChangePinStep = "menu" | "current" | "new" | "confirm" | "success";

export default function SecurityPage() {
  const router = useRouter();

  // Multi-step PIN change flow state
  const [pinStep, setPinStep] = useState<ChangePinStep>("menu");
  const [currentPin, setCurrentPin] = useState<string[]>([]);
  const [newPin, setNewPin] = useState<string[]>([]);
  const [confirmPin, setConfirmPin] = useState<string[]>([]);
  const [flowError, setFlowError] = useState<string | null>(null);

  const changePin = useChangePin();
  const logout = useLogout();
  const logoutAll = useLogoutAll();
  const verifyPin = useVerifyPin();
  const changePinError = changePin.error as PaadiApiError | null;

  const maxLength = 4;
  const isPending = changePin.isPending || logout.isPending || logoutAll.isPending;

  function submitPinChange() {
    changePin.mutate(
      { currentPin: currentPin.join(""), newPin: newPin.join("") },
      {
        onSuccess: () => setPinStep("success"),
        onError: () => {
          setCurrentPin([]);
          setPinStep("current");
        },
      }
    );
  }

  function handleKeyPress(num: string) {
    if (pinStep === "current" && currentPin.length < maxLength) {
      setCurrentPin((prev) => [...prev, num]);
    } else if (pinStep === "new" && newPin.length < maxLength) {
      setNewPin((prev) => [...prev, num]);
    } else if (pinStep === "confirm" && confirmPin.length < maxLength) {
      setConfirmPin((prev) => [...prev, num]);
    }
  }

  function handleDelete() {
    if (pinStep === "current") {
      setCurrentPin((prev) => prev.slice(0, -1));
    } else if (pinStep === "new") {
      setNewPin((prev) => prev.slice(0, -1));
    } else if (pinStep === "confirm") {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
  }

  function advancePinStep() {
    setFlowError(null);
    if (pinStep === "current" && currentPin.length === maxLength) {
      verifyPin.mutate(currentPin.join(""), {
        onSuccess: () => setPinStep("new"),
        onError: () => {
          setCurrentPin([]);
          setFlowError("That PIN didn't match. Try again.");
        },
      });
      return;
    } else if (pinStep === "new" && newPin.length === maxLength) {
      if (newPin.join("") === currentPin.join("")) {
        setFlowError("New PIN must be different from current PIN.");
        setNewPin([]);
        return;
      }
      setPinStep("confirm");
    } else if (pinStep === "confirm" && confirmPin.length === maxLength) {
      if (confirmPin.join("") !== newPin.join("")) {
        setFlowError("PINs don't match. Set again.");
        setNewPin([]);
        setConfirmPin([]);
        setPinStep("new");
        return;
      }
      submitPinChange();
    }
  }

  function handleLogoutThisDevice() {
    Alert.alert("Log out", "Are you sure you want to log out of this device?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          logout.mutate(undefined, {
            onSuccess: () => router.replace("/welcome"),
          });
        },
      },
    ]);
  }

  function handleLogoutEverywhere() {
    Alert.alert(
      "Revoke all sessions?",
      "This will log you out of every device connected to your Paadi account, including this one.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out everywhere",
          style: "destructive",
          onPress: () => {
            logoutAll.mutate(undefined, {
              onSuccess: () => router.replace("/welcome"),
            });
          },
        },
      ]
    );
  }

  // ---- Reusable Components ----

  const PinIndicators = ({ pinArray }: { pinArray: string[] }) => (
    <View style={styles.dotsRow}>
      {Array.from({ length: maxLength }).map((_, idx) => {
        const hasDigit = pinArray[idx] !== undefined;
        return (
          <View
            key={idx}
            style={[styles.dot, hasDigit ? styles.dotFilled : styles.dotEmpty]}
          />
        );
      })}
    </View>
  );

  const NumericKeypad = () => (
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
      <View style={styles.keyButton} />
      <TouchableOpacity
        style={styles.keyButton}
        onPress={() => handleKeyPress("0")}
      >
        <Text style={styles.keyText}>0</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.keyButton} onPress={handleDelete}>
        <Delete
          size={20}
          color="rgba(17,24,39,0.5)"
          strokeWidth={2.5}
        />
      </TouchableOpacity>
    </View>
  );

  // ---- Main Render ----

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          pinStep === "menu" ? router.back() : setPinStep("menu")
        }
      >
        <Text style={styles.backArrow}>{"←"}</Text>
        <Text style={styles.backLabel}>Security</Text>
      </TouchableOpacity>

      {pinStep === "menu" && (
        <View style={styles.menuSection}>
          {/* PIN Management Card */}
          <View style={styles.card}>
            <View style={styles.cardIconBox}>
              <Text style={styles.cardIconText}>{""}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Transaction PIN</Text>
              <Text style={styles.cardDescription}>
                Required for transfers, withdrawals, and setting locks.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setCurrentPin([]);
                  setNewPin([]);
                  setConfirmPin([]);
                  setFlowError(null);
                  setPinStep("current");
                }}
              >
                <Text style={styles.cardAction}>Change PIN</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Actions */}
          <View style={styles.logoutCard}>
            <TouchableOpacity
              style={styles.logoutItem}
              onPress={handleLogoutThisDevice}
              disabled={isPending}
              activeOpacity={0.6}
            >
              <Text style={styles.logoutItemText}>Log out this device</Text>
            </TouchableOpacity>
            <View style={styles.logoutDivider} />
            <TouchableOpacity
              style={styles.logoutItem}
              onPress={handleLogoutEverywhere}
              disabled={isPending}
              activeOpacity={0.6}
            >
              <Text style={styles.logoutItemTextDanger}>Log out everywhere</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* PIN Change Flow */}
      {pinStep !== "menu" && pinStep !== "success" && (
        <View style={styles.pinFlowContainer}>
          {/* Icon */}
          <View style={styles.flowIconBox}>
            <Text>{""}</Text>
          </View>

          <Text style={styles.flowHeadline}>
            {pinStep === "current" && "Verify your identity"}
            {pinStep === "new" && "Set new PIN"}
            {pinStep === "confirm" && "Confirm new PIN"}
          </Text>
          <Text style={styles.flowSubtext}>
            {pinStep === "current" &&
              "Enter your current 4-digit Transaction PIN to proceed."}
            {pinStep === "new" &&
              "Create a new 4-digit code. Avoid obvious sequences."}
            {pinStep === "confirm" &&
              "Re-enter the new PIN to confirm it's correct."}
          </Text>

          {/* Pin Indicators */}
          {pinStep === "current" && <PinIndicators pinArray={currentPin} />}
          {pinStep === "new" && <PinIndicators pinArray={newPin} />}
          {pinStep === "confirm" && <PinIndicators pinArray={confirmPin} />}

          {flowError && <Text style={styles.errorText}>{flowError}</Text>}

          {changePinError && (
            <Text style={styles.errorText}>
              {changePinError.statusCode === 401
                ? "Incorrect PIN. Please try again."
                : "Could not update PIN. Please try again."}
            </Text>
          )}

          <View style={styles.spacer} />

          {/* Numeric Keypad */}
          <NumericKeypad />

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.ctaButton,
              ((pinStep === "current" && currentPin.length !== maxLength) ||
                (pinStep === "new" && newPin.length !== maxLength) ||
                (pinStep === "confirm" && confirmPin.length !== maxLength) ||
                isPending) &&
                styles.ctaDisabled,
            ]}
            onPress={advancePinStep}
            disabled={
              (pinStep === "current" && currentPin.length !== maxLength) ||
              (pinStep === "new" && newPin.length !== maxLength) ||
              (pinStep === "confirm" && confirmPin.length !== maxLength) ||
              isPending
            }
          >
            {isPending ? (
              <ActivityIndicator color={theme.colors.ink} />
            ) : (
              <>
                <Text style={styles.ctaText}>Continue</Text>
                <Text style={styles.ctaArrow}>{"➔"}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Success State */}
      {pinStep === "success" && (
        <View style={styles.successContainer}>
          <View style={styles.successIconBox}>
            <CheckCircle2 size={32} color={theme.colors.success} strokeWidth={2.5} />
          </View>
          <Text style={styles.successTitle}>PIN Updated!</Text>
          <Text style={styles.successDescription}>
            Your Transaction PIN has been securely changed. Please use the new
            code for future authorizations.
          </Text>
          <TouchableOpacity onPress={() => setPinStep("menu")}>
            <Text style={styles.successBack}>Go back</Text>
          </TouchableOpacity>
        </View>
      )}
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  backArrow: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
    padding: 4,
  },
  backLabel: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },

  // Menu section
  menuSection: {
    marginTop: theme.spacing[6],
    gap: theme.spacing[4],
  },
  card: {
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    padding: theme.spacing[5],
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: "rgba(255,210,0,0.2)",
    borderWidth: 1,
    borderColor: theme.colors.ink,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconText: {
    fontSize: theme.fontSize.xl,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
  },
  cardDescription: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.5)",
    marginTop: 4,
    lineHeight: 18,
  },
  cardAction: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.secondary,
  },

  // Logout card
  logoutCard: {
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    backgroundColor: theme.colors.white,
    overflow: "hidden",
  },
  logoutItem: {
    paddingHorizontal: theme.spacing[5],
    paddingVertical: 18,
  },
  logoutItemText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(17,24,39,0.8)",
  },
  logoutItemTextDanger: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
  },
  logoutDivider: {
    height: 1,
    backgroundColor: "rgba(17,24,39,0.06)",
  },

  // PIN Flow
  pinFlowContainer: {
    marginTop: theme.spacing[6],
    alignItems: "center",
  },
  flowIconBox: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius["2xl"],
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[6],
  },
  flowHeadline: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    textAlign: "center",
  },
  flowSubtext: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.6)",
    textAlign: "center",
    paddingHorizontal: theme.spacing[4],
    maxWidth: 260,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: theme.spacing[8],
    marginBottom: theme.spacing[6],
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
  },
  dotEmpty: {
    backgroundColor: theme.colors.white,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
    textAlign: "center",
    marginBottom: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: theme.spacing[4],
    width: 280,
    marginBottom: theme.spacing[6],
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

  // Success
  successContainer: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: theme.spacing[6],
  },
  successIconBox: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius["3xl"],
    backgroundColor: "rgba(16,185,129,0.1)",
    borderWidth: 2,
    borderColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[6],
  },
  successTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    textAlign: "center",
  },
  successDescription: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "rgba(17,24,39,0.6)",
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 280,
  },
  successBack: {
    marginTop: theme.spacing[6],
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.secondary,
  },
});
