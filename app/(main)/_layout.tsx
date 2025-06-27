import { Stack } from "expo-router";
import React from "react";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ title: "Main Tabs" }} />
      <Stack.Screen name="ai-assistant" options={{ title: "AI Assistant" }} />
      <Stack.Screen
        name="legal-pinboard"
        options={{ title: "Legal Pinboard" }}
      />
      <Stack.Screen name="case-timeline" options={{ title: "Case Timeline" }} />
      <Stack.Screen name="secure-vault" options={{ title: "Secure Vault" }} />
      <Stack.Screen
        name="section-comparator"
        options={{ title: "Section Comparator" }}
      />
      <Stack.Screen name="flashcards" options={{ title: "Flashcards" }} />
      <Stack.Screen
        name="client-folders"
        options={{ title: "Client Folders" }}
      />
      <Stack.Screen
        name="document-scanner"
        options={{ title: "Document Scanner" }}
      />
      <Stack.Screen name="help-support" options={{ title: "Help & Support" }} />
      <Stack.Screen
        name="legal-templates"
        options={{ title: "Legal Templates" }}
      />
      <Stack.Screen
        name="notification-center"
        options={{ title: "Notifications" }}
      />
    </Stack>
  );
}
