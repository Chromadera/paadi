import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import type { ReactNode } from "react";

// Mock the API client
jest.mock("@/lib/api/client", () => ({
  publicClient: {
    signupStart: jest.fn(),
    signupVerifyPhone: jest.fn(),
    signupProfile: jest.fn(),
    signupUsername: jest.fn(),
    signupPassword: jest.fn(),
    signupPin: jest.fn(),
    usernameAvailable: jest.fn(),
  },
  getAuthedClient: jest.fn(() => ({
    registerDevice: jest.fn(),
  })),
}));

// Mock session store
const mockSetSession = jest.fn();
jest.mock("@/lib/auth/session", () => ({
  useSessionStore: jest.fn((selector?: any) => {
    if (typeof selector === "function") {
      return selector({ setSession: mockSetSession, accessToken: null });
    }
    return { setSession: mockSetSession, accessToken: null, getState: () => ({ accessToken: null }) };
  }),
}));

// Need to import after mocks
import { useSignupStart, useVerifyPhone, useSignupPin } from "@/features/onboarding/hooks";
import { publicClient } from "@/lib/api/client";
import { useOnboardingStore } from "@/features/onboarding/store";

const mockedPublicClient = publicClient as jest.Mocked<typeof publicClient>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("onboarding hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardingStore.getState().reset();
    useOnboardingStore.getState().setOnboardingToken("test-onboarding-token");
  });

  it("useSignupStart calls API and stores token on success", async () => {
    mockedPublicClient.signupStart.mockResolvedValueOnce({
      onboardingToken: "new-token",
      expiresIn: 300,
      otpChannel: "sms",
    });

    const { result } = await renderHook(() => useSignupStart(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("+2348000000000");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedPublicClient.signupStart).toHaveBeenCalledWith({
      phone: "+2348000000000",
    });
    expect(useOnboardingStore.getState().onboardingToken).toBe("new-token");
    expect(useOnboardingStore.getState().phone).toBe("+2348000000000");
  });

  it("useVerifyPhone calls API with onboardingToken and code", async () => {
    mockedPublicClient.signupVerifyPhone.mockResolvedValueOnce({
      verified: true as const,
    });

    const { result } = await renderHook(() => useVerifyPhone(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("123456");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedPublicClient.signupVerifyPhone).toHaveBeenCalledWith({
      onboardingToken: "test-onboarding-token",
      code: "123456",
    });
    expect(useOnboardingStore.getState().otpVerified).toBe(true);
  });

  it("useSignupPin calls API and sets session on success", async () => {
    const mockSession = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      expiresIn: 3600,
      tokenType: "Bearer" as const,
    };
    mockedPublicClient.signupPin.mockResolvedValueOnce(mockSession);

    const { result } = await renderHook(() => useSignupPin(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("1234");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedPublicClient.signupPin).toHaveBeenCalledWith({
      onboardingToken: "test-onboarding-token",
      pin: "1234",
    });
    expect(mockSetSession).toHaveBeenCalledWith(mockSession);
    expect(useOnboardingStore.getState().pin).toBe("1234");
  });
});
