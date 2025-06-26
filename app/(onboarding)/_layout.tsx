import { Stack } from "expo-router";
import React from "react";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="language-selection" />
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="phone-verification" />
      <Stack.Screen name="email-verification" />
      <Stack.Screen name="document-upload" />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="terms" />
    </Stack>
  );
}
