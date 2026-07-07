import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import type { ReactNode } from "react";

// Mock the API client
jest.mock("@/lib/api/client", () => ({
  publicClient: {},
  getAuthedClient: jest.fn(),
}));

// Mock session store
const mockClearSession = jest.fn();
jest.mock("@/lib/auth/session", () => ({
  useSessionStore: jest.fn((selector?: any) => {
    if (typeof selector === "function") {
      return selector({
        accessToken: "test-token",
        clearSession: mockClearSession,
      });
    }
    return {
      accessToken: "test-token",
      clearSession: mockClearSession,
      getState: () => ({ accessToken: "test-token" }),
    };
  }),
}));

// Import after mocks
import { useMe, useLogout } from "@/features/settings/profile-hooks";
import { getAuthedClient } from "@/lib/api/client";

const mockedGetAuthedClient = getAuthedClient as jest.MockedFunction<typeof getAuthedClient>;

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

describe("profile hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("useMe returns user profile on success", async () => {
    const mockProfile = {
      profile: {
        id: "user-1",
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        displayName: "John D.",
        avatarUrl: null,
        email: null,
        emailVerified: false,
        phone: "+2348000000000",
      },
      tier: "TIER_0",
      createdAt: new Date().toISOString(),
    };

    const mockClient = { getMe: jest.fn().mockResolvedValue(mockProfile) };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => useMe(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.profile.username).toBe("johndoe");
    expect(result.current.data?.tier).toBe("TIER_0");
  });

  it("useLogout calls API and clears session on success", async () => {
    const mockClient = { logout: jest.fn().mockResolvedValue({ ok: true }) };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockClient.logout).toHaveBeenCalled();
    expect(mockClearSession).toHaveBeenCalled();
  });

  it("useLogout clears session even on API error", async () => {
    const mockClient = {
      logout: jest.fn().mockRejectedValue(new Error("Network error")),
    };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockClearSession).toHaveBeenCalled();
  });
});
