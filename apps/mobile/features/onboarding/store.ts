import { create } from "zustand";

type OnboardingStep =
  | "phone"
  | "otp"
  | "name"
  | "username"
  | "password"
  | "pin"
  | "biometric"
  | "ready";

type OnboardingState = {
  step: OnboardingStep;
  onboardingToken: string | null;
  phone: string;
  otpVerified: boolean;
  firstName: string;
  lastName: string;
  username: string;
  pin: string;
  biometricEnabled: boolean;

  setStep: (step: OnboardingStep) => void;
  setOnboardingToken: (token: string) => void;
  setPhone: (phone: string) => void;
  setOtpVerified: (verified: boolean) => void;
  setName: (firstName: string, lastName: string) => void;
  setUsername: (username: string) => void;
  setPin: (pin: string) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  reset: () => void;
};

const initialState = {
  step: "phone" as OnboardingStep,
  onboardingToken: null as string | null,
  phone: "",
  otpVerified: false,
  firstName: "",
  lastName: "",
  username: "",
  pin: "",
  biometricEnabled: false,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setOnboardingToken: (onboardingToken) => set({ onboardingToken }),
  setPhone: (phone) => set({ phone }),
  setOtpVerified: (otpVerified) => set({ otpVerified }),
  setName: (firstName, lastName) => set({ firstName, lastName }),
  setUsername: (username) => set({ username }),
  setPin: (pin) => set({ pin }),
  setBiometricEnabled: (biometricEnabled) => set({ biometricEnabled }),
  reset: () => set(initialState),
}));
