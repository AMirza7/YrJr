import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, any>;
  timestamp: Date;
  isRead: boolean;
  priority: "low" | "normal" | "high";
  actionable?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  id: string;
  title: string;
  type: "default" | "destructive";
}

export type NotificationType =
  | "case_update"
  | "court_hearing"
  | "message"
  | "document_verified"
  | "subscription_reminder"
  | "legal_update"
  | "system_announcement"
  | "reminder"
  | "rating_request";

export interface NotificationSettings {
  enabled: boolean;
  caseUpdates: boolean;
  courtHearings: boolean;
  messages: boolean;
  documentUpdates: boolean;
  subscriptionReminders: boolean;
  legalUpdates: boolean;
  systemAnnouncements: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;
  };
}

export class NotificationService {
  private static readonly NOTIFICATIONS_KEY = "app_notifications";
  private static readonly SETTINGS_KEY = "notification_settings";
  private static readonly PUSH_TOKEN_KEY = "push_notification_token";

  private static defaultSettings: NotificationSettings = {
    enabled: true,
    caseUpdates: true,
    courtHearings: true,
    messages: true,
    documentUpdates: true,
    subscriptionReminders: true,
    legalUpdates: true,
    systemAnnouncements: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
  };

  // Initialize notification service
  static async initialize(): Promise<boolean> {
    try {
      // Set notification handler
      Notifications.setNotificationHandler({
        handleNotification: async (notification) => {
          const settings = await this.getSettings();

          // Check if notifications are enabled
          if (!settings.enabled) {
            return {
              shouldShowAlert: false,
              shouldPlaySound: false,
              shouldSetBadge: false,
            };
          }

          // Check quiet hours
          if (this.isQuietHours(settings.quietHours)) {
            return {
              shouldShowAlert: false,
              shouldPlaySound: false,
              shouldSetBadge: true,
            };
          }

          return {
            shouldShowAlert: true,
            shouldPlaySound: settings.soundEnabled,
            shouldSetBadge: true,
          };
        },
      });

      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Notification permissions not granted");
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === "android") {
        await this.setupAndroidChannels();
      }

      // Register for push notifications
      await this.registerForPushNotifications();

      return true;
    } catch (error) {
      console.error("Error initializing notifications:", error);
      return false;
    }
  }

  // Setup Android notification channels
  private static async setupAndroidChannels(): Promise<void> {
    const channels = [
      {
        name: "case-updates",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#8B5CF6",
        description: "Updates about your legal cases",
      },
      {
        name: "court-hearings",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#EF4444",
        description: "Court hearing reminders",
      },
      {
        name: "messages",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#10B981",
        description: "New messages from lawyers",
      },
      {
        name: "general",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#06B6D4",
        description: "General app notifications",
      },
    ];

    for (const channel of channels) {
      await Notifications.setNotificationChannelAsync(channel.name, channel);
    }
  }

  // Register for push notifications
  private static async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.warn("Push notifications are not supported on simulators");
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      await AsyncStorage.setItem(this.PUSH_TOKEN_KEY, token.data);

      console.log("Push notification token:", token.data);
      return token.data;
    } catch (error) {
      console.error("Error registering for push notifications:", error);
      return null;
    }
  }

  // Send local notification
  static async sendLocalNotification(
    notification: Omit<AppNotification, "id" | "timestamp" | "isRead">,
  ): Promise<string> {
    try {
      const settings = await this.getSettings();

      // Check if notification type is enabled
      if (!this.isNotificationTypeEnabled(notification.type, settings)) {
        throw new Error("Notification type is disabled");
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: settings.soundEnabled,
          priority: this.getPriority(notification.priority),
        },
        trigger: null, // Send immediately
      });

      // Store notification in local storage
      const appNotification: AppNotification = {
        ...notification,
        id,
        timestamp: new Date(),
        isRead: false,
      };

      await this.storeNotification(appNotification);
      return id;
    } catch (error) {
      console.error("Error sending local notification:", error);
      throw new Error("Failed to send notification");
    }
  }

  // Schedule notification for later
  static async scheduleNotification(
    notification: Omit<AppNotification, "id" | "timestamp" | "isRead">,
    trigger: Date | number,
  ): Promise<string> {
    try {
      const settings = await this.getSettings();

      if (!this.isNotificationTypeEnabled(notification.type, settings)) {
        throw new Error("Notification type is disabled");
      }

      const triggerInput =
        typeof trigger === "number" ? { seconds: trigger } : trigger;

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: settings.soundEnabled,
          priority: this.getPriority(notification.priority),
        },
        trigger: triggerInput,
      });

      // Store notification info
      const appNotification: AppNotification = {
        ...notification,
        id,
        timestamp: new Date(),
        isRead: false,
      };

      await this.storeNotification(appNotification);
      return id;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      throw new Error("Failed to schedule notification");
    }
  }

  // Get all notifications
  static async getNotifications(): Promise<AppNotification[]> {
    try {
      const stored = await AsyncStorage.getItem(this.NOTIFICATIONS_KEY);
      if (!stored) return [];

      const notifications: AppNotification[] = JSON.parse(stored);
      return notifications
        .map((n) => ({ ...n, timestamp: new Date(n.timestamp) }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error("Error getting notifications:", error);
      return [];
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updated = notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n,
      );

      await AsyncStorage.setItem(
        this.NOTIFICATIONS_KEY,
        JSON.stringify(updated),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updated = notifications.map((n) => ({ ...n, isRead: true }));

      await AsyncStorage.setItem(
        this.NOTIFICATIONS_KEY,
        JSON.stringify(updated),
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }

  // Delete notification
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      // Cancel scheduled notification
      await Notifications.cancelScheduledNotificationAsync(notificationId);

      // Remove from stored notifications
      const notifications = await this.getNotifications();
      const filtered = notifications.filter((n) => n.id !== notificationId);

      await AsyncStorage.setItem(
        this.NOTIFICATIONS_KEY,
        JSON.stringify(filtered),
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }

  // Clear all notifications
  static async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem(this.NOTIFICATIONS_KEY);
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  }

  // Get unread count
  static async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter((n) => !n.isRead).length;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  // Get notification settings
  static async getSettings(): Promise<NotificationSettings> {
    try {
      const stored = await AsyncStorage.getItem(this.SETTINGS_KEY);
      if (!stored) return this.defaultSettings;

      return { ...this.defaultSettings, ...JSON.parse(stored) };
    } catch (error) {
      console.error("Error getting notification settings:", error);
      return this.defaultSettings;
    }
  }

  // Update notification settings
  static async updateSettings(
    settings: Partial<NotificationSettings>,
  ): Promise<void> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };

      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error updating notification settings:", error);
      throw new Error("Failed to update notification settings");
    }
  }

  // Check if in quiet hours
  private static isQuietHours(
    quietHours: NotificationSettings["quietHours"],
  ): boolean {
    if (!quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    return currentTime >= quietHours.start || currentTime <= quietHours.end;
  }

  // Check if notification type is enabled
  private static isNotificationTypeEnabled(
    type: NotificationType,
    settings: NotificationSettings,
  ): boolean {
    switch (type) {
      case "case_update":
        return settings.caseUpdates;
      case "court_hearing":
        return settings.courtHearings;
      case "message":
        return settings.messages;
      case "document_verified":
        return settings.documentUpdates;
      case "subscription_reminder":
        return settings.subscriptionReminders;
      case "legal_update":
        return settings.legalUpdates;
      case "system_announcement":
        return settings.systemAnnouncements;
      default:
        return true;
    }
  }

  // Get Android priority from our priority
  private static getPriority(
    priority: AppNotification["priority"],
  ): Notifications.AndroidNotificationPriority {
    switch (priority) {
      case "high":
        return Notifications.AndroidNotificationPriority.HIGH;
      case "low":
        return Notifications.AndroidNotificationPriority.LOW;
      default:
        return Notifications.AndroidNotificationPriority.DEFAULT;
    }
  }

  // Store notification in local storage
  private static async storeNotification(
    notification: AppNotification,
  ): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      notifications.unshift(notification);

      // Keep only last 100 notifications
      const limited = notifications.slice(0, 100);

      await AsyncStorage.setItem(
        this.NOTIFICATIONS_KEY,
        JSON.stringify(limited),
      );
    } catch (error) {
      console.error("Error storing notification:", error);
    }
  }

  // Send different types of notifications
  static async sendCaseUpdateNotification(
    caseNumber: string,
    update: string,
  ): Promise<void> {
    await this.sendLocalNotification({
      title: "Case Update",
      body: `Update on case ${caseNumber}: ${update}`,
      type: "case_update",
      priority: "high",
      data: { caseNumber, update },
    });
  }

  static async sendCourtHearingReminder(
    caseNumber: string,
    courtName: string,
    time: string,
  ): Promise<void> {
    await this.sendLocalNotification({
      title: "Court Hearing Reminder",
      body: `Your hearing for case ${caseNumber} is scheduled at ${time} in ${courtName}`,
      type: "court_hearing",
      priority: "high",
      data: { caseNumber, courtName, time },
    });
  }

  static async sendMessageNotification(
    senderName: string,
    message: string,
  ): Promise<void> {
    await this.sendLocalNotification({
      title: `New message from ${senderName}`,
      body: message.length > 50 ? message.substring(0, 50) + "..." : message,
      type: "message",
      priority: "normal",
      data: { senderName, message },
    });
  }

  static async sendDocumentVerificationNotification(
    documentName: string,
    status: "verified" | "rejected",
  ): Promise<void> {
    await this.sendLocalNotification({
      title: "Document Update",
      body: `Your document "${documentName}" has been ${status}`,
      type: "document_verified",
      priority: "normal",
      data: { documentName, status },
    });
  }
}
