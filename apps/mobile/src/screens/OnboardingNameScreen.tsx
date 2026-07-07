import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSignupProfile } from "../../features/onboarding/hooks";
import { PaadiApiError } from "@paadi/api-client";
import { colors, spacing, typography, radius, shadows } from "../theme";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BrandMark } from "../components/BrandMark";
import { RootStackParamList } from "../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingNameScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const signupProfile = useSignupProfile();
  const isPending = signupProfile.isPending;

  function handleContinue() {
    if (!firstName.trim() || !lastName.trim() || isPending) return;
    signupProfile.mutate(
      { firstName: firstName.trim(), lastName: lastName.trim() },
      { onSuccess: () => navigation.navigate("OnboardingUsername") }
    );
  }

  const isValid = firstName.trim().length >= 2 && lastName.trim().length >= 2;
  const error = signupProfile.error as PaadiApiError | null;

  const initials =
    `${firstName.trim().charAt(0).toUpperCase() || ""}${lastName.trim().charAt(0).toUpperCase() || ""}` || "P";

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <BrandMark />

        <Text style={styles.title}>What's your name?</Text>
        <Text style={styles.subtitle}>
          Enter your name as it appears on your ID
        </Text>

        <Input
          label="First Name"
          autoFocus
          placeholder="e.g., Tunde"
          value={firstName}
          onChangeText={setFirstName}
          editable={!isPending}
          containerStyle={styles.inputSpacing}
        />

        <Input
          label="Last Name"
          placeholder="e.g., Adebayo"
          value={lastName}
          onChangeText={setLastName}
          editable={!isPending}
          containerStyle={styles.inputSpacing}
        />

        {error && (
          <Text style={styles.errorText}>
            Couldn't save your name. Please try again.
          </Text>
        )}

      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isValid || isPending}
          loading={isPending}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing["6"],
  },
  content: {
    flex: 1,
    paddingTop: spacing["12"],
    alignItems: "center",
  },
  title: {
    fontSize: typography.sizes["2xl-"],
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.heading,
    color: colors.fg,
    textAlign: "center",
    marginTop: spacing["6"],
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.muted60,
    textAlign: "center",
    marginTop: spacing["1.5"],
    marginBottom: spacing["8"],
  },
  inputSpacing: {
    marginBottom: spacing["3"],
  },
  errorText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing["4"],
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["4"],
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.fg,
    padding: spacing["4"],
    marginTop: spacing["6"],
    width: "100%",
    ...shadows.brutSm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.pink,
    borderWidth: 2,
    borderColor: colors.fg,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.black,
    color: colors.surface,
  },
  previewInfo: {
    flex: 1,
  },
  previewLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.black,
    color: colors.pink,
    letterSpacing: typography.letterSpacing.wide,
  },
  previewName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.black,
    color: colors.fg,
    marginTop: spacing["0.5"],
  },
  previewRole: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.muted,
    marginTop: spacing["0.5"],
  },
  footer: {
    paddingBottom: spacing["4"],
  },
});
