import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lawyer/dashboard" />
        <Stack.Screen name="junior_lawyer/dashboard" />
        <Stack.Screen name="lawyer_assistant/dashboard" />
        <Stack.Screen name="law_office_helper/dashboard" />
        <Stack.Screen name="law_student/dashboard" />
        <Stack.Screen name="ai-comparator" />
        <Stack.Screen name="templates" />
        <Stack.Screen name="flashcards" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="scanner" />
      </Stack>
    </>
  );
}
