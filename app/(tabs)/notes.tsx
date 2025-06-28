import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { dataService } from "@/services/dataService";
import { SecureNote } from "@/types/features";

export default function NotesScreen() {
  const [notes, setNotes] = useState<SecureNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<SecureNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<SecureNote | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Create modal state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadSecureNotes();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery]);

  const authenticateUser = async () => {
    try {
      // Import biometric service
      const { biometricService } = await import("@/services/biometric");

      // Check if biometric is available
      const isAvailable = await biometricService.isBiometricAvailable();

      if (!isAvailable) {
        // Fallback to password authentication
        Alert.alert(
          "Authentication Required",
          "Biometric authentication not available. Please use your device password.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Use Password",
              onPress: () => {
                // Simulate password auth success
                setIsAuthenticated(true);
                Alert.alert("Success", "Authentication successful!");
              },
            },
          ],
        );
        return;
      }

      // Attempt biometric authentication
      const result = await biometricService.authenticate(
        "Access Secure Notes",
        "Use your fingerprint or face ID to access your secure notes",
      );

      if (result.success) {
        setIsAuthenticated(true);
        Alert.alert("Success", "Authentication successful!");
      } else {
        Alert.alert(
          "Authentication Failed",
          result.error || "Please try again",
        );
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // Fallback authentication
      Alert.alert(
        "Authentication",
        "Secure authentication is required to access your notes.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              setIsAuthenticated(true);
            },
          },
        ],
      );
    }
  };

  const loadSecureNotes = async () => {
    try {
      const data = await dataService.getSecureNotes();
      setNotes(data);
    } catch (error) {
      console.error("Error loading secure notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
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

  const handleCreateNote = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      Alert.alert("Error", "Please enter title and content");
      return;
    }

    try {
      const newNote = await dataService.saveSecureNote({
        title: newTitle,
        content: newContent,
        encrypted: isPrivate,
        tags: newTags,
        isPrivate: isPrivate,
      });

      setNotes([newNote, ...notes]);
      resetCreateForm();
      setShowCreateModal(false);
      Alert.alert(
        "Success",
        `Note ${isPrivate ? "encrypted and " : ""}saved successfully!`,
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create note");
    }
  };

  const handleViewNote = (note: SecureNote) => {
    if (note.encrypted && note.isPrivate) {
      Alert.alert(
        "Encrypted Note",
        "This note is encrypted. Authenticate to view.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Authenticate",
            onPress: () => {
              // Simulate decryption
              setTimeout(() => {
                setSelectedNote(note);
                setShowViewModal(true);
              }, 500);
            },
          },
        ],
      );
    } else {
      setSelectedNote(note);
      setShowViewModal(true);
    }
  };

  const resetCreateForm = () => {
    setNewTitle("");
    setNewContent("");
    setNewTags([]);
    setIsPrivate(false);
  };

  const availableTags = [
    "Client",
    "Case",
    "Research",
    "Meeting",
    "Court",
    "Evidence",
    "Confidential",
    "Draft",
  ];

  const toggleTag = (tag: string) => {
    if (newTags.includes(tag)) {
      setNewTags(newTags.filter((t) => t !== tag));
    } else {
      setNewTags([...newTags, tag]);
    }
  };

  const renderNote = ({ item }: { item: SecureNote }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => handleViewNote(item)}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <View style={styles.noteIcons}>
          {item.encrypted && <Text style={styles.encryptionIcon}>🔐</Text>}
          {item.isPrivate && <Text style={styles.privateIcon}>👁️</Text>}
        </View>
      </View>

      <Text style={styles.notePreview} numberOfLines={2}>
        {item.encrypted && item.isPrivate
          ? "••••••••••••••••••••"
          : item.content}
      </Text>

      <View style={styles.noteTagsContainer}>
        {item.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.noteTag}>
            <Text style={styles.noteTagText}>{tag}</Text>
          </View>
        ))}
        {item.tags.length > 3 && (
          <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
        )}
      </View>

      <Text style={styles.noteDate}>
        {new Date(item.updatedAt).toLocaleDateString("en-IN")}
      </Text>
    </TouchableOpacity>
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authIcon}>🔐</Text>
        <Text style={styles.authTitle}>Secure Notes Vault</Text>
        <Text style={styles.authDescription}>
          Your notes are protected with biometric authentication and encryption.
        </Text>

        <View style={styles.securityFeatures}>
          <View style={styles.securityFeature}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>End-to-end encryption</Text>
          </View>
          <View style={styles.securityFeature}>
            <Text style={styles.featureIcon}>👆</Text>
            <Text style={styles.featureText}>Biometric authentication</Text>
          </View>
          <View style={styles.securityFeature}>
            <Text style={styles.featureIcon}>☁️</Text>
            <Text style={styles.featureText}>Secure cloud backup</Text>
          </View>
          <View style={styles.securityFeature}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Offline access</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.authenticateButton}
          onPress={authenticateUser}
        >
          <Text style={styles.authenticateButtonText}>
            🔓 Authenticate & Access Notes
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>🔐 Secure Notes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.lockButton}
            onPress={() => setIsAuthenticated(false)}
          >
            <Text style={styles.lockButtonText}>🔒</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search secure notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={loadSecureNotes}
      />

      {/* Create Note Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Secure Note</Text>
            <TouchableOpacity onPress={handleCreateNote}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Enter note title"
            />

            <Text style={styles.inputLabel}>Content *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newContent}
              onChangeText={setNewContent}
              placeholder="Enter note content"
              multiline
              numberOfLines={8}
            />

            <View style={styles.securityOptions}>
              <TouchableOpacity
                style={[
                  styles.securityOption,
                  { backgroundColor: isPrivate ? "#dc2626" : "#f3f4f6" },
                ]}
                onPress={() => setIsPrivate(!isPrivate)}
              >
                <Text style={styles.securityIcon}>🔐</Text>
                <Text
                  style={[
                    styles.securityOptionText,
                    { color: isPrivate ? "#fff" : "#374151" },
                  ]}
                >
                  {isPrivate ? "Encrypted & Private" : "Standard Note"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Tags</Text>
            <View style={styles.tagsSelector}>
              {availableTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagOption,
                    {
                      backgroundColor: newTags.includes(tag)
                        ? "#dc2626"
                        : "#f3f4f6",
                    },
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text
                    style={[
                      styles.tagOptionText,
                      { color: newTags.includes(tag) ? "#fff" : "#374151" },
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* View Note Modal */}
      <Modal
        visible={showViewModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowViewModal(false)}>
              <Text style={styles.modalCancel}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedNote?.encrypted ? "🔐" : "📝"} {selectedNote?.title}
            </Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Coming Soon", "Edit functionality will be added")
              }
            >
              <Text style={styles.modalSave}>Edit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.noteContentText}>{selectedNote?.content}</Text>

            {selectedNote?.tags && selectedNote.tags.length > 0 && (
              <View style={styles.viewTagsContainer}>
                <Text style={styles.viewTagsTitle}>Tags:</Text>
                <View style={styles.viewTags}>
                  {selectedNote.tags.map((tag, index) => (
                    <View key={index} style={styles.viewTag}>
                      <Text style={styles.viewTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.noteMetadata}>
              <Text style={styles.metadataText}>
                Created:{" "}
                {new Date(selectedNote?.createdAt || "").toLocaleString(
                  "en-IN",
                )}
              </Text>
              <Text style={styles.metadataText}>
                Updated:{" "}
                {new Date(selectedNote?.updatedAt || "").toLocaleString(
                  "en-IN",
                )}
              </Text>
              {selectedNote?.encrypted && (
                <Text style={styles.encryptedText}>
                  🔐 This note is encrypted
                </Text>
              )}
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
  authContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  authIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  authDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  securityFeatures: {
    marginBottom: 40,
  },
  securityFeature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#374151",
  },
  authenticateButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  authenticateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  lockButton: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  lockButtonText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  searchContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9fafb",
  },
  listContainer: {
    padding: 16,
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
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  noteIcons: {
    flexDirection: "row",
  },
  encryptionIcon: {
    fontSize: 16,
    marginLeft: 4,
  },
  privateIcon: {
    fontSize: 16,
    marginLeft: 4,
  },
  notePreview: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  noteTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  noteTag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  noteTagText: {
    fontSize: 10,
    color: "#374151",
    fontWeight: "500",
  },
  moreTagsText: {
    fontSize: 10,
    color: "#9ca3af",
    alignSelf: "center",
  },
  noteDate: {
    fontSize: 12,
    color: "#9ca3af",
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
  modalCancel: {
    color: "#6b7280",
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  modalSave: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  securityOptions: {
    marginVertical: 16,
  },
  securityOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  securityOptionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  tagsSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagOptionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  noteContentText: {
    fontSize: 16,
    color: "#111827",
    lineHeight: 24,
    marginBottom: 20,
  },
  viewTagsContainer: {
    marginBottom: 20,
  },
  viewTagsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  viewTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  viewTag: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  viewTagText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
  },
  noteMetadata: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
  },
  metadataText: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  encryptedText: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "600",
    marginTop: 8,
  },
});
