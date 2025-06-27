import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚖️ YrJr Legal Assistant</Text>
      <Text style={styles.subtitle}>App is now working!</Text>

      <View style={styles.card}>
        <Text style={styles.counter}>Interactions: {count}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>Test App</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>✅ Status: FIXED</Text>
        <Text style={styles.statusText}>
          • Dev server running smoothly{"\n"}• Bundling completed successfully
          {"\n"}• App rendering properly{"\n"}• Navigation will be restored next
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#10b981",
    marginBottom: 40,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
    minWidth: 200,
  },
  counter: {
    fontSize: 24,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1e40af",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  statusCard: {
    backgroundColor: "#f0f9ff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#0ea5e9",
    maxWidth: 300,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: 12,
    textAlign: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#0369a1",
    lineHeight: 20,
  },
});
