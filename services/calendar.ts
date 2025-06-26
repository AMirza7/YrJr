import * as Calendar from "expo-calendar";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export interface CourtEvent {
  id: string;
  title: string;
  caseNumber: string;
  courtName: string;
  judgeName?: string;
  date: Date;
  time: string;
  duration?: number; // in minutes
  location?: string;
  notes?: string;
  clientName?: string;
  reminderMinutes: number[];
  calendarEventId?: string;
  notificationIds?: string[];
}

export interface CalendarPermissions {
  calendar: boolean;
  notifications: boolean;
}

export class CalendarService {
  private static readonly LEGAL_CALENDAR_NAME =
    "Legal Assistant - Court Hearings";

  // Request permissions
  static async requestPermissions(): Promise<CalendarPermissions> {
    try {
      const calendarStatus = await Calendar.requestCalendarPermissionsAsync();
      const notificationStatus = await Notifications.requestPermissionsAsync();

      return {
        calendar: calendarStatus.status === "granted",
        notifications: notificationStatus.status === "granted",
      };
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return { calendar: false, notifications: false };
    }
  }

  // Get or create legal calendar
  static async getLegalCalendar(): Promise<string | null> {
    try {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT,
      );

      // Find existing legal calendar
      const existingCalendar = calendars.find(
        (cal) => cal.title === this.LEGAL_CALENDAR_NAME,
      );
      if (existingCalendar) {
        return existingCalendar.id;
      }

      // Create new legal calendar
      const defaultCalendarSource =
        Platform.OS === "ios"
          ? await Calendar.getDefaultCalendarAsync()
          : { isLocalAccount: true, name: "Legal Assistant" };

      const calendarId = await Calendar.createCalendarAsync({
        title: this.LEGAL_CALENDAR_NAME,
        color: "#8B5CF6",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.source?.id || defaultCalendarSource.id,
        source: defaultCalendarSource.source || defaultCalendarSource,
        name: this.LEGAL_CALENDAR_NAME,
        ownerAccount: "personal",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      return calendarId;
    } catch (error) {
      console.error("Error getting/creating legal calendar:", error);
      return null;
    }
  }

  // Add court hearing to calendar
  static async addCourtHearing(event: CourtEvent): Promise<string | null> {
    try {
      const permissions = await this.requestPermissions();
      if (!permissions.calendar) {
        throw new Error("Calendar permission is required to add events");
      }

      const calendarId = await this.getLegalCalendar();
      if (!calendarId) {
        throw new Error("Failed to create or access legal calendar");
      }

      // Parse time and create start/end dates
      const startDate = new Date(event.date);
      const [hours, minutes] = event.time.split(":").map(Number);
      startDate.setHours(hours, minutes, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + (event.duration || 60));

      // Create calendar event
      const eventDetails: Calendar.Event = {
        title: `${event.title} - ${event.caseNumber}`,
        startDate,
        endDate,
        timeZone: "Asia/Kolkata",
        location: event.location || event.courtName,
        notes: this.formatEventNotes(event),
        alarms: event.reminderMinutes.map((minutes) => ({
          relativeOffset: -minutes,
        })),
      };

      const calendarEventId = await Calendar.createEventAsync(
        calendarId,
        eventDetails,
      );

      // Schedule notifications
      const notificationIds = await this.scheduleNotifications(
        event,
        startDate,
      );

      // Update event with IDs
      event.calendarEventId = calendarEventId;
      event.notificationIds = notificationIds;

      return calendarEventId;
    } catch (error) {
      console.error("Error adding court hearing to calendar:", error);
      throw new Error("Failed to add event to calendar");
    }
  }

  // Update court hearing
  static async updateCourtHearing(event: CourtEvent): Promise<boolean> {
    try {
      if (!event.calendarEventId) {
        throw new Error("Event not found in calendar");
      }

      // Cancel existing notifications
      if (event.notificationIds) {
        await this.cancelNotifications(event.notificationIds);
      }

      // Parse time and create start/end dates
      const startDate = new Date(event.date);
      const [hours, minutes] = event.time.split(":").map(Number);
      startDate.setHours(hours, minutes, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + (event.duration || 60));

      // Update calendar event
      const eventDetails: Partial<Calendar.Event> = {
        title: `${event.title} - ${event.caseNumber}`,
        startDate,
        endDate,
        location: event.location || event.courtName,
        notes: this.formatEventNotes(event),
        alarms: event.reminderMinutes.map((minutes) => ({
          relativeOffset: -minutes,
        })),
      };

      await Calendar.updateEventAsync(event.calendarEventId, eventDetails);

      // Schedule new notifications
      const notificationIds = await this.scheduleNotifications(
        event,
        startDate,
      );
      event.notificationIds = notificationIds;

      return true;
    } catch (error) {
      console.error("Error updating court hearing:", error);
      return false;
    }
  }

  // Delete court hearing
  static async deleteCourtHearing(event: CourtEvent): Promise<boolean> {
    try {
      // Cancel notifications
      if (event.notificationIds) {
        await this.cancelNotifications(event.notificationIds);
      }

      // Delete calendar event
      if (event.calendarEventId) {
        await Calendar.deleteEventAsync(event.calendarEventId);
      }

      return true;
    } catch (error) {
      console.error("Error deleting court hearing:", error);
      return false;
    }
  }

  // Get upcoming court hearings
  static async getUpcomingHearings(
    days: number = 30,
  ): Promise<Calendar.Event[]> {
    try {
      const calendarId = await this.getLegalCalendar();
      if (!calendarId) return [];

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const events = await Calendar.getEventsAsync(
        [calendarId],
        startDate,
        endDate,
      );
      return events.sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime(),
      );
    } catch (error) {
      console.error("Error getting upcoming hearings:", error);
      return [];
    }
  }

