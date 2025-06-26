import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, I18nManager } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/components/auth/AuthContext";
import { SessionManager } from "@/components/auth/SessionManager";
import { ScreenTransition } from "@/components/ui/ScreenTransition";
import { LegalTheme } from "@/constants/Theme";
import { isRTL } from "@/constants/Translations";
import { AppHealth, Cleanup, Logger } from "@/utils/production";

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [appHealthChecked, setAppHealthChecked] = React.useState(false);

  // Set RTL layout if user's language requires it
  React.useEffect(() => {
    if (user?.language && isRTL(user.language)) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    } else {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    }
  }, [user?.language]);

  const isAppLoading = !loaded || isLoading;

  return (
    <SessionManager>
      <ScreenTransition loading={isAppLoading} slideDirection="up">
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              animationDuration: 250,
            }}
          >
            {isAuthenticated ? (
              <>
                <Stack.Screen
                  name="(main)"
                  options={{
                    animation: "fade",
                    animationDuration: 300,
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="(onboarding)"
                  options={{
                    animation: "slide_from_bottom",
                    animationDuration: 400,
                  }}
                />
              </>
            )}
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ScreenTransition>
    </SessionManager>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
