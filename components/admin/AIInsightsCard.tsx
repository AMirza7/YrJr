import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface Insight {
  id: string;
  type: "trend" | "anomaly" | "opportunity" | "warning" | "prediction";
  title: string;
  description: string;
  impact: "low" | "medium" | "high" | "critical";
  confidence: number;
  actionRequired: boolean;
  category: string;
  data?: Record<string, any>;
  timestamp: string;
}

const mockInsights: Insight[] = [
  {
    id: "1",
    type: "warning",
    title: "High Churn Among Junior Lawyers",
    description:
      "30% of junior lawyers registered in the last 3 months haven't logged in for over 2 weeks. This indicates potential engagement issues.",
    impact: "high",
    confidence: 87,
    actionRequired: true,
    category: "User Retention",
    data: { churnRate: 30, affectedUsers: 45, avgDaysInactive: 16 },
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    type: "trend",
    title: "Document Scanner Usage Surge",
    description:
      "Document scanner feature usage has increased by 150% this month, primarily driven by law students preparing for exams.",
    impact: "medium",
    confidence: 95,
    actionRequired: false,
    category: "Feature Adoption",
    data: {
      growthRate: 150,
      primaryUsers: "law_students",
      scansThisMonth: 2340,
    },
    timestamp: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    type: "anomaly",
    title: "Unusual Registration Pattern",
    description:
      "Registrations from Mumbai region spiked 400% yesterday, possibly due to a promotional campaign or news coverage.",
    impact: "medium",
    confidence: 78,
    actionRequired: true,
    category: "User Acquisition",
    data: { region: "Mumbai", spikePercentage: 400, newRegistrations: 120 },
    timestamp: "2024-01-15T08:45:00Z",
  },
  {
    id: "4",
    type: "opportunity",
    title: "Premium Conversion Opportunity",
    description:
      "Users who use AI Comparator feature more than 5 times show 70% higher likelihood to upgrade to Premium. Consider targeted upselling.",
    impact: "high",
    confidence: 91,
    actionRequired: true,
    category: "Revenue Optimization",
    data: { conversionRate: 70, targetUsers: 234, potentialRevenue: 58500 },
    timestamp: "2024-01-15T07:20:00Z",
  },
  {
    id: "5",
    type: "prediction",
    title: "Subscription Renewal Risk",
    description:
      "Based on usage patterns, 18 Premium subscribers are at risk of not renewing next month. Engagement-based retention campaigns recommended.",
    impact: "high",
    confidence: 84,
    actionRequired: true,
    category: "Revenue Retention",
    data: { atRiskUsers: 18, predictedChurn: 15, revenueAtRisk: 27000 },
    timestamp: "2024-01-15T06:00:00Z",
  },
  {
    id: "6",
    type: "trend",
    title: "Mobile Usage Dominance",
    description:
      "85% of user sessions now happen on mobile devices, with tablet usage growing 45% among senior lawyers for document review.",
    impact: "medium",
    confidence: 96,
    actionRequired: false,
    category: "Platform Usage",
    data: { mobilePercentage: 85, tabletGrowth: 45, mobileSessionDuration: 18 },
    timestamp: "2024-01-15T05:30:00Z",
  },
];

