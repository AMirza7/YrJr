import { View, Text, StyleSheet } from "react-native";

export default function TimelineScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>⏱️ Case Timeline</Text>
        <Text style={styles.subtitle}>Coming in milestone 3</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.featureIcon}>⏱️</Text>
        <Text style={styles.featureTitle}>Interactive Case Timeline</Text>
        <Text style={styles.featureDescription}>
          Track case progress with interactive timeline, status badges, and
          smooth scrolling navigation.
        </Text>

        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• Interactive timeline view</Text>
          <Text style={styles.featureItem}>
            • Status badges for each milestone
          </Text>
          <Text style={styles.featureItem}>• Smooth scroll navigation</Text>
          <Text style={styles.featureItem}>• Case progress tracking</Text>
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
    color: "#059669",
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
