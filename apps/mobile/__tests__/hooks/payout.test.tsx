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
import { usePayoutAccounts, useCreatePayoutAccount } from "@/features/settings/payout-hooks";
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

describe("payout hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("usePayoutAccounts returns accounts list on success", async () => {
    const mockAccounts = {
      accounts: [
        {
          id: "acc-1",
          bankCode: "044",
          bankName: "Access Bank",
          accountNumberLast4: "5678",
          accountName: "John Doe",
          nameMatchVerified: true,
          isPrimary: true,
        },
        {
          id: "acc-2",
          bankCode: "058",
          bankName: "GTBank",
          accountNumberLast4: "1234",
          accountName: "John Doe",
          nameMatchVerified: false,
          isPrimary: false,
        },
      ],
    };

    const mockClient = {
      getPayoutAccounts: jest.fn().mockResolvedValue(mockAccounts),
    };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => usePayoutAccounts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.accounts).toHaveLength(2);
    expect(result.current.data?.accounts[0].bankName).toBe("Access Bank");
  });

  it("useCreatePayoutAccount calls API with bank code + account number + pin", async () => {
    const mockResult = {
      accounts: [
        {
          id: "new-acc",
          bankCode: "044",
          bankName: "Access Bank",
          accountNumberLast4: "5678",
          accountName: "New Account",
          nameMatchVerified: true,
          isPrimary: false,
        },
      ],
    };

    const mockClient = {
      createPayoutAccount: jest.fn().mockResolvedValue(mockResult),
    };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(() => useCreatePayoutAccount(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      bankCode: "044",
      accountNumber: "1234567890",
      pin: "1234",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockClient.createPayoutAccount).toHaveBeenCalledWith({
      bankCode: "044",
      accountNumber: "1234567890",
      pin: "1234",
    });
  });
});
