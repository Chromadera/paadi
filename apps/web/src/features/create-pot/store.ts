import { create } from "zustand";

export type SplitInput = {
  label: string;
  weight?: number;
  amountKobo?: number;
  percent?: number;
};

type CreatePotState = {
  settlementType: "bill_payment" | "bank_payout" | "wallet";
  completionRule: "progressive" | "all_or_nothing";
  splitMode: "weight" | "amount" | "percent";
  title: string;
  description: string;
  totalKobo: number; // in kobo
  deadlineAt: string | null;

  // Bill payment specifics
  billerCategory?: "electricity" | "cable";
  billerProductCode?: string; // e.g. "ikeja-electric", "dstv"
  billerCustomerId?: string;  // meter / smartcard
  meterType?: "PREPAID" | "POSTPAID";
  billerCustomerName?: string; // resolved from lookup

  // Payout account
  payoutAccountId?: string;

  splits: SplitInput[];

  setField: <K extends keyof CreatePotState>(key: K, value: CreatePotState[K]) => void;
  reset: () => void;
};

const initialState = {
  settlementType: "bill_payment" as const,
  completionRule: "progressive" as const,
  splitMode: "weight" as const,
  title: "",
  description: "",
  totalKobo: 0,
  deadlineAt: null,
  billerCategory: undefined,
  billerProductCode: undefined,
  billerCustomerId: undefined,
  meterType: undefined,
  billerCustomerName: undefined,
  payoutAccountId: undefined,
  splits: [
    { label: "Organizer", weight: 1 },
    { label: "Friend 1", weight: 1 },
  ],
};

export const useCreatePotStore = create<CreatePotState>((set) => ({
  ...initialState,
  setField: (key, value) => set({ [key]: value }),
  reset: () => set(initialState),
}));
