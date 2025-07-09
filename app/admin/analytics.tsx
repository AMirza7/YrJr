import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { useLocalization } from "@/contexts/LocalizationContext";
import EnhancedDataExport from "@/components/admin/EnhancedDataExport";

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  subscriptionRevenue: number;
  pendingApprovals: number;
  totalCases: number;
  totalNotes: number;
  systemHealth: "good" | "warning" | "critical";
}

export default function AdminAnalyticsScreen() {
  const { t } = useLocalization();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    checkAdminAccess();
    loadAnalytics();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user || user.role !== "admin") {
        Alert.alert("Access Denied", "Admin access required", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
        return;
      }
    } catch (error) {
      router.replace("/login");
    }
  };

  const loadAnalytics = async () => {
    try {
      // Simulate loading analytics data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockAnalytics: AnalyticsData = {
        totalUsers: 1247,
        activeUsers: 892,
        newUsersToday: 23,
        subscriptionRevenue: 89340,
        pendingApprovals: 7,
        totalCases: 4562,
        totalNotes: 12890,
        systemHealth: "good",
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      Alert.alert("Error", "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "good":
        return "#10B981";
      case "warning":
        return "#F59E0B";
      case "critical":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case "good":
        return "✅";
      case "warning":
        return "⚠️";
      case "critical":
        return "🚨";
      default:
        return "ℹ️";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  if (!analytics) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load analytics</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAnalytics}>
          <Text style={styles.retryButtonText}>{t("retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/admin");
            }
          }}
        >
          <Text style={styles.backButtonText}>← {t("back")}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t("analytics")}</Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{analytics.totalUsers}</Text>
            <Text style={styles.metricLabel}>{t("totalUsers")}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{analytics.activeUsers}</Text>
            <Text style={styles.metricLabel}>Active Users</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{analytics.newUsersToday}</Text>
            <Text style={styles.metricLabel}>{t("newUsers")}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              ₹{analytics.subscriptionRevenue.toLocaleString()}
            </Text>
            <Text style={styles.metricLabel}>{t("revenue")}</Text>
          </View>
        </View>
      </View>

      {/* System Health */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("systemHealth")}</Text>
        <View style={styles.healthCard}>
          <View style={styles.healthIndicator}>
            <Text style={styles.healthIcon}>
              {getHealthIcon(analytics.systemHealth)}
            </Text>
            <Text
              style={[
                styles.healthText,
                { color: getHealthColor(analytics.systemHealth) },
              ]}
            >
              {analytics.systemHealth.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.healthDescription}>
            All systems operational and running smoothly
          </Text>
        </View>
      </View>

      {/* Content Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Cases</Text>
            <Text style={styles.statValue}>{analytics.totalCases}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Secure Notes</Text>
            <Text style={styles.statValue}>{analytics.totalNotes}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Pending Approvals</Text>
            <Text style={[styles.statValue, { color: "#F59E0B" }]}>
              {analytics.pendingApprovals}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/admin/users")}
        >
          <Text style={styles.actionButtonText}>👥 Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/admin/pending-approvals")}
        >
          <Text style={styles.actionButtonText}>
            ⏳ Review Approvals ({analytics.pendingApprovals})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowExportModal(true)}
        >
          <Text style={styles.actionButtonText}>📊 Export Data</Text>
        </TouchableOpacity>
      </View>

      <EnhancedDataExport
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={(config) => {
          console.log("Exporting data with config:", config);
          setShowExportModal(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#1E40AF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#DC2626",
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  healthCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  healthIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  healthIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  healthText: {
    fontSize: 16,
    fontWeight: "600",
  },
  healthDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  statsGrid: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  statLabel: {
    fontSize: 14,
    color: "#374151",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  actionButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
});
