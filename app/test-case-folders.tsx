import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function TestCaseFolders() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Case Folders Test</Text>

      <TouchableOpacity
        style={styles.testButton}
        onPress={() => router.push("/(tabs)/case-folders")}
      >
        <Text style={styles.buttonText}>📁 Test Case Folders Route</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.status}>
        <Text style={styles.statusText}>✅ screenWidth error fixed</Text>
        <Text style={styles.statusText}>✅ State update error fixed</Text>
        <Text style={styles.statusText}>✅ Route moved to tabs directory</Text>
        <Text style={styles.statusText}>✅ Safe state management added</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 40,
    textAlign: "center",
  },
  testButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 40,
  },
  backButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  status: {
    backgroundColor: "#f0f9ff",
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  statusText: {
    fontSize: 14,
    color: "#1e40af",
    marginBottom: 8,
  },
});
