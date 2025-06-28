import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import { canAccessFeature } from "@/constants/roles";
import BackButton from "@/components/navigation/BackButton";
import {
  notificationService,
  NotificationData,
  NotificationSettings,
} from "@/services/notifications";

export default function NotificationCenter() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [settings, setSettings] = useState<NotificationSettings | null>(null);

  const categories = [
    { value: "all", label: "All", icon: "🔔" },
    { value: "case_update", label: "Cases", icon: "⚖️" },
    { value: "reminder", label: "Reminders", icon: "⏰" },
    { value: "legal_update", label: "Legal", icon: "📖" },
    { value: "system", label: "System", icon: "⚙️" },
    { value: "general", label: "General", icon: "📢" },
  ];

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

      if (
        !canAccessFeature(
          currentUser.role,
          currentUser.subscriptionTier,
          "notifications",
        )
      ) {
        Alert.alert(
          "Access Restricted",
          "Notifications feature requires appropriate subscription level.",
          [{ text: "OK", onPress: () => router.back() }],
        );
        return;
      }

      setUser(currentUser);
      await loadData();
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [notificationsData, settingsData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getSettings(),
      ]);

      setNotifications(notificationsData);
      setSettings(settingsData);
    } catch (error) {
      console.error("Error loading notification data:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: NotificationData) => {
    // Mark as read
    if (!notification.isRead) {
      await notificationService.markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n,
        ),
      );
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await notificationService.markAllAsRead();
    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success =
              await notificationService.deleteNotification(notificationId);
            if (success) {
              setNotifications((prev) =>
                prev.filter((n) => n.id !== notificationId),
              );
            }
          },
        },
      ],
    );
  };

  const handleClearAll = async () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            const success = await notificationService.clearAllNotifications();
            if (success) {
              setNotifications([]);
            }
          },
        },
      ],
    );
  };

  const filteredNotifications =
    selectedCategory === "all"
      ? notifications
      : notifications.filter((n) => n.type === selectedCategory);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  const renderNotification = ({ item }: { item: NotificationData }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        { backgroundColor: item.isRead ? "#fff" : "#f0f9ff" },
      ]}
      onPress={() => handleNotificationPress(item)}
      onLongPress={() => handleDeleteNotification(item.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationLeft}>
          <Text style={styles.notificationIcon}>
            {notificationService.getNotificationTypeIcon(item.type)}
          </Text>
          <View style={styles.notificationContent}>
            <Text
              style={[
                styles.notificationTitle,
                { fontWeight: item.isRead ? "500" : "600" },
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>
          </View>
        </View>

        <View style={styles.notificationRight}>
          <View
            style={[
              styles.priorityDot,
              {
                backgroundColor: notificationService.getPriorityColor(
                  item.priority,
                ),
              },
            ]}
          />
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
      </View>

      <View style={styles.notificationFooter}>
        <Text style={styles.notificationTime}>
          {formatTimeAgo(item.createdAt)}
        </Text>
        <View style={styles.notificationActions}>
          <View
            style={[
              styles.typeChip,
              {
                backgroundColor:
                  notificationService.getNotificationTypeColor(item.type) +
                  "20",
              },
            ]}
          >
            <Text
              style={[
                styles.typeText,
                {
                  color: notificationService.getNotificationTypeColor(
                    item.type,
                  ),
                },
              ]}
            >
              {item.type.replace("_", " ").toUpperCase()}
            </Text>
          </View>
          {item.actionUrl && (
            <Text style={styles.actionHint}>Tap to view →</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton title="Home" color="#fff" />
        <View style={styles.headerContent}>
          <Text style={styles.screenTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>
          {filteredNotifications.length} notification
          {filteredNotifications.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <Text
            style={[
              styles.actionButtonText,
              { opacity: unreadCount === 0 ? 0.5 : 1 },
            ]}
          >
            ✓ Mark All Read
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.actionButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleClearAll}
          disabled={notifications.length === 0}
        >
          <Text
            style={[
              styles.actionButtonText,
              { opacity: notifications.length === 0 ? 0.5 : 1 },
            ]}
          >
            🗑️ Clear All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryFilters}>
            {categories.map((category) => {
              const categoryCount =
                category.value === "all"
                  ? notifications.length
                  : notifications.filter((n) => n.type === category.value)
                      .length;

              return (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor:
                        selectedCategory === category.value
                          ? "#7c3aed"
                          : "#f3f4f6",
                    },
                  ]}
                  onPress={() => setSelectedCategory(category.value)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      {
                        color:
                          selectedCategory === category.value
                            ? "#fff"
                            : "#374151",
                      },
                    ]}
                  >
                    {category.label}
                  </Text>
                  {categoryCount > 0 && (
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {categoryCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔕</Text>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>
              {selectedCategory === "all"
                ? "You're all caught up! No notifications to show."
                : `No ${selectedCategory.replace("_", " ")} notifications found.`}
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    backgroundColor: "#7c3aed",
    padding: 20,
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    marginTop: 10,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  actionsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  dangerButton: {
    backgroundColor: "#fef2f2",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  filtersContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  categoryFilters: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  categoryBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 4,
    minWidth: 16,
    alignItems: "center",
  },
  categoryBadgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notificationLeft: {
    flexDirection: "row",
    flex: 1,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
  notificationRight: {
    alignItems: "center",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationTime: {
    fontSize: 10,
    color: "#9ca3af",
  },
  notificationActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 8,
    fontWeight: "600",
  },
  actionHint: {
    fontSize: 10,
    color: "#7c3aed",
    fontWeight: "500",
  },
  emptyContainer: {
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
    lineHeight: 20,
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
