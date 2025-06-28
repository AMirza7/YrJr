import React, { useEffect, useState } from "react";
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
import { authService } from "@/services/auth";
import { User, AdminStats } from "@/types";
import BackButton from "@/components/navigation/BackButton";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        router.replace("/login");
        return;
      }

      setUser(currentUser);

      // Get all users for stats
      const allUsers = await authService.getAllUsers();
      const pending = allUsers.filter(
        (u) =>
          !u.isApproved && (u.role === "lawyer" || u.role === "junior_lawyer"),
      );
      setPendingUsers(pending);

      // Calculate stats
      const adminStatsData: AdminStats = {
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter((u) => {
          const lastActive = new Date(u.lastActiveAt);
          const now = new Date();
          const daysDiff =
            (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7;
        }).length,
        newUsersToday: allUsers.filter((u) => {
          const created = new Date(u.createdAt);
          const today = new Date();
          return created.toDateString() === today.toDateString();
        }).length,
        subscriptionRevenue: allUsers.reduce((total, u) => {
          const amounts = { free: 0, pro: 499, premium: 999 };
          return total + amounts[u.subscriptionTier];
        }, 0),
        pendingApprovals: pending.length,
        totalCases: Math.floor(Math.random() * 500) + 100,
        totalTemplates: Math.floor(Math.random() * 50) + 20,
        systemHealth: "good",
      };

      setStats(adminStatsData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await authService.logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const quickActions = [
    {
      title: "User Management",
      icon: "👥",
      color: "#3b82f6",
      route: "/admin/users",
      description: `${pendingUsers.length} pending approvals`,
    },
    {
      title: "Analytics",
      icon: "📊",
      color: "#10b981",
      route: "/admin/analytics",
      description: "View detailed reports",
    },
    {
      title: "App Settings",
      icon: "⚙️",
      color: "#f59e0b",
      route: "/admin/settings",
      description: "Configure app features",
    },
    {
      title: "All Users",
      icon: "🔍",
      color: "#8b5cf6",
      route: "/admin/users",
      description: `${stats?.totalUsers || 0} total users`,
    },
  ];

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading admin dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadDashboardData();
          }}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <BackButton
            title="Exit Admin"
            color="#fff"
            onPress={() => router.replace("/(tabs)/home")}
          />
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, {user?.name}</Text>
      </View>

      {/* Stats Overview */}
      {stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: "#dbeafe" }]}>
              <Text style={[styles.statNumber, { color: "#1e40af" }]}>
                {stats.totalUsers}
              </Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#dcfce7" }]}>
              <Text style={[styles.statNumber, { color: "#16a34a" }]}>
                {stats.activeUsers}
              </Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#fef3c7" }]}>
              <Text style={[styles.statNumber, { color: "#d97706" }]}>
                {stats.newUsersToday}
              </Text>
              <Text style={styles.statLabel}>New Today</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#fce7f3" }]}>
              <Text style={[styles.statNumber, { color: "#be185d" }]}>
                ₹{stats.subscriptionRevenue}
              </Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: "#f3e8ff", flex: 1, marginRight: 8 },
              ]}
            >
              <Text style={[styles.statNumber, { color: "#7c3aed" }]}>
                {stats.pendingApprovals}
              </Text>
              <Text style={styles.statLabel}>Pending Approvals</Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: "#ecfdf5", flex: 1, marginLeft: 8 },
              ]}
            >
              <Text style={[styles.statNumber, { color: "#059669" }]}>
                {stats.systemHealth}
              </Text>
              <Text style={styles.statLabel}>System Health</Text>
            </View>
          </View>
        </View>
      )}

      {/* Pending Approvals Alert */}
      {pendingUsers.length > 0 && (
        <View style={styles.section}>
          <View style={styles.alertCard}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Pending Approvals</Text>
              <Text style={styles.alertMessage}>
                {pendingUsers.length} lawyer
                {pendingUsers.length !== 1 ? "s" : ""} waiting for approval
              </Text>
            </View>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => router.push("/admin/users")}
            >
              <Text style={styles.alertButtonText}>Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={() => router.push(action.route as any)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>
                  {action.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>👤</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>New lawyer registration</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>💳</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Pro subscription upgrade</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>⚠️</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                System maintenance completed
              </Text>
              <Text style={styles.activityTime}>6 hours ago</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
  },
  statCard: {
    width: "23%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
  alertCard: {
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 14,
    color: "#991b1b",
  },
  alertButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  alertButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  activityList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
