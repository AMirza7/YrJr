import * as Notifications from "expo-notifications";
import { storage } from "./storage";

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: "case_update" | "reminder" | "system" | "legal_update" | "general";
  priority: "low" | "normal" | "high" | "urgent";
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
  actionUrl?: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  caseUpdates: boolean;
  reminders: boolean;
  legalUpdates: boolean;
  marketing: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

class NotificationService {
  private notifications: NotificationData[] = [];
  private readonly NOTIFICATIONS_KEY = "stored_notifications";
  private readonly SETTINGS_KEY = "notification_settings";

  constructor() {
    this.initializeNotifications();
    this.loadStoredNotifications();
  }

  private async initializeNotifications() {
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Request permissions
    await this.requestPermissions();
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === "granted";
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  async getSettings(): Promise<NotificationSettings> {
    try {
      const settingsJson = await storage.get(this.SETTINGS_KEY);
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }

    // Return default settings
    return {
      pushEnabled: true,
      emailEnabled: true,
      caseUpdates: true,
      reminders: true,
      legalUpdates: true,
      marketing: false,
      quietHours: {
        enabled: false,
        startTime: "22:00",
        endTime: "08:00",
      },
    };
  }

  async updateSettings(
    settings: Partial<NotificationSettings>,
  ): Promise<boolean> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };

      await storage.set(this.SETTINGS_KEY, JSON.stringify(updatedSettings));
      return true;
    } catch (error) {
      console.error("Error updating notification settings:", error);
      return false;
    }
  }

  private async loadStoredNotifications() {
    try {
      const notificationsJson = await storage.get(this.NOTIFICATIONS_KEY);
      if (notificationsJson) {
        this.notifications = JSON.parse(notificationsJson);
      } else {
        // Load mock notifications for demo
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
      await storage.set(
        this.NOTIFICATIONS_KEY,
        JSON.stringify(this.notifications),
      );
    } catch (error) {
      console.error("Error saving notifications:", error);
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
      },
      {
        id: "2",
        title: "New BNS Section Added",
        message: "Section 351A has been added to the Bharatiya Nyaya Sanhita",
        type: "legal_update",
        priority: "normal",
        isRead: false,
        createdAt: oneDayAgo.toISOString(),
        actionUrl: "/ai-comparator",
      },
      {
        id: "3",
        title: "Document Reminder",
        message: "Remember to submit witness statements by January 18th",
        type: "reminder",
        priority: "high",
        isRead: true,
        createdAt: oneDayAgo.toISOString(),
      },
      {
        id: "4",
        title: "System Maintenance",
        message: "Scheduled maintenance on January 19th from 2-4 AM",
        type: "system",
        priority: "low",
        isRead: true,
        createdAt: twoDaysAgo.toISOString(),
      },
      {
        id: "5",
        title: "New Template Available",
        message: "Employment Contract template has been updated",
        type: "general",
        priority: "normal",
        isRead: false,
        createdAt: twoDaysAgo.toISOString(),
        actionUrl: "/templates",
      },
    ];
  }

  async sendLocalNotification(
    title: string,
    message: string,
    data?: Record<string, any>,
    delay?: number,
  ): Promise<string | null> {
    try {
      const settings = await this.getSettings();

      if (!settings.pushEnabled) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          data: data || {},
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: delay ? { seconds: delay } : null,
      });

      return notificationId;
    } catch (error) {
      console.error("Error sending local notification:", error);
      return null;
    }
  }

  async addNotification(
    notification: Omit<NotificationData, "id" | "createdAt" | "isRead">,
  ): Promise<string> {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    this.notifications.unshift(newNotification);
    await this.saveNotifications();

    // Send push notification if enabled
    const settings = await this.getSettings();
    if (settings.pushEnabled) {
      await this.sendLocalNotification(
        notification.title,
        notification.message,
        notification.data,
      );
    }

    return newNotification.id;
  }

  async getNotifications(
    type?: NotificationData["type"],
    limit?: number,
  ): Promise<NotificationData[]> {
    let filtered = this.notifications;

    if (type) {
      filtered = filtered.filter((n) => n.type === type);
    }

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const notification = this.notifications.find(
        (n) => n.id === notificationId,
      );
      if (notification) {
        notification.isRead = true;
        await this.saveNotifications();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      this.notifications.forEach((n) => (n.isRead = true));
      await this.saveNotifications();
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const index = this.notifications.findIndex(
        (n) => n.id === notificationId,
      );
      if (index !== -1) {
        this.notifications.splice(index, 1);
        await this.saveNotifications();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  }

  async clearAllNotifications(): Promise<boolean> {
    try {
      this.notifications = [];
      await this.saveNotifications();
      return true;
    } catch (error) {
      console.error("Error clearing notifications:", error);
      return false;
    }
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  async scheduleCaseReminder(
    caseNumber: string,
    hearingDate: Date,
    message: string,
  ): Promise<string | null> {
    try {
      const oneDayBefore = new Date(
        hearingDate.getTime() - 24 * 60 * 60 * 1000,
      );
      const delay = Math.max(0, (oneDayBefore.getTime() - Date.now()) / 1000);

      const notificationId = await this.sendLocalNotification(
        `Case Reminder: ${caseNumber}`,
        message,
        { caseNumber, hearingDate: hearingDate.toISOString() },
        delay,
      );

      // Also add to notifications list
      await this.addNotification({
        title: `Case Reminder: ${caseNumber}`,
        message,
        type: "reminder",
        priority: "high",
        data: { caseNumber, hearingDate: hearingDate.toISOString() },
        actionUrl: "/(tabs)/timeline",
      });

      return notificationId;
    } catch (error) {
      console.error("Error scheduling case reminder:", error);
      return null;
    }
  }

  async sendCaseUpdateNotification(
    caseNumber: string,
    message: string,
  ): Promise<string> {
    return this.addNotification({
      title: `Case Update: ${caseNumber}`,
      message,
      type: "case_update",
      priority: "high",
      data: { caseNumber },
      actionUrl: "/(tabs)/timeline",
    });
  }

  async sendLegalUpdateNotification(
    title: string,
    message: string,
    actionUrl?: string,
  ): Promise<string> {
    return this.addNotification({
      title,
      message,
      type: "legal_update",
      priority: "normal",
      actionUrl,
    });
  }

  async sendSystemNotification(
    title: string,
    message: string,
  ): Promise<string> {
    return this.addNotification({
      title,
      message,
      type: "system",
      priority: "low",
    });
  }

  getNotificationTypeIcon(type: NotificationData["type"]): string {
    switch (type) {
      case "case_update":
        return "📋";
      case "reminder":
        return "⏰";
      case "system":
        return "⚙️";
      case "legal_update":
        return "⚖️";
      case "general":
        return "📢";
      default:
        return "🔔";
    }
  }

  getNotificationTypeColor(type: NotificationData["type"]): string {
    switch (type) {
      case "case_update":
        return "#3b82f6";
      case "reminder":
        return "#f59e0b";
      case "system":
        return "#6b7280";
      case "legal_update":
        return "#7c3aed";
      case "general":
        return "#059669";
      default:
        return "#374151";
    }
  }

  getPriorityColor(priority: NotificationData["priority"]): string {
    switch (priority) {
      case "urgent":
        return "#dc2626";
      case "high":
        return "#f59e0b";
      case "normal":
        return "#059669";
      case "low":
        return "#6b7280";
      default:
        return "#374151";
    }
  }
}

export const notificationService = new NotificationService();
