import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen
              name="(onboarding)"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen name="(main)" />
            <Stack.Screen name="demo" />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
