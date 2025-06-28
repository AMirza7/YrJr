import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import BackButton from "@/components/navigation/BackButton";

interface PendingUser extends User {
  verificationDocuments?: {
    barCouncilCard?: string;
    lawDegree?: string;
    practiceDocument?: string;
  };
  submittedAt: Date;
  appliedRole: string;
}

export default function PendingApprovalsScreen() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    try {
      // Mock pending approvals data
      const mockPendingUsers: PendingUser[] = [
        {
          id: "pending_1",
          name: "Advocate Priya Sharma",
          email: "priya.sharma@legal.com",
          phone: "+91-9876543210",
          role: "pending_lawyer",
          appliedRole: "lawyer",
          barCouncilNumber: "DL/2023/12345",
          practiceYears: 5,
          specialization: ["Criminal Law", "Family Law"],
          officeAddress: "Court Complex, Delhi",
          isVerified: false,
          subscriptionTier: "free",
          preferences: {} as any,
          verificationDocuments: {
            barCouncilCard: "mock_document_1.pdf",
            lawDegree: "mock_degree_1.pdf",
            practiceDocument: "mock_practice_1.pdf",
          },
          submittedAt: new Date("2024-01-14T10:30:00Z"),
        },
        {
          id: "pending_2",
          name: "Junior Advocate Rahul Kumar",
          email: "rahul.kumar@lawfirm.com",
          phone: "+91-9876543211",
          role: "pending_junior_lawyer",
          appliedRole: "junior_lawyer",
          barCouncilNumber: "MH/2024/67890",
          practiceYears: 2,
          specialization: ["Corporate Law", "Contract Law"],
          officeAddress: "Legal Hub, Mumbai",
          isVerified: false,
          subscriptionTier: "free",
          preferences: {} as any,
          verificationDocuments: {
            barCouncilCard: "mock_document_2.pdf",
            lawDegree: "mock_degree_2.pdf",
          },
          submittedAt: new Date("2024-01-13T15:45:00Z"),
        },
        {
          id: "pending_3",
          name: "Advocate Anita Desai",
          email: "anita.desai@chambers.in",
          phone: "+91-9876543212",
          role: "pending_lawyer",
          appliedRole: "lawyer",
          barCouncilNumber: "KA/2022/11111",
          practiceYears: 8,
          specialization: ["Constitutional Law", "Public Interest"],
          officeAddress: "High Court Complex, Bangalore",
          isVerified: false,
          subscriptionTier: "pro",
          preferences: {} as any,
          verificationDocuments: {
            barCouncilCard: "mock_document_3.pdf",
            lawDegree: "mock_degree_3.pdf",
            practiceDocument: "mock_practice_3.pdf",
          },
          submittedAt: new Date("2024-01-12T09:15:00Z"),
        },
      ];

      setPendingUsers(mockPendingUsers);
    } catch (error) {
      console.error("Error loading pending approvals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string, appliedRole: string) => {
    Alert.alert(
      "Approve Application",
      `Approve this application for ${appliedRole} role?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          style: "default",
          onPress: async () => {
            try {
              // Mock approval process
              await new Promise((resolve) => setTimeout(resolve, 1500));

              // Remove from pending list
              setPendingUsers((prev) => prev.filter((u) => u.id !== userId));

              Alert.alert(
                "Approved!",
                "User has been approved and can now access lawyer features.",
              );
            } catch (error) {
              Alert.alert("Error", "Failed to approve user. Please try again.");
            }
          },
        },
      ],
    );
  };

  const handleReject = async (userId: string) => {
    Alert.alert(
      "Reject Application",
      "Reject this application? Please provide a reason.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              // Mock rejection process
              await new Promise((resolve) => setTimeout(resolve, 1000));

              // Remove from pending list
              setPendingUsers((prev) => prev.filter((u) => u.id !== userId));

              Alert.alert(
                "Rejected",
                "Application has been rejected. User has been notified.",
              );
            } catch (error) {
              Alert.alert("Error", "Failed to reject application.");
            }
          },
        },
      ],
    );
  };

  const handleViewDocuments = (user: PendingUser) => {
    let documentsList = "";
    if (user.verificationDocuments?.barCouncilCard) {
      documentsList += "✅ Bar Council Card\n";
    }
    if (user.verificationDocuments?.lawDegree) {
      documentsList += "✅ Law Degree Certificate\n";
    }
    if (user.verificationDocuments?.practiceDocument) {
      documentsList += "✅ Practice Certificate\n";
    }

    Alert.alert(
      "Verification Documents",
      `Documents submitted by ${user.name}:\n\n${documentsList}\nBar Council: ${user.barCouncilNumber}\nExperience: ${user.practiceYears} years\n\nIn a real app, you would be able to view and download these documents.`,
      [{ text: "Close" }],
    );
  };

  const getStatusColor = (days: number) => {
    if (days <= 1) return "#059669"; // Green - recent
    if (days <= 3) return "#f59e0b"; // Yellow - moderate
    return "#ef4444"; // Red - urgent
  };

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading pending approvals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Admin" color="#fff" />
        <Text style={styles.title}>Pending Approvals</Text>
        <Text style={styles.subtitle}>
          {pendingUsers.length} lawyer{pendingUsers.length !== 1 ? "s" : ""}{" "}
          waiting for approval
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {pendingUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>No Pending Approvals</Text>
            <Text style={styles.emptyText}>
              All lawyer applications have been processed.
            </Text>
          </View>
        ) : (
          <View style={styles.approvalsList}>
            {pendingUsers.map((user) => {
              const daysAgo = getDaysAgo(user.submittedAt);
              const statusColor = getStatusColor(daysAgo);

              return (
                <View key={user.id} style={styles.approvalCard}>
                  <View style={styles.approvalHeader}>
                    <View style={styles.userInfo}>
                      <View style={styles.userAvatar}>
                        <Text style={styles.userInitials}>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        <Text style={styles.appliedRole}>
                          Applied for:{" "}
                          {user.appliedRole.replace("_", " ").toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.statusBadge}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: statusColor },
                        ]}
                      />
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {daysAgo === 1 ? "Today" : `${daysAgo}d ago`}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.approvalDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>📞 Phone:</Text>
                      <Text style={styles.detailValue}>{user.phone}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>🏛️ Bar Council:</Text>
                      <Text style={styles.detailValue}>
                        {user.barCouncilNumber}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>⚖️ Experience:</Text>
                      <Text style={styles.detailValue}>
                        {user.practiceYears} years
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>📍 Office:</Text>
                      <Text style={styles.detailValue}>
                        {user.officeAddress}
                      </Text>
                    </View>

                    {user.specialization && user.specialization.length > 0 && (
                      <View style={styles.specializationContainer}>
                        <Text style={styles.detailLabel}>
                          🎯 Specialization:
                        </Text>
                        <View style={styles.specializationTags}>
                          {user.specialization.map((spec, index) => (
                            <View key={index} style={styles.specializationTag}>
                              <Text style={styles.specializationText}>
                                {spec}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={styles.documentsSection}>
                    <TouchableOpacity
                      style={styles.documentsButton}
                      onPress={() => handleViewDocuments(user)}
                    >
                      <Text style={styles.documentsButtonText}>
                        📄 View Documents (
                        {Object.keys(user.verificationDocuments || {}).length})
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.approvalActions}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleReject(user.id)}
                    >
                      <Text style={styles.rejectButtonText}>❌ Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApprove(user.id, user.appliedRole)}
                    >
                      <Text style={styles.approveButtonText}>✅ Approve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#dc2626",
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  approvalsList: {
    paddingBottom: 20,
  },
  approvalCard: {
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
  approvalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInitials: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  appliedRole: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  approvalDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  specializationContainer: {
    marginTop: 8,
  },
  specializationTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 6,
  },
  specializationTag: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  specializationText: {
    fontSize: 11,
    color: "#1e40af",
    fontWeight: "500",
  },
  documentsSection: {
    marginBottom: 16,
  },
  documentsButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  documentsButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  approvalActions: {
    flexDirection: "row",
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  rejectButtonText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#059669",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
