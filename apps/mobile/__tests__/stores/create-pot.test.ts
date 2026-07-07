import { useCreatePotStore } from "@/features/create-pot/store";

describe("create-pot store", () => {
  beforeEach(() => {
    useCreatePotStore.getState().reset();
  });

  it("has correct initial state", () => {
    const state = useCreatePotStore.getState();
    expect(state.settlementType).toBe("bill_payment");
    expect(state.title).toBe("");
    expect(state.description).toBe("");
    expect(state.totalKobo).toBe(0);
    expect(state.splitMode).toBe("weight");
    expect(state.deadlineAt).toBeNull();
    expect(state.billerCategory).toBeUndefined();
    expect(state.billerProductCode).toBeUndefined();
    expect(state.billerCustomerId).toBeUndefined();
    expect(state.meterType).toBeUndefined();
    expect(state.billerCustomerName).toBeUndefined();
    expect(state.payoutAccountId).toBeUndefined();
    expect(state.splits).toHaveLength(2);
    expect(state.splits[0].label).toBe("Organizer");
  });

  it("setField updates individual fields", () => {
    useCreatePotStore.getState().setField("title", "Test Pot");
    expect(useCreatePotStore.getState().title).toBe("Test Pot");

    useCreatePotStore.getState().setField("totalKobo", 500000);
    expect(useCreatePotStore.getState().totalKobo).toBe(500000);

    useCreatePotStore.getState().setField("description", "A test pot");
    expect(useCreatePotStore.getState().description).toBe("A test pot");
  });

  it("settlement type switching clears biller fields", () => {
    const store = useCreatePotStore;

    // Set bill payment fields
    store.getState().setField("billerCategory", "electricity");
    store.getState().setField("billerProductCode", "ikeja-electric");
    store.getState().setField("billerCustomerId", "1234567890");
    store.getState().setField("billerCustomerName", "John Doe");

    expect(store.getState().billerCategory).toBe("electricity");
    expect(store.getState().billerProductCode).toBe("ikeja-electric");

    // Switch to bank payout - the UI clears biller fields explicitly, test that setField works
    store.getState().setField("settlementType", "bank_payout");
    store.getState().setField("billerCategory", undefined);
    store.getState().setField("billerProductCode", undefined);
    store.getState().setField("billerCustomerId", undefined);
    store.getState().setField("billerCustomerName", undefined);

    expect(store.getState().settlementType).toBe("bank_payout");
    expect(store.getState().billerCategory).toBeUndefined();
    expect(store.getState().billerProductCode).toBeUndefined();
  });

  it("supports split management: add, remove, update", () => {
    const store = useCreatePotStore;

    // Initial: 2 splits
    expect(store.getState().splits).toHaveLength(2);

    // Add a split
    const newSplits = [
      ...store.getState().splits,
      { label: "Friend 2", weight: 1 },
    ];
    store.getState().setField("splits", newSplits);
    expect(store.getState().splits).toHaveLength(3);

    // Update a split label
    const updated = store.getState().splits.map((s, i) => {
      if (i === 0) return { ...s, label: "Boss" };
      return s;
    });
    store.getState().setField("splits", updated);
    expect(store.getState().splits[0].label).toBe("Boss");

    // Remove a split
    const removed = store.getState().splits.slice(1);
    store.getState().setField("splits", removed);
    expect(store.getState().splits).toHaveLength(2);
  });

  it("reset clears all state back to initial", () => {
    const store = useCreatePotStore;

    store.getState().setField("title", "My Big Pot");
    store.getState().setField("totalKobo", 1000000);
    store.getState().setField("splitMode", "amount");
    store.getState().setField("splits", [
      { label: "Me", amountKobo: 500000 },
      { label: "You", amountKobo: 500000 },
    ]);

    store.getState().reset();

    expect(store.getState().title).toBe("");
    expect(store.getState().totalKobo).toBe(0);
    expect(store.getState().splitMode).toBe("weight");
    expect(store.getState().splits).toHaveLength(2);
    expect(store.getState().splits[0].label).toBe("Organizer");
  });
});
