import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { UserRole } from "@/types";

interface ApprovalItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  verificationData: {
    barCouncilNo?: string;
    practiceYears?: number;
    specialization?: string[];
    officeAddress?: string;
  };
  isNew?: boolean;
}

const mockApprovals: ApprovalItem[] = [
  {
    id: "approval_1",
    userId: "user_123",
    userName: "Adv. Priya Sharma",
    userEmail: "priya.sharma@example.com",
    role: "lawyer",
    status: "pending",
    submittedAt: "2024-01-15T10:30:00Z",
    documents: [
      {
        id: "doc_1",
        name: "Bar Council Certificate.pdf",
        type: "certificate",
        url: "/docs/cert1.pdf",
      },
      {
        id: "doc_2",
        name: "Practice License.pdf",
        type: "license",
        url: "/docs/license1.pdf",
      },
    ],
    verificationData: {
      barCouncilNo: "DL/2019/12345",
      practiceYears: 5,
      specialization: ["Criminal Law", "Civil Law"],
      officeAddress: "123 Legal Complex, New Delhi",
    },
  },
  {
    id: "approval_2",
    userId: "user_124",
    userName: "Rajesh Kumar",
    userEmail: "rajesh.kumar@example.com",
    role: "junior_lawyer",
    status: "pending",
    submittedAt: "2024-01-15T09:45:00Z",
    documents: [
      {
        id: "doc_3",
        name: "Law Degree.pdf",
        type: "degree",
        url: "/docs/degree1.pdf",
      },
      {
        id: "doc_4",
        name: "ID Proof.pdf",
        type: "identity",
        url: "/docs/id1.pdf",
      },
    ],
    verificationData: {
      practiceYears: 2,
      specialization: ["Corporate Law"],
      officeAddress: "456 Law Street, Mumbai",
    },
  },
];

