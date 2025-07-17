import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import BackButton from "@/components/navigation/BackButton";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: "hearing" | "meeting" | "deadline" | "reminder";
  location?: string;
  caseId?: string;
  priority: "low" | "medium" | "high";
}

interface GroupedEvents {
  date: string;
  dateFormatted: string;
  events: CalendarEvent[];
}

export default function CalendarScreen() {
  const { theme } = useTheme();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      groupEventsByDate();
    }
  }, [events]);

  const fetchCalendarEvents = async () => {
    try {
      setError(null);

      // API call to GET /api/calendar-events
      const response = await fetch("/api/calendar-events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      setError("Failed to load calendar events. Please try again.");

      // Fallback to mock data for demo
      setEvents([
        {
          id: "1",
          title: "Court Hearing - Property Dispute",
          description: "Final hearing for ABC vs XYZ property dispute case",
          startDate: "2024-02-15T10:00:00Z",
          endDate: "2024-02-15T12:00:00Z",
          type: "hearing",
          location: "District Court Room 205",
          caseId: "CS/2024/001234",
          priority: "high",
        },
        {
          id: "2",
          title: "Client Meeting - Employment Case",
          description:
            "Initial consultation with John Doe regarding employment dispute",
          startDate: "2024-02-15T14:00:00Z",
          endDate: "2024-02-15T15:00:00Z",
          type: "meeting",
          location: "Office Conference Room",
          priority: "medium",
        },
        {
          id: "3",
          title: "Document Submission Deadline",
          description:
            "Submit all evidence documents for corporate merger case",
          startDate: "2024-02-16T17:00:00Z",
          endDate: "2024-02-16T17:00:00Z",
          type: "deadline",
          caseId: "CS/2024/009876",
          priority: "high",
        },
        {
          id: "4",
          title: "Review Case Files",
          description: "Review and prepare arguments for upcoming hearing",
          startDate: "2024-02-17T09:00:00Z",
          endDate: "2024-02-17T11:00:00Z",
          type: "reminder",
          priority: "medium",
        },
        {
          id: "5",
          title: "Mediation Session",
          description: "Attempt to resolve dispute through mediation",
          startDate: "2024-02-18T11:00:00Z",
          endDate: "2024-02-18T13:00:00Z",
          type: "meeting",
          location: "Mediation Center",
          priority: "high",
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const groupEventsByDate = () => {
    const grouped = events.reduce(
      (acc: { [key: string]: CalendarEvent[] }, event) => {
        const date = new Date(event.startDate).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(event);
        return acc;
      },
      {},
    );

    const groupedArray: GroupedEvents[] = Object.keys(grouped)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => ({
        date,
        dateFormatted: formatDateHeader(date),
        events: grouped[date].sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        ),
      }));

    setGroupedEvents(groupedArray);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCalendarEvents();
  };

  const handleEventPress = (event: CalendarEvent) => {
    Alert.alert(
      event.title,
      `${event.description}\n\nTime: ${formatTime(event.startDate)} - ${formatTime(event.endDate)}${event.location ? `\nLocation: ${event.location}` : ""}`,
      [
        { text: "Close", style: "cancel" },
        {
          text: "View Details",
          onPress: () => {
            // Navigate to event details
            // router.push(`/event-details/${event.id}`);
          },
        },
      ],
    );
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "hearing":
        return "⚖️";
      case "meeting":
        return "👥";
      case "deadline":
        return "⏰";
      case "reminder":
        return "🔔";
      default:
        return "📅";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "hearing":
        return "#dc2626";
      case "meeting":
        return "#2563eb";
      case "deadline":
        return "#ea580c";
      case "reminder":
        return "#16a34a";
      default:
        return theme.colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#dc2626";
      case "medium":
        return "#d97706";
      case "low":
        return "#16a34a";
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderEventItem = ({ item }: { item: CalendarEvent }) => (
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleEventPress(item)}
    >
      <View style={styles.eventHeader}>
        <View style={styles.eventTitleContainer}>
          <Text style={styles.eventIcon}>{getEventIcon(item.type)}</Text>
          <View style={styles.eventDetails}>
            <Text
              style={[styles.eventTitle, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              style={[styles.eventTime, { color: getEventColor(item.type) }]}
            >
              {formatTime(item.startDate)} - {formatTime(item.endDate)}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.priorityDot,
            { backgroundColor: getPriorityColor(item.priority) },
          ]}
        />
      </View>

      {item.description && (
        <Text
          style={[
            styles.eventDescription,
            { color: theme.colors.textSecondary },
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      )}

      {item.location && (
        <Text
          style={[styles.eventLocation, { color: theme.colors.textSecondary }]}
        >
          📍 {item.location}
        </Text>
      )}

      {item.caseId && (
        <Text style={[styles.eventCase, { color: theme.colors.textSecondary }]}>
          📁 Case: {item.caseId}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderDateGroup = ({ item }: { item: GroupedEvents }) => (
    <View style={styles.dateGroup}>
      <Text style={[styles.dateHeader, { color: theme.colors.text }]}>
        {item.dateFormatted}
      </Text>
      <Text style={[styles.eventCount, { color: theme.colors.textSecondary }]}>
        {item.events.length} event{item.events.length !== 1 ? "s" : ""}
      </Text>

      {item.events.map((event) => (
        <View key={event.id} style={styles.eventWrapper}>
          {renderEventItem({ item: event })}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View
          style={[styles.header, { backgroundColor: theme.colors.primary }]}
        >
          <BackButton color="#fff" />
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            Loading calendar events...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <BackButton color="#fff" />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Calendar</Text>
          <Text style={styles.headerSubtitle}>
            {events.length} upcoming event{events.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠��� {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchCalendarEvents}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={groupedEvents}
        renderItem={renderDateGroup}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No Events Scheduled
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Your upcoming events will appear here.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventCount: {
    fontSize: 14,
    marginBottom: 12,
  },
  eventWrapper: {
    marginBottom: 8,
  },
  eventCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  eventTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  eventIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: "500",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  eventLocation: {
    fontSize: 12,
    marginBottom: 4,
  },
  eventCase: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
