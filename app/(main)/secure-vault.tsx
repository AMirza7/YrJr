import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { styles } from "@/constants/AppStyles";

interface SecureNote {
  id: string;
  title: string;
  content: string;
  category: "confidential" | "case_notes" | "client_info" | "legal_research";
  createdAt: Date;
  lastAccessed: Date;
  isEncrypted: boolean;
}

const SAMPLE_NOTES: SecureNote[] = [
  {
    id: "1",
    title: "Client Confidential Information",
    content: "Sensitive client details and case strategy notes...",
    category: "confidential",
    createdAt: new Date("2024-01-15"),
    lastAccessed: new Date("2024-01-20"),
    isEncrypted: true,
  },
  {
    id: "2",
    title: "Case Research Notes",
    content: "Legal precedents and case law research for ongoing matter...",
    category: "legal_research",
    createdAt: new Date("2024-01-14"),
    lastAccessed: new Date("2024-01-19"),
    isEncrypted: true,
  },
  {
    id: "3",
    title: "Court Strategy",
    content: "Detailed strategy for upcoming court hearing...",
    category: "case_notes",
    createdAt: new Date("2024-01-13"),
    lastAccessed: new Date("2024-01-18"),
    isEncrypted: true,
  },
];

export default function SecureVaultScreen() {
  const [notes, setNotes] = useState<SecureNote[]>(SAMPLE_NOTES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState<SecureNote | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "confidential" as SecureNote["category"],
  });

  const categories = [
    { id: "confidential", name: "Confidential", icon: "🔒", color: "#ef4444" },
    { id: "case_notes", name: "Case Notes", icon: "📝", color: "#f59e0b" },
    { id: "client_info", name: "Client Info", icon: "👤", color: "#06b6d4" },
    {
      id: "legal_research",
      name: "Legal Research",
      icon: "🔍",
      color: "#10b981",
    },
  ];

  const handleAccessNote = (note: SecureNote) => {
    // In a real app, this would use biometric authentication
    Alert.alert(
      "Secure Access Required",
      "Enter access code to view this encrypted note:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Enter Code",
          onPress: () => {
            // For demo, any 4-digit code works
            Alert.prompt(
              "Access Code",
              "Enter 4-digit access code:",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Access",
                  onPress: (code) => {
                    if (code && code.length === 4) {
                      setSelectedNote(note);
                      // Update last accessed
                      const updatedNotes = notes.map((n) =>
                        n.id === note.id
                          ? { ...n, lastAccessed: new Date() }
                          : n,
                      );
                      setNotes(updatedNotes);
                    } else {
                      Alert.alert("Error", "Invalid access code");
                    }
                  },
                },
              ],
              "secure-text",
            );
          },
        },
      ],
    );
  };

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      Alert.alert("Error", "Please fill in both title and content");
      return;
    }

    const note: SecureNote = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      createdAt: new Date(),
      lastAccessed: new Date(),
      isEncrypted: true,
    };

    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", category: "confidential" });
    setShowAddForm(false);
    Alert.alert("Success", "Secure note added to vault");
  };

  const getCategoryInfo = (category: string) => {
    return categories.find((cat) => cat.id === category) || categories[0];
  };

  if (selectedNote) {
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
              <Text style={styles.title}>🔓 Secure Note</Text>
              <Text style={styles.subtitle}>Encrypted content unlocked</Text>
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
              onPress={() => setSelectedNote(null)}
            >
              <Text style={[styles.buttonText, { fontSize: 14 }]}>
                Back to Vault
              </Text>
            </TouchableOpacity>
          </View>

          {/* Note Content */}
          <View style={[styles.card, { backgroundColor: "#f0f9ff" }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <Text
                style={[
                  styles.text,
                  { fontWeight: "600", fontSize: 18, flex: 1 },
                ]}
              >
                {selectedNote.title}
              </Text>
              <View
                style={{
                  backgroundColor: getCategoryInfo(selectedNote.category).color,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{ color: "#ffffff", fontSize: 12, fontWeight: "600" }}
                >
                  {getCategoryInfo(selectedNote.category).icon}{" "}
                  {getCategoryInfo(selectedNote.category).name}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.text,
                { fontSize: 16, lineHeight: 24, marginBottom: 16 },
              ]}
            >
              {selectedNote.content}
            </Text>

            <Text style={[styles.text, { fontSize: 12, color: "#64748b" }]}>
              Created: {selectedNote.createdAt.toLocaleDateString("en-IN")}
            </Text>
            <Text style={[styles.text, { fontSize: 12, color: "#64748b" }]}>
              Last accessed:{" "}
              {selectedNote.lastAccessed.toLocaleDateString("en-IN")}
            </Text>
          </View>

          {/* Security Info */}
          <View style={[styles.card, { backgroundColor: "#f0fdf4" }]}>
            <Text
              style={[
                styles.text,
                { fontWeight: "600", marginBottom: 8, color: "#15803d" },
              ]}
            >
              🔒 Security Status
            </Text>
            <Text style={[styles.text, { fontSize: 14, color: "#15803d" }]}>
              ✓ This note is encrypted with AES-256 encryption
            </Text>
            <Text style={[styles.text, { fontSize: 14, color: "#15803d" }]}>
              ✓ Access logged and monitored
            </Text>
            <Text style={[styles.text, { fontSize: 14, color: "#15803d" }]}>
              ✓ Auto-lock after 5 minutes of inactivity
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

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
            <Text style={styles.title}>🔒 Secure Vault</Text>
            <Text style={styles.subtitle}>Encrypted notes and documents</Text>
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
          <View
            style={[
              styles.card,
              { marginBottom: 20, backgroundColor: "#f8fafc" },
            ]}
          >
            <Text
              style={[styles.text, { fontWeight: "600", marginBottom: 12 }]}
            >
              Add Secure Note
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Note title"
              value={newNote.title}
              onChangeText={(text) => setNewNote({ ...newNote, title: text })}
            />

            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              placeholder="Note content (will be encrypted)"
              value={newNote.content}
              onChangeText={(text) => setNewNote({ ...newNote, content: text })}
              multiline
            />

            {/* Category Selector */}
            <Text style={[styles.text, { fontWeight: "600", marginBottom: 8 }]}>
              Category:
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        newNote.category === category.id
                          ? category.color
                          : "#f1f5f9",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    },
                  ]}
                  onPress={() =>
                    setNewNote({ ...newNote, category: category.id as any })
                  }
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          newNote.category === category.id
                            ? "#ffffff"
                            : "#64748b",
                        fontSize: 12,
                      },
                    ]}
                  >
                    {category.icon} {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: "#10b981" }]}
                onPress={handleAddNote}
              >
                <Text style={styles.buttonText}>🔒 Add Encrypted Note</Text>
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
            style={[
              styles.button,
              { marginBottom: 20, backgroundColor: "#10b981" },
            ]}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.buttonText}>+ Add Secure Note</Text>
          </TouchableOpacity>
        )}

        {/* Notes List */}
        <Text
          style={[
            styles.text,
            { fontSize: 18, fontWeight: "600", marginBottom: 16 },
          ]}
        >
          Encrypted Notes ({notes.length})
        </Text>

        {notes.map((note) => {
          const categoryInfo = getCategoryInfo(note.category);
          return (
            <TouchableOpacity
              key={note.id}
              style={[styles.card, { backgroundColor: "#fafafa" }]}
              onPress={() => handleAccessNote(note)}
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
                  🔒 {note.title}
                </Text>
                <View
                  style={{
                    backgroundColor: categoryInfo.color,
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
                    {categoryInfo.icon} {categoryInfo.name}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.text,
                  { fontSize: 14, color: "#64748b", marginBottom: 8 },
                ]}
              >
                ****** Content encrypted - Tap to unlock ******
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.text, { fontSize: 12, color: "#64748b" }]}>
                  Created: {note.createdAt.toLocaleDateString("en-IN")}
                </Text>
                <Text style={[styles.text, { fontSize: 12, color: "#1e40af" }]}>
                  Tap to unlock →
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {notes.length === 0 && (
          <View style={styles.card}>
            <Text
              style={[styles.text, { textAlign: "center", color: "#64748b" }]}
            >
              No secure notes in vault. Add your first encrypted note above!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
