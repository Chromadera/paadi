import { useMutation, useQuery } from "@tanstack/react-query";
import { publicClient, getAuthedClient } from "@/lib/api/client";
import { PaadiApiError } from "@paadi/api-client";
import { useSessionStore } from "@/lib/auth/session";
import { useOnboardingStore } from "./store";

/**
 * One mutation per signup step, all following the SAME shape:
 *   1. call publicClient.<method>
 *   2. on success, write the result into the store
 *   3. the PAGE (not this file) decides where to navigate next
 *
 * All signup routes are @Public on the server — they use the onboardingToken
 * passed in the request body as proof-of-progress, not a Bearer header.
 * That's why we use publicClient (no Authorization header) throughout.
 */

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

// Re-request a code on the same phone — same endpoint as the initial send.
// The OTP screen's "resend" link just calls this again.
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
      return publicClient.signupProfile({ onboardingToken, firstName, lastName });
    },
    onSuccess: (_data, vars) => setName(vars.firstName, vars.lastName),
  });
}

// ---- 4. username: availability check + claim ----

// Separate from the mutation below on purpose — this one fires on every
// keystroke (debounced in the component), it's a read, not a step commit.
export function useUsernameAvailable(handle: string) {
  return useQuery({
    queryKey: ["onboarding", "username-available", handle],
    queryFn: () => publicClient.usernameAvailable(handle),
    enabled: handle.length >= 3, // don't fire for "a", "ad" etc
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
    // password is intentionally never stored client-side longer than this request
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

// ---- 6. PIN -> this is the call that creates the real account ----

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
      // AuthSession (accessToken/refreshToken/expiresIn) persists via
      // useSessionStore (lib/auth/session.ts). Dashboard and any /me/* call
      // can now read useSessionStore().accessToken to know the user is signed in.
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
        platform: "WEB",
        biometricEnabled,
      }),
  });
}