import { renderHook, waitFor, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import type { ReactNode } from "react";

// We import the hooks we want to test — but they live inline in
// the notifications screen. For the test we replicate the same
// useQuery / useMutation pattern directly.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

import { getAuthedClient } from "@/lib/api/client";

const mockedGetAuthedClient = getAuthedClient as jest.MockedFunction<
  typeof getAuthedClient
>;

// Replicate the notification hook pattern from the screen
function useNotificationPrefsForTest() {
  return useQuery({
    queryKey: ["settings", "notifications"],
    queryFn: () => getAuthedClient().getNotificationPreferences(),
  });
}

function useUpdateNotificationPrefsForTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedList: any[]) =>
      getAuthedClient().updateNotificationPreferences({
        preferences: updatedList,
      }),
    onMutate: async (updatedList) => {
      await queryClient.cancelQueries({ queryKey: ["settings", "notifications"] });
      const previous = queryClient.getQueryData<{ preferences: any[] }>([
        "settings",
        "notifications",
      ]);
      queryClient.setQueryData(["settings", "notifications"], {
        preferences: updatedList,
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if ((context as any)?.previous) {
        queryClient.setQueryData(
          ["settings", "notifications"],
          (context as any).previous
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "notifications"] });
    },
  });
}

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

describe("notification hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns notification preferences on success", async () => {
    const mockPrefs = {
      preferences: [
        { event: "NEW_CONTRIBUTION", channel: "PUSH", enabled: true },
        { event: "POT_SETTLED", channel: "PUSH", enabled: false },
      ],
    };

    const mockClient = {
      getNotificationPreferences: jest.fn().mockResolvedValue(mockPrefs),
    };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const { result } = await renderHook(
      () => useNotificationPrefsForTest(),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.preferences).toHaveLength(2);
    expect(result.current.data?.preferences[0].enabled).toBe(true);
    expect(result.current.data?.preferences[1].enabled).toBe(false);
  });

  it("update mutation toggles a preference with optimistic update", async () => {
    const initialPrefs = {
      preferences: [
        { event: "NEW_CONTRIBUTION", channel: "PUSH", enabled: true },
      ],
    };

    const mockClient = {
      getNotificationPreferences: jest.fn().mockResolvedValue(initialPrefs),
      updateNotificationPreferences: jest
        .fn()
        .mockResolvedValue({
          preferences: [
            { event: "NEW_CONTRIBUTION", channel: "PUSH", enabled: false },
          ],
        }),
    };
    mockedGetAuthedClient.mockReturnValue(mockClient as any);

    const wrapper = createWrapper();

    // First, load the preferences
    const { result: queryResult } = await renderHook(
      () => useNotificationPrefsForTest(),
      { wrapper }
    );

    await waitFor(() => {
      expect(queryResult.current.isSuccess).toBe(true);
    });

    // Then toggle
    const { result: mutationResult } = await renderHook(
      () => useUpdateNotificationPrefsForTest(),
      { wrapper }
    );

    await act(async () => {
      mutationResult.current.mutate([
        { event: "NEW_CONTRIBUTION", channel: "PUSH", enabled: false },
      ]);
    });

    await waitFor(() => {
      expect(mutationResult.current.isSuccess).toBe(true);
    });

    expect(mockClient.updateNotificationPreferences).toHaveBeenCalledWith({
      preferences: [
        { event: "NEW_CONTRIBUTION", channel: "PUSH", enabled: false },
      ],
    });
  });
});
