import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { dataService } from "@/services/dataService";
import { CaseFolder, CaseTimelineEvent } from "@/types/features";

export default function TimelineScreen() {
  const [cases, setCases] = useState<CaseFolder[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseFolder | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<CaseTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);

  // Event modal state
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventType, setNewEventType] = useState<
    "filing" | "hearing" | "order" | "payment" | "document" | "meeting"
  >("hearing");

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const data = await dataService.getCaseFolders();
      setCases(data);
      if (data.length > 0) {
        setSelectedCase(data[0]);
        setTimelineEvents(generateTimelineEvents(data[0]));
      }
    } catch (error) {
      console.error("Error loading cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimelineEvents = (
    caseFolder: CaseFolder,
  ): CaseTimelineEvent[] => {
    const now = new Date();
    return [
      {
        id: "1",
        caseId: caseFolder.id,
        title: "Case Filed",
        description: "Initial case documentation submitted to court",
        date: new Date(caseFolder.startDate),
        type: "filing",
        status: "completed",
      },
      {
        id: "2",
        caseId: caseFolder.id,
        title: "First Hearing Scheduled",
        description: "Court has scheduled the first hearing for case review",
        date: new Date(
          caseFolder.startDate.getTime() + 7 * 24 * 60 * 60 * 1000,
        ),
        type: "hearing",
        status: "completed",
      },
      {
        id: "3",
        caseId: caseFolder.id,
        title: "Evidence Submission",
        description: "All supporting documents and evidence submitted",
        date: new Date(
          caseFolder.startDate.getTime() + 14 * 24 * 60 * 60 * 1000,
        ),
        type: "document",
        status: "completed",
      },
      {
        id: "4",
        caseId: caseFolder.id,
        title: "Second Hearing",
        description: "Arguments presented by both parties",
        date: new Date(
          caseFolder.startDate.getTime() + 21 * 24 * 60 * 60 * 1000,
        ),
        type: "hearing",
        status: "completed",
      },
      {
        id: "5",
        caseId: caseFolder.id,
        title: "Next Hearing",
        description: "Final arguments and case conclusion",
        date:
          caseFolder.nextHearing ||
          new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        type: "hearing",
        status: "upcoming",
      },
      {
        id: "6",
        caseId: caseFolder.id,
        title: "Judgment Expected",
        description: "Court expected to deliver final judgment",
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        type: "order",
        status: "upcoming",
      },
    ];
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "filing":
        return "📄";
      case "hearing":
        return "⚖️";
      case "order":
        return "📋";
      case "payment":
        return "💳";
      case "document":
        return "📁";
      case "meeting":
        return "🤝";
      default:
        return "📌";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "upcoming":
        return "#f59e0b";
      case "overdue":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case "completed":
        return "#d1fae5";
      case "upcoming":
        return "#fef3c7";
      case "overdue":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  };

  const renderTimelineEvent = ({
    item,
    index,
  }: {
    item: CaseTimelineEvent;
    index: number;
  }) => (
    <View style={styles.timelineItem}>
      <View style={styles.timelineItemLeft}>
        <View
          style={[
            styles.timelineDate,
            { backgroundColor: getStatusBackground(item.status) },
          ]}
        >
          <Text
            style={[
              styles.timelineDateText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {item.date.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            })}
          </Text>
        </View>
        <View style={styles.timelineConnector}>
          <View
            style={[
              styles.timelineDot,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
          {index < timelineEvents.length - 1 && (
            <View
              style={[
                styles.timelineLine,
                { backgroundColor: getStatusColor(item.status) + "40" },
              ]}
            />
          )}
        </View>
      </View>

      <View style={styles.timelineItemRight}>
        <View style={styles.timelineCard}>
          <View style={styles.timelineCardHeader}>
            <Text style={styles.timelineIcon}>
              {getEventTypeIcon(item.type)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusBackground(item.status) },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.timelineTitle}>{item.title}</Text>
          <Text style={styles.timelineDescription}>{item.description}</Text>

          <Text style={styles.timelineTime}>
            {item.date.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCaseTab = ({ item }: { item: CaseFolder }) => (
    <TouchableOpacity
      style={[
        styles.caseTab,
        {
          backgroundColor: selectedCase?.id === item.id ? "#7c3aed" : "#f3f4f6",
        },
      ]}
      onPress={() => {
        setSelectedCase(item);
        setTimelineEvents(generateTimelineEvents(item));
      }}
    >
      <Text
        style={[
          styles.caseTabText,
          { color: selectedCase?.id === item.id ? "#fff" : "#374151" },
        ]}
      >
        {item.title.substring(0, 20)}...
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>⏱️ Case Timeline</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowEventModal(true)}
        >
          <Text style={styles.addButtonText}>+ Event</Text>
        </TouchableOpacity>
      </View>

      {/* Case Selector */}
      <View style={styles.caseSelectorContainer}>
        <Text style={styles.selectorLabel}>Select Case:</Text>
        <FlatList
          data={cases}
          renderItem={renderCaseTab}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.caseSelector}
        />
      </View>

      {/* Case Info */}
      {selectedCase && (
        <View style={styles.caseInfo}>
          <Text style={styles.caseTitle}>{selectedCase.title}</Text>
          <View style={styles.caseDetails}>
            <Text style={styles.caseDetailText}>
              📋 {selectedCase.caseNumber}
            </Text>
            <Text style={styles.caseDetailText}>🏛️ {selectedCase.court}</Text>
            <Text style={styles.caseDetailText}>
              👤 {selectedCase.clientName}
            </Text>
          </View>
          <View
            style={[
              styles.statusChip,
              { backgroundColor: getStatusBackground("upcoming") },
            ]}
          >
            <Text
              style={[
                styles.statusChipText,
                { color: getStatusColor("upcoming") },
              ]}
            >
              {selectedCase.status}
            </Text>
          </View>
        </View>
      )}

      {/* Timeline */}
      <FlatList
        data={timelineEvents}
        renderItem={renderTimelineEvent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.timelineContainer}
        refreshing={loading}
        onRefresh={loadCases}
      />

      {/* Add Event Modal */}
      <Modal
        visible={showEventModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEventModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Timeline Event</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Event creation will be implemented in the next update",
                )
              }
            >
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Event Title</Text>
            <TextInput
              style={styles.textInput}
              value={newEventTitle}
              onChangeText={setNewEventTitle}
              placeholder="Enter event title"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newEventDescription}
              onChangeText={setNewEventDescription}
              placeholder="Enter event description"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.inputLabel}>Event Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                "filing",
                "hearing",
                "order",
                "payment",
                "document",
                "meeting",
              ].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    {
                      backgroundColor:
                        newEventType === type ? "#7c3aed" : "#f3f4f6",
                    },
                  ]}
                  onPress={() => setNewEventType(type as any)}
                >
                  <Text style={styles.typeIcon}>{getEventTypeIcon(type)}</Text>
                  <Text
                    style={[
                      styles.typeText,
                      { color: newEventType === type ? "#fff" : "#374151" },
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  featureIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  featureList: {
    alignSelf: "flex-start",
  },
  featureItem: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
});
