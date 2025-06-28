import { View, Text, StyleSheet, TextInput } from "react-native";
import { useState } from "react";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>🔍 Legal Search</Text>
        <Text style={styles.subtitle}>
          Basic search - Advanced features coming
        </Text>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search legal topics, cases, sections..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.featureIcon}>🔍</Text>
        <Text style={styles.featureTitle}>AI-Powered Legal Search</Text>
        <Text style={styles.featureDescription}>
          Advanced search capabilities with AI assistance, voice input, and
          multi-language support.
        </Text>

        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• AI-powered search results</Text>
          <Text style={styles.featureItem}>• Voice search support</Text>
          <Text style={styles.featureItem}>• Multi-language queries</Text>
          <Text style={styles.featureItem}>• Smart suggestions</Text>
          <Text style={styles.featureItem}>• Case law references</Text>
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
    color: "#ea580c",
    fontWeight: "500",
  },
  searchSection: {
    padding: 20,
    backgroundColor: "#fff",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f9fafb",
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
