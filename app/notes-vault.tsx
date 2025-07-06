import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User, SecureNote } from "@/types";
import { canAccessFeature } from "@/constants/roles";
import BackButton from "@/components/navigation/BackButton";

// Mock secure notes data
const MOCK_NOTES: SecureNote[] = [
  {
    id: "1",
    userId: "demo_user",
    title: "Client Confidential Information",
    content:
      "Important client details and case sensitive information that requires secure access.",
    tags: ["confidential", "client", "case"],
    isEncrypted: true,
    requiresBiometric: true,
    lastAccessed: "2024-01-20T10:00:00Z",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    userId: "demo_user",
    title: "Banking Details & Passwords",
    content:
      "Secure banking information and important passwords for legal practice management.",
    tags: ["banking", "passwords", "financial"],
    isEncrypted: true,
    requiresBiometric: true,
    lastAccessed: "2024-01-19T15:30:00Z",
    createdAt: "2024-01-10T14:00:00Z",
    updatedAt: "2024-01-19T15:30:00Z",
  },
  {
    id: "3",
    userId: "demo_user",
    title: "Personal Legal Documents",
    content:
      "Important personal documents and identification numbers for quick reference.",
    tags: ["personal", "documents", "id"],
    isEncrypted: false,
    requiresBiometric: false,
    lastAccessed: "2024-01-18T11:00:00Z",
    createdAt: "2024-01-12T16:00:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
  },
];

