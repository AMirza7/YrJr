import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Index() {
  // Immediately navigate to landing page - no splash, no async operations
  React.useEffect(() => {
    // Use setTimeout to ensure the component has mounted properly
    const timer = setTimeout(() => {
      router.replace("/landing");
    }, 10); // Minimal delay for smooth transition

    return () => clearTimeout(timer);
  }, []);

  // Simple loading UI without animations or complex logic
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>⚖️</Text>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e40af",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});
