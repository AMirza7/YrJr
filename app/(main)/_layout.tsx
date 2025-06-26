import { Stack } from "expo-router";
import React from "react";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="case-tracker" />
      <Stack.Screen name="legal-help" />
      <Stack.Screen name="case-law" />
      <Stack.Screen name="community" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="lawyer-profile/[id]" />
    </Stack>
  );
}
