import React from "react";
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="legal-pinboard" options={{ presentation: "modal" }} />
      <Stack.Screen name="case-timeline" options={{ presentation: "modal" }} />
      <Stack.Screen name="secure-vault" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="section-comparator"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="flashcards" options={{ presentation: "modal" }} />
      <Stack.Screen name="client-folders" options={{ presentation: "modal" }} />
    </Stack>
  );
}
