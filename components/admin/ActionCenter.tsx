import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ActionItem {
  id: string;
  type:
    | "flagged_doc"
    | "support_ticket"
    | "pending_kyc"
    | "user_report"
    | "payment_issue"
    | "system_alert";
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  timestamp: string;
  data?: Record<string, any>;
  actionRequired: boolean;
  assignedTo?: string;
}

const mockActionItems: ActionItem[] = [
  {
    id: "1",
    type: "pending_kyc",
    title: "KYC Verification Required",
    description:
      "Adv. Rajesh Kumar - Bar Council documents uploaded for verification",
    priority: "high",
    timestamp: "2024-01-15T10:30:00Z",
    data: { userId: "usr_123", barCouncilNo: "DL/12345", documentsCount: 3 },
    actionRequired: true,
  },
  {
    id: "2",
    type: "flagged_doc",
    title: "Document Flagged for Review",
    description:
      "Suspicious document detected in case CIV/2024/001 - possible manipulation",
    priority: "urgent",
    timestamp: "2024-01-15T09:45:00Z",
    data: {
      caseId: "CIV/2024/001",
      documentId: "doc_456",
      flagReason: "manipulation_detected",
    },
    actionRequired: true,
  },
  {
    id: "3",
    type: "support_ticket",
    title: "Premium Subscription Issue",
    description:
      "User unable to access premium features after payment - Ticket #SUP-789",
    priority: "high",
    timestamp: "2024-01-15T09:15:00Z",
    data: { ticketId: "SUP-789", userId: "usr_789", paymentId: "pay_012" },
    actionRequired: true,
  },
  {
    id: "4",
    type: "user_report",
    title: "User Conduct Report",
    description:
      "Inappropriate behavior reported in community forum by multiple users",
    priority: "medium",
    timestamp: "2024-01-15T08:30:00Z",
    data: {
      reportedUserId: "usr_456",
      reportCount: 3,
      forumPostId: "post_123",
    },
    actionRequired: true,
  },
  {
    id: "5",
    type: "payment_issue",
    title: "Failed Payment Recovery",
    description:
      "₹2,999 payment failed for Premium subscription - retry required",
    priority: "medium",
    timestamp: "2024-01-15T08:00:00Z",
    data: {
      amount: 2999,
      userId: "usr_234",
      paymentMethod: "UPI",
      retryCount: 2,
    },
    actionRequired: true,
  },
  {
    id: "6",
    type: "system_alert",
    title: "High Server Load Detected",
    description:
      "Document scanner service experiencing 85% CPU usage - scaling recommended",
    priority: "high",
    timestamp: "2024-01-15T07:45:00Z",
    data: { service: "document_scanner", cpuUsage: 85, activeUsers: 1250 },
    actionRequired: true,
  },
];

