import { Redirect } from "expo-router";
import { useAuth } from "@/components/auth/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { LegalTheme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(main)/(tabs)/home" />;
  }

  return <Redirect href="/(onboarding)" />;
}
