import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SectionList,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  NotificationService,
  AppNotification,
  NotificationType,
} from "@/services/notifications";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

type NotificationSection = {
  title: string;
  data: AppNotification[];
};

export default function NotificationCenterScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [sections, setSections] = useState<NotificationSection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>(
    "all",
  );
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    filterAndGroupNotifications();
  }, [notifications, filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [notificationList, count] = await Promise.all([
        NotificationService.getNotifications(),
        NotificationService.getUnreadCount(),
      ]);

      setNotifications(notificationList);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error loading notifications:", error);
      Alert.alert("Error", "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const filterAndGroupNotifications = () => {
    let filtered = notifications;

    // Apply filter
    if (filter === "unread") {
      filtered = filtered.filter((n) => !n.isRead);
    } else if (filter !== "all") {
      filtered = filtered.filter((n) => n.type === filter);
    }

    // Group by date
    const grouped = groupNotificationsByDate(filtered);
    setSections(grouped);
  };

  const groupNotificationsByDate = (
    notifications: AppNotification[],
  ): NotificationSection[] => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: { [key: string]: AppNotification[] } = {
      Today: [],
      Yesterday: [],
      "This Week": [],
      "This Month": [],
      Older: [],
    };

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.timestamp);
      const daysDiff = Math.floor(
        (today.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (isToday(notificationDate)) {
        groups.Today.push(notification);
      } else if (isYesterday(notificationDate)) {
        groups.Yesterday.push(notification);
      } else if (daysDiff <= 7) {
        groups["This Week"].push(notification);
      } else if (daysDiff <= 30) {
        groups["This Month"].push(notification);
      } else {
        groups.Older.push(notification);
      }
    });

    return Object.entries(groups)
      .filter(([_, notifications]) => notifications.length > 0)
      .map(([title, data]) => ({ title, data }));
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: AppNotification) => {
    try {
      // Mark as read
      if (!notification.isRead) {
        await NotificationService.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      // Navigate based on notification type and data
      const { type, data } = notification;

      switch (type) {
        case "case_update":
          if (data?.caseNumber) {
            router.push("/(main)/case-tracker");
          }
          break;
        case "court_hearing":
          router.push("/(main)/case-tracker");
          break;
        case "message":
          if (data?.senderId) {
            router.push(`/(main)/chat/${data.senderId}`);
          } else {
            router.push("/(main)/(tabs)/messages");
          }
          break;
        case "document_verified":
          router.push("/(main)/(tabs)/profile");
          break;
        default:
          // No specific navigation
          break;
      }
    } catch (error) {
      console.error("Error handling notification press:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
      Alert.alert("Error", "Failed to mark notifications as read");
    }
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
            try {
              await NotificationService.clearAllNotifications();
              setNotifications([]);
              setUnreadCount(0);
            } catch (error) {
              console.error("Error clearing notifications:", error);
              Alert.alert("Error", "Failed to clear notifications");
            }
          },
        },
      ],
    );
  };

  const getNotificationIcon = (type: NotificationType): string => {
    const icons: Record<NotificationType, string> = {
      case_update: "briefcase",
      court_hearing: "calendar",
      message: "chatbubble",
      document_verified: "document-text",
      subscription_reminder: "card",
      legal_update: "library",
      system_announcement: "megaphone",
      reminder: "alarm",
      rating_request: "star",
    };
    return icons[type] || "notifications";
  };

  const getNotificationColor = (type: NotificationType): string => {
    const colors: Record<NotificationType, string> = {
      case_update: theme.primary,
      court_hearing: theme.error,
      message: theme.success,
      document_verified: theme.info,
      subscription_reminder: theme.warning,
      legal_update: theme.secondary,
      system_announcement: theme.accent,
      reminder: theme.warning,
      rating_request: theme.warning,
    };
    return colors[type] || theme.primary;
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return timestamp.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const renderNotificationItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <Card
        style={[
          styles.notificationCard,
          !item.isRead && { backgroundColor: theme.primary + "05" },
        ]}
        padding="medium"
      >
        <View style={styles.notificationContent}>
          <View
            style={[
              styles.notificationIcon,
              { backgroundColor: getNotificationColor(item.type) + "20" },
            ]}
          >
            <Ionicons
              name={getNotificationIcon(item.type) as any}
              size={20}
              color={getNotificationColor(item.type)}
            />
          </View>

          <View style={styles.notificationText}>
            <View style={styles.notificationHeader}>
              <Text
                style={[
                  styles.notificationTitle,
                  { color: theme.text },
                  !item.isRead && { fontWeight: FontWeights.semibold },
                ]}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text
                style={[styles.notificationTime, { color: theme.textTertiary }]}
              >
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>

            <Text
              style={[styles.notificationBody, { color: theme.textSecondary }]}
              numberOfLines={3}
            >
              {item.body}
            </Text>

            {item.priority === "high" && (
              <View style={styles.priorityIndicator}>
                <Ionicons name="flag" size={12} color={theme.error} />
                <Text style={[styles.priorityText, { color: theme.error }]}>
                  High Priority
                </Text>
              </View>
            )}
          </View>

          {!item.isRead && (
            <View
              style={[styles.unreadDot, { backgroundColor: theme.primary }]}
            />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: NotificationSection;
  }) => (
    <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {section.title}
      </Text>
    </View>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        onPress={() => setFilter("all")}
        style={[
          styles.filterButton,
          filter === "all" && { backgroundColor: theme.primary + "20" },
        ]}
      >
        <Text
          style={[
            styles.filterText,
            { color: filter === "all" ? theme.primary : theme.textSecondary },
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setFilter("unread")}
        style={[
          styles.filterButton,
          filter === "unread" && { backgroundColor: theme.primary + "20" },
        ]}
      >
        <Text
          style={[
            styles.filterText,
            {
              color: filter === "unread" ? theme.primary : theme.textSecondary,
            },
          ]}
        >
          Unread ({unreadCount})
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <EmptyState type="loading" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.surface, borderBottomColor: theme.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Notifications
        </Text>

        <TouchableOpacity
          onPress={handleMarkAllAsRead}
          style={styles.actionButton}
        >
          <Ionicons name="checkmark-done" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {renderFilterButtons()}

      {sections.length === 0 ? (
        <EmptyState
          type="no_notifications"
          title="No Notifications"
          subtitle="You're all caught up! We'll notify you when something important happens."
        />
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderNotificationItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {notifications.length > 0 && (
        <View
          style={[
            styles.footer,
            { backgroundColor: theme.surface, borderTopColor: theme.border },
          ]}
        >
          <Button
            title="Clear All"
            variant="outline"
            onPress={handleClearAll}
            style={styles.clearButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  filterText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notificationCard: {
    marginBottom: Spacing.sm,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.xs,
  },
  notificationTitle: {
    fontSize: FontSizes.md,
    flex: 1,
    marginRight: Spacing.sm,
  },
  notificationTime: {
    fontSize: FontSizes.xs,
  },
  notificationBody: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  priorityIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  priorityText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.sm,
    marginTop: Spacing.xs,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  clearButton: {
    alignSelf: "center",
  },
});
