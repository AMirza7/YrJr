import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const chartWidth = width - 40;

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropOffCount?: number;
  dropOffPercentage?: number;
  icon: string;
  color: string;
}

interface BehaviorFunnelAnalyticsProps {
  funnelData: FunnelStage[];
  timeframe: "7days" | "30days" | "90days" | "all";
}

export default function BehaviorFunnelAnalytics({
  funnelData,
  timeframe,
}: BehaviorFunnelAnalyticsProps) {
  const maxCount = Math.max(...funnelData.map((stage) => stage.count));

  const getFunnelWidth = (count: number) => {
    return (count / maxCount) * (chartWidth - 100);
  };

  const getTimeframeLabel = (timeframe: string) => {
    const labels = {
      "7days": "Last 7 Days",
      "30days": "Last 30 Days",
      "90days": "Last 90 Days",
      all: "All Time",
    };
    return labels[timeframe as keyof typeof labels] || "All Time";
  };

  const calculateConversionRate = () => {
    if (funnelData.length < 2) return 0;
    const firstStage = funnelData[0];
    const lastStage = funnelData[funnelData.length - 1];
    return ((lastStage.count / firstStage.count) * 100).toFixed(1);
  };

  const FunnelStageComponent = ({
    stage,
    index,
  }: {
    stage: FunnelStage;
    index: number;
  }) => {
    const isLastStage = index === funnelData.length - 1;
    const stageWidth = getFunnelWidth(stage.count);

    return (
      <View style={styles.stageContainer}>
        <View style={styles.stageHeader}>
          <View style={styles.stageInfo}>
            <Text style={styles.stageIcon}>{stage.icon}</Text>
            <View style={styles.stageDetails}>
              <Text style={styles.stageName}>{stage.stage}</Text>
              <Text style={styles.stageStats}>
                {stage.count.toLocaleString()} users ({stage.percentage}%)
              </Text>
            </View>
          </View>

          <View style={styles.stageMetrics}>
            <Text style={styles.stageCount}>
              {stage.count.toLocaleString()}
            </Text>
            <Text style={styles.stagePercentage}>{stage.percentage}%</Text>
          </View>
        </View>

        <View style={styles.funnelBarContainer}>
          <View
            style={[
              styles.funnelBar,
              {
                width: stageWidth,
                backgroundColor: stage.color,
              },
            ]}
          />
          <View
            style={[styles.funnelBarBackground, { width: chartWidth - 100 }]}
          />
        </View>

        {!isLastStage && stage.dropOffCount && (
          <View style={styles.dropOffContainer}>
            <Text style={styles.dropOffIcon}>⬇️</Text>
            <Text style={styles.dropOffText}>
              {stage.dropOffCount.toLocaleString()} users dropped off (
              {stage.dropOffPercentage}%)
            </Text>
          </View>
        )}

        {!isLastStage && (
          <View style={styles.conversionArrow}>
            <Text style={styles.conversionArrowIcon}>⬇️</Text>
            <Text style={styles.conversionText}>
              {index < funnelData.length - 1
                ? `${((funnelData[index + 1].count / stage.count) * 100).toFixed(1)}% converted`
                : ""}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const mockFunnelData: FunnelStage[] =
    funnelData.length > 0
      ? funnelData
      : [
          {
            stage: "Signup",
            count: 1247,
            percentage: 100,
            dropOffCount: 234,
            dropOffPercentage: 18.8,
            icon: "👤",
            color: "#3b82f6",
          },
          {
            stage: "Profile Setup",
            count: 1013,
            percentage: 81.2,
            dropOffCount: 156,
            dropOffPercentage: 15.4,
            icon: "📝",
            color: "#10b981",
          },
          {
            stage: "First Scan",
            count: 857,
            percentage: 68.7,
            dropOffCount: 123,
            dropOffPercentage: 14.3,
            icon: "📱",
            color: "#f59e0b",
          },
          {
            stage: "First Document Export",
            count: 734,
            percentage: 58.9,
            icon: "📄",
            color: "#8b5cf6",
          },
        ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 User Behavior Funnel</Text>
        <Text style={styles.subtitle}>{getTimeframeLabel(timeframe)}</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{calculateConversionRate()}%</Text>
          <Text style={styles.summaryLabel}>Overall Conversion Rate</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {mockFunnelData[0]?.count.toLocaleString() || "0"}
          </Text>
          <Text style={styles.summaryLabel}>Total Signups</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {mockFunnelData[
              mockFunnelData.length - 1
            ]?.count.toLocaleString() || "0"}
          </Text>
          <Text style={styles.summaryLabel}>Completed Journey</Text>
        </View>
      </View>

      {/* Funnel Visualization */}
      <View style={styles.funnelContainer}>
        <Text style={styles.funnelTitle}>User Journey Funnel</Text>

        {mockFunnelData.map((stage, index) => (
          <FunnelStageComponent key={stage.stage} stage={stage} index={index} />
        ))}
      </View>

      {/* Insights & Recommendations */}
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>
          💡 Key Insights & Recommendations
        </Text>

        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>🎯</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Profile Setup Drop-off</Text>
            <Text style={styles.insightDescription}>
              18.8% of users drop off during profile setup. Consider simplifying
              the onboarding process or adding progress indicators.
            </Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>📱</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>First Scan Conversion</Text>
            <Text style={styles.insightDescription}>
              81.2% of users who complete profile setup go on to make their
              first scan. This suggests good product-market fit.
            </Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>📄</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Export Feature Adoption</Text>
            <Text style={styles.insightDescription}>
              58.9% overall conversion to document export. Consider promoting
              export features earlier in the user journey.
            </Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>🚀</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Optimization Opportunities</Text>
            <Text style={styles.insightDescription}>
              Focus on reducing profile setup friction and promoting scanning
              features to improve overall funnel performance.
            </Text>
          </View>
        </View>
      </View>

      {/* Detailed Metrics */}
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsTitle}>📈 Detailed Metrics</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>3.2 days</Text>
            <Text style={styles.metricLabel}>Avg. Time to First Scan</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>7.5 days</Text>
            <Text style={styles.metricLabel}>Avg. Time to First Export</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>73%</Text>
            <Text style={styles.metricLabel}>7-Day Retention</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>45%</Text>
            <Text style={styles.metricLabel}>30-Day Retention</Text>
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
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  summaryContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  summaryCard: {
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
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  funnelContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  funnelTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 20,
  },
  stageContainer: {
    marginBottom: 24,
  },
  stageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stageInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stageIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  stageDetails: {
    flex: 1,
  },
  stageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  stageStats: {
    fontSize: 12,
    color: "#64748b",
  },
  stageMetrics: {
    alignItems: "flex-end",
  },
  stageCount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  stagePercentage: {
    fontSize: 12,
    color: "#64748b",
  },
  funnelBarContainer: {
    position: "relative",
    height: 40,
    justifyContent: "center",
    marginBottom: 8,
  },
  funnelBar: {
    height: 40,
    borderRadius: 20,
    position: "absolute",
    left: 0,
  },
  funnelBarBackground: {
    height: 40,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    position: "absolute",
    left: 0,
  },
  dropOffContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  dropOffIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  dropOffText: {
    fontSize: 12,
    color: "#92400e",
    fontWeight: "500",
  },
  conversionArrow: {
    alignItems: "center",
    marginVertical: 8,
  },
  conversionArrowIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  conversionText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },
  insightsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  insightContent: {
    flex: 1,
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
  metricsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    width: "48%",
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
});
