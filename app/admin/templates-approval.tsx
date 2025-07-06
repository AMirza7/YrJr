import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import BackButton from "@/components/navigation/BackButton";

interface PendingTemplate {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  createdBy: string;
  createdByName: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

interface ReviewModalProps {
  visible: boolean;
  template: PendingTemplate | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

function ReviewModal({
  visible,
  template,
  onClose,
  onApprove,
  onReject,
}: ReviewModalProps) {
  const [rejectReason, setRejectReason] = useState("");

  const handleReject = () => {
    if (!rejectReason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection");
      return;
    }
    onReject(rejectReason);
    setRejectReason("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Review Template</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.modalContent}>
          {template && (
            <>
              <View style={styles.templateDetails}>
                <Text style={styles.detailTitle}>Template Details</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Title:</Text>
                  <Text style={styles.detailValue}>{template.title}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category:</Text>
                  <Text style={styles.detailValue}>{template.category}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Price:</Text>
                  <Text style={styles.detailValue}>₹{template.price}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Created By:</Text>
                  <Text style={styles.detailValue}>
                    {template.createdByName}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>File:</Text>
                  <Text style={styles.detailValue}>
                    {template.fileName} ({(template.fileSize / 1024).toFixed(1)}{" "}
                    KB)
                  </Text>
                </View>

                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Description:</Text>
                  <Text style={styles.detailValue}>{template.description}</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={onApprove}
                >
                  <Text style={styles.approveButtonText}>✓ Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => {
                    Alert.prompt(
                      "Reject Template",
                      "Please provide a reason for rejection:",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Reject",
                          style: "destructive",
                          onPress: (reason) => {
                            if (reason?.trim()) {
                              onReject(reason);
                            } else {
                              Alert.alert(
                                "Error",
                                "Please provide a reason for rejection",
                              );
                            }
                          },
                        },
                      ],
                      "plain-text",
                    );
                  }}
                >
                  <Text style={styles.rejectButtonText}>✗ Reject</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function TemplatesApprovalScreen() {
  const [pendingTemplates, setPendingTemplates] = useState<PendingTemplate[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PendingTemplate | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      if (currentUser.role !== "admin") {
        Alert.alert(
          "Access Denied",
          "Only administrators can access this page.",
          [{ text: "OK", onPress: () => router.back() }],
        );
        return;
      }

      setUser(currentUser);
      loadPendingTemplates();
    } catch (error) {
      router.replace("/login");
    }
  };

  const loadPendingTemplates = async () => {
    try {
      // Mock pending templates data
      const mockTemplates: PendingTemplate[] = [
        {
          id: "template_pending_1",
          title: "Divorce Petition Template",
          description:
            "Comprehensive divorce petition template with all necessary legal sections and formatting",
          price: 250,
          category: "Court Applications",
          createdBy: "clerk_1",
          createdByName: "Ravi Kumar",
          fileName: "divorce_petition_template.docx",
          fileUrl: "/mock/files/divorce_petition.docx",
          fileSize: 45600,
          submittedAt: "2024-01-20T10:30:00Z",
          status: "pending",
        },
        {
          id: "template_pending_2",
          title: "Employment Contract Template",
          description:
            "Standard employment contract template with customizable clauses for various job roles",
          price: 300,
          category: "Contracts",
          createdBy: "clerk_2",
          createdByName: "Priya Sharma",
          fileName: "employment_contract.pdf",
          fileUrl: "/mock/files/employment_contract.pdf",
          fileSize: 32400,
          submittedAt: "2024-01-19T15:45:00Z",
          status: "pending",
        },
        {
          id: "template_pending_3",
          title: "Power of Attorney Form",
          description:
            "General power of attorney template with specific clauses for different scenarios",
          price: 180,
          category: "Legal Documents",
          createdBy: "clerk_1",
          createdByName: "Ravi Kumar",
          fileName: "power_of_attorney.docx",
          fileUrl: "/mock/files/power_of_attorney.docx",
          fileSize: 28900,
          submittedAt: "2024-01-18T09:20:00Z",
          status: "pending",
        },
      ];

      setPendingTemplates(mockTemplates.filter((t) => t.status === "pending"));
    } catch (error) {
      console.error("Error loading pending templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewTemplate = (template: PendingTemplate) => {
    setSelectedTemplate(template);
    setShowReviewModal(true);
  };

  const handleApproveTemplate = () => {
    if (!selectedTemplate) return;

    setPendingTemplates((prev) =>
      prev.filter((t) => t.id !== selectedTemplate.id),
    );

    setShowReviewModal(false);

    Alert.alert(
      "Template Approved",
      `"${selectedTemplate.title}" has been approved and is now available in the marketplace.`,
    );
  };

  const handleRejectTemplate = (reason: string) => {
    if (!selectedTemplate) return;

    setPendingTemplates((prev) =>
      prev.filter((t) => t.id !== selectedTemplate.id),
    );

    setShowReviewModal(false);

    Alert.alert(
      "Template Rejected",
      `"${selectedTemplate.title}" has been rejected. The creator will be notified with the reason: "${reason}"`,
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const renderTemplate = ({ item }: { item: PendingTemplate }) => (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <Text style={styles.templateTitle}>{item.title}</Text>
        <Text style={styles.templatePrice}>₹{item.price}</Text>
      </View>

      <Text style={styles.templateDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.templateMeta}>
        <Text style={styles.categoryBadge}>{item.category}</Text>
        <Text style={styles.createdBy}>by {item.createdByName}</Text>
      </View>

      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>📎 {item.fileName}</Text>
        <Text style={styles.fileSize}>
          {(item.fileSize / 1024).toFixed(1)} KB
        </Text>
      </View>

      <Text style={styles.submittedDate}>
        Submitted: {formatDate(item.submittedAt)}
      </Text>

      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => handleReviewTemplate(item)}
      >
        <Text style={styles.reviewButtonText}>Review Template</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading pending templates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton color="#fff" />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Templates Approval</Text>
          <Text style={styles.headerSubtitle}>
            {pendingTemplates.length} template
            {pendingTemplates.length !== 1 ? "s" : ""} pending review
          </Text>
        </View>
      </View>

      <FlatList
        data={pendingTemplates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.templatesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>No Pending Templates</Text>
            <Text style={styles.emptySubtitle}>
              All templates have been reviewed. New submissions will appear
              here.
            </Text>
          </View>
        }
      />

      <ReviewModal
        visible={showReviewModal}
        template={selectedTemplate}
        onClose={() => setShowReviewModal(false)}
        onApprove={handleApproveTemplate}
        onReject={handleRejectTemplate}
      />
    </View>
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
    color: "#6b7280",
  },
  header: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  templatesList: {
    padding: 16,
  },
  templateCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  templatePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#059669",
  },
  templateDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  templateMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  createdBy: {
    fontSize: 12,
    color: "#6b7280",
  },
  fileInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  fileName: {
    fontSize: 12,
    color: "#374151",
    flex: 1,
  },
  fileSize: {
    fontSize: 12,
    color: "#6b7280",
  },
  submittedDate: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
    fontStyle: "italic",
  },
  reviewButton: {
    backgroundColor: "#DC2626",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#DC2626",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  placeholder: {
    width: 26,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  templateDetails: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailColumn: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#059669",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
