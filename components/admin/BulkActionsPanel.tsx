import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";

interface BulkAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  confirmationRequired: boolean;
  description: string;
}

interface BulkActionsPanelProps {
  selectedUserIds: string[];
  onAction: (actionId: string, userIds: string[], data?: any) => void;
  onClearSelection: () => void;
}

export default function BulkActionsPanel({
  selectedUserIds,
  onAction,
  onClearSelection,
}: BulkActionsPanelProps) {
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<BulkAction | null>(null);
  const [actionData, setActionData] = useState<any>({});

  const bulkActions: BulkAction[] = [
    {
      id: "approve",
      label: "Approve",
      icon: "✅",
      color: "#10b981",
      confirmationRequired: true,
      description: "Approve selected user applications",
    },
    {
      id: "reject",
      label: "Reject",
      icon: "❌",
      color: "#ef4444",
      confirmationRequired: true,
      description: "Reject selected user applications",
    },
    {
      id: "revoke_badge",
      label: "Revoke Badge",
      icon: "🚫",
      color: "#f59e0b",
      confirmationRequired: true,
      description: "Remove verification badge from selected users",
    },
    {
      id: "grant_badge",
      label: "Grant Badge",
      icon: "🏆",
      color: "#3b82f6",
      confirmationRequired: true,
      description: "Grant verification badge to selected users",
    },
    {
      id: "block",
      label: "Block",
      icon: "🔒",
      color: "#ef4444",
      confirmationRequired: true,
      description: "Block selected users from accessing the platform",
    },
    {
      id: "unblock",
      label: "Unblock",
      icon: "🔓",
      color: "#10b981",
      confirmationRequired: true,
      description: "Unblock selected users",
    },
    {
      id: "reset_password",
      label: "Reset Password",
      icon: "🔑",
      color: "#8b5cf6",
      confirmationRequired: true,
      description: "Send password reset emails to selected users",
    },
    {
      id: "change_subscription",
      label: "Change Subscription",
      icon: "💳",
      color: "#06b6d4",
      confirmationRequired: false,
      description: "Modify subscription tier for selected users",
    },
    {
      id: "send_notification",
      label: "Send Notification",
      icon: "📢",
      color: "#f59e0b",
      confirmationRequired: false,
      description: "Send a custom notification to selected users",
    },
    {
      id: "export_data",
      label: "Export Data",
      icon: "📊",
      color: "#64748b",
      confirmationRequired: false,
      description: "Export selected users' data as CSV/Excel",
    },
  ];

  const handleActionPress = (action: BulkAction) => {
    setSelectedAction(action);
    setActionData({});

    if (action.confirmationRequired) {
      Alert.alert(
        `${action.label} ${selectedUserIds.length} users`,
        `Are you sure you want to ${action.label.toLowerCase()} ${selectedUserIds.length} selected user(s)? This action cannot be undone.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: action.label,
            style:
              action.id === "reject" || action.id === "block"
                ? "destructive"
                : "default",
            onPress: () => executeAction(action),
          },
        ],
      );
    } else {
      setShowActionModal(true);
    }
  };

  const executeAction = (action: BulkAction, data?: any) => {
    onAction(action.id, selectedUserIds, data);
    setShowActionModal(false);
    setSelectedAction(null);
    setActionData({});
  };

  const renderActionModal = () => {
    if (!selectedAction) return null;

    const renderActionForm = () => {
      switch (selectedAction.id) {
        case "change_subscription":
          return (
            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>
                Select New Subscription Tier:
              </Text>
              {["free", "pro", "premium"].map((tier) => (
                <TouchableOpacity
                  key={tier}
                  style={[
                    styles.optionButton,
                    actionData.subscription === tier &&
                      styles.optionButtonSelected,
                  ]}
                  onPress={() =>
                    setActionData({ ...actionData, subscription: tier })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      actionData.subscription === tier &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );

        case "send_notification":
          return (
            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>Notification Title:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter notification title"
                value={actionData.title || ""}
                onChangeText={(text) =>
                  setActionData({ ...actionData, title: text })
                }
              />

              <Text style={styles.formLabel}>Notification Message:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter notification message"
                value={actionData.message || ""}
                onChangeText={(text) =>
                  setActionData({ ...actionData, message: text })
                }
                multiline
                numberOfLines={4}
              />

              <Text style={styles.formLabel}>Priority:</Text>
              {["low", "normal", "high", "urgent"].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.optionButton,
                    actionData.priority === priority &&
                      styles.optionButtonSelected,
                  ]}
                  onPress={() => setActionData({ ...actionData, priority })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      actionData.priority === priority &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );

        case "export_data":
          return (
            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>Export Format:</Text>
              {["csv", "excel", "json"].map((format) => (
                <TouchableOpacity
                  key={format}
                  style={[
                    styles.optionButton,
                    actionData.format === format && styles.optionButtonSelected,
                  ]}
                  onPress={() => setActionData({ ...actionData, format })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      actionData.format === format && styles.optionTextSelected,
                    ]}
                  >
                    {format.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.formLabel}>Include Fields:</Text>
              {[
                "basic_info",
                "contact_details",
                "subscription_info",
                "activity_logs",
              ].map((field) => (
                <TouchableOpacity
                  key={field}
                  style={[
                    styles.checkboxOption,
                    actionData.fields?.includes(field) &&
                      styles.checkboxOptionSelected,
                  ]}
                  onPress={() => {
                    const fields = actionData.fields || [];
                    const updatedFields = fields.includes(field)
                      ? fields.filter((f: string) => f !== field)
                      : [...fields, field];
                    setActionData({ ...actionData, fields: updatedFields });
                  }}
                >
                  <Text style={styles.checkboxText}>
                    {actionData.fields?.includes(field) ? "☑️" : "☐"}{" "}
                    {field.replace("_", " ").toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );

        default:
          return null;
      }
    };

    return (
      <Modal
        visible={showActionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedAction.icon} {selectedAction.label}
            </Text>
            <Text style={styles.modalSubtitle}>
              {selectedAction.description} ({selectedUserIds.length} users
              selected)
            </Text>

            <ScrollView style={styles.modalContent}>
              {renderActionForm()}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowActionModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  { backgroundColor: selectedAction.color },
                ]}
                onPress={() => executeAction(selectedAction, actionData)}
              >
                <Text style={styles.confirmButtonText}>
                  {selectedAction.label}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (selectedUserIds.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.selectionInfo}>
          <Text style={styles.selectedCount}>
            {selectedUserIds.length} user
            {selectedUserIds.length !== 1 ? "s" : ""} selected
          </Text>
          <TouchableOpacity
            onPress={onClearSelection}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.actionsContainer}
      >
        {bulkActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, { borderColor: action.color }]}
            onPress={() => handleActionPress(action)}
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={[styles.actionLabel, { color: action.color }]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {renderActionModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    padding: 16,
  },
  selectionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  actionsContainer: {
    padding: 16,
  },
  actionButton: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
    minWidth: 80,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
    textAlign: "center",
  },
  modalContent: {
    maxHeight: 300,
  },
  formContainer: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  optionText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  checkboxOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  checkboxOptionSelected: {
    backgroundColor: "#f0f9ff",
  },
  checkboxText: {
    fontSize: 14,
    color: "#64748b",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
