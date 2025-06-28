import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User, UserRole, SubscriptionTier } from "@/types";
import { getRoleColor, getRoleIcon } from "@/constants/roles";
import BackButton from "@/components/navigation/BackButton";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "verified"
  >("all");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, filterRole, filterStatus]);

  const loadUsers = async () => {
    try {
      const allUsers = await authService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    // Status filter
    if (filterStatus === "pending") {
      filtered = filtered.filter(
        (user) =>
          !user.isApproved &&
          (user.role === "lawyer" || user.role === "junior_lawyer"),
      );
    } else if (filterStatus === "approved") {
      filtered = filtered.filter((user) => user.isApproved);
    } else if (filterStatus === "verified") {
      filtered = filtered.filter((user) => user.hasVerificationBadge);
    }

    setFilteredUsers(filtered);
  };

  const handleApproveUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    Alert.alert(
      "Approve User",
      `Are you sure you want to approve ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            const success = await authService.approveUser(userId);
            if (success) {
              Alert.alert("Success", "User approved successfully");
              loadUsers();
            } else {
              Alert.alert("Error", "Failed to approve user");
            }
          },
        },
      ],
    );
  };

  const handleRejectUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    Alert.alert(
      "Reject User",
      `Are you sure you want to reject ${user.name}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            const success = await authService.rejectUser(userId);
            if (success) {
              Alert.alert("Success", "User rejected");
              loadUsers();
            } else {
              Alert.alert("Error", "Failed to reject user");
            }
          },
        },
      ],
    );
  };

  const handleToggleVerificationBadge = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const action = user.hasVerificationBadge ? "revoke" : "grant";
    Alert.alert(
      `${action === "grant" ? "Grant" : "Revoke"} Verification Badge`,
      `Are you sure you want to ${action} verification badge for ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action === "grant" ? "Grant" : "Revoke",
          onPress: async () => {
            const success = user.hasVerificationBadge
              ? await authService.revokeVerificationBadge(userId)
              : await authService.grantVerificationBadge(userId);

            if (success) {
              Alert.alert(
                "Success",
                `Verification badge ${action}ed successfully`,
              );
              loadUsers();
            } else {
              Alert.alert("Error", `Failed to ${action} verification badge`);
            }
          },
        },
      ],
    );
  };

  const handleUpdateSubscription = async (
    userId: string,
    tier: SubscriptionTier,
  ) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    Alert.alert(
      "Update Subscription",
      `Change ${user.name}'s subscription to ${tier.toUpperCase()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            const success = await authService.updateUserSubscription(
              userId,
              tier,
            );
            if (success) {
              Alert.alert("Success", "Subscription updated successfully");
              loadUsers();
            } else {
              Alert.alert("Error", "Failed to update subscription");
            }
          },
        },
      ],
    );
  };

  const roles: Array<UserRole | "all"> = [
    "all",
    "admin",
    "lawyer",
    "junior_lawyer",
    "lawyer_assistant",
    "law_office_helper",
    "law_student",
  ];
  const statuses = ["all", "pending", "approved", "verified"];

  const UserCard = ({ user }: { user: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.roleIcon}>{getRoleIcon(user.role)}</Text>
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              {user.hasVerificationBadge && (
                <Text style={styles.verifiedBadge}>✓</Text>
              )}
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.userMeta}>
              <Text
                style={[styles.userRole, { color: getRoleColor(user.role) }]}
              >
                {user.role.replace("_", " ").toUpperCase()}
              </Text>
              <Text style={styles.userSubscription}>
                {user.subscriptionTier.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.userStatus}>
          {!user.isApproved &&
            (user.role === "lawyer" || user.role === "junior_lawyer") && (
              <Text style={styles.pendingStatus}>PENDING</Text>
            )}
          {user.isApproved && (
            <Text style={styles.approvedStatus}>APPROVED</Text>
          )}
        </View>
      </View>

      <View style={styles.userActions}>
        {!user.isApproved &&
          (user.role === "lawyer" || user.role === "junior_lawyer") && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleApproveUser(user.id)}
              >
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleRejectUser(user.id)}
              >
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </>
          )}

        {user.isApproved &&
          (user.role === "lawyer" || user.role === "junior_lawyer") && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                user.hasVerificationBadge
                  ? styles.revokeButton
                  : styles.verifyButton,
              ]}
              onPress={() => handleToggleVerificationBadge(user.id)}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  user.hasVerificationBadge && styles.revokeButtonText,
                ]}
              >
                {user.hasVerificationBadge ? "Revoke Badge" : "Grant Badge"}
              </Text>
            </TouchableOpacity>
          )}

        <View style={styles.subscriptionActions}>
          {["free", "pro", "premium"].map((tier) => (
            <TouchableOpacity
              key={tier}
              style={[
                styles.subscriptionButton,
                user.subscriptionTier === tier &&
                  styles.subscriptionButtonActive,
              ]}
              onPress={() =>
                handleUpdateSubscription(user.id, tier as SubscriptionTier)
              }
            >
              <Text
                style={[
                  styles.subscriptionButtonText,
                  user.subscriptionTier === tier &&
                    styles.subscriptionButtonTextActive,
                ]}
              >
                {tier.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading users...</Text>
      </View>
    );
  }

  const pendingCount = users.filter(
    (u) => !u.isApproved && (u.role === "lawyer" || u.role === "junior_lawyer"),
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Dashboard" color="#fff" />
        <Text style={styles.title}>User Management</Text>
        <Text style={styles.subtitle}>
          {filteredUsers.length} users • {pendingCount} pending approvals
        </Text>
      </View>

      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterTabs}
        >
          {roles.map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.filterTab,
                filterRole === role && styles.filterTabActive,
              ]}
              onPress={() => setFilterRole(role)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterRole === role && styles.filterTabTextActive,
                ]}
              >
                {role === "all" ? "All Roles" : role.replace("_", " ")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterTabs}
        >
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                filterStatus === status && styles.filterTabActive,
              ]}
              onPress={() => setFilterStatus(status as any)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterStatus === status && styles.filterTabTextActive,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.usersList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadUsers();
            }}
          />
        }
      >
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}

        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No users found</Text>
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
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  filters: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  filterTabs: {
    marginBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: "#dc2626",
  },
  filterTabText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: "#fff",
  },
  usersList: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
  },
  roleIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  verifiedBadge: {
    backgroundColor: "#10b981",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  userMeta: {
    flexDirection: "row",
    marginTop: 4,
  },
  userRole: {
    fontSize: 12,
    fontWeight: "600",
    marginRight: 12,
  },
  userSubscription: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  userStatus: {
    alignItems: "flex-end",
  },
  pendingStatus: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  approvedStatus: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  approveButton: {
    backgroundColor: "#10b981",
  },
  rejectButton: {
    backgroundColor: "#ef4444",
  },
  verifyButton: {
    backgroundColor: "#3b82f6",
  },
  revokeButton: {
    backgroundColor: "#f59e0b",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  approveButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  revokeButtonText: {
    color: "#fff",
  },
  subscriptionActions: {
    flexDirection: "row",
    flex: 1,
    gap: 4,
  },
  subscriptionButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  subscriptionButtonActive: {
    backgroundColor: "#1e40af",
  },
  subscriptionButtonText: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
  },
  subscriptionButtonTextActive: {
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9ca3af",
  },
});
