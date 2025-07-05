import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { scannerService } from "@/services/scanner";
import { ScannerAnalytics, ScannerType } from "@/types/scanner";
import BackButton from "@/components/navigation/BackButton";
import AnalyticsCharts from "@/components/scanner/AnalyticsCharts";

const { width } = Dimensions.get("window");

export default function ScannerAnalyticsScreen() {
  const [analytics, setAnalytics] = useState<ScannerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "usage" | "stats">("overview");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await scannerService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScannerTypeIcon = (type: ScannerType) => {
    const icons = {
      document: "📄",
      barcode: "📊",
      qr: "📱",
      id_card: "🆔",
      receipt: "🧾",
      signature: "✍️",
      text: "📝",
    };
    return icons[type];
  };

  const getScannerTypeName = (type: ScannerType) => {
    const names = {
      document: "Documents",
      barcode: "Barcodes",
      qr: "QR Codes",
      id_card: "ID Cards",
      receipt: "Receipts",
      signature: "Signatures",
      text: "Text Extracts",
    };
    return names[type];
  };

  const getTypeColor = (type: ScannerType) => {
    const colors = {
      document: "#2563eb",
      barcode: "#059669",
      qr: "#059669",
      id_card: "#dc2626",
      receipt: "#7c3aed",
      signature: "#ea580c",
      text: "#0891b2",
    };
    return colors[type];
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading analytics...</Text>
      </View>
    );
  }

  if (!analytics) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton
            title="Scanner"
            color="#fff"
            onPress={() => router.push("/(tabs)/scanner")}
          />
          <Text style={styles.title}>📈 Scanner Analytics</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load analytics</Text>
        </View>
      </View>
    );
  }

  // Mock enhanced analytics data
  const mockAnalyticsData = {
    scansByType: analytics?.scansByType || {
      document: 45,
      barcode: 12,
      qr: 8,
      id_card: 23,
      receipt: 34,
      signature: 15,
      text: 19,
    },
    weeklyActivity: [
      { day: "Mon", scans: 12 },
      { day: "Tue", scans: 19 },
      { day: "Wed", scans: 3 },
      { day: "Thu", scans: 5 },
      { day: "Fri", scans: 2 },
      { day: "Sat", scans: 3 },
      { day: "Sun", scans: 7 },
    ],
    topDocumentTypes: [
      { type: "Sale Deed", count: 25 },
      { type: "FIR Document", count: 18 },
      { type: "Court Notice", count: 14 },
      { type: "Property Papers", count: 12 },
      { type: "Legal Agreement", count: 8 },
    ],
    ipcSections: [
      { section: "IPC 420", mentions: 15 },
      { section: "IPC 406", mentions: 12 },
      { section: "IPC 320", mentions: 10 },
      { section: "IPC 379", mentions: 8 },
      { section: "IPC 468", mentions: 7 },
      { section: "IPC 471", mentions: 6 },
      { section: "IPC 376", mentions: 5 },
      { section: "IPC 302", mentions: 4 },
    ],
    fieldExtractionStats: {
      averageFields: 6.2,
      successRate: 94,
      accuracyRate: 89,
    },
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {/* Overview Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Overview</Text>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{analytics?.totalScans || 156}</Text>
                  <Text style={styles.statLabel}>Total Scans</Text>
                  <Text style={styles.statIcon}>📊</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {getScannerTypeIcon(analytics?.mostUsedTool || "document")}{" "}
                    {getScannerTypeName(analytics?.mostUsedTool || "document")}
                  </Text>
                  <Text style={styles.statLabel}>Most Used Tool</Text>
                  <Text style={styles.statIcon}>🏆</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {analytics?.averageEntitiesDetected || 6.2}
                  </Text>
                  <Text style={styles.statLabel}>Avg. Entities</Text>
                  <Text style={styles.statIcon}>🎯</Text>
                </View>
              </View>
            </View>

            {/* Quick Insights */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 Key Insights</Text>

              <View style={styles.insightsContainer}>
                <View style={styles.insightCard}>
                  <Text style={styles.insightIcon}>📈</Text>
                  <Text style={styles.insightTitle}>Peak Usage</Text>
                  <Text style={styles.insightDescription}>
                    Tuesdays show highest scanning activity with 19 documents processed.
                  </Text>
                </View>

                <View style={styles.insightCard}>
                  <Text style={styles.insightIcon}>⚖️</Text>
                  <Text style={styles.insightTitle}>Legal Focus</Text>
                  <Text style={styles.insightDescription}>
                    IPC 420 (cheating) is the most frequently mentioned section in scanned documents.
                  </Text>
                </View>

                <View style={styles.insightCard}>
                  <Text style={styles.insightIcon}>🎯</Text>
                  <Text style={styles.insightTitle}>High Accuracy</Text>
                  <Text style={styles.insightDescription}>
                    89% OCR accuracy rate with strong field extraction performance.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case "usage":
        return (
          <AnalyticsCharts
            scansByType={mockAnalyticsData.scansByType}
            weeklyActivity={mockAnalyticsData.weeklyActivity}
            topDocumentTypes={mockAnalyticsData.topDocumentTypes}
            ipcSections={mockAnalyticsData.ipcSections}
            fieldExtractionStats={mockAnalyticsData.fieldExtractionStats}
          />
        );

      case "stats":
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {/* Performance Metrics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚡ Performance Metrics</Text>

              <View style={styles.metricsContainer}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricIcon}>🎯</Text>
                  <Text style={styles.metricTitle}>Accuracy Rate</Text>
                  <Text style={styles.metricValue}>89%</Text>
                  <Text style={styles.metricDescription}>Average OCR accuracy</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricIcon}>⚡</Text>
                  <Text style={styles.metricTitle}>Processing Speed</Text>
                  <Text style={styles.metricValue}>1.8s</Text>
                  <Text style={styles.metricDescription}>Average scan time</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricIcon}>📊</Text>
                  <Text style={styles.metricTitle}>Success Rate</Text>
                  <Text style={styles.metricValue}>94%</Text>
                  <Text style={styles.metricDescription}>Successful scans</Text>
                </View>
              </View>
            </View>

            {/* Top IPC Sections */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚖️ Top IPC Sections</Text>

              <View style={styles.ipcContainer}>
                {mockAnalyticsData.ipcSections.slice(0, 5).map((item, index) => (
                  <View key={index} style={styles.ipcItem}>
                    <View style={styles.ipcRank}>
                      <Text style={styles.ipcRankText}>{index + 1}</Text>
                    </View>
                    <View style={styles.ipcContent}>
                      <Text style={styles.ipcSection}>{item.section}</Text>
                      <Text style={styles.ipcMentions}>
                        {item.mentions} mention{item.mentions !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <View style={styles.ipcBar}>
                      <View
                        style={[
                          styles.ipcProgress,
                          {
                            width: `${(item.mentions / mockAnalyticsData.ipcSections[0].mentions) * 100}%`,
                            backgroundColor: index < 3 ? "#3b82f6" : "#94a3b8",
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Document Types Breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Document Types Breakdown</Text>

              <View style={styles.documentTypesContainer}>
                {mockAnalyticsData.topDocumentTypes.map((docType, index) => (
                  <View key={index} style={styles.documentTypeItem}>
                    <View style={styles.documentTypeRank}>
                      <Text style={styles.documentTypeRankText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.documentTypeName}>{docType.type}</Text>
                    <View style={styles.documentTypeBadge}>
                      <Text style={styles.documentTypeBadgeText}>
                        {docType.count} scans
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton
          title="Scanner"
          color="#fff"
          onPress={() => router.push("/(tabs)/scanner")}
        />
        <Text style={styles.title}>📈 Scanner Analytics</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.activeTab]}
          onPress={() => setActiveTab("overview")}
        >
          <Text style={styles.tabIcon}>📊</Text>
          <Text style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "usage" && styles.activeTab]}
          onPress={() => setActiveTab("usage")}
        >
          <Text style={styles.tabIcon}>📱</Text>
          <Text style={[styles.tabText, activeTab === "usage" && styles.activeTabText]}>
            Module Usage
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "stats" && styles.activeTab]}
          onPress={() => setActiveTab("stats")}
        >
          <Text style={styles.tabIcon}>📈</Text>
          <Text style={[styles.tabText, activeTab === "stats" && styles.activeTabText]}>
            Field Stats
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}
        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Overview</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{analytics.totalScans}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
              <Text style={styles.statIcon}>📊</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {getScannerTypeIcon(analytics.mostUsedTool)}{" "}
                {getScannerTypeName(analytics.mostUsedTool)}
              </Text>
              <Text style={styles.statLabel}>Most Used Tool</Text>
              <Text style={styles.statIcon}>🏆</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {analytics.averageEntitiesDetected}
              </Text>
              <Text style={styles.statLabel}>Avg. Entities</Text>
              <Text style={styles.statIcon}>🎯</Text>
            </View>
          </View>
        </View>

        {/* Top Document Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Top Document Types</Text>

          <View style={styles.documentTypesContainer}>
            {analytics.topDocumentTypes.map((docType, index) => (
              <View key={index} style={styles.documentTypeItem}>
                <View style={styles.documentTypeRank}>
                  <Text style={styles.documentTypeRankText}>{index + 1}</Text>
                </View>
                <Text style={styles.documentTypeName}>{docType}</Text>
                <View style={styles.documentTypeBadge}>
                  <Text style={styles.documentTypeBadgeText}>
                    Top {index + 1}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Scanner Usage by Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Usage by Scanner Type</Text>

          <View style={styles.usageContainer}>
            {Object.entries(analytics.scansByType).map(([type, count]) => {
              const scannerType = type as ScannerType;
              const percentage =
                analytics.totalScans > 0
                  ? (count / analytics.totalScans) * 100
                  : 0;

              return (
                <View key={type} style={styles.usageItem}>
                  <View style={styles.usageHeader}>
                    <View style={styles.usageInfo}>
                      <Text style={styles.usageIcon}>
                        {getScannerTypeIcon(scannerType)}
                      </Text>
                      <Text style={styles.usageName}>
                        {getScannerTypeName(scannerType)}
                      </Text>
                    </View>
                    <Text style={styles.usageCount}>{count}</Text>
                  </View>

                  <View style={styles.usageBar}>
                    <View
                      style={[
                        styles.usageProgress,
                        {
                          width: `${percentage}%`,
                          backgroundColor: getTypeColor(scannerType),
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.usagePercentage}>
                    {percentage.toFixed(1)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Performance Metrics</Text>

          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>🎯</Text>
              <Text style={styles.metricTitle}>Accuracy Rate</Text>
              <Text style={styles.metricValue}>96.5%</Text>
              <Text style={styles.metricDescription}>Average OCR accuracy</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>⚡</Text>
              <Text style={styles.metricTitle}>Processing Speed</Text>
              <Text style={styles.metricValue}>1.8s</Text>
              <Text style={styles.metricDescription}>Average scan time</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>📊</Text>
              <Text style={styles.metricTitle}>Success Rate</Text>
              <Text style={styles.metricValue}>98.2%</Text>
              <Text style={styles.metricDescription}>Successful scans</Text>
            </View>
          </View>
        </View>

        {/* Weekly Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Weekly Activity</Text>

          <View style={styles.activityContainer}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => {
                const scans = Math.floor(Math.random() * 10) + 1; // Mock data
                const maxScans = 10;
                const height = (scans / maxScans) * 60;

                return (
                  <View key={day} style={styles.activityDay}>
                    <View style={styles.activityBar}>
                      <View
                        style={[
                          styles.activityProgress,
                          { height: `${height}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.activityScans}>{scans}</Text>
                    <Text style={styles.activityLabel}>{day}</Text>
                  </View>
                );
              },
            )}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Insights & Recommendations</Text>

          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>📈</Text>
              <Text style={styles.insightTitle}>Peak Usage</Text>
              <Text style={styles.insightDescription}>
                You scan most documents on weekdays. Consider batch processing
                for efficiency.
              </Text>
            </View>

            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>🎯</Text>
              <Text style={styles.insightTitle}>High Accuracy</Text>
              <Text style={styles.insightDescription}>
                Your document quality is excellent! Keep using good lighting for
                best results.
              </Text>
            </View>

            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>🚀</Text>
              <Text style={styles.insightTitle}>Productivity Tip</Text>
              <Text style={styles.insightDescription}>
                Try the bulk export feature to save time when processing
                multiple scans.
              </Text>
            </View>
          </View>
        </View>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
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
    position: "relative",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  statIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    fontSize: 16,
    opacity: 0.3,
  },
  documentTypesContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentTypeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  documentTypeRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  documentTypeRankText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  documentTypeName: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  documentTypeBadge: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  documentTypeBadgeText: {
    color: "#92400e",
    fontSize: 10,
    fontWeight: "600",
  },
  usageContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  usageItem: {
    marginBottom: 16,
  },
  usageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  usageInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  usageIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  usageName: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  usageCount: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  usageBar: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    marginBottom: 4,
  },
  usageProgress: {
    height: "100%",
    borderRadius: 3,
  },
  usagePercentage: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "right",
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
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
  metricIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    textAlign: "center",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  metricDescription: {
    fontSize: 10,
    color: "#94a3b8",
    textAlign: "center",
  },
  activityContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  activityDay: {
    alignItems: "center",
    flex: 1,
  },
  activityBar: {
    width: 20,
    height: 60,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: "flex-end",
  },
  activityProgress: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    width: "100%",
  },
  activityScans: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#64748b",
  },
});