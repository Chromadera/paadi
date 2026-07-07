import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: jest.fn().mockReturnValue({}),
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

// Mock useMe
jest.mock("@/features/settings/profile-hooks", () => ({
  useMe: jest.fn().mockReturnValue({
    data: {
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
      tier: "TIER_1",
      createdAt: new Date().toISOString(),
    },
    isPending: false,
    error: null,
  }),
  useLogout: jest.fn(),
}));

// Mock usePots
const mockUsePots = jest.fn().mockReturnValue({
  data: { items: [], nextCursor: null },
  isPending: false,
  error: null,
});
jest.mock("@/features/pots/hooks", () => ({
  usePots: (...args: any[]) => mockUsePots(...args),
  usePot: jest.fn(),
  useCancelPot: jest.fn(),
  useDeletePot: jest.fn(),
  usePotSettlement: jest.fn(),
  usePotActivity: jest.fn(),
}));

// Mock getAuthedClient with getWallet
const mockGetWallet = jest.fn().mockResolvedValue({
  balanceKobo: 5000000,
  virtualAccount: {
    bankName: "Providus Bank",
    accountNumber: "1234567890",
  },
});
jest.mock("@/lib/api/client", () => ({
  publicClient: {},
  getAuthedClient: jest.fn(() => ({
    getWallet: mockGetWallet,
  })),
}));

// Import after all mocks
import HomePage from "@/app/(main)/home";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function QueryWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("Home screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePots.mockReturnValue({
      data: { items: [], nextCursor: null },
      isPending: false,
      error: null,
    });
    mockGetWallet.mockResolvedValue({
      balanceKobo: 5000000,
      virtualAccount: {
        bankName: "Providus Bank",
        accountNumber: "1234567890",
      },
    });
  });

  it("smoke test: renders dashboard without crashing", async () => {
    const { getByText } = await render(<HomePage />, {
      wrapper: createWrapper(),
    });

    // Greeting should be shown - John's name appears in the greeting
    expect(getByText(/John/)).toBeTruthy();
  });

  it("shows create pot button", async () => {
    const { getByText } = await render(<HomePage />, {
      wrapper: createWrapper(),
    });

    expect(getByText("Create New Split Pot")).toBeTruthy();
  });

  it("shows wallet balance when wallet is loaded", async () => {
    const { getByText } = await render(<HomePage />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(getByText("Wallet Balance")).toBeTruthy();
    });
  });

  it("renders empty state when no pots", async () => {
    const { getByText } = await render(<HomePage />, {
      wrapper: createWrapper(),
    });

    expect(getByText("No active collections")).toBeTruthy();
  });

  it("renders active pots when present", async () => {
    mockUsePots.mockReturnValue({
      data: {
        items: [
          {
            id: "pot-1",
            title: "Office AC Fund",
            status: "open",
            totalKobo: 300000,
            collectedKobo: 150000,
            splitCount: 5,
            paidCount: 3,
            deadlineAt: null,
            createdAt: new Date().toISOString(),
          },
        ],
        nextCursor: null,
      },
      isPending: false,
      error: null,
    });

    const { getByText } = await render(<HomePage />, {
      wrapper: createWrapper(),
    });

    expect(getByText("Office AC Fund")).toBeTruthy();
    expect(getByText(/Active Pots/)).toBeTruthy();
  });
});
