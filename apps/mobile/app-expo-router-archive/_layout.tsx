import { Stack } from "expo-router";
import { Providers } from "../lib/providers";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <Providers>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </Providers>
  );
}
