import { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignupStart } from "@/features/onboarding/hooks";
import { PaadiApiError } from "@paadi/api-client";
import { theme } from "@/lib/theme";

const phoneImg = require("../../assets/phone.jpg");

export default function PhonePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const signupStart = useSignupStart();

  const error = signupStart.error as PaadiApiError | null;
  const isInvalidPhone =
    error?.statusCode === undefined &&
    error?.issues?.some((i) => i.path === "phone");

  function handleContinue() {
    const fullPhone = `+234${phone.replace(/^0/, "")}`;
    signupStart.mutate(fullPhone, {
      onSuccess: () => router.push("/otp"),
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
        {/* Illustration */}
        <Image source={phoneImg} style={styles.illustrationImg} resizeMode="contain" />

        <Text style={styles.headline}>What's your number?</Text>
        <Text style={styles.subtext}>
          Join the crew. Let's get your account verified and ready for social
          splitting.
        </Text>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <View style={styles.prefixBox}>
            <Text style={styles.prefixText}>{"🇳🇬"} +234</Text>
          </View>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            autoFocus
            placeholder="800 000 0000"
            placeholderTextColor={theme.colors.inkMuted}
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/\D/g, ""))}
          />
        </View>

        {isInvalidPhone ? (
          <Text style={styles.errorText}>
            Enter a valid Nigerian phone number.
          </Text>
        ) : (
          <Text style={styles.privacyText}>
            Your privacy is our priority
          </Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.smsText}>
          We'll send a code to verify your phone via SMS or WhatsApp.
        </Text>

        <TouchableOpacity
          style={[
            styles.ctaButton,
            (phone.length < 10 || signupStart.isPending) && styles.ctaDisabled,
          ]}
          onPress={handleContinue}
          disabled={phone.length < 10 || signupStart.isPending}
        >
          {signupStart.isPending ? (
            <ActivityIndicator color={theme.colors.ink} />
          ) : (
            <>
              <Text style={styles.ctaText}>Continue</Text>
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
    width: 28,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationImg: {
    width: 160,
    height: 160,
    marginBottom: theme.spacing[8],
    alignSelf: "center",
  },
  headline: {
    fontSize: theme.fontSize.huge - 2,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.ink,
    textAlign: "center",
    lineHeight: 34,
  },
  subtext: {
    marginTop: 10,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: "#EAB308",
    textAlign: "center",
    paddingHorizontal: theme.spacing[4],
    lineHeight: 20,
  },
  inputContainer: {
    marginTop: theme.spacing[8],
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.borderRadius["2xl"],
    borderWidth: 2,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 2,
  },
  prefixBox: {
    paddingRight: 12,
    borderRightWidth: 2,
    borderRightColor: "rgba(17,24,39,0.1)",
    paddingVertical: 8,
  },
  prefixText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 12,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
  },
  errorText: {
    marginTop: 8,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.danger,
  },
  privacyText: {
    marginTop: 16,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  footer: {
    gap: 20,
    alignItems: "center",
  },
  smsText: {
    textAlign: "center",
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.inkMuted,
    paddingHorizontal: theme.spacing[6],
    lineHeight: 18,
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
