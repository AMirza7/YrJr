import React, { Suspense, lazy } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

// Lazy load the actual notes screen
const NotesScreen = lazy(() => import("./notes"));

// Loading component
const NotesLoading = () => (
  <View style={styles.loading}>
    <ActivityIndicator size="large" color="#1e40af" />
    <Text style={styles.loadingText}>Loading Secure Notes...</Text>
    <Text style={styles.loadingSubtext}>Initializing encryption...</Text>
  </View>
);

export default function NotesLazyScreen() {
  return (
    <Suspense fallback={<NotesLoading />}>
      <NotesScreen />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
