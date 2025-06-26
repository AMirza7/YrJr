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
      <Stack.Screen name="notification-center" />
      <Stack.Screen name="legal-templates" />
      <Stack.Screen name="ai-assistant" />
      <Stack.Screen name="legal-pinboard" />
      <Stack.Screen name="case-timeline" />
      <Stack.Screen name="secure-vault" />
      <Stack.Screen name="section-comparator" />
      <Stack.Screen name="flashcards" />
      <Stack.Screen name="client-folders" />
    </Stack>
  );
}
