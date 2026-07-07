import type { StateStorage } from "zustand/middleware";
import { Platform } from "react-native";

const webAdapter: StateStorage = {
  getItem: async (name) => {
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },
  setItem: async (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    localStorage.removeItem(name);
  },
};

const nativeAdapter: StateStorage = {
  getItem: async (name) => {
    const SecureStore = require("expo-secure-store");
    const raw = await SecureStore.getItemAsync(name);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },
  setItem: async (name, value) => {
    const SecureStore = require("expo-secure-store");
    await SecureStore.setItemAsync(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    const SecureStore = require("expo-secure-store");
    await SecureStore.deleteItemAsync(name);
  },
};

export const secureStoreAdapter: StateStorage =
  Platform.OS === "web" ? webAdapter : nativeAdapter;
