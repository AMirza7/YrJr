import * as Calendar from "expo-calendar";
import { notificationService } from "./notifications";

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  location?: string;
  attendees?: string[];
  caseNumber?: string;
  eventType: "hearing" | "deadline" | "consultation" | "filing" | "meeting";
  priority: "low" | "medium" | "high" | "urgent";
  reminderMinutes?: number[];
}

export interface CalendarSettings {
  defaultReminderMinutes: number[];
  autoSync: boolean;
  calendarId?: string;
  timezone: string;
}

class CalendarService {
  private defaultCalendarId: string | null = null;
  private settings: CalendarSettings = {
    defaultReminderMinutes: [1440, 60, 15], // 1 day, 1 hour, 15 minutes
    autoSync: true,
    timezone: "Asia/Kolkata",
  };

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting calendar permissions:", error);
      return false;
    }
  }

  async getCalendars(): Promise<Calendar.Calendar[]> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return [];

      return await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    } catch (error) {
      console.error("Error getting calendars:", error);
      return [];
    }
  }

  async createDefaultCalendar(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const defaultCalendarSource = {
        isLocalAccount: true,
        name: "YRJR Legal Assistant",
      };

      const calendarId = await Calendar.createCalendarAsync({
        title: "Legal Events",
        color: "#7c3aed",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.name,
        source: defaultCalendarSource,
        name: "Legal Events",
        ownerAccount: "legal@yrjr.app",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      this.defaultCalendarId = calendarId;
      return calendarId;
    } catch (error) {
      console.error("Error creating calendar:", error);
      return null;
    }
  }

  async getOrCreateDefaultCalendar(): Promise<string | null> {
    if (this.defaultCalendarId) {
      return this.defaultCalendarId;
    }

    try {
      const calendars = await this.getCalendars();
      const legalCalendar = calendars.find(
        (cal) => cal.title === "Legal Events" || cal.name === "Legal Events",
      );

      if (legalCalendar) {
        this.defaultCalendarId = legalCalendar.id;
        return legalCalendar.id;
      }

      return await this.createDefaultCalendar();
    } catch (error) {
      console.error("Error getting or creating calendar:", error);
      return null;
    }
  }

  async addCourtHearing(details: {
    caseNumber: string;
    date: Date;
    courtName: string;
    judgeName?: string;
    purpose: string;
    location?: string;
    duration?: number; // in minutes
  }): Promise<string | null> {
    try {
      const calendarId = await this.getOrCreateDefaultCalendar();
      if (!calendarId) return null;

      const startDate = details.date;
      const endDate = new Date(
        startDate.getTime() + (details.duration || 60) * 60000,
      );

      const event: Omit<CalendarEvent, "id"> = {
        title: `Court Hearing - ${details.caseNumber}`,
        startDate,
        endDate,
        notes: `Case: ${details.caseNumber}\nCourt: ${details.courtName}\n${details.judgeName ? `Judge: ${details.judgeName}\n` : ""}Purpose: ${details.purpose}`,
        location: details.location || details.courtName,
        caseNumber: details.caseNumber,
        eventType: "hearing",
        priority: "high",
        reminderMinutes: this.settings.defaultReminderMinutes,
      };

      const eventId = await this.createEvent(event);

      if (eventId) {
        // Schedule notification reminder
        await notificationService.scheduleCaseReminder(
          details.caseNumber,
          details.date,
          `Court hearing for case ${details.caseNumber} is scheduled for tomorrow`,
        );
      }

      return eventId;
    } catch (error) {
      console.error("Error adding court hearing:", error);
      return null;
    }
  }

  async addDeadline(details: {
    title: string;
    date: Date;
    caseNumber?: string;
    description: string;
    priority: "low" | "medium" | "high" | "urgent";
  }): Promise<string | null> {
    try {
      const calendarId = await this.getOrCreateDefaultCalendar();
      if (!calendarId) return null;

      const event: Omit<CalendarEvent, "id"> = {
        title: `DEADLINE: ${details.title}`,
        startDate: details.date,
        endDate: new Date(details.date.getTime() + 60 * 60000), // 1 hour duration
        notes: `${details.description}${details.caseNumber ? `\nCase: ${details.caseNumber}` : ""}`,
        caseNumber: details.caseNumber,
        eventType: "deadline",
        priority: details.priority,
        reminderMinutes: this.getDeadlineReminders(details.priority),
      };

      return await this.createEvent(event);
    } catch (error) {
      console.error("Error adding deadline:", error);
      return null;
    }
  }

  async addConsultation(details: {
    clientName: string;
    date: Date;
    duration: number; // in minutes
    location?: string;
    notes?: string;
    contactInfo?: string;
  }): Promise<string | null> {
    try {
      const calendarId = await this.getOrCreateDefaultCalendar();
      if (!calendarId) return null;

      const startDate = details.date;
      const endDate = new Date(startDate.getTime() + details.duration * 60000);

      const event: Omit<CalendarEvent, "id"> = {
        title: `Consultation - ${details.clientName}`,
        startDate,
        endDate,
        notes: `Client: ${details.clientName}${details.contactInfo ? `\nContact: ${details.contactInfo}` : ""}${details.notes ? `\nNotes: ${details.notes}` : ""}`,
        location: details.location,
        eventType: "consultation",
        priority: "medium",
        reminderMinutes: [60, 15], // 1 hour and 15 minutes before
      };

      return await this.createEvent(event);
    } catch (error) {
      console.error("Error adding consultation:", error);
      return null;
    }
  }

  private async createEvent(
    event: Omit<CalendarEvent, "id">,
  ): Promise<string | null> {
    try {
      const calendarId = await this.getOrCreateDefaultCalendar();
      if (!calendarId) return null;

      const eventId = await Calendar.createEventAsync(calendarId, {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        notes: event.notes,
        location: event.location,
        alarms:
          event.reminderMinutes?.map((minutes) => ({
            relativeOffset: -minutes,
            method: Calendar.AlarmMethod.ALERT,
          })) || [],
        timeZone: this.settings.timezone,
      });

      return eventId;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      return null;
    }
  }

  async getUpcomingEvents(days: number = 30): Promise<CalendarEvent[]> {
    try {
      const calendarId = await this.getOrCreateDefaultCalendar();
      if (!calendarId) return [];

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const events = await Calendar.getEventsAsync(
        [calendarId],
        startDate,
        endDate,
      );

      // Convert to CalendarEvent format
      return events.map((event) => ({
        id: event.id,
        title: event.title,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        notes: event.notes,
        location: event.location,
        eventType: this.getEventTypeFromTitle(event.title),
        priority: "medium", // Default priority
        reminderMinutes:
          event.alarms?.map((alarm) => Math.abs(alarm.relativeOffset)) || [],
      }));
    } catch (error) {
      console.error("Error getting upcoming events:", error);
      return [];
    }
  }

  private getEventTypeFromTitle(title: string): CalendarEvent["eventType"] {
    if (title.toLowerCase().includes("hearing")) return "hearing";
    if (title.toLowerCase().includes("deadline")) return "deadline";
    if (title.toLowerCase().includes("consultation")) return "consultation";
    if (title.toLowerCase().includes("filing")) return "filing";
    return "meeting";
  }

  private getDeadlineReminders(priority: CalendarEvent["priority"]): number[] {
    switch (priority) {
      case "urgent":
        return [10080, 1440, 60, 15]; // 1 week, 1 day, 1 hour, 15 min
      case "high":
        return [2880, 1440, 60]; // 2 days, 1 day, 1 hour
      case "medium":
        return [1440, 60]; // 1 day, 1 hour
      case "low":
        return [1440]; // 1 day
      default:
        return [1440];
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await Calendar.deleteEventAsync(eventId);
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      return false;
    }
  }

  async updateEvent(
    eventId: string,
    updates: Partial<CalendarEvent>,
  ): Promise<boolean> {
    try {
      await Calendar.updateEventAsync(eventId, {
        title: updates.title,
        startDate: updates.startDate,
        endDate: updates.endDate,
        notes: updates.notes,
        location: updates.location,
        alarms: updates.reminderMinutes?.map((minutes) => ({
          relativeOffset: -minutes,
          method: Calendar.AlarmMethod.ALERT,
        })),
      });
      return true;
    } catch (error) {
      console.error("Error updating event:", error);
      return false;
    }
  }

  getSettings(): CalendarSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<CalendarSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Export calendar data
  async exportToICS(events: CalendarEvent[]): Promise<string> {
    const icsContent = this.generateICSContent(events);
    return icsContent;
  }

  private generateICSContent(events: CalendarEvent[]): string {
    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//YRJR Legal Assistant//Calendar//EN",
      "CALSCALE:GREGORIAN",
    ];

    events.forEach((event) => {
      icsLines.push(
        "BEGIN:VEVENT",
        `UID:${event.id}@yrjr.app`,
        `DTSTART:${this.formatDateForICS(event.startDate)}`,
        `DTEND:${this.formatDateForICS(event.endDate)}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.notes || ""}`,
        `LOCATION:${event.location || ""}`,
        `PRIORITY:${this.getPriorityNumber(event.priority)}`,
        "END:VEVENT",
      );
    });

    icsLines.push("END:VCALENDAR");
    return icsLines.join("\r\n");
  }

  private formatDateForICS(date: Date): string {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  private getPriorityNumber(priority: CalendarEvent["priority"]): number {
    switch (priority) {
      case "urgent":
        return 1;
      case "high":
        return 3;
      case "medium":
        return 5;
      case "low":
        return 7;
      default:
        return 5;
    }
  }

  // Quick actions for common legal events
  async addQuickHearing(
    caseNumber: string,
    date: Date,
  ): Promise<string | null> {
    return this.addCourtHearing({
      caseNumber,
      date,
      courtName: "District Court",
      purpose: "Regular Hearing",
      duration: 60,
    });
  }

  async addQuickDeadline(title: string, date: Date): Promise<string | null> {
    return this.addDeadline({
      title,
      date,
      description: "Legal deadline reminder",
      priority: "high",
    });
  }

  async getTodaysEvents(): Promise<CalendarEvent[]> {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
      const calendarId = await this.getOrCreateDefaultCalendar();
      if (!calendarId) return [];

      const events = await Calendar.getEventsAsync(
        [calendarId],
        today,
        tomorrow,
      );

      return events.map((event) => ({
        id: event.id,
        title: event.title,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        notes: event.notes,
        location: event.location,
        eventType: this.getEventTypeFromTitle(event.title),
        priority: "medium",
        reminderMinutes:
          event.alarms?.map((alarm) => Math.abs(alarm.relativeOffset)) || [],
      }));
    } catch (error) {
      console.error("Error getting today's events:", error);
      return [];
    }
  }
}

export const calendarService = new CalendarService();
