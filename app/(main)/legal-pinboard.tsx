import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { styles } from "@/constants/AppStyles";

interface PinnedNote {
  id: string;
  title: string;
  content: string;
  color: string;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

const SAMPLE_NOTES: PinnedNote[] = [
  {
    id: "1",
    title: "Case Update - Patel vs State",
    content:
      "Next hearing scheduled for January 25th. Need to prepare witness statements.",
    color: "#fef3c7",
    priority: "high",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Legal Research Notes",
    content:
      "Review recent Supreme Court judgment on bail provisions under Section 437 CrPC.",
    color: "#dbeafe",
    priority: "medium",
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    title: "Client Meeting Reminder",
    content:
      "Meeting with Mrs. Sharma tomorrow at 3 PM to discuss property dispute.",
    color: "#d1fae5",
    priority: "low",
    createdAt: new Date("2024-01-13"),
  },
];

export default function LegalPinboardScreen() {
  const [notes, setNotes] = useState<PinnedNote[]>(SAMPLE_NOTES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      Alert.alert("Error", "Please fill in both title and content");
      return;
    }

    const note: PinnedNote = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      color: "#f3f4f6",
      priority: "medium",
      createdAt: new Date(),
    };

    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "" });
    setShowAddForm(false);
    Alert.alert("Success", "Note added to pinboard");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#64748b";
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
            <Text style={styles.title}>📌 Legal Pinboard</Text>
            <Text style={styles.subtitle}>
              Your pinned legal notes and reminders
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

        {/* Add Note Form */}
        {showAddForm && (
          <View style={[styles.card, { marginBottom: 20 }]}>
            <Text
              style={[styles.text, { fontWeight: "600", marginBottom: 12 }]}
            >
              Add New Note
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Note title"
              value={newNote.title}
              onChangeText={(text) => setNewNote({ ...newNote, title: text })}
            />

            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              placeholder="Note content"
              value={newNote.content}
              onChangeText={(text) => setNewNote({ ...newNote, content: text })}
              multiline
            />

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: "#10b981" }]}
                onPress={handleAddNote}
              >
                <Text style={styles.buttonText}>Add Note</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: "#64748b" }]}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Add Note Button */}
        {!showAddForm && (
          <TouchableOpacity
            style={[styles.button, { marginBottom: 20 }]}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.buttonText}>+ Add New Note</Text>
          </TouchableOpacity>
        )}

        {/* Notes Grid */}
        {notes.map((note) => (
          <View
            key={note.id}
            style={[
              styles.card,
              { backgroundColor: note.color, marginBottom: 12 },
            ]}
          >
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
                {note.title}
              </Text>
              <View
                style={{
                  backgroundColor: getPriorityColor(note.priority),
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{ color: "#ffffff", fontSize: 10, fontWeight: "600" }}
                >
                  {note.priority.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={[styles.text, { fontSize: 14, marginBottom: 8 }]}>
              {note.content}
            </Text>

            <Text style={[styles.text, { fontSize: 12, color: "#64748b" }]}>
              {note.createdAt.toLocaleDateString("en-IN")} •{" "}
              {note.createdAt.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        ))}

        {notes.length === 0 && (
          <View style={styles.card}>
            <Text
              style={[styles.text, { textAlign: "center", color: "#64748b" }]}
            >
              No notes pinned yet. Add your first note above!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
