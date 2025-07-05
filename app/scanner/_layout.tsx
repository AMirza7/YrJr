import React from "react";
import { Stack } from "expo-router";

export default function ScannerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="analytics" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