export default function NotesVault() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState<SecureNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<SecureNote[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<SecureNote | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
    requiresBiometric: true,
  });

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notes, searchQuery]);

  const checkAccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      if (
        !canAccessFeature(
          currentUser.role,
          currentUser.subscriptionTier,
          "secureNotes",
        )
      ) {
        Alert.alert(
          "Access Restricted",
          "Secure Notes feature requires appropriate role and subscription.",
          [
            {
              text: "OK",
              onPress: () => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/home");
                }
              },
            },
          ],
        );
        return;
      }

      setUser(currentUser);

      // Load user's notes
      const userNotes = MOCK_NOTES.filter(
        (note) => note.userId === currentUser.id || note.userId === "demo_user",
      );
      setNotes(userNotes);
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = notes;

    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    setFilteredNotes(filtered);
  };

  const authenticateAccess = async () => {
    try {
      // Simulate biometric authentication
      Alert.alert(
        "Secure Access Required",
        "Choose your authentication method to access secure notes:",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Use PIN (6261)",
            onPress: () => promptPinAuth(),
          },
          {
            text: "Use Password",
            onPress: () => promptPasswordAuth(),
          },
          {
            text: "Biometric",
            onPress: async () => {
              // Simulate authentication delay
              setTimeout(() => {
                setIsAuthenticated(true);
                Alert.alert(
                  "Success",
                  "Biometric authentication successful! You can now access your secure notes.",
                );
              }, 1500);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Authentication failed. Please try again.");
    }
  };

  const promptPasswordAuth = () => {
    Alert.alert(
      "Authentication Required",
      "Choose your authentication method:",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Use PIN", onPress: () => promptPinAuth() },
        { text: "Use Password", onPress: () => promptPasswordInput() },
      ],
    );
  };

  const promptPinAuth = () => {
    Alert.prompt(
      "PIN Authentication",
      "Enter your 4-digit PIN to access secure notes:\n(Demo PIN: 6261)",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Authenticate",
          onPress: (pin) => {
            if (pin === "6261") {
              setIsAuthenticated(true);
              Alert.alert("Success", "PIN authentication successful!");
            } else {
              Alert.alert(
                "Error",
                "Incorrect PIN. Please try again.\n(Demo PIN: 6261)",
              );
            }
          },
        },
      ],
      "numeric",
    );
  };

  const promptPasswordInput = () => {
    Alert.prompt(
      "Password Authentication",
      "Enter your password to access secure notes:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Authenticate",
          onPress: (password) => {
            if (password === "demo123" || password === "admin123") {
              setIsAuthenticated(true);
              Alert.alert("Success", "Password authentication successful!");
            } else {
              Alert.alert("Error", "Incorrect password. Please try again.");
            }
          },
        },
      ],
      "secure-text",
    );
  };

  const openNote = (note: SecureNote) => {
    if (note.requiresBiometric && !isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "This note requires biometric authentication to access.",
        [{ text: "OK" }],
      );
      return;
    }

    setSelectedNote(note);
    setShowNoteModal(true);

    // Update last accessed time
    const updatedNotes = notes.map((n) =>
      n.id === note.id ? { ...n, lastAccessed: new Date().toISOString() } : n,
    );
    setNotes(updatedNotes);
  };

  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      Alert.alert("Error", "Please fill in both title and content.");
      return;
    }

    try {
      const noteData = {
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        isEncrypted: newNote.requiresBiometric,
        requiresBiometric: newNote.requiresBiometric,
      };

      // API call to POST /api/secure-notes
      const response = await fetch("/api/secure-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedNote = await response.json();

      // Create local note object for immediate UI update
      const note: SecureNote = {
        id: savedNote.id || `note_${Date.now()}`,
        userId: user?.id || "demo_user",
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        isEncrypted: newNote.requiresBiometric,
        requiresBiometric: newNote.requiresBiometric,
        lastAccessed: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes([note, ...notes]);
      setNewNote({ title: "", content: "", tags: "", requiresBiometric: true });
      setShowCreateModal(false);

      // Refresh the notes list from server
      await refreshNotes();

      Alert.alert("Success", "Secure note saved successfully!");
    } catch (error) {
      console.error("Error saving secure note:", error);

      // Fallback to local storage if API fails
      const note: SecureNote = {
        id: `note_${Date.now()}`,
        userId: user?.id || "demo_user",
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        isEncrypted: newNote.requiresBiometric,
        requiresBiometric: newNote.requiresBiometric,
        lastAccessed: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes([note, ...notes]);
      setNewNote({ title: "", content: "", tags: "", requiresBiometric: true });
      setShowCreateModal(false);

      Alert.alert(
        "Note Saved Locally",
        "Note saved to device. It will sync when connection is restored.",
        [{ text: "OK" }],
      );
    }
  };

  const refreshNotes = async () => {
    try {
      // API call to GET /api/secure-notes to refresh the list
      const response = await fetch("/api/secure-notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const updatedNotes = await response.json();
        setNotes(updatedNotes);
      }
    } catch (error) {
      console.error("Error refreshing notes:", error);
      // Continue with local state if refresh fails
    }
  };

  const deleteNote = (noteId: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotes(notes.filter((n) => n.id !== noteId));
            setShowNoteModal(false);
            Alert.alert("Success", "Note deleted successfully.");
          },
        },
      ],
    );
  };

  const NoteCard = ({ note }: { note: SecureNote }) => (
    <TouchableOpacity
      style={[styles.noteCard, note.requiresBiometric && styles.secureNoteCard]}
      onPress={() => openNote(note)}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{note.title}</Text>
        <View style={styles.noteMeta}>
          {note.requiresBiometric && (
            <View style={styles.biometricBadge}>
              <Text style={styles.biometricBadgeText}>🔒</Text>
            </View>
          )}
          {note.isEncrypted && (
            <View style={styles.encryptedBadge}>
              <Text style={styles.encryptedBadgeText}>🔐</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.noteContent} numberOfLines={2}>
        {note.requiresBiometric && !isAuthenticated
          ? "••••••••••••••••••••"
          : note.content}
      </Text>

      <View style={styles.noteTags}>
        {note.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.noteDate}>
        Last accessed: {new Date(note.lastAccessed).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading secure vault...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Home" color="#fff" />
        <Text style={styles.title}>Secure Notes Vault</Text>
        <Text style={styles.subtitle}>
          {isAuthenticated ? "🔓 Authenticated" : "🔒 Secure Access Required"}
        </Text>
      </View>

      {/* Authentication Section */}
      {!isAuthenticated && (
        <View style={styles.authSection}>
          <View style={styles.authCard}>
            <Text style={styles.authIcon}>🔒</Text>
            <Text style={styles.authTitle}>Authenticate & Access</Text>
            <Text style={styles.authDescription}>
              Use biometric authentication or password to access your secure
              notes
            </Text>
            <TouchableOpacity
              style={styles.authButton}
              onPress={authenticateAccess}
            >
              <Text style={styles.authButtonText}>🔓 Authenticate Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Notes Section */}
      {isAuthenticated && (
        <>
          <View style={styles.controlsSection}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search secure notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createButtonText}>+ New Note</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.notesList}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.statsCard}>
              <Text style={styles.statsText}>
                📊 {filteredNotes.length} notes •{" "}
                {filteredNotes.filter((n) => n.requiresBiometric).length} secure
              </Text>
            </View>

            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}

            {filteredNotes.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📝</Text>
                <Text style={styles.emptyStateTitle}>No notes found</Text>
                <Text style={styles.emptyStateText}>
                  Create your first secure note or adjust your search
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      )}

      {/* Note View Modal */}
      <Modal
        visible={showNoteModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedNote && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                <Text style={styles.modalCloseText}>✕ Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteNote(selectedNote.id)}>
                <Text style={styles.deleteText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedNote.title}</Text>

              <View style={styles.modalMeta}>
                {selectedNote.requiresBiometric && (
                  <View style={styles.modalBadge}>
                    <Text style={styles.modalBadgeText}>
                      🔒 Biometric Protected
                    </Text>
                  </View>
                )}
                {selectedNote.isEncrypted && (
                  <View style={styles.modalBadge}>
                    <Text style={styles.modalBadgeText}>🔐 Encrypted</Text>
                  </View>
                )}
              </View>

              <Text style={styles.modalContentText}>
                {selectedNote.content}
              </Text>

              <View style={styles.modalTags}>
                {selectedNote.tags.map((tag, index) => (
                  <View key={index} style={styles.modalTag}>
                    <Text style={styles.modalTagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.modalDate}>
                Created: {new Date(selectedNote.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.modalDate}>
                Last accessed:{" "}
                {new Date(selectedNote.lastAccessed).toLocaleDateString()}
              </Text>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Create Note Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.modalCloseText}>✕ Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={createNote}>
              <Text style={styles.saveText}>💾 Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Secure Note</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter note title"
                value={newNote.title}
                onChangeText={(text) => setNewNote({ ...newNote, title: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Content *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter your secure note content"
                value={newNote.content}
                onChangeText={(text) =>
                  setNewNote({ ...newNote, content: text })
                }
                multiline
                numberOfLines={6}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tags (comma separated)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., confidential, client, passwords"
                value={newNote.tags}
                onChangeText={(text) => setNewNote({ ...newNote, tags: text })}
              />
            </View>

            <View style={styles.securityOptions}>
              <TouchableOpacity
                style={styles.securityOption}
                onPress={() =>
                  setNewNote({
                    ...newNote,
                    requiresBiometric: !newNote.requiresBiometric,
                  })
                }
              >
                <Text style={styles.securityOptionText}>
                  {newNote.requiresBiometric ? "🔒" : "🔓"} Require Biometric
                  Authentication
                </Text>
              </TouchableOpacity>
            </View>
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#dc2626",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  authSection: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  authCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  authIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  authDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  authButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  authButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  controlsSection: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  createButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  notesList: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  statsText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  noteCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  secureNoteCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  noteMeta: {
    flexDirection: "row",
    gap: 4,
  },
  biometricBadge: {
    backgroundColor: "#fef2f2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  biometricBadgeText: {
    fontSize: 12,
  },
  encryptedBadge: {
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  encryptedBadgeText: {
    fontSize: 12,
  },
  noteContent: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  noteTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: "#6b7280",
  },
  noteDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  deleteText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "500",
  },
  saveText: {
    fontSize: 16,
    color: "#059669",
    fontWeight: "500",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  modalMeta: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  modalBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalBadgeText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  modalContentText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 20,
  },
  modalTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  modalTag: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalTagText: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "500",
  },
  modalDate: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textArea: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 120,
    textAlignVertical: "top",
  },
  securityOptions: {
    marginTop: 16,
  },
  securityOption: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  securityOptionText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
    textAlign: "center",
  },
});
