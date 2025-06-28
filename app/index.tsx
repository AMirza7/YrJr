import { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    // Immediately redirect to splash screen
    router.replace("/splash");
  }, []);

  return null;
}
