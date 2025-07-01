import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import { canAccessFeature } from "@/constants/roles";

const { width } = Dimensions.get("window");

export default function ScannerScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const scannerTools = [
    {
      id: "document_scan",
      title: "Document Scanner",
      description: "Scan and digitize legal documents with OCR",
      icon: "📄",
      color: "#2563eb",
      route: "/scanner",
      premium: false,
    },
    {
      id: "barcode_scan",
      title: "Barcode Scanner",
      description: "Scan barcodes and QR codes for case files",
      icon: "📊",
      color: "#059669",
      route: "/barcode-scanner",
      premium: true,
    },
    {
      id: "id_scan",
      title: "ID Card Scanner",
      description: "Extract information from ID cards and licenses",
      icon: "🆔",
      color: "#dc2626",
      route: "/id-scanner",
      premium: true,
    },
    {
      id: "receipt_scan",
      title: "Receipt Scanner",
      description: "Scan receipts and invoices for expense tracking",
      icon: "🧾",
      color: "#7c3aed",
      route: "/receipt-scanner",
      premium: false,
    },
    {
      id: "signature_scan",
      title: "Signature Capture",
      description: "Capture and verify digital signatures",
      icon: "✍️",
      color: "#ea580c",
      route: "/signature-capture",
      premium: true,
    },
    {
      id: "text_extract",
      title: "Text Extractor",
      description: "Extract text from images and photos",
      icon: "📝",
      color: "#0891b2",
      route: "/text-extractor",
      premium: false,
    },
  ];

  const quickActions = [
    {
      title: "Scan Document",
      icon: "📷",
      action: () => router.push("/scanner"),
    },
    {
      title: "View History",
      icon: "📂",
      action: () =>
        Alert.alert("Coming Soon", "Scan history will be available soon!"),
    },
    {
      title: "Export Data",
      icon: "📤",
      action: () =>
        Alert.alert(
          "Coming Soon",
          "Export functionality will be available soon!",
        ),
    },
  ];

  const handleToolPress = (tool: (typeof scannerTools)[0]) => {
    if (tool.premium && user?.subscriptionTier === "free") {
      Alert.alert(
        "Premium Feature",
        `${tool.title} requires a premium subscription. Would you like to upgrade?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Upgrade", onPress: () => router.push("/subscription") },
        ],
      );
      return;
    }

    if (tool.route === "/scanner") {
      router.push("/scanner");
    } else {
      Alert.alert(
        tool.title,
        `${tool.description}\n\nThis feature is coming soon!`,
        [{ text: "OK" }],
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading scanner...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍 Advanced Scanner</Text>
        <Text style={styles.headerSubtitle}>
          AI-powered OCR and document processing tools
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={action.action}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Scanner Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scanner Tools</Text>
          <View style={styles.toolsGrid}>
            {scannerTools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={[styles.toolCard, { borderLeftColor: tool.color }]}
                onPress={() => handleToolPress(tool)}
              >
                <View style={styles.toolHeader}>
                  <Text style={styles.toolIcon}>{tool.icon}</Text>
                  {tool.premium && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumText}>PRO</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>

                <View style={styles.toolFooter}>
                  <Text style={[styles.toolStatus, { color: tool.color }]}>
                    {tool.route === "/scanner" ? "Available" : "Coming Soon"}
                  </Text>
                  <Text style={styles.toolArrow}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Advanced Features</Text>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🤖</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AI-Powered OCR</Text>
              <Text style={styles.featureDescription}>
                Advanced optical character recognition with 99%+ accuracy for
                legal documents
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔒</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Secure Processing</Text>
              <Text style={styles.featureDescription}>
                End-to-end encryption ensures your sensitive documents remain
                private
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>☁️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Cloud Sync</Text>
              <Text style={styles.featureDescription}>
                Automatically sync scanned documents across all your devices
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Analytics</Text>
              <Text style={styles.featureDescription}>
                Get insights and summaries from your scanned legal documents
              </Text>
            </View>
          </View>
        </View>

        {/* Subscription CTA */}
        {user.subscriptionTier === "free" && (
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>🚀 Unlock Premium Scanner</Text>
            <Text style={styles.ctaDescription}>
              Get access to advanced scanning tools, batch processing, and
              priority support
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push("/subscription")}
            >
              <Text style={styles.ctaButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#8b5cf6",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  toolsGrid: {
    gap: 12,
  },
  toolCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toolHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  toolIcon: {
    fontSize: 24,
  },
  premiumBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  toolFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toolStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  toolArrow: {
    fontSize: 16,
    color: "#9ca3af",
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 18,
  },
  ctaSection: {
    margin: 20,
    backgroundColor: "#8b5cf6",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: "#8b5cf6",
    fontSize: 16,
    fontWeight: "600",
  },
});