export default function AIInsightsCard() {
  const { theme } = useTheme();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    "All",
    ...new Set(mockInsights.map((insight) => insight.category)),
  ];

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setInsights(mockInsights);
      setIsLoading(false);
    }, 1500);
  };

  const refreshInsights = async () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setInsights(mockInsights);
      setRefreshing(false);
    }, 1000);
  };

  const filteredInsights =
    selectedCategory === "All"
      ? insights
      : insights.filter((insight) => insight.category === selectedCategory);

  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "trend":
        return "📈";
      case "anomaly":
        return "🔍";
      case "opportunity":
        return "💡";
      case "warning":
        return "⚠️";
      case "prediction":
        return "🔮";
      default:
        return "ℹ️";
    }
  };

  const getImpactColor = (impact: Insight["impact"]) => {
    switch (impact) {
      case "critical":
        return theme.colors.error;
      case "high":
        return "#f59e0b";
      case "medium":
        return theme.colors.warning;
      case "low":
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getInsightTypeColor = (type: Insight["type"]) => {
    switch (type) {
      case "trend":
        return theme.colors.success;
      case "anomaly":
        return theme.colors.warning;
      case "opportunity":
        return theme.colors.info;
      case "warning":
        return theme.colors.error;
      case "prediction":
        return theme.colors.secondary;
      default:
        return theme.colors.primary;
    }
  };

  const handleInsightAction = (insight: Insight) => {
    // In real app, this would trigger specific actions based on insight type
    console.log("Taking action on insight:", insight.title);
  };

  const renderInsightCard = (insight: Insight) => (
    <View
      key={insight.id}
      style={[styles.insightCard, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.insightHeader}>
        <View style={styles.insightTitleRow}>
          <Text style={styles.insightIcon}>{getInsightIcon(insight.type)}</Text>
          <View style={styles.insightTitleContainer}>
            <Text style={[styles.insightTitle, { color: theme.colors.text }]}>
              {insight.title}
            </Text>
            <View style={styles.insightMeta}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: getInsightTypeColor(insight.type) },
                ]}
              >
                <Text style={styles.typeBadgeText}>
                  {insight.type.toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.impactBadge,
                  { backgroundColor: getImpactColor(insight.impact) },
                ]}
              >
                <Text style={styles.impactBadgeText}>
                  {insight.impact.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.confidenceContainer}>
          <Text
            style={[
              styles.confidenceText,
              { color: theme.colors.textSecondary },
            ]}
          >
            {insight.confidence}%
          </Text>
          <View
            style={[
              styles.confidenceBar,
              { backgroundColor: theme.colors.border },
            ]}
          >
            <View
              style={[
                styles.confidenceFill,
                {
                  width: `${insight.confidence}%`,
                  backgroundColor:
                    insight.confidence > 80
                      ? theme.colors.success
                      : insight.confidence > 60
                        ? theme.colors.warning
                        : theme.colors.error,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <Text
        style={[
          styles.insightDescription,
          { color: theme.colors.textSecondary },
        ]}
      >
        {insight.description}
      </Text>

      {insight.data && (
        <View style={styles.dataContainer}>
          {Object.entries(insight.data).map(([key, value]) => (
            <View key={key} style={styles.dataItem}>
              <Text
                style={[styles.dataKey, { color: theme.colors.textSecondary }]}
              >
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </Text>
              <Text style={[styles.dataValue, { color: theme.colors.text }]}>
                {typeof value === "number" && key.includes("Revenue")
                  ? `₹${value.toLocaleString()}`
                  : value}
                {typeof value === "number" && key.includes("Rate") ? "%" : ""}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.insightFooter}>
        <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
          {new Date(insight.timestamp).toLocaleString()}
        </Text>

        {insight.actionRequired && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => handleInsightAction(insight)}
          >
            <Text style={styles.actionButtonText}>Take Action</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={[styles.loadingText, { color: theme.colors.textSecondary }]}
        >
          Analyzing system data...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            🤖 AI Insights
          </Text>
          <TouchableOpacity
            style={[
              styles.refreshButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={refreshInsights}
            disabled={refreshing}
          >
            <Text style={styles.refreshButtonText}>
              {refreshing ? "..." : "🔄"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          AI-powered system analysis and recommendations
        </Text>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  {
                    color:
                      selectedCategory === category
                        ? "#fff"
                        : theme.colors.text,
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Summary Stats */}
      <View
        style={[
          styles.summaryContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
            {insights.filter((i) => i.actionRequired).length}
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            Action Required
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
            {
              insights.filter(
                (i) => i.impact === "high" || i.impact === "critical",
              ).length
            }
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            High Impact
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
            {insights.filter((i) => i.type === "opportunity").length}
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            Opportunities
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.colors.info }]}>
            {Math.round(
              insights.reduce((acc, i) => acc + i.confidence, 0) /
                insights.length,
            )}
            %
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            Avg Confidence
          </Text>
        </View>
      </View>

      {/* Insights List */}
      <ScrollView
        style={styles.insightsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredInsights.length > 0 ? (
          filteredInsights.map(renderInsightCard)
        ) : (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              style={[
                styles.emptyStateText,
                { color: theme.colors.textSecondary },
              ]}
            >
              No insights available for this category
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  categoryFilter: {
    flexDirection: "row",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f3f4f6",
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  summaryContainer: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  insightsList: {
    flex: 1,
    padding: 16,
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    marginBottom: 12,
  },
  insightTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  insightMeta: {
    flexDirection: "row",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  impactBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  confidenceContainer: {
    alignItems: "flex-end",
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  confidenceBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  confidenceFill: {
    height: "100%",
    borderRadius: 2,
  },
  insightDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  dataContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dataKey: {
    fontSize: 12,
    flex: 1,
  },
  dataValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  insightFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
  },
});
