import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import type { ReactNode } from "react";

// Mock the API client
jest.mock("@/lib/api/client", () => ({
  publicClient: {
    login: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  },
  getAuthedClient: jest.fn(),
}));

// Mock session store
const mockSetSession = jest.fn();
jest.mock("@/lib/auth/session", () => ({
  useSessionStore: jest.fn((selector?: any) => {
    if (typeof selector === "function") {
      return selector({ setSession: mockSetSession });
    }
    return { setSession: mockSetSession, getState: () => ({ accessToken: null }) };
  }),
}));

// Import after mocks
import { useLogin } from "@/features/auth/login-hooks";
import { publicClient } from "@/lib/api/client";

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

describe("useLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls API and sets session on success", async () => {
    const mockSession = {
      accessToken: "login-access-token",
      refreshToken: "login-refresh-token",
      expiresIn: 3600,
      tokenType: "Bearer" as const,
      stepUpRequired: false,
    };
    mockedPublicClient.login.mockResolvedValueOnce(mockSession);

    const { result } = await renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      identifier: "testuser",
      password: "password123",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedPublicClient.login).toHaveBeenCalledWith({
      identifier: "testuser",
      password: "password123",
    });
    expect(mockSetSession).toHaveBeenCalledWith(mockSession);
  });

  it("throws on invalid credentials", async () => {
    const apiError = new Error("Invalid credentials");
    mockedPublicClient.login.mockRejectedValueOnce(apiError);

    const { result } = await renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      identifier: "wronguser",
      password: "wrongpassword",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Invalid credentials");
    expect(mockSetSession).not.toHaveBeenCalled();
  });
});
