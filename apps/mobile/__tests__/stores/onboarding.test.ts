import { useOnboardingStore } from "@/features/onboarding/store";

describe("useOnboardingStore", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("initial state has expected defaults", () => {
    const state = useOnboardingStore.getState();
    expect(state.step).toBe("phone");
    expect(state.onboardingToken).toBeNull();
    expect(state.phone).toBe("");
    expect(state.otpVerified).toBe(false);
    expect(state.firstName).toBe("");
    expect(state.lastName).toBe("");
    expect(state.username).toBe("");
    expect(state.pin).toBe("");
    expect(state.biometricEnabled).toBe(false);
  });

  it("setPhone updates phone", () => {
    useOnboardingStore.getState().setPhone("+2348000000000");
    expect(useOnboardingStore.getState().phone).toBe("+2348000000000");
  });

  it("setOnboardingToken stores token", () => {
    useOnboardingStore.getState().setOnboardingToken("onboarding-abc");
    expect(useOnboardingStore.getState().onboardingToken).toBe("onboarding-abc");
  });

  it("setOtpVerified marks verified", () => {
    useOnboardingStore.getState().setOtpVerified(true);
    expect(useOnboardingStore.getState().otpVerified).toBe(true);
  });

  it("setName updates first and last name", () => {
    useOnboardingStore.getState().setName("Tunde", "Adebayo");
    const state = useOnboardingStore.getState();
    expect(state.firstName).toBe("Tunde");
    expect(state.lastName).toBe("Adebayo");
  });

  it("setUsername stores username", () => {
    useOnboardingStore.getState().setUsername("tunde123");
    expect(useOnboardingStore.getState().username).toBe("tunde123");
  });

  it("setPin stores pin", () => {
    useOnboardingStore.getState().setPin("1234");
    expect(useOnboardingStore.getState().pin).toBe("1234");
  });

  it("setBiometricEnabled toggles biometric", () => {
    useOnboardingStore.getState().setBiometricEnabled(true);
    expect(useOnboardingStore.getState().biometricEnabled).toBe(true);
  });

  it("setStep changes step", () => {
    useOnboardingStore.getState().setStep("otp");
    expect(useOnboardingStore.getState().step).toBe("otp");
  });

  it("reset clears all state back to defaults", () => {
    const store = useOnboardingStore.getState();
    store.setPhone("+2348000000000");
    store.setOnboardingToken("onboarding-abc");
    store.setName("Tunde", "Adebayo");
    store.setUsername("tunde123");
    store.setPin("1234");
    store.setBiometricEnabled(true);
    store.setStep("ready");

    store.reset();

    const resetState = useOnboardingStore.getState();
    expect(resetState.phone).toBe("");
    expect(resetState.onboardingToken).toBeNull();
    expect(resetState.firstName).toBe("");
    expect(resetState.lastName).toBe("");
    expect(resetState.username).toBe("");
    expect(resetState.pin).toBe("");
    expect(resetState.biometricEnabled).toBe(false);
    expect(resetState.step).toBe("phone");
  });
});