export default function RealTimeApprovalsFeed() {
  const { theme } = useTheme();
  const [approvals, setApprovals] = useState<ApprovalItem[]>(mockApprovals);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [processingId, setProcessingId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate WebSocket connection and real-time updates
  useEffect(() => {
    // Simulate connection
    setIsConnected(true);

    // Simulate periodic updates
    intervalRef.current = setInterval(() => {
      // Randomly add new approval requests
      if (Math.random() > 0.7) {
        const newApproval: ApprovalItem = {
          id: `approval_${Date.now()}`,
          userId: `user_${Date.now()}`,
          userName: `Adv. ${["Amit", "Sunita", "Deepak", "Kavita", "Rohit"][Math.floor(Math.random() * 5)]} ${["Singh", "Patel", "Sharma", "Kumar", "Gupta"][Math.floor(Math.random() * 5)]}`,
          userEmail: `user${Date.now()}@example.com`,
          role: ["lawyer", "junior_lawyer", "lawyer_assistant"][
            Math.floor(Math.random() * 3)
          ] as UserRole,
          status: "pending",
          submittedAt: new Date().toISOString(),
          documents: [
            {
              id: `doc_${Date.now()}`,
              name: "Bar Council Certificate.pdf",
              type: "certificate",
              url: "/docs/cert.pdf",
            },
          ],
          verificationData: {
            barCouncilNo: `DL/2024/${Math.floor(Math.random() * 10000)}`,
            practiceYears: Math.floor(Math.random() * 20) + 1,
            specialization: ["Criminal Law", "Civil Law", "Corporate Law"][
              Math.floor(Math.random() * 3)
            ]
              ? ["Criminal Law"]
              : ["Civil Law"],
          },
          isNew: true,
        };

        setApprovals((prev) => [newApproval, ...prev]);
        setLastUpdate(new Date());

        // Remove the "new" flag after a few seconds
        setTimeout(() => {
          setApprovals((prev) =>
            prev.map((item) =>
              item.id === newApproval.id ? { ...item, isNew: false } : item,
            ),
          );
        }, 3000);
      }
    }, 10000); // Check every 10 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleApprove = async (approvalId: string) => {
    setProcessingId(approvalId);

    // Simulate API call
    setTimeout(() => {
      setApprovals((prev) =>
        prev.map((item) =>
          item.id === approvalId
            ? { ...item, status: "approved" as const }
            : item,
        ),
      );
      setProcessingId(null);
      setLastUpdate(new Date());
      Alert.alert("Success", "User approved successfully");
    }, 1500);
  };

  const handleReject = async (approvalId: string) => {
    Alert.alert(
      "Confirm Rejection",
      "Are you sure you want to reject this user's application?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setProcessingId(approvalId);
            setTimeout(() => {
              setApprovals((prev) =>
                prev.map((item) =>
                  item.id === approvalId
                    ? { ...item, status: "rejected" as const }
                    : item,
                ),
              );
              setProcessingId(null);
              setLastUpdate(new Date());
              Alert.alert("Success", "User application rejected");
            }, 1000);
          },
        },
      ],
    );
  };

  const handleViewDocument = (document: ApprovalItem["documents"][0]) => {
    Alert.alert(
      "Document Viewer",
      `Opening: ${document.name}\nType: ${document.type}`,
      [{ text: "OK" }],
    );
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "lawyer":
        return theme.colors.primary;
      case "junior_lawyer":
        return theme.colors.success;
      case "lawyer_assistant":
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusColor = (status: ApprovalItem["status"]) => {
    switch (status) {
      case "pending":
        return theme.colors.warning;
      case "approved":
        return theme.colors.success;
      case "rejected":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const pendingApprovals = approvals.filter(
    (item) => item.status === "pending",
  );
  const processedApprovals = approvals.filter(
    (item) => item.status !== "pending",
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header with Connection Status */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            🔄 Real-Time Approvals
          </Text>
          <View style={styles.connectionStatus}>
            <View
              style={[
                styles.connectionDot,
                {
                  backgroundColor: isConnected
                    ? theme.colors.success
                    : theme.colors.error,
                },
              ]}
            />
            <Text
              style={[
                styles.connectionText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {isConnected ? "Live" : "Disconnected"}
            </Text>
          </View>
        </View>

        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Auto-refreshing approval queue • Last update:{" "}
          {lastUpdate.toLocaleTimeString()}
        </Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
              {pendingApprovals.length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Pending
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {processedApprovals.filter((a) => a.status === "approved").length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Approved Today
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>
              {processedApprovals.filter((a) => a.status === "rejected").length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Rejected Today
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.approvalsList}
        showsVerticalScrollIndicator={false}
      >
        {/* Pending Approvals */}
        {pendingApprovals.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              ⏳ Pending Approvals ({pendingApprovals.length})
            </Text>

            {pendingApprovals.map((approval) => {
              const isProcessing = processingId === approval.id;

              return (
                <View
                  key={approval.id}
                  style={[
                    styles.approvalCard,
                    { backgroundColor: theme.colors.surface },
                    approval.isNew && styles.newApprovalCard,
                  ]}
                >
                  {approval.isNew && (
                    <View
                      style={[
                        styles.newBadge,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  )}

                  <View style={styles.approvalHeader}>
                    <View style={styles.userInfo}>
                      <Text
                        style={[styles.userName, { color: theme.colors.text }]}
                      >
                        {approval.userName}
                      </Text>
                      <Text
                        style={[
                          styles.userEmail,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {approval.userEmail}
                      </Text>
                      <View style={styles.roleBadgeContainer}>
                        <View
                          style={[
                            styles.roleBadge,
                            { backgroundColor: getRoleColor(approval.role) },
                          ]}
                        >
                          <Text style={styles.roleBadgeText}>
                            {approval.role.replace("_", " ").toUpperCase()}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.submissionTime,
                            { color: theme.colors.textSecondary },
                          ]}
                        >
                          {new Date(approval.submittedAt).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Verification Data */}
                  <View
                    style={[
                      styles.verificationContainer,
                      { backgroundColor: theme.colors.background },
                    ]}
                  >
                    <Text
                      style={[
                        styles.verificationTitle,
                        { color: theme.colors.text },
                      ]}
                    >
                      Verification Details
                    </Text>
                    {approval.verificationData.barCouncilNo && (
                      <Text
                        style={[
                          styles.verificationText,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        Bar Council No: {approval.verificationData.barCouncilNo}
                      </Text>
                    )}
                    {approval.verificationData.practiceYears && (
                      <Text
                        style={[
                          styles.verificationText,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        Experience: {approval.verificationData.practiceYears}{" "}
                        years
                      </Text>
                    )}
                    {approval.verificationData.specialization && (
                      <Text
                        style={[
                          styles.verificationText,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        Specialization:{" "}
                        {approval.verificationData.specialization.join(", ")}
                      </Text>
                    )}
                  </View>

                  {/* Documents */}
                  <View style={styles.documentsContainer}>
                    <Text
                      style={[
                        styles.documentsTitle,
                        { color: theme.colors.text },
                      ]}
                    >
                      Documents ({approval.documents.length})
                    </Text>
                    {approval.documents.map((doc) => (
                      <TouchableOpacity
                        key={doc.id}
                        style={[
                          styles.documentItem,
                          { borderColor: theme.colors.border },
                        ]}
                        onPress={() => handleViewDocument(doc)}
                      >
                        <Text style={styles.documentIcon}>📄</Text>
                        <Text
                          style={[
                            styles.documentName,
                            { color: theme.colors.text },
                          ]}
                        >
                          {doc.name}
                        </Text>
                        <Text
                          style={[
                            styles.documentType,
                            { color: theme.colors.textSecondary },
                          ]}
                        >
                          {doc.type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[
                        styles.rejectButton,
                        { backgroundColor: theme.colors.error },
                      ]}
                      onPress={() => handleReject(approval.id)}
                      disabled={isProcessing}
                    >
                      <Text style={styles.rejectButtonText}>
                        {isProcessing ? "..." : "�� Reject"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.approveButton,
                        { backgroundColor: theme.colors.success },
                      ]}
                      onPress={() => handleApprove(approval.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.approveButtonText}>✅ Approve</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Recent Processed */}
        {processedApprovals.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              📋 Recently Processed
            </Text>

            {processedApprovals.slice(0, 5).map((approval) => (
              <View
                key={approval.id}
                style={[
                  styles.processedCard,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <View style={styles.processedInfo}>
                  <Text
                    style={[styles.processedName, { color: theme.colors.text }]}
                  >
                    {approval.userName}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(approval.status) },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>
                      {approval.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.processedTime,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {new Date(approval.submittedAt).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {approvals.length === 0 && (
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
              No pending approvals
            </Text>
            <Text
              style={[
                styles.emptyStateSubtext,
                { color: theme.colors.textSecondary },
              ]}
            >
              All caught up! New requests will appear here automatically.
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
    fontSize: 12,
    marginBottom: 16,
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
  },
  approvalsList: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  approvalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  newApprovalCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  newBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  approvalHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  roleBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  submissionTime: {
    fontSize: 12,
  },
  verificationContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  verificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  verificationText: {
    fontSize: 12,
    marginBottom: 4,
  },
  documentsContainer: {
    marginBottom: 16,
  },
  documentsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 4,
  },
  documentIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  documentName: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
  },
  documentType: {
    fontSize: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  approveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  processedCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  processedInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  processedName: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  processedTime: {
    fontSize: 12,
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
