import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

export default function SimpleTest() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🧪 Simple App Test</Text>
        <Text style={styles.subtitle}>
          Testing if the basic React Native app is working
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.buttonText}>📱 Go to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/minimal-test")}
        >
          <Text style={styles.buttonText}>🔍 Minimal Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/(tabs)/home");
            }
          }}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.status}>
          <Text style={styles.statusTitle}>📋 Status Check</Text>
          <Text style={styles.statusText}>✅ React Native rendering</Text>
          <Text style={styles.statusText}>✅ Expo Router working</Text>
          <Text style={styles.statusText}>✅ StyleSheet working</Text>
          <Text style={styles.statusText}>✅ SafeAreaView working</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
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
    width: "100%",
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    color: "#1e40af",
    marginBottom: 8,
  },
});
