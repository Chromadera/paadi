import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUsernameAvailable, useSignupUsername } from "../../features/onboarding/hooks";
import { PaadiApiError } from "@paadi/api-client";
import { colors, spacing, typography, radius } from "../theme";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BrandMark } from "../components/BrandMark";
import { RootStackParamList } from "../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingUsernameScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(username), 400);
    return () => clearTimeout(timer);
  }, [username]);

  const availability = useUsernameAvailable(debounced);
  const isChecking = availability.isFetching;
  const isAvailable = availability.data?.available ?? null;
  const signupUsername = useSignupUsername();
  const isPending = signupUsername.isPending;

  function handleChange(value: string) {
    setUsername(value.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9_]/g, ""));
  }

  function handleSubmit() {
    if (username.length < 3 || isChecking || isAvailable === false || isPending) return;
    signupUsername.mutate(username, {
      onSuccess: () => navigation.navigate("OnboardingPassword"),
    });
  }

  const error = signupUsername.error as PaadiApiError | null;
  const isTaken = error?.statusCode === 409;

  const statusText =
    isAvailable === false ? "Already taken!"
    : isAvailable === true ? "Looking good!"
    : "Make it catchy!";
  const statusBg =
    isAvailable === false ? colors.danger
    : isAvailable === true ? colors.success
    : colors.pink;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <BrandMark />

        <Text style={styles.title}>Choose a username</Text>
        <Text style={styles.subtitle}>
          Your @username is how friends find and add you to pots.
        </Text>

        <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.atPrefix}>@</Text>
          <Input
            containerStyle={styles.inlineInputContainer}
            style={styles.inlineInput}
            autoFocus
            autoCapitalize="none"
            placeholder="username"
            value={username}
            onChangeText={handleChange}
            editable={!isPending}
          />
          {isChecking && <ActivityIndicator size="small" color={colors.muted} />}
        </View>

        {isTaken && (
          <Text style={styles.errorText}>That username was just taken — try another.</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          title="Set Username"
          onPress={handleSubmit}
          disabled={username.length < 3 || isChecking || isAvailable === false || isPending}
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
    marginBottom: spacing["6"],
  },
  statusPill: {
    alignSelf: "center",
    paddingHorizontal: spacing["3"],
    paddingVertical: spacing["0.5"],
    borderRadius: radius.full,
    marginBottom: spacing["4"],
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: radius.base,
    borderWidth: 2,
    borderColor: colors.fg,
    backgroundColor: colors.surface,
    paddingRight: spacing["4"],
  },
  atPrefix: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.black,
    color: colors.muted,
    paddingLeft: spacing["4"],
    paddingRight: spacing["0.5"],
    paddingVertical: spacing["3.5"],
  },
  inlineInputContainer: {
    flex: 1,
  },
  inlineInput: {
    borderWidth: 0,
    borderRadius: 0,
    paddingVertical: spacing["3.5"],
    paddingHorizontal: 0,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.danger,
    marginTop: spacing["3"],
  },
  footer: {
    paddingBottom: spacing["4"],
  },
});
