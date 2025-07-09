import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { ModalProvider } from "@/contexts/ModalContext";

export default function RootLayout() {
  return (
    <LocalizationProvider>
      <ThemeProvider>
        <ModalProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="landing" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="verify-email" />
            <Stack.Screen name="verify-phone" />
            <Stack.Screen name="verification-status" />
            <Stack.Screen name="profile-completion" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="admin" />
            <Stack.Screen name="ai-comparator" />
            <Stack.Screen name="features" />
            <Stack.Screen name="templates" />
            <Stack.Screen name="flashcards" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="notes-vault" />
            <Stack.Screen name="privacy-policy" />
            <Stack.Screen name="terms-of-service" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="help-support" />
            <Stack.Screen name="subscription" />
            <Stack.Screen name="test-case-folders" />
            <Stack.Screen name="minimal-test" />
            <Stack.Screen name="simple-test" />
            <Stack.Screen name="status-check" />
          </Stack>
        </ModalProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
