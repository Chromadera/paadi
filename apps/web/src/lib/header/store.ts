import { create } from "zustand";

type HeaderAction = {
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onPress?: () => void;
};

type HeaderState = {
  action: HeaderAction | null;
  setAction: (action: HeaderAction | null) => void;
  clearAction: () => void;
};

export const useHeaderStore = create<HeaderState>((set) => ({
  action: null,
  setAction: (action) => set({ action }),
  clearAction: () => set({ action: null }),
}));