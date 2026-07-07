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
    return { accessToken: "test-token", getState: () => ({ accessToken: "test-token" }) };
  }),
}));

// Import after mocks
import { usePots, usePot } from "@/features/pots/hooks";
import { useCreatePot } from "@/features/create-pot/hooks";
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

describe("pots hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("usePots returns list on success", async () => {
    const mockListItems = {
      items: [
        {
          id: "pot-1",
          title: "Test Pot",
          status: "open" as const,
          totalKobo: 500000,
          collectedKobo: 250000,
          splitCount: 3,
          paidCount: 1,
          deadlineAt: null,
          createdAt: new Date().toISOString(),
        },
      ],
      nextCursor: null,
    };

    const mockClient = { listPots: jest.fn().mockResolvedValue(mockListItems) };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => usePots({ status: "open", limit: 3 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedGetAuthedClient).toHaveBeenCalled();
    expect(mockClient.listPots).toHaveBeenCalledWith({ status: "open", limit: 3 });
    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0].title).toBe("Test Pot");
  });

  it("usePot returns PotDetail on success", async () => {
    const mockPotDetail = {
      id: "pot-1",
      title: "Test Pot",
      description: null,
      totalKobo: 500000,
      settlementType: "bill_payment" as const,
      completionRule: "progressive" as const,
      status: "open" as const,
      billerCategory: null,
      billerProductCode: null,
      billerCustomerId: null,
      meterType: null,
      deadlineAt: null,
      createdAt: new Date().toISOString(),
      progress: {
        collectedKobo: 250000,
        targetKobo: 500000,
        paidCount: 1,
        splitCount: 3,
      },
      settlement: null,
      splits: [],
    };

    const mockClient = { getPot: jest.fn().mockResolvedValue(mockPotDetail) };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => usePot("pot-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockClient.getPot).toHaveBeenCalledWith("pot-1");
    expect(result.current.data?.title).toBe("Test Pot");
  });

  it("useCreatePot calls API and invalidates cache on success", async () => {
    const mockCreatedPot = {
      id: "new-pot-id",
      title: "New Pot",
      description: null,
      totalKobo: 100000,
      settlementType: "bill_payment" as const,
      completionRule: "progressive" as const,
      status: "open" as const,
      billerCategory: null,
      billerProductCode: null,
      billerCustomerId: null,
      meterType: null,
      deadlineAt: null,
      createdAt: new Date().toISOString(),
      progress: {
        collectedKobo: 0,
        targetKobo: 100000,
        paidCount: 0,
        splitCount: 2,
      },
      settlement: null,
      splits: [],
    };

    const mockClient = { createPot: jest.fn().mockResolvedValue(mockCreatedPot) };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => useCreatePot(), {
      wrapper: createWrapper(),
    });

    const input = {
      title: "New Pot",
      totalKobo: 100000,
      settlementType: "bill_payment" as const,
      completionRule: "progressive" as const,
      attributionMode: "checkout_link" as const,
      splitMode: "weight" as const,
      splits: [{ label: "A", weight: 1 }, { label: "B", weight: 1 }],
      billerCategory: "electricity" as const,
      billerProductCode: "ikeja-electric",
      billerCustomerId: "1234567890",
      meterType: "PREPAID" as const,
    };

    result.current.mutate({ input, idempotencyKey: "test-key" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockClient.createPot).toHaveBeenCalledWith(input, "test-key");
    expect(result.current.data?.id).toBe("new-pot-id");
  });

  it("useCreatePot propagates error on failure", async () => {
    const apiError = new Error("Payout account not verified");
    const mockClient = { createPot: jest.fn().mockRejectedValue(apiError) };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => useCreatePot(), {
      wrapper: createWrapper(),
    });

    const input = {
      title: "Fail Pot",
      totalKobo: 50000,
      settlementType: "bank_payout" as const,
      completionRule: "progressive" as const,
      attributionMode: "checkout_link" as const,
      splitMode: "weight" as const,
      splits: [{ label: "A", weight: 1 }, { label: "B", weight: 1 }],
      payoutAccountId: "non-existent-uuid",
    };

    result.current.mutate({ input, idempotencyKey: "fail-key" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Payout account not verified");
  });
});
