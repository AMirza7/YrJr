import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import BackButton from "@/components/navigation/BackButton";
import CaseTimelineVisualizer, {
  TimelineEvent,
} from "@/components/legal/CaseTimelineVisualizer";

export default function CaseTimelineScreen() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      title: "FIR Filed",
      description:
        "First Information Report filed at Police Station regarding theft case",
      date: new Date("2024-01-15"),
      type: "fir",
      documents: [
        { id: "doc1", name: "FIR Copy", type: "pdf" },
        { id: "doc2", name: "Witness Statement", type: "pdf" },
      ],
      editable: false,
    },
    {
      id: "2",
      title: "Arrest Made",
      description: "Accused arrested by police and taken into custody",
      date: new Date("2024-01-18"),
      type: "arrest",
      documents: [{ id: "doc3", name: "Arrest Memo", type: "pdf" }],
      editable: false,
    },
    {
      id: "3",
      title: "Bail Application Filed",
      description: "Bail application submitted to Sessions Court",
      date: new Date("2024-01-22"),
      type: "bail",
      documents: [
        { id: "doc4", name: "Bail Application", type: "pdf" },
        { id: "doc5", name: "Surety Documents", type: "pdf" },
      ],
      editable: true,
    },
  ]);

  const handleEventUpdate = (
    eventId: string,
    updatedEvent: Partial<TimelineEvent>,
  ) => {
    setTimelineEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, ...updatedEvent } : event,
      ),
    );
  };

  const handleEventAdd = (newEvent: Omit<TimelineEvent, "id">) => {
    const event: TimelineEvent = {
      ...newEvent,
      id: Date.now().toString(),
    };
    setTimelineEvents((prev) => [...prev, event]);
  };

  const handleEventDelete = (eventId: string) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this timeline event?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTimelineEvents((prev) =>
              prev.filter((event) => event.id !== eventId),
            );
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <BackButton title="Home" color="#fff" />
      <CaseTimelineVisualizer
        events={timelineEvents}
        onEventUpdate={handleEventUpdate}
        onEventAdd={handleEventAdd}
        onEventDelete={handleEventDelete}
        caseTitle="State vs. John Doe - Theft Case"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
});
