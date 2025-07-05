import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";

// Conditional import to handle React Native Web compatibility
let LineChart: any, BarChart: any, PieChart: any, ProgressChart: any;

try {
  if (Platform.OS === "web") {
    // For web, create fallback components
    LineChart = ({ data, width, height, chartConfig, style }: any) => (
      <View
        style={[
          {
            width,
            height,
            backgroundColor: "#f8fafc",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          },
          style,
        ]}
      >
        <Text style={{ color: "#64748b", fontSize: 14 }}>
          Chart: {data.labels?.join(", ") || "Loading..."}
        </Text>
      </View>
    );
    BarChart = LineChart;
    PieChart = LineChart;
    ProgressChart = LineChart;
  } else {
    // For native platforms, use the actual chart library
    const charts = require("react-native-chart-kit");
    LineChart = charts.LineChart;
    BarChart = charts.BarChart;
    PieChart = charts.PieChart;
    ProgressChart = charts.ProgressChart;
  }
} catch (error) {
  // Fallback if library fails to load
  const FallbackChart = ({ data, width, height, style }: any) => (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: "#f8fafc",
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <Text style={{ color: "#64748b", fontSize: 14 }}>
        Chart: {data.labels?.join(", ") || "Loading..."}
      </Text>
    </View>
  );
  LineChart = BarChart = PieChart = ProgressChart = FallbackChart;
}

const { width } = Dimensions.get("window");
const chartWidth = width - 40;

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

export default function AnalyticsCharts({
  scansByType,
  weeklyActivity,
  topDocumentTypes,
  ipcSections,
  fieldExtractionStats,
}: AnalyticsChartsProps) {
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontSize: 12,
      fontWeight: "500",
    },
  };

  // Prepare data for charts
  const scanTypeData = {
    labels: Object.keys(scansByType).map((key) => {
      const names: Record<string, string> = {
        document: "Docs",
        barcode: "Barcodes",
        qr: "QR",
        id_card: "ID Cards",
        receipt: "Receipts",
        signature: "Signs",
        text: "Text",
      };
      return names[key] || key;
    }),
    datasets: [
      {
        data: Object.values(scansByType),
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const weeklyData = {
    labels: weeklyActivity.map((item) => item.day),
    datasets: [
      {
        data: weeklyActivity.map((item) => item.scans),
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const pieData = topDocumentTypes.slice(0, 5).map((item, index) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
    return {
      name: item.type,
      population: item.count,
      color: colors[index] || "#64748b",
      legendFontColor: "#64748b",
      legendFontSize: 12,
    };
  });

  const progressData = {
    labels: ["Success", "Accuracy", "Avg Fields"],
    data: [
      fieldExtractionStats.successRate / 100,
      fieldExtractionStats.accuracyRate / 100,
      fieldExtractionStats.averageFields / 10,
    ],
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Scanner Usage by Type */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>📱 Scanner Usage by Type</Text>
        <Text style={styles.chartSubtitle}>Total scans per scanner module</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={scanTypeData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            showValuesOnTopOfBars
            style={styles.chart}
          />
        </View>
      </View>

      {/* Weekly Activity */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>📅 Weekly Scan Activity</Text>
        <Text style={styles.chartSubtitle}>
          Daily scan count over the past week
        </Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={weeklyData}
            width={chartWidth}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>
      </View>

      {/* Top Document Types */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>📋 Top 5 Document Types</Text>
        <Text style={styles.chartSubtitle}>
          Most frequently scanned document categories
        </Text>
        <View style={styles.chartContainer}>
          <PieChart
            data={pieData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            style={styles.chart}
          />
        </View>
      </View>

      {/* Field Extraction Performance */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>🎯 Field Extraction Performance</Text>
        <Text style={styles.chartSubtitle}>
          Success rate, accuracy, and average fields detected
        </Text>
        <View style={styles.chartContainer}>
          <ProgressChart
            data={progressData}
            width={chartWidth}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1, index = 0) => {
                const colors = ["#10b981", "#3b82f6", "#f59e0b"];
                return colors[index] || `rgba(59, 130, 246, ${opacity})`;
              },
            }}
            hideLegend={false}
            style={styles.chart}
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
  chartContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  chart: {
    borderRadius: 8,
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
