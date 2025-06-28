import { Redirect } from "expo-router";

export default function LawyerDashboard() {
  // Redirect to tabs for lawyer role
  return <Redirect href="/(tabs)" />;
}
