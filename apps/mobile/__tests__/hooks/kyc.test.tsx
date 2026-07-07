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
jest.mock("@/lib/auth/session", () => ({
  useSessionStore: jest.fn((selector?: any) => {
    if (typeof selector === "function") {
      return selector({ accessToken: "test-token" });
    }
    return {
      accessToken: "test-token",
      getState: () => ({ accessToken: "test-token" }),
    };
  }),
}));

// Import after mocks
import { useKycStatus, useSubmitBvn, useSubmitSelfie } from "@/features/kyc/hooks";
import { getAuthedClient } from "@/lib/api/client";

const mockedGetAuthedClient = getAuthedClient as jest.MockedFunction<
  typeof getAuthedClient
>;

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

describe("kyc hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("useKycStatus returns KYC status on success", async () => {
    const mockKyc = {
      kycStatus: "PENDING",
      bvnVerified: true,
      tier: "TIER_0",
    };

    const mockClient = { getKyc: jest.fn().mockResolvedValue(mockKyc) };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => useKycStatus(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.kycStatus).toBe("PENDING");
    expect(result.current.data?.bvnVerified).toBe(true);
  });

  it("useSubmitBvn calls API with BVN string", async () => {
    const mockClient = {
      submitKycBvn: jest.fn().mockResolvedValue({ ok: true }),
    };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => useSubmitBvn(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("22200000000");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockClient.submitKycBvn).toHaveBeenCalledWith({
      bvn: "22200000000",
    });
  });

  it("useSubmitSelfie calls API with image data", async () => {
    const mockClient = {
      submitKycSelfie: jest.fn().mockResolvedValue({ ok: true }),
    };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => useSubmitSelfie(), {
      wrapper: createWrapper(),
    });

    const imageData = "base64encodedstring";
    result.current.mutate(imageData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockClient.submitKycSelfie).toHaveBeenCalledWith({
      image: imageData,
    });
  });
});
