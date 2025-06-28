import { Redirect } from "expo-router";

export default function JuniorLawyerDashboard() {
  // Redirect to tabs for junior lawyer role
  return <Redirect href="/(tabs)" />;
}
