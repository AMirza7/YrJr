import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface AnalyticsChartsProps {
  scansByType: Record<string, number>;
  weeklyActivity: Array<{ day: string; scans: number }>;
  topDocumentTypes: Array<{ type: string; count: number }>;
  ipcSections: Array<{ section: string; mentions: number }>;
  fieldExtractionStats: {
    averageFields: number;
    successRate: number;
    accuracyRate: number;
  };
}

// Simple bar chart component
const SimpleBarChart = ({
  data,
  title,
}: {
  data: Array<{ label: string; value: number; color: string }>;
  title: string;
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <View style={styles.simpleChart}>
      <Text style={styles.simpleChartTitle}>{title}</Text>
      {data.map((item, index) => (
        <View key={index} style={styles.barItem}>
          <Text style={styles.barLabel}>{item.label}</Text>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                },
              ]}
            />
            <Text style={styles.barValue}>{item.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// Simple progress indicators
const ProgressIndicator = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressLabel}>{label}</Text>
      <Text style={styles.progressValue}>{Math.round(value)}%</Text>
    </View>
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressBar,
          {
            width: `${value}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  </View>
);

export default function AnalyticsCharts({
  scansByType,
  weeklyActivity,
  topDocumentTypes,
  ipcSections,
  fieldExtractionStats,
}: AnalyticsChartsProps) {
  // Prepare data for simple charts
  const scanTypeData = Object.entries(scansByType).map(
    ([key, value], index) => {
      const names: Record<string, string> = {
        document: "Docs",
        barcode: "Barcodes",
        qr: "QR",
        id_card: "ID Cards",
        receipt: "Receipts",
        signature: "Signs",
        text: "Text",
      };
      const colors = [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#84cc16",
      ];
      return {
        label: names[key] || key,
        value,
        color: colors[index % colors.length],
      };
    },
  );

  const weeklyData = weeklyActivity.map((item, index) => ({
    label: item.day,
    value: item.scans,
    color: "#10b981",
  }));

  const topDocData = topDocumentTypes.slice(0, 5).map((item, index) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
    return {
      label: item.type,
      value: item.count,
      color: colors[index % colors.length],
    };
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Scanner Usage by Type */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>📱 Scanner Usage by Type</Text>
        <Text style={styles.chartSubtitle}>Total scans per scanner module</Text>
        <SimpleBarChart data={scanTypeData} title="" />
      </View>

      {/* Weekly Activity */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>📅 Weekly Scan Activity</Text>
        <Text style={styles.chartSubtitle}>
          Daily scan count over the past week
        </Text>
        <SimpleBarChart data={weeklyData} title="" />
      </View>

      {/* Top Document Types */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>📋 Top 5 Document Types</Text>
        <Text style={styles.chartSubtitle}>
          Most frequently scanned document categories
        </Text>
        <SimpleBarChart data={topDocData} title="" />
      </View>

      {/* Field Extraction Performance */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>🎯 Field Extraction Performance</Text>
        <Text style={styles.chartSubtitle}>
          Success rate, accuracy, and average fields detected
        </Text>

        <View style={styles.progressSection}>
          <ProgressIndicator
            label="Success Rate"
            value={fieldExtractionStats.successRate}
            color="#10b981"
          />
          <ProgressIndicator
            label="Accuracy Rate"
            value={fieldExtractionStats.accuracyRate}
            color="#3b82f6"
          />
          <ProgressIndicator
            label="Average Fields"
            value={(fieldExtractionStats.averageFields / 10) * 100}
            color="#f59e0b"
          />
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {fieldExtractionStats.successRate}%
            </Text>
            <Text style={styles.metricLabel}>Success Rate</Text>
            <View
              style={[styles.metricIndicator, { backgroundColor: "#10b981" }]}
            />
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {fieldExtractionStats.accuracyRate}%
            </Text>
            <Text style={styles.metricLabel}>Accuracy Rate</Text>
            <View
              style={[styles.metricIndicator, { backgroundColor: "#3b82f6" }]}
            />
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {fieldExtractionStats.averageFields}
            </Text>
            <Text style={styles.metricLabel}>Avg Fields</Text>
            <View
              style={[styles.metricIndicator, { backgroundColor: "#f59e0b" }]}
            />
          </View>
        </View>
      </View>

      {/* IPC Sections Analysis */}
      {ipcSections.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>⚖️ Most Mentioned IPC Sections</Text>
          <Text style={styles.chartSubtitle}>
            Frequently referenced sections in legal documents
          </Text>

          <View style={styles.ipcContainer}>
            {ipcSections.slice(0, 8).map((item, index) => (
              <View key={index} style={styles.ipcItem}>
                <View style={styles.ipcRank}>
                  <Text style={styles.ipcRankText}>{index + 1}</Text>
                </View>
                <View style={styles.ipcContent}>
                  <Text style={styles.ipcSection}>{item.section}</Text>
                  <Text style={styles.ipcMentions}>
                    {item.mentions} mention{item.mentions !== 1 ? "s" : ""}
                  </Text>
                </View>
                <View style={styles.ipcBar}>
                  <View
                    style={[
                      styles.ipcProgress,
                      {
                        width: `${(item.mentions / Math.max(...ipcSections.map((i) => i.mentions))) * 100}%`,
                        backgroundColor: index < 3 ? "#3b82f6" : "#94a3b8",
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Summary Statistics */}
      <View style={styles.summarySection}>
        <Text style={styles.chartTitle}>📊 Summary Statistics</Text>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📄</Text>
            <Text style={styles.summaryValue}>
              {Object.values(scansByType).reduce((a, b) => a + b, 0)}
            </Text>
            <Text style={styles.summaryLabel}>Total Scans</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>🎯</Text>
            <Text style={styles.summaryValue}>
              {Math.round(
                Object.values(scansByType).reduce((a, b) => a + b, 0) / 7,
              )}
            </Text>
            <Text style={styles.summaryLabel}>Daily Average</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>⚡</Text>
            <Text style={styles.summaryValue}>
              {fieldExtractionStats.averageFields}
            </Text>
            <Text style={styles.summaryLabel}>Fields/Scan</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📈</Text>
            <Text style={styles.summaryValue}>
              {Math.max(...weeklyActivity.map((d) => d.scans))}
            </Text>
            <Text style={styles.summaryLabel}>Peak Day</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  chartSection: {
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: "#64748b",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  simpleChart: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  simpleChartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  barItem: {
    marginBottom: 12,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
  },
  bar: {
    height: 8,
    borderRadius: 4,
    minWidth: 8,
  },
  barValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
    minWidth: 30,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  metricsGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    position: "relative",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  metricIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  ipcContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ipcItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  ipcRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ipcRankText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  ipcContent: {
    flex: 1,
    marginRight: 12,
  },
  ipcSection: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  ipcMentions: {
    fontSize: 12,
    color: "#64748b",
  },
  ipcBar: {
    width: 60,
    height: 4,
    backgroundColor: "#f1f5f9",
    borderRadius: 2,
    overflow: "hidden",
  },
  ipcProgress: {
    height: "100%",
    borderRadius: 2,
  },
  summarySection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "48%",
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
});
