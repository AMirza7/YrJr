import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Card } from "@/components/ui/Card";
import { LegalTheme, FontSizes, FontWeights, Spacing } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function DocumentScannerScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          Document Scanner
        </Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.comingSoonCard}>
          <Ionicons
            name="scan"
            size={64}
            color={theme.primary}
            style={styles.icon}
          />
          <Text style={[styles.comingSoonTitle, { color: theme.text }]}>
            Document Scanner
          </Text>
          <Text style={[styles.comingSoonText, { color: theme.textSecondary }]}>
            Advanced OCR and document scanning features coming soon!
          </Text>
          <Text style={[styles.featuresText, { color: theme.textTertiary }]}>
            • AI-powered text recognition{"\n"}• Legal document templates{"\n"}•
            Automatic classification{"\n"}• Secure cloud storage
          </Text>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
  },
  comingSoonCard: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  icon: {
    marginBottom: Spacing.lg,
  },
  comingSoonTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  comingSoonText: {
    fontSize: FontSizes.md,
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  featuresText: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    lineHeight: 20,
  },
});
