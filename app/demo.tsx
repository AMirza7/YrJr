import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function DemoScreen() {
  const router = useRouter();
  const [interactions, setInteractions] = React.useState(0);

  const goBack = () => {
    router.back();
  };

  const goToMain = () => {
    router.push("/(main)/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Demo Mode</Text>
      <Text style={styles.subtitle}>Testing app functionality</Text>

      <View style={styles.testCard}>
        <Text style={styles.testTitle}>Interactive Test</Text>
        <Text style={styles.counter}>Interactions: {interactions}</Text>
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => setInteractions(interactions + 1)}
        >
          <Text style={styles.testButtonText}>Test Button</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigationCard}>
        <Text style={styles.navTitle}>Navigation Test</Text>

        <TouchableOpacity style={styles.navButton} onPress={goToMain}>
          <Text style={styles.navButtonText}>🏠 Go to Main App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>✅ Demo Status</Text>
        <Text style={styles.statusText}>
          • React components working{"\n"}• State management active{"\n"}•
          Navigation functional{"\n"}• UI rendering properly
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e40af",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 40,
  },
  testCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  counter: {
    fontSize: 20,
    color: "#1e40af",
    marginBottom: 16,
    fontWeight: "500",
  },
  testButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  testButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  navigationCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
    textAlign: "center",
  },
  navButton: {
    backgroundColor: "#1e40af",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  navButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#6b7280",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: "#f0f9ff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0ea5e9",
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
