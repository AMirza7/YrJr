import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function IndexScreen() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simple delay to ensure the app is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while app initializes
  if (!isReady) {
    return <LoadingScreen message="Initializing app..." showLogo={true} />;
  }

  // Always redirect to onboarding first (user can login from there)
  return <Redirect href="/(onboarding)" />;
}
