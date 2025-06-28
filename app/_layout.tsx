import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="landing" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="verify-email" />
        <Stack.Screen name="verify-phone" />
        <Stack.Screen name="verification-status" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="ai-comparator" />
        <Stack.Screen name="templates" />
        <Stack.Screen name="flashcards" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="scanner" />
        <Stack.Screen name="notes-vault" />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="terms-of-service" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="help-support" />
        <Stack.Screen name="subscription" />
      </Stack>
    </>
  );
}
