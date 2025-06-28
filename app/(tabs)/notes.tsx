import { View, Text, StyleSheet } from "react-native";

export default function NotesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>🔐 Secure Notes</Text>
        <Text style={styles.subtitle}>Coming in milestone 4</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.featureIcon}>🔐</Text>
        <Text style={styles.featureTitle}>Secure Notes Vault</Text>
        <Text style={styles.featureDescription}>
          Encrypted note storage with biometric authentication for sensitive
          legal information.
        </Text>

        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• Biometric authentication</Text>
          <Text style={styles.featureItem}>• End-to-end encryption</Text>
          <Text style={styles.featureItem}>• Secure cloud backup</Text>
          <Text style={styles.featureItem}>• Offline access</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  featureIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  featureList: {
    alignSelf: "flex-start",
  },
  featureItem: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
});