export default function ActionCenter() {
  const { theme } = useTheme();
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const actionTypes = [
    {
      key: "All",
      label: "All Actions",
      icon: "📋",
      count: mockActionItems.length,
    },
    {
      key: "pending_kyc",
      label: "KYC Pending",
      icon: "🆔",
      count: mockActionItems.filter((i) => i.type === "pending_kyc").length,
    },
    {
      key: "flagged_doc",
      label: "Flagged Docs",
      icon: "🚩",
      count: mockActionItems.filter((i) => i.type === "flagged_doc").length,
    },
    {
      key: "support_ticket",
      label: "Support",
      icon: "🎫",
      count: mockActionItems.filter((i) => i.type === "support_ticket").length,
    },
    {
      key: "user_report",
      label: "User Reports",
      icon: "👥",
      count: mockActionItems.filter((i) => i.type === "user_report").length,
    },
    {
      key: "payment_issue",
      label: "Payments",
      icon: "💳",
      count: mockActionItems.filter((i) => i.type === "payment_issue").length,
    },
    {
      key: "system_alert",
      label: "System",
      icon: "⚙️",
      count: mockActionItems.filter((i) => i.type === "system_alert").length,
    },
  ];

  useEffect(() => {
    loadActionItems();
  }, []);

  const loadActionItems = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setActionItems(mockActionItems);
      setIsLoading(false);
    }, 1000);
  };

  const filteredItems =
    selectedType === "All"
      ? actionItems
      : actionItems.filter((item) => item.type === selectedType);

  const getPriorityColor = (priority: ActionItem["priority"]) => {
    switch (priority) {
      case "urgent":
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

  const getTypeIcon = (type: ActionItem["type"]) => {
    switch (type) {
      case "pending_kyc":
        return "🆔";
      case "flagged_doc":
        return "🚩";
      case "support_ticket":
        return "🎫";
      case "user_report":
        return "👥";
      case "payment_issue":
        return "💳";
      case "system_alert":
        return "⚙️";
      default:
        return "📋";
    }
  };

  const handleApprove = async (item: ActionItem) => {
    setProcessingId(item.id);

    // Simulate API call
    setTimeout(() => {
      setActionItems((prev) => prev.filter((i) => i.id !== item.id));
      setProcessingId(null);
      Alert.alert("Success", "Action approved successfully");
    }, 1500);
  };

  const handleReject = async (item: ActionItem) => {
    Alert.alert(
      "Confirm Rejection",
      "Are you sure you want to reject this action?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setProcessingId(item.id);
            setTimeout(() => {
              setActionItems((prev) => prev.filter((i) => i.id !== item.id));
              setProcessingId(null);
              Alert.alert("Success", "Action rejected successfully");
            }, 1000);
          },
        },
      ],
    );
  };

  const handleViewDetails = (item: ActionItem) => {
    Alert.alert(
      "Action Details",
      `Type: ${item.type}\nPriority: ${item.priority}\nData: ${JSON.stringify(item.data, null, 2)}`,
      [{ text: "OK" }],
    );
  };

  const renderActionItem = (item: ActionItem) => {
    const isProcessing = processingId === item.id;

    return (
      <View
        key={item.id}
        style={[styles.actionItem, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.actionHeader}>
          <View style={styles.actionInfo}>
            <View style={styles.actionTitleRow}>
              <Text style={styles.actionIcon}>{getTypeIcon(item.type)}</Text>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                {item.title}
              </Text>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(item.priority) },
                ]}
              >
                <Text style={styles.priorityText}>
                  {item.priority.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.actionDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              {item.description}
            </Text>
            <Text
              style={[
                styles.actionTimestamp,
                { color: theme.colors.textSecondary },
              ]}
            >
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>

        {item.data && (
          <View
            style={[
              styles.dataContainer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            {Object.entries(item.data)
              .slice(0, 3)
              .map(([key, value]) => (
                <View key={key} style={styles.dataRow}>
                  <Text
                    style={[
                      styles.dataKey,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Text>
                  <Text
                    style={[styles.dataValue, { color: theme.colors.text }]}
                  >
                    {typeof value === "string" ? value : JSON.stringify(value)}
                  </Text>
                </View>
              ))}
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.detailsButton, { borderColor: theme.colors.border }]}
            onPress={() => handleViewDetails(item)}
            disabled={isProcessing}
          >
            <Text
              style={[styles.detailsButtonText, { color: theme.colors.text }]}
            >
              View Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rejectButton,
              { backgroundColor: theme.colors.error },
            ]}
            onPress={() => handleReject(item)}
            disabled={isProcessing}
          >
            <Text style={styles.rejectButtonText}>
              {isProcessing ? "..." : "Reject"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.approveButton,
              { backgroundColor: theme.colors.success },
            ]}
            onPress={() => handleApprove(item)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.approveButtonText}>Approve</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={[styles.loadingText, { color: theme.colors.textSecondary }]}
        >
          Loading action items...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          ⚡ Action Center
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Quick actions for flagged items, tickets, and alerts
        </Text>
      </View>

      {/* Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typeFilter}
      >
        {actionTypes.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.typeButton,
              selectedType === type.key && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={() => setSelectedType(type.key)}
          >
            <Text style={styles.typeIcon}>{type.icon}</Text>
            <Text
              style={[
                styles.typeLabel,
                {
                  color: selectedType === type.key ? "#fff" : theme.colors.text,
                },
              ]}
            >
              {type.label}
            </Text>
            {type.count > 0 && (
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor:
                      selectedType === type.key
                        ? "rgba(255,255,255,0.3)"
                        : theme.colors.error,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    { color: selectedType === type.key ? "#fff" : "#fff" },
                  ]}
                >
                  {type.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Priority Summary */}
      <View
        style={[
          styles.summaryContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
            {filteredItems.filter((i) => i.priority === "urgent").length}
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            Urgent
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: "#f59e0b" }]}>
            {filteredItems.filter((i) => i.priority === "high").length}
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            High Priority
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
            {filteredItems.filter((i) => i.priority === "medium").length}
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            Medium
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
            {filteredItems.filter((i) => i.priority === "low").length}
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            Low Priority
          </Text>
        </View>
      </View>

      {/* Action Items List */}
      <ScrollView
        style={styles.actionsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length > 0 ? (
          filteredItems
            .sort((a, b) => {
              const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map(renderActionItem)
        ) : (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={styles.emptyIcon}>✅</Text>
            <Text
              style={[
                styles.emptyStateText,
                { color: theme.colors.textSecondary },
              ]}
            >
              No action items in this category
            </Text>
            <Text
              style={[
                styles.emptyStateSubtext,
                { color: theme.colors.textSecondary },
              ]}
            >
              All clear! Check back later for new items.
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  typeFilter: {
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 10,
    fontWeight: "700",
  },
  summaryContainer: {
    flexDirection: "row",
    padding: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  actionsList: {
    flex: 1,
    padding: 16,
  },
  actionItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionHeader: {
    marginBottom: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  actionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actionTimestamp: {
    fontSize: 12,
  },
  dataContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dataRow: {
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
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  approveButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
