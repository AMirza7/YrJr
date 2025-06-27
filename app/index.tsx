import { Redirect } from "expo-router";
import { useAuth } from "@/components/auth/AuthContext";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <LoadingScreen message="Checking authentication..." showLogo={true} />
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(main)/(tabs)/home" />;
  }

  return <Redirect href="/(onboarding)" />;
}
