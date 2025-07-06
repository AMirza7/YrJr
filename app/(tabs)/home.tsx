import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import {
  getRoleColor,
  getRolePermissions,
  getVisibleTabs,
} from "@/constants/tabs";
import { useLocalization } from "@/contexts/LocalizationContext";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { dataService } from "@/services/dataService";
import LanguageSelector from "@/components/ui/LanguageSelector";

export default function HomeScreen() {
  const { t } = useLocalization();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (!userData) {
        // Use setTimeout to avoid navigation during render
        setTimeout(() => router.replace("/landing"), 0);
        return;
      }
      setUser(userData);

      // Load user stats and notifications
      const stats = await dataService.getUserStats();
      const notifications = await dataService.getNotifications();
      setUserStats(stats);
      setRecentNotifications(notifications.slice(0, 3));
    } catch (error) {
      console.error("Error loading user:", error);
      // Use setTimeout to avoid navigation during render
      setTimeout(() => router.replace("/landing"), 0);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(t("logout"), t("logoutConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("logout"),
        style: "destructive",
        onPress: async () => {
          try {
            await authService.logout();
            Alert.alert(t("success"), t("logoutSuccess"), [
              {
                text: t("done"),
                onPress: () => router.replace("/landing"),
              },
            ]);
          } catch (error) {
            console.error("Logout error:", error);
            // Force navigation even if logout fails
            router.replace("/landing");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  const permissions = getRolePermissions(user.role);
  const roleColor = getRoleColor(user.role);
  const visibleTabs = getVisibleTabs(user.role);

  const quickActions = [
    {
      title: t("legalPinboard"),
      icon: "📌",
      available: permissions.canAccessPinboard,
      route: "/(tabs)/pinboard",
    },
    {
      title: t("caseTimeline"),
      icon: "⏱️",
      available: permissions.canAccessCaseTimeline,
      route: "/(tabs)/timeline",
    },
    {
      title: t("secureNotes"),
      icon: "🔐",
      available: permissions.canAccessSecureNotes,
      route: "/(tabs)/notes",
    },
    {
      title: "Case Timeline",
      icon: "📅",
      available: true,
      route: "/case-timeline",
    },
    {
      title: "Legal Chat AI",
      icon: "🤖",
      available: true,
      route: "/legal-chat",
    },
    {
      title: "Case Folders",
      icon: "📁",
      available: true,
      route: "/case-folders",
    },
    {
      title: "Auto Drafter",
      icon: "📝",
      available: true,
      route: "/auto-drafter",
    },
    {
      title: "Find Lawyers",
      icon: "⚖️",
      available: true, // Available to all users
      route: "/lawyer-directory",
    },
    {
      title: "Clerks Directory",
      icon: "⌨️",
      available:
        user?.role === "lawyer" ||
        user?.role === "junior_lawyer" ||
        user?.role === "admin",
      route: "/clerks-directory",
    },
    {
      title: t("searchLegal"),
      icon: "🔍",
      available: true,
      route: "/(tabs)/search",
    },
  ].filter((action) => action.available); // Only show available actions

  const advancedFeatures = [
    {
      title: "Legal Templates",
      icon: "📚",
      available: true,
      route: "/legal-templates",
      description: "Smart legal document templates",
    },
    {
      title: t("aiComparator"),
      icon: "⚖️",
      available: permissions.canAccessAIComparator,
      route: "/ai-comparator",
      description: "Compare IPC vs BNS",
    },
    {
      title: t("templatesHub"),
      icon: "📋",
      available: permissions.canAccessTemplates,
      route: "/templates",
      description: "Legal document templates",
    },
    {
      title: t("flashcards"),
      icon: "🧠",
      available: permissions.canAccessFlashcards,
      route: "/flashcards",
      description: "Study legal concepts",
    },
    {
      title: t("notifications"),
      icon: "🔔",
      available: permissions.canAccessNotifications,
      route: "/notifications",
      description: "Recent updates",
    },
  ].filter((feature) => feature.available); // Only show available features

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>{t("welcome")},</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <View
              style={[styles.roleCard, { backgroundColor: roleColor + "20" }]}
            >
              <Text style={[styles.roleText, { color: roleColor }]}>
                {user.role.replace("_", " ").toUpperCase()}
              </Text>
            </View>
          </View>
          <LanguageSelector compact style={{ marginTop: 8 }} />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("quickActions")}</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionCard,
                { opacity: action.available ? 1 : 0.5 },
              ]}
              onPress={() =>
                action.available && router.push(action.route as any)
              }
              disabled={!action.available}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
              {!action.available && (
                <Text style={styles.unavailableText}>Not available</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* User Stats */}
      {userStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("yourOverview")}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.activeCases}</Text>
              <Text style={styles.statLabel}>Active Cases</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {userStats.upcomingHearings}
              </Text>
              <Text style={styles.statLabel}>Hearings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.notesCreated}</Text>
              <Text style={styles.statLabel}>Notes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.flashcardScore}%</Text>
              <Text style={styles.statLabel}>Study Score</Text>
            </View>
          </View>
        </View>
      )}

      {/* Advanced Features */}
      {advancedFeatures.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("advancedFeatures")}</Text>
          <View style={styles.featuresGrid}>
            {advancedFeatures.map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={styles.featureCard}
                onPress={() => router.push(feature.route as any)}
              >
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("recentUpdates")}</Text>
            <TouchableOpacity onPress={() => router.push("/notifications")}>
              <Text style={styles.viewAllText}>{t("viewAll")}</Text>
            </TouchableOpacity>
          </View>
          {recentNotifications.map((notification, index) => (
            <View key={index} style={styles.notificationItem}>
              <Text style={styles.notificationIcon}>🔔</Text>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationMessage} numberOfLines={1}>
                  {notification.message}
                </Text>
              </View>
              <Text style={styles.notificationTime}>
                {new Date(notification.createdAt).toLocaleDateString("en-IN")}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* User Actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Text style={styles.profileButtonText}>👤 {t("profile")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.subscriptionButton}
          onPress={() => router.push("/subscription")}
        >
          <Text style={styles.subscriptionButtonText}>
            ⭐ {t("subscription")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 {t("logout")}</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Action Button */}
      <FloatingActionButton userRole={user.role} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  roleCard: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
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
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  unavailableText: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 4,
  },
  featuresCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featuresText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  profileButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  profileButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  subscriptionButton: {
    backgroundColor: "#1e40af",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  subscriptionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#fff",
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
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: "#7c3aed",
    fontWeight: "500",
  },
  notificationItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  notificationIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 10,
    color: "#6b7280",
  },
  notificationTime: {
    fontSize: 9,
    color: "#9ca3af",
  },
});
