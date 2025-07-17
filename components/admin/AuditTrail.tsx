import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";

interface AuditEvent {
  id: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  details?: string;
  metadata?: Record<string, any>;
}

interface AuditTrailProps {
  userId: string;
  events: AuditEvent[];
  compact?: boolean;
}

export default function AuditTrail({
  userId,
  events,
  compact = true,
}: AuditTrailProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpansion = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);

    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      created: "📝",
      submitted: "📤",
      reviewed: "👀",
      approved: "✅",
      rejected: "❌",
      updated: "📝",
      verified: "🔍",
      suspended: "⏸️",
      reactivated: "▶️",
      document_uploaded: "📄",
      document_verified: "✅",
      comment_added: "💬",
    };
    return icons[action.toLowerCase()] || "📋";
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      approved: "#10b981",
      verified: "#10b981",
      rejected: "#ef4444",
      suspended: "#f59e0b",
      created: "#3b82f6",
      submitted: "#6366f1",
      updated: "#8b5cf6",
    };
    return colors[action.toLowerCase()] || "#64748b";
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  const sortedEvents = [...events].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
  const recentEvents = compact ? sortedEvents.slice(0, 3) : sortedEvents;
  const hasMoreEvents = compact && sortedEvents.length > 3;

  const EventItem = ({
    event,
    isLast,
  }: {
    event: AuditEvent;
    isLast: boolean;
  }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventIndicator}>
        <View
          style={[
            styles.eventDot,
            { backgroundColor: getActionColor(event.action) },
          ]}
        >
          <Text style={styles.eventIcon}>{getActionIcon(event.action)}</Text>
        </View>
        {!isLast && <View style={styles.eventLine} />}
      </View>

      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventAction}>{event.action}</Text>
          <Text style={styles.eventTime}>
            {formatRelativeTime(event.timestamp)}
          </Text>
        </View>

        <Text style={styles.eventPerformer}>by {event.performedBy}</Text>

        {event.details && (
          <Text style={styles.eventDetails}>{event.details}</Text>
        )}

        <Text style={styles.eventTimestamp}>
          {formatTimestamp(event.timestamp)}
        </Text>
      </View>
    </View>
  );

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No audit trail available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpansion}>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>📋</Text>
          <Text style={styles.headerTitle}>Audit Trail</Text>
          <View style={styles.eventCount}>
            <Text style={styles.eventCountText}>{events.length}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.expandIcon,
            { transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] },
          ]}
        >
          ▼
        </Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.content,
          {
            height: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.min(400, events.length * 80)],
            }),
            opacity: animation,
          },
        ]}
      >
        <ScrollView
          style={styles.eventsContainer}
          showsVerticalScrollIndicator={false}
        >
          {(isExpanded ? sortedEvents : recentEvents).map(
            (event, index, array) => (
              <EventItem
                key={event.id}
                event={event}
                isLast={index === array.length - 1}
              />
            ),
          )}

          {hasMoreEvents && !isExpanded && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={toggleExpansion}
            >
              <Text style={styles.showMoreText}>
                Show {sortedEvents.length - 3} more events
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  eventCount: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  eventCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  expandIcon: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 8,
  },
  content: {
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  eventsContainer: {
    padding: 12,
  },
  eventItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  eventIndicator: {
    alignItems: "center",
    marginRight: 12,
  },
  eventDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  eventIcon: {
    fontSize: 10,
  },
  eventLine: {
    width: 2,
    height: 30,
    backgroundColor: "#e2e8f0",
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  eventAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    textTransform: "capitalize",
  },
  eventTime: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  eventPerformer: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 4,
    fontStyle: "italic",
  },
  eventTimestamp: {
    fontSize: 11,
    color: "#94a3b8",
  },
  showMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    fontStyle: "italic",
  },
});
