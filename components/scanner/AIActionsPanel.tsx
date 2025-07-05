import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { ScannerType } from "@/types/scanner";

interface AIAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route?: string;
  handler?: () => void;
  confidence?: number;
  color?: string;
}

interface AIActionsPanelProps {
  documentType: ScannerType;
  extractedData: any;
  onActionSelect: (action: AIAction) => void;
}

export default function AIActionsPanel({
  documentType,
  extractedData,
  onActionSelect,
}: AIActionsPanelProps) {
  const getAIActions = (): AIAction[] => {
    const baseActions: AIAction[] = [
      {
        id: "save_history",
        title: "Save to History",
        description: "Store this scan for future reference",
        icon: "💾",
        color: "#10b981",
        handler: () => {
          Alert.alert("Saved", "Document saved to scan history");
        },
      },
      {
        id: "export_pdf",
        title: "Export as PDF",
        description: "Generate a PDF document with extracted data",
        icon: "📄",
        color: "#ef4444",
        handler: () => {
          Alert.alert("Export", "PDF export feature coming soon");
        },
      },
    ];

    // Document type specific actions
    switch (documentType) {
      case "document":
        return [
          {
            id: "generate_petition",
            title: "Generate FIR Quashing Petition",
            description: "Auto-create petition with extracted case details",
            icon: "⚖️",
            route: "/petition-form",
            confidence: 0.95,
            color: "#3b82f6",
          },
          {
            id: "legal_summary",
            title: "Extract Legal Summary",
            description: "Get key legal points and case references",
            icon: "📋",
            confidence: 0.88,
            color: "#8b5cf6",
            handler: () => {
              Alert.alert(
                "Legal Summary",
                "AI analysis will extract key legal points, IPC sections, and case precedents from this document.",
              );
            },
          },
          {
            id: "court_notice",
            title: "Prepare Court Notice",
            description: "Draft a court notice based on document content",
            icon: "📨",
            confidence: 0.82,
            color: "#f59e0b",
            handler: () => {
              Alert.alert(
                "Court Notice",
                "This will help you prepare a formal court notice with the relevant details.",
              );
            },
          },
          ...baseActions,
        ];

      case "id_card":
        return [
          {
            id: "verify_identity",
            title: "Verify Identity",
            description: "Cross-check ID details with government databases",
            icon: "🔍",
            confidence: 0.92,
            color: "#059669",
            handler: () => {
              Alert.alert(
                "Identity Verification",
                "This feature will verify the ID against official databases.",
              );
            },
          },
          {
            id: "extract_details",
            title: "Extract Personal Details",
            description: "Parse and organize all personal information",
            icon: "👤",
            confidence: 0.96,
            color: "#6366f1",
            handler: () => {
              Alert.alert(
                "Personal Details",
                "Name: " +
                  (extractedData?.name || "Not detected") +
                  "\nID Number: " +
                  (extractedData?.idNumber || "Not detected"),
              );
            },
          },
          ...baseActions,
        ];

      case "receipt":
        return [
          {
            id: "expense_report",
            title: "Add to Expense Report",
            description: "Include this receipt in your expense tracking",
            icon: "💰",
            confidence: 0.89,
            color: "#dc2626",
            handler: () => {
              Alert.alert(
                "Expense Report",
                "Receipt will be added to your expense tracking system.",
              );
            },
          },
          {
            id: "tax_category",
            title: "Categorize for Tax",
            description: "Automatically categorize expense for tax purposes",
            icon: "📊",
            confidence: 0.85,
            color: "#7c3aed",
            handler: () => {
              Alert.alert(
                "Tax Category",
                "This receipt will be categorized for tax deduction purposes.",
              );
            },
          },
          ...baseActions,
        ];

      case "barcode":
      case "qr":
        return [
          {
            id: "lookup_info",
            title: "Lookup Information",
            description: "Search for details about this code online",
            icon: "🔍",
            confidence: 0.94,
            color: "#059669",
            handler: () => {
              Alert.alert(
                "Code Lookup",
                "Searching for information about: " +
                  (extractedData?.text || "Unknown"),
              );
            },
          },
          {
            id: "save_contact",
            title: "Save Contact Info",
            description: "Add contact details to your address book",
            icon: "📞",
            confidence: 0.78,
            color: "#3b82f6",
            handler: () => {
              Alert.alert(
                "Contact Info",
                "Contact information will be extracted and saved.",
              );
            },
          },
          ...baseActions,
        ];

      case "signature":
        return [
          {
            id: "verify_signature",
            title: "Verify Signature",
            description: "Compare with stored signature samples",
            icon: "✅",
            confidence: 0.87,
            color: "#10b981",
            handler: () => {
              Alert.alert(
                "Signature Verification",
                "This signature will be compared against stored samples.",
              );
            },
          },
          {
            id: "legal_witness",
            title: "Prepare Legal Witness",
            description: "Generate witness documentation for this signature",
            icon: "👥",
            confidence: 0.83,
            color: "#f59e0b",
            handler: () => {
              Alert.alert(
                "Legal Witness",
                "Prepare witness documentation for legal proceedings.",
              );
            },
          },
          ...baseActions,
        ];

      default:
        return baseActions;
    }
  };

  const actions = getAIActions();

  const handleActionPress = (action: AIAction) => {
    if (action.route) {
      router.push(action.route as any);
    } else if (action.handler) {
      action.handler();
    }
    onActionSelect(action);
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return "#94a3b8";
    if (confidence >= 0.9) return "#10b981";
    if (confidence >= 0.8) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 AI Suggestions</Text>
      <Text style={styles.subtitle}>
        Smart actions based on your scanned content
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.actionsScroll}
        contentContainerStyle={styles.actionsContainer}
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionCard,
              { borderLeftColor: action.color || "#3b82f6" },
            ]}
            onPress={() => handleActionPress(action)}
          >
            <View style={styles.actionHeader}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              {action.confidence && (
                <View
                  style={[
                    styles.confidenceBadge,
                    { backgroundColor: getConfidenceColor(action.confidence) },
                  ]}
                >
                  <Text style={styles.confidenceText}>
                    {Math.round(action.confidence * 100)}%
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionDescription}>{action.description}</Text>

            <View style={styles.actionFooter}>
              <Text style={styles.actionCTA}>Tap to execute</Text>
              <Text style={styles.actionArrow}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Actions Row */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickAction}
          onPress={() =>
            handleActionPress({
              id: "copy_text",
              title: "Copy Text",
              description: "Copy extracted text to clipboard",
              icon: "📋",
              handler: () => Alert.alert("Copied", "Text copied to clipboard"),
            })
          }
        >
          <Text style={styles.quickActionIcon}>📋</Text>
          <Text style={styles.quickActionText}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() =>
            handleActionPress({
              id: "share",
              title: "Share",
              description: "Share scan results",
              icon: "📤",
              handler: () => Alert.alert("Share", "Sharing scan results"),
            })
          }
        >
          <Text style={styles.quickActionIcon}>📤</Text>
          <Text style={styles.quickActionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() =>
            handleActionPress({
              id: "star",
              title: "Star",
              description: "Mark as favorite",
              icon: "⭐",
              handler: () => Alert.alert("Starred", "Added to favorites"),
            })
          }
        >
          <Text style={styles.quickActionIcon}>⭐</Text>
          <Text style={styles.quickActionText}>Star</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() =>
            handleActionPress({
              id: "more",
              title: "More",
              description: "More options",
              icon: "⋯",
              handler: () =>
                Alert.alert("More Options", "Additional actions available"),
            })
          }
        >
          <Text style={styles.quickActionIcon}>⋯</Text>
          <Text style={styles.quickActionText}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  actionsScroll: {
    marginBottom: 16,
  },
  actionsContainer: {
    paddingRight: 16,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  actionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 12,
  },
  actionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionCTA: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "500",
  },
  actionArrow: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  quickActions: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
});
