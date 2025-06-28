import { View, Text, StyleSheet } from "react-native";

export default function PinboardScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>📌 Legal Pinboard</Text>
        <Text style={styles.subtitle}>Coming in milestone 2</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.featureIcon}>📌</Text>
        <Text style={styles.featureTitle}>Legal Pinboard Feed</Text>
        <Text style={styles.featureDescription}>
          Create, organize and track legal updates with tags, priority filters,
          and CRUD operations.
        </Text>

        <View style={styles.featureList}>
          <Text style={styles.featureItem}>
            • Create and edit pinboard items
          </Text>
          <Text style={styles.featureItem}>• Tag-based organization</Text>
          <Text style={styles.featureItem}>• Priority filtering</Text>
          <Text style={styles.featureItem}>• Real-time updates</Text>
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
    color: "#7c3aed",
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
