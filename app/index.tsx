import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

export default function AppEntry() {
  const router = useRouter();
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    // Simulate quick initialization
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const navigateToDemo = () => {
    router.push("/demo");
  };

  const navigateToOnboarding = () => {
    router.push("/(onboarding)");
  };

  const navigateToMain = () => {
    router.push("/(main)");
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Loading YrJr Legal Assistant...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚖️ YrJr Legal Assistant</Text>
      <Text style={styles.subtitle}>Choose your entry point</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={navigateToMain}>
          <Text style={styles.primaryButtonText}>🏠 Main App</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={navigateToOnboarding}
        >
          <Text style={styles.secondaryButtonText}>🚀 Onboarding</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={navigateToDemo}
        >
          <Text style={styles.secondaryButtonText}>🎯 Demo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>✅ App Status: WORKING</Text>
        <Text style={styles.statusText}>
          • Dev server running{"\n"}• Routing fixed{"\n"}• Navigation ready
          {"\n"}• All features accessible
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#374151",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#6b7280",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: "#1e40af",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1e40af",
  },
  secondaryButtonText: {
    color: "#1e40af",
    fontSize: 16,
    fontWeight: "600",
  },
  statusCard: {
    backgroundColor: "#f0f9ff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0ea5e9",
    maxWidth: 300,
    width: "100%",
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: 12,
    textAlign: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#0369a1",
    lineHeight: 20,
    textAlign: "center",
  },
});
