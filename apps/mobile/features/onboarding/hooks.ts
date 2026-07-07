import { useMutation, useQuery } from "@tanstack/react-query";
import { publicClient, getAuthedClient } from "@/lib/api/client";
import { PaadiApiError } from "@paadi/api-client";
import { useSessionStore } from "@/lib/auth/session";
import { useOnboardingStore } from "./store";
import { Platform } from "react-native";

// ---- 1. phone entry -> request OTP ----

export function useSignupStart() {
  const setOnboardingToken = useOnboardingStore((s) => s.setOnboardingToken);
  const setPhone = useOnboardingStore((s) => s.setPhone);

  return useMutation({
    mutationFn: (phone: string) => publicClient.signupStart({ phone }),
    onSuccess: (data, phone) => {
      setOnboardingToken(data.onboardingToken);
      setPhone(phone);
    },
  });
}

// ---- 2. OTP verify ----

export function useVerifyPhone() {
  const onboardingToken = useOnboardingStore((s) => s.onboardingToken);
  const setOtpVerified = useOnboardingStore((s) => s.setOtpVerified);

  return useMutation({
    mutationFn: (code: string) => {
      if (!onboardingToken) {
        throw new PaadiApiError(
          { statusCode: 400, message: "invalid onboarding token" },
          400
        );
      }
      return publicClient.signupVerifyPhone({ onboardingToken, code });
    },
    onSuccess: () => setOtpVerified(true),
  });
}

// Re-request a code
export function useResendOtp() {
  const phone = useOnboardingStore((s) => s.phone);
  const setOnboardingToken = useOnboardingStore((s) => s.setOnboardingToken);

  return useMutation({
    mutationFn: () => publicClient.signupStart({ phone }),
    onSuccess: (data) => setOnboardingToken(data.onboardingToken),
  });
}

// ---- 3. name entry ----

export function useSignupProfile() {
  const onboardingToken = useOnboardingStore((s) => s.onboardingToken);
  const setName = useOnboardingStore((s) => s.setName);

  return useMutation({
    mutationFn: ({
      firstName,
      lastName,
    }: {
      firstName: string;
      lastName: string;
    }) => {
      if (!onboardingToken) {
        throw new PaadiApiError(
          { statusCode: 400, message: "invalid onboarding token" },
          400
        );
      }
      return publicClient.signupProfile({
        onboardingToken,
        firstName,
        lastName,
      });
    },
    onSuccess: (_data, vars) => setName(vars.firstName, vars.lastName),
  });
}

// ---- 4. username: availability check + claim ----

export function useUsernameAvailable(handle: string) {
  return useQuery({
    queryKey: ["onboarding", "username-available", handle],
    queryFn: () => publicClient.usernameAvailable(handle),
    enabled: handle.length >= 3,
    staleTime: 0,
    retry: false,
  });
}

export function useSignupUsername() {
  const onboardingToken = useOnboardingStore((s) => s.onboardingToken);
  const setUsername = useOnboardingStore((s) => s.setUsername);

  return useMutation({
    mutationFn: (username: string) => {
      if (!onboardingToken) {
        throw new PaadiApiError(
          { statusCode: 400, message: "invalid onboarding token" },
          400
        );
      }
      return publicClient.signupUsername({ onboardingToken, username });
    },
    onSuccess: (_data, username) => setUsername(username),
  });
}

// ---- 5. password ----

export function useSignupPassword() {
  const onboardingToken = useOnboardingStore((s) => s.onboardingToken);

  return useMutation({
    mutationFn: (password: string) => {
      if (!onboardingToken) {
        throw new PaadiApiError(
          { statusCode: 400, message: "invalid onboarding token" },
          400
        );
      }
      return publicClient.signupPassword({ onboardingToken, password });
    },
  });
}

// ---- 6. PIN -> creates the real account ----

export function useSignupPin() {
  const onboardingToken = useOnboardingStore((s) => s.onboardingToken);
  const setPin = useOnboardingStore((s) => s.setPin);
  const setSession = useSessionStore((s) => s.setSession);

  return useMutation({
    mutationFn: (pin: string) => {
      if (!onboardingToken) {
        throw new PaadiApiError(
          { statusCode: 400, message: "incomplete signup" },
          400
        );
      }
      return publicClient.signupPin({ onboardingToken, pin });
    },
    onSuccess: (session, pin) => {
      setPin(pin);
      setSession(session);
    },
  });
}

// ---- 7. biometric device registration ----

export function useRegisterDevice() {
  return useMutation({
    mutationFn: ({
      deviceId,
      biometricEnabled,
    }: {
      deviceId: string;
      biometricEnabled: boolean;
    }) =>
      getAuthedClient().registerDevice({
        deviceId,
        platform:
          Platform.OS === "ios" ? "IOS" : "ANDROID",
        biometricEnabled,
      }),
  });
}
