import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type:
    | "fir"
    | "arrest"
    | "bail"
    | "chargesheet"
    | "hearing"
    | "judgment"
    | "custom";
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uri?: string;
  }>;
  editable: boolean;
}

interface CaseTimelineVisualizerProps {
  events: TimelineEvent[];
  onEventUpdate: (
    eventId: string,
    updatedEvent: Partial<TimelineEvent>,
  ) => void;
  onEventAdd: (newEvent: Omit<TimelineEvent, "id">) => void;
  onEventDelete: (eventId: string) => void;
  caseTitle?: string;
}

export default function CaseTimelineVisualizer({
  events,
  onEventUpdate,
  onEventAdd,
  onEventDelete,
  caseTitle = "Case Timeline",
}: CaseTimelineVisualizerProps) {
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    title: "",
    description: "",
    date: new Date(),
    type: "custom",
    documents: [],
    editable: true,
  });

  const getEventIcon = (type: TimelineEvent["type"]) => {
    const icons = {
      fir: "🚨",
      arrest: "👮",
      bail: "🏛️",
      chargesheet: "📋",
      hearing: "⚖️",
      judgment: "🏆",
      custom: "📅",
    };
    return icons[type];
  };

  const getEventColor = (type: TimelineEvent["type"]) => {
    const colors = {
      fir: "#ef4444",
      arrest: "#f97316",
      bail: "#10b981",
      chargesheet: "#3b82f6",
      hearing: "#8b5cf6",
      judgment: "#06b6d4",
      custom: "#64748b",
    };
    return colors[type];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const sortedEvents = [...events].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  const handleEditEvent = (event: TimelineEvent) => {
    if (event.editable) {
      setEditingEvent(event);
    }
  };

  const handleSaveEdit = () => {
    if (editingEvent) {
      onEventUpdate(editingEvent.id, editingEvent);
      setEditingEvent(null);
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.description) {
      onEventAdd({
        ...newEvent,
        id: Date.now().toString(),
      } as Omit<TimelineEvent, "id">);
      setNewEvent({
        title: "",
        description: "",
        date: new Date(),
        type: "custom",
        documents: [],
        editable: true,
      });
      setShowAddModal(false);
    } else {
      Alert.alert("Error", "Please fill in all required fields");
    }
  };

  const EventCard = ({
    event,
    index,
  }: {
    event: TimelineEvent;
    index: number;
  }) => (
    <View style={styles.eventContainer}>
      <View style={styles.timelineConnector}>
        <View
          style={[
            styles.eventDot,
            { backgroundColor: getEventColor(event.type) },
          ]}
        >
          <Text style={styles.eventIcon}>{getEventIcon(event.type)}</Text>
        </View>
        {index < sortedEvents.length - 1 && (
          <View style={styles.connectionLine} />
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.eventCard,
          { borderLeftColor: getEventColor(event.type) },
        ]}
        onPress={() => handleEditEvent(event)}
        disabled={!event.editable}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
        </View>

        <Text style={styles.eventDescription}>{event.description}</Text>

        {event.documents.length > 0 && (
          <View style={styles.documentsContainer}>
            <Text style={styles.documentsTitle}>📎 Attached Documents:</Text>
            {event.documents.map((doc) => (
              <Text key={doc.id} style={styles.documentItem}>
                • {doc.name}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.eventFooter}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getEventColor(event.type) + "20" },
            ]}
          >
            <Text
              style={[styles.typeText, { color: getEventColor(event.type) }]}
            >
              {event.type.toUpperCase()}
            </Text>
          </View>
          {event.editable && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditEvent(event)}
            >
              <Text style={styles.editButtonText}>✏️ Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{caseTitle}</Text>
        <Text style={styles.subtitle}>📅 Chronological Timeline</Text>
      </View>

      <View style={styles.actionsBar}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>➕ Add New Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.attachButton}
          onPress={() =>
            Alert.alert("Feature", "Attach Petition functionality")
          }
        >
          <Text style={styles.attachButtonText}>📎 Attach Petition</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
        {sortedEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No Events Yet</Text>
            <Text style={styles.emptyMessage}>
              Start building your case timeline by adding events like FIR,
              Arrest, Bail, etc.
            </Text>
          </View>
        ) : (
          sortedEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))
        )}
      </ScrollView>

      {/* Edit Event Modal */}
      <Modal
        visible={editingEvent !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingEvent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={editingEvent?.title || ""}
              onChangeText={(text) =>
                setEditingEvent((prev) =>
                  prev ? { ...prev, title: text } : null,
                )
              }
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Event Description"
              value={editingEvent?.description || ""}
              onChangeText={(text) =>
                setEditingEvent((prev) =>
                  prev ? { ...prev, description: text } : null,
                )
              }
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditingEvent(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Event Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={newEvent.title || ""}
              onChangeText={(text) =>
                setNewEvent((prev) => ({ ...prev, title: text }))
              }
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Event Description"
              value={newEvent.description || ""}
              onChangeText={(text) =>
                setNewEvent((prev) => ({ ...prev, description: text }))
              }
              multiline
              numberOfLines={4}
            />

            <View style={styles.typeSelector}>
              <Text style={styles.typeSelectorTitle}>Event Type:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(
                  [
                    "fir",
                    "arrest",
                    "bail",
                    "chargesheet",
                    "hearing",
                    "judgment",
                    "custom",
                  ] as const
                ).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      newEvent.type === type && styles.typeOptionSelected,
                      { borderColor: getEventColor(type) },
                    ]}
                    onPress={() => setNewEvent((prev) => ({ ...prev, type }))}
                  >
                    <Text style={styles.typeOptionIcon}>
                      {getEventIcon(type)}
                    </Text>
                    <Text style={styles.typeOptionText}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddEvent}
              >
                <Text style={styles.saveButtonText}>Add Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#8b5cf6",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd6fe",
  },
  actionsBar: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  attachButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  attachButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  timeline: {
    flex: 1,
    padding: 16,
  },
  eventContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelineConnector: {
    alignItems: "center",
    marginRight: 16,
  },
  eventDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  eventIcon: {
    fontSize: 16,
  },
  connectionLine: {
    width: 2,
    height: 60,
    backgroundColor: "#e2e8f0",
    marginTop: 8,
  },
  eventCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  eventDate: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  eventDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 12,
  },
  documentsContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  documentsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  documentItem: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  typeSelector: {
    marginBottom: 20,
  },
  typeSelectorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  typeOption: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    marginRight: 8,
    minWidth: 80,
  },
  typeOptionSelected: {
    backgroundColor: "#f0f9ff",
  },
  typeOptionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  typeOptionText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748b",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#3b82f6",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
