import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PinboardItem,
  CaseFolder,
  SecureNote,
  LegalTemplate,
  Flashcard,
  FlashcardSession,
  Document,
  Message,
  CalendarEvent,
  Notification,
  UserStats,
} from "@/types/features";
import { LEGAL_TEMPLATES } from "@/constants/LegalConstants";

const STORAGE_KEYS = {
  PINBOARD: "pinboard_items",
  CASES: "case_folders",
  NOTES: "secure_notes",
  TEMPLATES: "legal_templates",
  FLASHCARDS: "flashcards",
  FLASHCARD_SESSIONS: "flashcard_sessions",
  DOCUMENTS: "documents",
  MESSAGES: "messages",
  CALENDAR: "calendar_events",
  NOTIFICATIONS: "notifications",
  USER_STATS: "user_stats",
};

class DataService {
  // Pinboard Management
  async getPinboardItems(): Promise<PinboardItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PINBOARD);
      return data ? JSON.parse(data) : this.getDefaultPinboardItems();
    } catch (error) {
      console.error("Error getting pinboard items:", error);
      return this.getDefaultPinboardItems();
    }
  }

  async savePinboardItem(
    item: Omit<PinboardItem, "id" | "createdAt" | "updatedAt">,
  ): Promise<PinboardItem> {
    try {
      const items = await this.getPinboardItems();
      const newItem: PinboardItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      items.unshift(newItem);
      await AsyncStorage.setItem(STORAGE_KEYS.PINBOARD, JSON.stringify(items));
      return newItem;
    } catch (error) {
      console.error("Error saving pinboard item:", error);
      throw error;
    }
  }

  async updatePinboardItem(
    id: string,
    updates: Partial<PinboardItem>,
  ): Promise<void> {
    try {
      const items = await this.getPinboardItems();
      const index = items.findIndex((item) => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...updates, updatedAt: new Date() };
        await AsyncStorage.setItem(
          STORAGE_KEYS.PINBOARD,
          JSON.stringify(items),
        );
      }
    } catch (error) {
      console.error("Error updating pinboard item:", error);
      throw error;
    }
  }

  async deletePinboardItem(id: string): Promise<void> {
    try {
      const items = await this.getPinboardItems();
      const filteredItems = items.filter((item) => item.id !== id);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PINBOARD,
        JSON.stringify(filteredItems),
      );
    } catch (error) {
      console.error("Error deleting pinboard item:", error);
      throw error;
    }
  }

  // Case Management
  async getCaseFolders(): Promise<CaseFolder[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CASES);
      return data ? JSON.parse(data) : this.getDefaultCaseFolders();
    } catch (error) {
      console.error("Error getting case folders:", error);
      return this.getDefaultCaseFolders();
    }
  }

  // Secure Notes
  async getSecureNotes(): Promise<SecureNote[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : this.getDefaultSecureNotes();
    } catch (error) {
      console.error("Error getting secure notes:", error);
      return this.getDefaultSecureNotes();
    }
  }

  async saveSecureNote(
    note: Omit<SecureNote, "id" | "createdAt" | "updatedAt">,
  ): Promise<SecureNote> {
    try {
      const notes = await this.getSecureNotes();
      const newNote: SecureNote = {
        ...note,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      notes.unshift(newNote);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      return newNote;
    } catch (error) {
      console.error("Error saving secure note:", error);
      throw error;
    }
  }

  // Templates
  async getLegalTemplates(): Promise<LegalTemplate[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TEMPLATES);
      return data
        ? JSON.parse(data)
        : LEGAL_TEMPLATES.map((template) => ({
            ...template,
            placeholders: this.extractPlaceholders(template.content),
            createdAt: new Date(),
            updatedAt: new Date(),
            downloads: Math.floor(Math.random() * 100),
          }));
    } catch (error) {
      console.error("Error getting legal templates:", error);
      return [];
    }
  }

  // Flashcards
  async getFlashcards(): Promise<Flashcard[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      return data ? JSON.parse(data) : this.getDefaultFlashcards();
    } catch (error) {
      console.error("Error getting flashcards:", error);
      return this.getDefaultFlashcards();
    }
  }

  async getFlashcardSessions(): Promise<FlashcardSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FLASHCARD_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting flashcard sessions:", error);
      return [];
    }
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : this.getDefaultNotifications();
    } catch (error) {
      console.error("Error getting notifications:", error);
      return this.getDefaultNotifications();
    }
  }

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const index = notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        notifications[index].readAt = new Date();
        await AsyncStorage.setItem(
          STORAGE_KEYS.NOTIFICATIONS,
          JSON.stringify(notifications),
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // User Stats
  async getUserStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
      return data ? JSON.parse(data) : this.getDefaultUserStats();
    } catch (error) {
      console.error("Error getting user stats:", error);
      return this.getDefaultUserStats();
    }
  }

  // Helper methods for default data
  private getDefaultPinboardItems(): PinboardItem[] {
    return [
      {
        id: "1",
        title: "Review Client Documentation",
        description:
          "Review all documents submitted by client for the property dispute case",
        priority: "high",
        tags: ["Review", "Documentation"],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        createdBy: "current_user",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        completed: false,
        caseId: "case_1",
      },
      {
        id: "2",
        title: "File Appeal in High Court",
        description:
          "Prepare and file appeal documents for the criminal case verdict",
        priority: "urgent",
        tags: ["Urgent", "Filing", "Appeal"],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        createdBy: "current_user",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        completed: false,
        caseId: "case_2",
      },
    ];
  }

  private getDefaultCaseFolders(): CaseFolder[] {
    return [
      {
        id: "case_1",
        title: "Property Dispute - ABC vs XYZ",
        caseNumber: "CS/2024/001234",
        clientName: "ABC Private Limited",
        caseType: "Civil",
        court: "District Court",
        status: "Trial in Progress",
        priority: "high",
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextHearing: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedLawyer: "Advocate Rajesh Kumar",
        description: "Property ownership dispute between two private companies",
        documents: [],
        timeline: [],
        notes: [],
        messages: [],
      },
    ];
  }

  private getDefaultSecureNotes(): SecureNote[] {
    return [
      {
        id: "note_1",
        title: "Client Confidential Information",
        content: "Sensitive case details and client communications...",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        encrypted: true,
        tags: ["Confidential", "Client"],
        caseId: "case_1",
        isPrivate: true,
      },
    ];
  }

  private getDefaultFlashcards(): Flashcard[] {
    return [
      {
        id: "fc_1",
        question: "What is the punishment for murder under IPC Section 302?",
        answer:
          "Death penalty or imprisonment for life, and shall also be liable to fine.",
        category: "Criminal Law",
        difficulty: "medium",
        tags: ["IPC", "Murder", "Punishment"],
        createdAt: new Date(),
        timesReviewed: 0,
        correctAnswers: 0,
      },
      {
        id: "fc_2",
        question: "What constitutes cheating under IPC Section 420?",
        answer:
          "Cheating and dishonestly inducing delivery of property with intent to deceive.",
        category: "Criminal Law",
        difficulty: "easy",
        tags: ["IPC", "Cheating", "Property"],
        createdAt: new Date(),
        timesReviewed: 0,
        correctAnswers: 0,
      },
    ];
  }

  private getDefaultNotifications(): Notification[] {
    return [
      {
        id: "notif_1",
        userId: "current_user",
        title: "Court Hearing Reminder",
        message:
          "Your hearing for case CS/2024/001234 is scheduled for tomorrow at 10:00 AM",
        type: "hearing_reminder",
        priority: "high",
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        actionUrl: "/(tabs)/timeline",
      },
      {
        id: "notif_2",
        userId: "current_user",
        title: "New Message Received",
        message:
          "You have received a new message from client ABC Private Limited",
        type: "message",
        priority: "medium",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actionUrl: "/(tabs)/cases",
      },
    ];
  }

  private getDefaultUserStats(): UserStats {
    return {
      totalCases: 15,
      activeCases: 8,
      completedCases: 7,
      upcomingHearings: 3,
      flashcardScore: 85,
      documentsScanned: 24,
      notesCreated: 12,
      templatesUsed: 6,
    };
  }

  private extractPlaceholders(content: string): string[] {
    const regex = /\[([^\]]+)\]/g;
    const placeholders: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (!placeholders.includes(match[1])) {
        placeholders.push(match[1]);
      }
    }
    return placeholders;
  }
}

export const dataService = new DataService();
