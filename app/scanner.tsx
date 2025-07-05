import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function DocumentScannerRedirect() {
  useEffect(() => {
    // Redirect to the new scanner tab interface
    router.replace("/(tabs)/scanner");
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#8b5cf6" />
      <Text style={styles.redirectText}>Redirecting to Scanner...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  redirectText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 16,
  },
});
