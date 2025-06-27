import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { styles } from "@/constants/AppStyles";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  status: "completed" | "in_progress" | "pending";
  milestone: "fir" | "investigation" | "hearing" | "orders" | "judgment";
}

const SAMPLE_TIMELINE: TimelineEvent[] = [
  {
    id: "1",
    title: "FIR Filed",
    description: "First Information Report filed at local police station",
    date: new Date("2024-01-01"),
    status: "completed",
    milestone: "fir",
  },
  {
    id: "2",
    title: "Investigation Started",
    description:
      "Police investigation initiated, evidence collection in progress",
    date: new Date("2024-01-05"),
    status: "completed",
    milestone: "investigation",
  },
  {
    id: "3",
    title: "First Hearing",
    description: "Initial hearing scheduled in court",
    date: new Date("2024-01-15"),
    status: "in_progress",
    milestone: "hearing",
  },
  {
    id: "4",
    title: "Bail Application",
    description: "Bail application to be filed",
    date: new Date("2024-01-25"),
    status: "pending",
    milestone: "orders",
  },
  {
    id: "5",
    title: "Final Judgment",
    description: "Court to deliver final judgment",
    date: new Date("2024-03-15"),
    status: "pending",
    milestone: "judgment",
  },
];

export default function CaseTimelineScreen() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in_progress":
        return "#f59e0b";
      case "pending":
        return "#64748b";
      default:
        return "#64748b";
    }
  };

  const getMilestoneIcon = (milestone: string) => {
    switch (milestone) {
      case "fir":
        return "📋";
      case "investigation":
        return "🔍";
      case "hearing":
        return "⚖️";
      case "orders":
        return "📜";
      case "judgment":
        return "🏛️";
      default:
        return "📄";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={styles.title}>⏰ Case Timeline</Text>
            <Text style={styles.subtitle}>
              Track case progress and milestones
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "#64748b",
                paddingHorizontal: 12,
                paddingVertical: 8,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { fontSize: 14 }]}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Case Info */}
        <View style={[styles.card, { marginBottom: 20 }]}>
          <Text
            style={[
              styles.text,
              { fontWeight: "600", fontSize: 16, marginBottom: 8 },
            ]}
          >
            Case: State vs. Accused
          </Text>
          <Text
            style={[
              styles.text,
              { color: "#64748b", fontSize: 14, marginBottom: 4 },
            ]}
          >
            Case Number: CR/2024/001
          </Text>
          <Text style={[styles.text, { color: "#64748b", fontSize: 14 }]}>
            Court: District Court, New Delhi
          </Text>
        </View>

        {/* Timeline */}
        <Text
          style={[
            styles.text,
            { fontSize: 18, fontWeight: "600", marginBottom: 16 },
          ]}
        >
          Timeline Events
        </Text>

        {SAMPLE_TIMELINE.map((event, index) => (
          <View
            key={event.id}
            style={{ flexDirection: "row", marginBottom: 16 }}
          >
            {/* Timeline Line */}
            <View style={{ alignItems: "center", marginRight: 16 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: getStatusColor(event.status),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>
                  {getMilestoneIcon(event.milestone)}
                </Text>
              </View>
              {index < SAMPLE_TIMELINE.length - 1 && (
                <View
                  style={{
                    width: 2,
                    height: 40,
                    backgroundColor: "#e2e8f0",
                    marginTop: 8,
                  }}
                />
              )}
            </View>

            {/* Event Details */}
            <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={[
                    styles.text,
                    { fontWeight: "600", fontSize: 16, flex: 1 },
                  ]}
                >
                  {event.title}
                </Text>
                <View
                  style={{
                    backgroundColor: getStatusColor(event.status),
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 10,
                      fontWeight: "600",
                    }}
                  >
                    {event.status.replace("_", " ").toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={[styles.text, { fontSize: 14, marginBottom: 8 }]}>
                {event.description}
              </Text>

              <Text style={[styles.text, { fontSize: 12, color: "#64748b" }]}>
                {event.date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
