import { Redirect } from "expo-router";

export default function LawyerAssistantDashboard() {
  // Redirect to tabs for lawyer assistant role
  return <Redirect href="/(tabs)" />;
}
