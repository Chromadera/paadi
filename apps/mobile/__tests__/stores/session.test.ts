import { useSessionStore } from "@/lib/auth/session";

describe("useSessionStore", () => {
  beforeEach(() => {
    // Reset store state between tests
    useSessionStore.getState().clearSession();
  });

  it("initial state has null tokens", () => {
    const state = useSessionStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.expiresAt).toBeNull();
  });

  it("setSession stores tokens and isAuthenticated() returns true", () => {
    const store = useSessionStore.getState();
    store.setSession({
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      expiresIn: 3600,
    });

    const updated = useSessionStore.getState();
    expect(updated.accessToken).toBe("test-access-token");
    expect(updated.refreshToken).toBe("test-refresh-token");
    expect(updated.expiresAt).toBeGreaterThan(Date.now());
    expect(updated.isAuthenticated()).toBe(true);
  });

  it("clearSession wipes tokens", () => {
    const store = useSessionStore.getState();
    store.setSession({
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      expiresIn: 3600,
    });
    store.clearSession();

    const updated = useSessionStore.getState();
    expect(updated.accessToken).toBeNull();
    expect(updated.refreshToken).toBeNull();
    expect(updated.expiresAt).toBeNull();
    expect(updated.isAuthenticated()).toBe(false);
  });

  it("isAuthenticated returns false when token expired", () => {
    const store = useSessionStore.getState();
    // Set a token that expires in the past
    store.setSession({
      accessToken: "expired-token",
      refreshToken: "expired-refresh",
      expiresIn: -1,
    });

    const updated = useSessionStore.getState();
    expect(updated.isAuthenticated()).toBe(false);
  });
});
