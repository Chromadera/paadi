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
  useLocalSearchParams: jest.fn().mockReturnValue({ token: "test-token" }),
}));

// Mock publicClient
const mockGetPayerView = jest.fn();
jest.mock("@/lib/api/client", () => ({
  publicClient: {
    getPayerView: (...args: any[]) => mockGetPayerView(...args),
  },
  getAuthedClient: jest.fn(),
}));

// Mock Linking
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn().mockResolvedValue(undefined),
}));

// Import after mocks
import PayPage from "@/app/pay/[token]";

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

describe("Pay screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders pending state with Pay Now button", async () => {
    mockGetPayerView.mockResolvedValue({
      potTitle: "Office AC Fund",
      potStatus: "open",
      shareStatus: "pending",
      shareKobo: 500000,
      splitLabel: "Equal",
      organizerName: "Jane Doe",
      organizerHandle: "janedoe",
      checkoutUrl: "https://checkout.example.com/pay",
      progress: {
        targetKobo: 12000000,
        collectedKobo: 4500000,
      },
    });

    const { getByText } = await render(<PayPage />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(getByText(/Pay with Nomba Checkout/)).toBeTruthy();
    });

    expect(getByText("Office AC Fund")).toBeTruthy();
    expect(getByText("Jane Doe")).toBeTruthy();
  });

  it("renders paid state with success banner", async () => {
    mockGetPayerView.mockResolvedValue({
      potTitle: "Office AC Fund",
      potStatus: "open",
      shareStatus: "paid",
      shareKobo: 500000,
      splitLabel: "Equal",
      organizerName: "Jane Doe",
      organizerHandle: "janedoe",
      checkoutUrl: null,
      progress: {
        targetKobo: 12000000,
        collectedKobo: 5000000,
      },
    });

    const { getByText } = await render(<PayPage />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(getByText("Contribution Paid!")).toBeTruthy();
    });
  });

  it("renders cancelled state with message", async () => {
    mockGetPayerView.mockResolvedValue({
      potTitle: "Office AC Fund",
      potStatus: "cancelled",
      shareStatus: "pending",
      shareKobo: 500000,
      splitLabel: "Equal",
      organizerName: "Jane Doe",
      organizerHandle: "janedoe",
      checkoutUrl: "https://checkout.example.com/pay",
      progress: {
        targetKobo: 12000000,
        collectedKobo: 0,
      },
    });

    const { getByText } = await render(<PayPage />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(
        getByText(/This split pot has been cancelled/)
      ).toBeTruthy();
    });
  });

  it("renders error state when view fails to load", async () => {
    mockGetPayerView.mockRejectedValue(new Error("Not found"));

    const { getByText } = await render(<PayPage />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(
        getByText(/Payment link not found or expired/)
      ).toBeTruthy();
    });
  });
});
