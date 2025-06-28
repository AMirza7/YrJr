import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { storage } from "./storage";

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type:
    | "case_update"
    | "payment"
    | "system"
    | "deadline"
    | "reminder"
    | "verification";
  priority: "low" | "medium" | "high";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: {
    caseId?: string;
    amount?: number;
    dueDate?: string;
    userId?: string;
  };
}

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
  style?: "default" | "destructive";
}

export interface NotificationCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  categories: {
    case_update: boolean;
    payment: boolean;
    system: boolean;
    deadline: boolean;
    reminder: boolean;
    verification: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string; // "08:00"
  };
  frequency: "immediate" | "hourly" | "daily";
}

class NotificationService {
  private notifications: NotificationData[] = [];
  private settings: NotificationSettings;
  private readonly NOTIFICATIONS_KEY = "@yrjr_notifications";
  private readonly SETTINGS_KEY = "@yrjr_notification_settings";

  constructor() {
    // Initialize default settings
    this.settings = this.getDefaultSettings();
    this.initializeNotifications();

    // Configure notification behavior
    if (typeof window === "undefined") {
      // Only configure on native platforms
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: this.settings.pushEnabled,
          shouldPlaySound: this.settings.soundEnabled,
          shouldSetBadge: true,
        }),
      });
    }
  }

  private getDefaultSettings(): NotificationSettings {
    return {
      pushEnabled: true,
      emailEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      categories: {
        case_update: true,
        payment: true,
        system: true,
        deadline: true,
        reminder: true,
        verification: true,
      },
      quietHours: {
        enabled: false,
        startTime: "22:00",
        endTime: "08:00",
      },
      frequency: "immediate",
    };
  }

  private async initializeNotifications() {
    await this.loadStoredNotifications();
    await this.loadStoredSettings();
  }

  private async loadStoredNotifications() {
    try {
      let storedData: string | null = null;

      // Check if we're in web environment
      if (typeof window !== "undefined") {
        storedData = localStorage.getItem(this.NOTIFICATIONS_KEY);
      } else {
        // For mobile/native environment
        try {
          storedData = await storage.get(this.NOTIFICATIONS_KEY);
        } catch (err) {
          console.log("Storage service not available, using mock data");
        }
      }

      if (storedData) {
        this.notifications = JSON.parse(storedData);
      } else {
        this.notifications = this.getMockNotifications();
        await this.saveNotifications();
      }
    } catch (error) {
      console.error("Error loading stored notifications:", error);
      this.notifications = this.getMockNotifications();
    }
  }

  private async saveNotifications() {
    try {
      // Check if we're in web environment
      if (typeof window !== "undefined") {
        localStorage.setItem(
          this.NOTIFICATIONS_KEY,
          JSON.stringify(this.notifications),
        );
      } else {
        // For mobile/native environment
        try {
          await storage.set(
            this.NOTIFICATIONS_KEY,
            JSON.stringify(this.notifications),
          );
        } catch (err) {
          console.log("Storage service not available for saving");
        }
      }
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  }

  private async loadStoredSettings() {
    try {
      let storedData: string | null = null;

      // Check if we're in web environment
      if (typeof window !== "undefined") {
        storedData = localStorage.getItem(this.SETTINGS_KEY);
      } else {
        // For mobile/native environment
        try {
          storedData = await storage.get(this.SETTINGS_KEY);
        } catch (err) {
          console.log("Storage service not available, using default settings");
        }
      }

      if (storedData) {
        this.settings = {
          ...this.getDefaultSettings(),
          ...JSON.parse(storedData),
        };
      }
    } catch (error) {
      console.error("Error loading stored settings:", error);
      this.settings = this.getDefaultSettings();
    }
  }

  private async saveSettings() {
    try {
      // Check if we're in web environment
      if (typeof window !== "undefined") {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
      } else {
        // For mobile/native environment
        try {
          await storage.set(this.SETTINGS_KEY, JSON.stringify(this.settings));
        } catch (err) {
          console.log("Storage service not available for saving settings");
        }
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }

  private getMockNotifications(): NotificationData[] {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    return [
      {
        id: "1",
        title: "Case Update: CRL-123/2024",
        message: "Your case hearing has been rescheduled to January 20, 2025",
        type: "case_update",
        priority: "high",
        isRead: false,
        createdAt: oneHourAgo.toISOString(),
        actionUrl: "/(tabs)/timeline",
        metadata: {
          caseId: "CRL-123/2024",
          dueDate: "2025-01-20T10:00:00Z",
        },
      },
      {
        id: "2",
        title: "Payment Successful",
        message:
          "Your subscription payment of ₹999 has been processed successfully",
        type: "payment",
        priority: "medium",
        isRead: false,
        createdAt: oneDayAgo.toISOString(),
        actionUrl: "/subscription",
        metadata: {
          amount: 999,
        },
      },
      {
        id: "3",
        title: "Document Verification",
        message: "Your law degree certificate has been approved by admin",
        type: "verification",
        priority: "high",
        isRead: true,
        createdAt: twoDaysAgo.toISOString(),
        actionUrl: "/verification-status",
      },
      {
        id: "4",
        title: "Court Hearing Reminder",
        message: "You have a court hearing tomorrow at 10:00 AM",
        type: "reminder",
        priority: "high",
        isRead: false,
        createdAt: oneDayAgo.toISOString(),
        actionUrl: "/(tabs)/timeline",
        metadata: {
          dueDate: "2025-01-19T10:00:00Z",
        },
      },
      {
        id: "5",
        title: "System Maintenance",
        message:
          "Scheduled maintenance will occur on Sunday from 2:00 AM to 4:00 AM",
        type: "system",
        priority: "low",
        isRead: true,
        createdAt: twoDaysAgo.toISOString(),
      },
    ];
  }

  // Get all notifications
  async getNotifications(): Promise<NotificationData[]> {
    return this.notifications;
  }

  // Get unread notifications count
  async getUnreadCount(): Promise<number> {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  // Get notifications by type
  async getNotificationsByType(
    type: NotificationData["type"],
  ): Promise<NotificationData[]> {
    return this.notifications.filter((n) => n.type === type);
  }

  // Get notifications by priority
  async getNotificationsByPriority(
    priority: NotificationData["priority"],
  ): Promise<NotificationData[]> {
    return this.notifications.filter((n) => n.priority === priority);
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const index = this.notifications.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      this.notifications[index].isRead = true;
      await this.saveNotifications();
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    this.notifications.forEach((n) => (n.isRead = true));
    await this.saveNotifications();
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    this.notifications = this.notifications.filter(
      (n) => n.id !== notificationId,
    );
    await this.saveNotifications();
  }

  // Delete all notifications
  async deleteAllNotifications(): Promise<void> {
    this.notifications = [];
    await this.saveNotifications();
  }

  // Delete notifications by type
  async deleteNotificationsByType(
    type: NotificationData["type"],
  ): Promise<void> {
    this.notifications = this.notifications.filter((n) => n.type !== type);
    await this.saveNotifications();
  }

  // Add new notification
  async addNotification(
    notification: Omit<NotificationData, "id" | "createdAt">,
  ): Promise<string> {
    const newNotification: NotificationData = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    this.notifications.unshift(newNotification);
    await this.saveNotifications();

    // Send push notification if on mobile
    if (typeof window === "undefined") {
      await this.sendPushNotification(newNotification);
    }

    return newNotification.id;
  }

  // Send push notification (native only)
  private async sendPushNotification(
    notification: NotificationData,
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.message,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          sound: "default",
          data: {
            notificationId: notification.id,
            type: notification.type,
            actionUrl: notification.actionUrl,
          },
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  }

  // Get notification categories with counts
  async getNotificationCategories(): Promise<NotificationCategory[]> {
    const categories: NotificationCategory[] = [
      {
        id: "all",
        name: "All",
        icon: "📋",
        count: this.notifications.length,
        color: "#6b7280",
      },
      {
        id: "unread",
        name: "Unread",
        icon: "🔴",
        count: this.notifications.filter((n) => !n.isRead).length,
        color: "#ef4444",
      },
      {
        id: "case_update",
        name: "Case Updates",
        icon: "⚖️",
        count: this.notifications.filter((n) => n.type === "case_update")
          .length,
        color: "#3b82f6",
      },
      {
        id: "payment",
        name: "Payments",
        icon: "💳",
        count: this.notifications.filter((n) => n.type === "payment").length,
        color: "#059669",
      },
      {
        id: "deadline",
        name: "Deadlines",
        icon: "⏰",
        count: this.notifications.filter((n) => n.type === "deadline").length,
        color: "#f59e0b",
      },
      {
        id: "system",
        name: "System",
        icon: "🔧",
        count: this.notifications.filter((n) => n.type === "system").length,
        color: "#8b5cf6",
      },
      {
        id: "verification",
        name: "Verification",
        icon: "✅",
        count: this.notifications.filter((n) => n.type === "verification")
          .length,
        color: "#10b981",
      },
    ];

    return categories;
  }

  // Get filtered notifications
  async getFilteredNotifications(
    category: string,
    priority?: NotificationData["priority"],
    isRead?: boolean,
  ): Promise<NotificationData[]> {
    let filtered = this.notifications;

    // Filter by category
    if (category !== "all") {
      if (category === "unread") {
        filtered = filtered.filter((n) => !n.isRead);
      } else {
        filtered = filtered.filter((n) => n.type === category);
      }
    }

    // Filter by priority
    if (priority) {
      filtered = filtered.filter((n) => n.priority === priority);
    }

    // Filter by read status
    if (isRead !== undefined) {
      filtered = filtered.filter((n) => n.isRead === isRead);
    }

    // Sort by creation date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  // Get notification by ID
  async getNotificationById(id: string): Promise<NotificationData | null> {
    return this.notifications.find((n) => n.id === id) || null;
  }

  // Search notifications
  async searchNotifications(query: string): Promise<NotificationData[]> {
    const lowerQuery = query.toLowerCase();
    return this.notifications.filter(
      (n) =>
        n.title.toLowerCase().includes(lowerQuery) ||
        n.message.toLowerCase().includes(lowerQuery),
    );
  }

  // Get notification statistics
  async getNotificationStats(): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    const byType: Record<string, number> = {};
    const byPriority: Record<string, number> = {};

    this.notifications.forEach((n) => {
      byType[n.type] = (byType[n.type] || 0) + 1;
      byPriority[n.priority] = (byPriority[n.priority] || 0) + 1;
    });

    return {
      total: this.notifications.length,
      unread: this.notifications.filter((n) => !n.isRead).length,
      byType,
      byPriority,
    };
  }

  // Request notification permissions (native only)
  async requestPermissions(): Promise<boolean> {
    if (typeof window !== "undefined") {
      return true; // Web doesn't need permissions
    }

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  // Schedule reminder notification
  async scheduleReminder(
    title: string,
    message: string,
    scheduledDate: Date,
    metadata?: NotificationData["metadata"],
  ): Promise<string> {
    const notificationId = await this.addNotification({
      title,
      message,
      type: "reminder",
      priority: "medium",
      isRead: false,
      actionUrl: "/(tabs)/timeline",
      metadata,
    });

    // Schedule push notification for the future (native only)
    if (typeof window === "undefined") {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body: message,
            data: { notificationId, type: "reminder" },
          },
          trigger: scheduledDate,
        });
      } catch (error) {
        console.error("Error scheduling reminder:", error);
      }
    }

    return notificationId;
  }

  // Get notification settings
  async getSettings(): Promise<NotificationSettings> {
    return this.settings;
  }

  // Update notification settings
  async updateSettings(
    newSettings: Partial<NotificationSettings>,
  ): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    await this.saveSettings();
  }

  // Get notification type icon
  getNotificationTypeIcon(type: NotificationData["type"]): string {
    switch (type) {
      case "case_update":
        return "⚖️";
      case "payment":
        return "💳";
      case "system":
        return "⚙️";
      case "deadline":
        return "⏰";
      case "reminder":
        return "🔔";
      case "verification":
        return "✅";
      default:
        return "📢";
    }
  }

  // Get notification type color
  getNotificationTypeColor(type: NotificationData["type"]): string {
    switch (type) {
      case "case_update":
        return "#3b82f6";
      case "payment":
        return "#059669";
      case "system":
        return "#8b5cf6";
      case "deadline":
        return "#f59e0b";
      case "reminder":
        return "#ef4444";
      case "verification":
        return "#10b981";
      default:
        return "#6b7280";
    }
  }

  // Get priority color
  getPriorityColor(priority: NotificationData["priority"]): string {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  }

  // Clear all notifications (alias for deleteAllNotifications for compatibility)
  async clearAllNotifications(): Promise<boolean> {
    try {
      await this.deleteAllNotifications();
      return true;
    } catch (error) {
      console.error("Error clearing all notifications:", error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