  // Schedule push notifications
  private static async scheduleNotifications(
    event: CourtEvent,
    eventDate: Date,
  ): Promise<string[]> {
    try {
      const permissions = await this.requestPermissions();
      if (!permissions.notifications) {
        return [];
      }

      const notificationIds: string[] = [];

      for (const minutes of event.reminderMinutes) {
        const triggerDate = new Date(eventDate.getTime() - minutes * 60 * 1000);

        // Only schedule if trigger date is in the future
        if (triggerDate > new Date()) {
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: "Court Hearing Reminder",
              body: `${event.title} - ${event.caseNumber} ${this.formatReminderTime(minutes)}`,
              data: {
                eventId: event.id,
                caseNumber: event.caseNumber,
                courtName: event.courtName,
              },
              sound: true,
              priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: triggerDate,
          });
          notificationIds.push(id);
        }
      }

      return notificationIds;
    } catch (error) {
      console.error("Error scheduling notifications:", error);
      return [];
    }
  }

  // Cancel notifications
  private static async cancelNotifications(
    notificationIds: string[],
  ): Promise<void> {
    try {
      for (const id of notificationIds) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    } catch (error) {
      console.error("Error canceling notifications:", error);
    }
  }

  // Format event notes
  private static formatEventNotes(event: CourtEvent): string {
    const notes: string[] = [];

    if (event.caseNumber) notes.push(`Case: ${event.caseNumber}`);
    if (event.courtName) notes.push(`Court: ${event.courtName}`);
    if (event.judgeName) notes.push(`Judge: ${event.judgeName}`);
    if (event.clientName) notes.push(`Client: ${event.clientName}`);
    if (event.notes) notes.push(`Notes: ${event.notes}`);

    return notes.join("\n");
  }

  // Format reminder time for notification
  private static formatReminderTime(minutes: number): string {
    if (minutes < 60) {
      return `in ${minutes} minutes`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `in ${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `in ${days} day${days > 1 ? "s" : ""}`;
    }
  }

  // Sync with external calendars (Google Calendar, iCal)
  static async syncWithExternalCalendar(
    event: CourtEvent,
    calendarType: "google" | "ical",
  ): Promise<boolean> {
    try {
      // This would integrate with Google Calendar API or generate iCal files
      // For now, we'll just add to the device calendar
      const eventId = await this.addCourtHearing(event);
      return !!eventId;
    } catch (error) {
      console.error(`Error syncing with ${calendarType}:`, error);
      return false;
    }
  }

  // Export calendar data
  static async exportCalendarData(
    startDate: Date,
    endDate: Date,
  ): Promise<string> {
    try {
      const events = await this.getUpcomingHearings();

      // Generate iCal format
      let icalData = "BEGIN:VCALENDAR\n";
      icalData += "VERSION:2.0\n";
      icalData += "PRODID:-//Legal Assistant//Court Hearings//EN\n";

      events.forEach((event) => {
        icalData += "BEGIN:VEVENT\n";
        icalData += `UID:${event.id}\n`;
        icalData += `DTSTART:${event.startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z\n`;
        icalData += `DTEND:${event.endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z\n`;
        icalData += `SUMMARY:${event.title}\n`;
        icalData += `DESCRIPTION:${event.notes || ""}\n`;
        icalData += `LOCATION:${event.location || ""}\n`;
        icalData += "END:VEVENT\n";
      });

      icalData += "END:VCALENDAR\n";

      return icalData;
    } catch (error) {
      console.error("Error exporting calendar data:", error);
      throw new Error("Failed to export calendar data");
    }
  }
}
