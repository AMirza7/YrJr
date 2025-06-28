import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import {
  lawyerVerificationService,
  LawyerVerification,
  VerificationBadge,
} from "@/services/lawyerVerification";
import { storage } from "@/services/storage";
import BackButton from "@/components/navigation/BackButton";

export default function VerificationStatusScreen() {
  const [verification, setVerification] = useState<LawyerVerification | null>(
    null,
  );
  const [badge, setBadge] = useState<VerificationBadge | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const user = await storage.getUser();
      if (!user) return;

      const verificationData =
        await lawyerVerificationService.getVerificationStatus(user.id);
      const userBadge = lawyerVerificationService.getVerificationBadge(
        user.role,
        verificationData?.status,
      );

      setVerification(verificationData);
      setBadge(userBadge);
    } catch (error) {
      console.error("Error loading verification status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadVerificationStatus();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#059669";
      case "rejected":
        return "#dc2626";
      case "under_review":
        return "#f59e0b";
      case "documents_required":
        return "#7c3aed";
      case "pending":
      default:
        return "#6b7280";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Your application has been submitted and is waiting for initial review.";
      case "under_review":
        return "Our team is currently reviewing your application and documents.";
      case "documents_required":
        return "Additional documents are required to complete your verification.";
      case "approved":
        return "Congratulations! Your verification has been approved.";
      case "rejected":
        return "Your verification application has been rejected. See details below.";
      default:
        return "Unknown status";
    }
  };

  const handleResubmit = () => {
    Alert.alert(
      "Resubmit Application",
      "Would you like to resubmit your verification application with updated information?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Resubmit",
          onPress: () => {
            // Navigate to verification form
            router.push("/apply-verification");
          },
        },
      ],
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Need help with your verification? Contact our support team.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Contact Support",
          onPress: () => router.push("/help-support"),
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading verification status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Settings" color="#fff" />
        <Text style={styles.title}>Verification Status</Text>
        <Text style={styles.subtitle}>
          Track your lawyer verification process
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Current Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeIcon}>{badge?.icon}</Text>
              <Text style={[styles.badgeLabel, { color: badge?.color }]}>
                {badge?.label}
              </Text>
            </View>
            {verification && (
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(verification.status) },
                ]}
              />
            )}
          </View>

          {verification ? (
            <View style={styles.statusDetails}>
              <Text style={styles.statusTitle}>
                {verification.status.replace("_", " ").toUpperCase()}
              </Text>
              <Text style={styles.statusDescription}>
                {getStatusDescription(verification.status)}
              </Text>

              <View style={styles.applicationInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Applied Role:</Text>
                  <Text style={styles.infoValue}>
                    {verification.appliedRole.replace("_", " ").toUpperCase()}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Submitted:</Text>
                  <Text style={styles.infoValue}>
                    {verification.submittedAt.toLocaleDateString()}
                  </Text>
                </View>
                {verification.reviewedAt && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Last Updated:</Text>
                    <Text style={styles.infoValue}>
                      {verification.reviewedAt.toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>

              {verification.rejectionReason && (
                <View style={styles.rejectionContainer}>
                  <Text style={styles.rejectionTitle}>Rejection Reason:</Text>
                  <Text style={styles.rejectionText}>
                    {verification.rejectionReason}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.noVerificationContainer}>
              <Text style={styles.noVerificationIcon}>📋</Text>
              <Text style={styles.noVerificationTitle}>
                No Verification Application
              </Text>
              <Text style={styles.noVerificationText}>
                You haven't submitted a lawyer verification application yet.
              </Text>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => router.push("/apply-verification")}
              >
                <Text style={styles.applyButtonText}>
                  Apply for Verification
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Documents Status */}
        {verification && verification.documents.length > 0 && (
          <View style={styles.documentsCard}>
            <Text style={styles.sectionTitle}>Documents Status</Text>
            {verification.documents.map((document) => (
              <View key={document.id} style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{document.name}</Text>
                  <Text style={styles.documentType}>
                    {document.type.replace("_", " ").toUpperCase()}
                  </Text>
                </View>
                <View style={styles.documentStatus}>
                  <View
                    style={[
                      styles.documentStatusDot,
                      {
                        backgroundColor:
                          document.status === "verified"
                            ? "#059669"
                            : document.status === "rejected"
                              ? "#dc2626"
                              : "#f59e0b",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.documentStatusText,
                      {
                        color:
                          document.status === "verified"
                            ? "#059669"
                            : document.status === "rejected"
                              ? "#dc2626"
                              : "#f59e0b",
                      },
                    ]}
                  >
                    {document.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Status History */}
        {verification && verification.statusHistory.length > 0 && (
          <View style={styles.historyCard}>
            <Text style={styles.sectionTitle}>Status History</Text>
            {verification.statusHistory.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <View
                  style={[
                    styles.historyDot,
                    { backgroundColor: getStatusColor(entry.status) },
                  ]}
                />
                <View style={styles.historyContent}>
                  <Text style={styles.historyStatus}>
                    {entry.status.replace("_", " ").toUpperCase()}
                  </Text>
                  <Text style={styles.historyDate}>
                    {entry.timestamp.toLocaleDateString()} at{" "}
                    {entry.timestamp.toLocaleTimeString()}
                  </Text>
                  {entry.notes && (
                    <Text style={styles.historyNotes}>{entry.notes}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {verification?.status === "rejected" && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleResubmit}
            >
              <Text style={styles.actionButtonText}>
                🔄 Resubmit Application
              </Text>
            </TouchableOpacity>
          )}

          {verification?.status === "documents_required" && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/upload-documents")}
            >
              <Text style={styles.actionButtonText}>📤 Upload Documents</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleContactSupport}
          >
            <Text style={styles.secondaryButtonText}>💬 Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            The verification process typically takes 3-5 business days. If you
            have questions or need assistance, please contact our support team.
          </Text>
          <View style={styles.helpLinks}>
            <TouchableOpacity onPress={() => router.push("/help-support")}>
              <Text style={styles.helpLink}>📞 Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/verification-faq")}>
              <Text style={styles.helpLink}>❓ Verification FAQ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    backgroundColor: "#7c3aed",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  badgeLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusDetails: {
    gap: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  statusDescription: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
  },
  applicationInfo: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  rejectionContainer: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  rejectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 8,
  },
  rejectionText: {
    fontSize: 14,
    color: "#991b1b",
    lineHeight: 20,
  },
  noVerificationContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noVerificationIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noVerificationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  noVerificationText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: "#7c3aed",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  documentsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  documentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  documentType: {
    fontSize: 12,
    color: "#6b7280",
  },
  documentStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  documentStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  documentStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#7c3aed",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  helpCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  helpLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  helpLink: {
    fontSize: 14,
    color: "#7c3aed",
    fontWeight: "500",
  },
});
