import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SecureNote } from "@/types";

interface SecureNotesVaultProps {
  style?: any;
}

const VAULT_KEY = "secure_notes_vault";
const PRIORITIES = [
  { id: "low", label: "Low", color: "#10B981", icon: "chevron-down" },
  { id: "medium", label: "Medium", color: "#F59E0B", icon: "remove" },
  { id: "high", label: "High", color: "#EF4444", icon: "chevron-up" },
] as const;

export function SecureNotesVault({ style }: SecureNotesVaultProps) {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState<SecureNote[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<SecureNote | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    caseId: "",
    priority: "medium" as SecureNote["priority"],
    tags: "",
  });

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotes();
    }
  }, [isAuthenticated]);

  const checkBiometricSupport = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (!hasHardware || supportedTypes.length === 0) {
        // Fallback to simple authentication for demo
        Alert.alert(
          "Biometric Authentication",
          "Biometric authentication is not available on this device. Using demo mode.",
          [
            {
              text: "Continue",
              onPress: () => {
                setIsAuthenticated(true);
                setShowAuth(false);
              },
            },
          ],
        );
        return;
      }

      authenticateUser();
    } catch (error) {
      console.error("Biometric check error:", error);
      setIsAuthenticated(true);
      setShowAuth(false);
    }
  };

  const authenticateUser = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access Secure Notes Vault",
        cancelLabel: "Cancel",
        fallbackLabel: "Use PIN",
      });

      if (result.success) {
        setIsAuthenticated(true);
        setShowAuth(false);
      } else {
        Alert.alert("Authentication Failed", "Please try again.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      Alert.alert("Error", "Authentication failed. Please try again.");
    }
  };

  const loadNotes = async () => {
    try {
      const encryptedData = await SecureStore.getItemAsync(VAULT_KEY);
      if (encryptedData) {
        const parsedNotes = JSON.parse(encryptedData).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
          lastAccessedAt: new Date(note.lastAccessedAt),
        }));
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error("Error loading secure notes:", error);
      Alert.alert("Error", "Failed to load secure notes.");
    }
  };

  const saveNotes = async (newNotes: SecureNote[]) => {
    try {
      await SecureStore.setItemAsync(VAULT_KEY, JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (error) {
      console.error("Error saving secure notes:", error);
      Alert.alert("Error", "Failed to save secure notes.");
    }
  };

  const addNote = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      Alert.alert("Error", "Title and content are required");
      return;
    }

    const newNote: SecureNote = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      caseId: formData.caseId.trim() || undefined,
      priority: formData.priority,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isEncrypted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: new Date(),
    };

    const newNotes = [newNote, ...notes];
    await saveNotes(newNotes);
    resetForm();
    setShowModal(false);
  };

  const updateNote = async () => {
    if (!editingNote || !formData.title.trim() || !formData.content.trim()) {
      Alert.alert("Error", "Title and content are required");
      return;
    }

    const updatedNote: SecureNote = {
      ...editingNote,
      title: formData.title.trim(),
      content: formData.content.trim(),
      caseId: formData.caseId.trim() || undefined,
      priority: formData.priority,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      updatedAt: new Date(),
      lastAccessedAt: new Date(),
    };

    const newNotes = notes.map((note) =>
      note.id === editingNote.id ? updatedNote : note,
    );
    await saveNotes(newNotes);
    resetForm();
    setEditingNote(null);
    setShowModal(false);
  };

  const deleteNote = (id: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to permanently delete this secure note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const newNotes = notes.filter((note) => note.id !== id);
            await saveNotes(newNotes);
          },
        },
      ],
    );
  };

  const editNote = (note: SecureNote) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      caseId: note.caseId || "",
      priority: note.priority,
      tags: note.tags.join(", "),
    });
    setShowModal(true);

    // Update last accessed time
    const updatedNote = { ...note, lastAccessedAt: new Date() };
    const newNotes = notes.map((n) => (n.id === note.id ? updatedNote : n));
    saveNotes(newNotes);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      caseId: "",
      priority: "medium",
      tags: "",
    });
  };

  const openModal = () => {
    resetForm();
    setEditingNote(null);
    setShowModal(true);
  };

  const lockVault = () => {
    Alert.alert(
      "Lock Vault",
      "Are you sure you want to lock the secure vault?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Lock",
          onPress: () => {
            setIsAuthenticated(false);
            setShowAuth(true);
          },
        },
      ],
    );
  };

  const getPriorityConfig = (priority: SecureNote["priority"]) => {
    return PRIORITIES.find((p) => p.id === priority) || PRIORITIES[1];
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesPriority =
      !selectedPriority || note.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  // Authentication Screen
  if (showAuth || !isAuthenticated) {
    return (
      <View
        style={[styles.authContainer, { backgroundColor: theme.background }]}
      >
        <View style={styles.authContent}>
          <Ionicons
            name="shield-checkmark"
            size={80}
            color={theme.primary}
            style={styles.authIcon}
          />
          <Text style={[styles.authTitle, { color: theme.text }]}>
            Secure Notes Vault
          </Text>
          <Text
            style={[styles.authDescription, { color: theme.textSecondary }]}
          >
            Your private legal notes are protected with biometric authentication
          </Text>

          <TouchableOpacity
            style={[
              styles.authButton,
              { backgroundColor: theme.primary },
              Shadows.md,
            ]}
            onPress={authenticateUser}
          >
            <Ionicons name="finger-print" size={24} color="white" />
            <Text style={styles.authButtonText}>Authenticate</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleContainer}>
            <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
            <Text style={[styles.title, { color: theme.text }]}>
              Secure Vault
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {notes.length} encrypted notes
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.surface },
              Shadows.sm,
            ]}
            onPress={lockVault}
          >
            <Ionicons
              name="lock-closed"
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: theme.primary },
              Shadows.sm,
            ]}
            onPress={openModal}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInput,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchText, { color: theme.text }]}
            placeholder="Search notes..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: !selectedPriority
                  ? theme.primary
                  : theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setSelectedPriority(null)}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color: !selectedPriority ? "white" : theme.text,
                },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {PRIORITIES.map((priority) => (
            <TouchableOpacity
              key={priority.id}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    selectedPriority === priority.id
                      ? priority.color
                      : theme.surface,
                  borderColor: priority.color,
                },
              ]}
              onPress={() =>
                setSelectedPriority(
                  selectedPriority === priority.id ? null : priority.id,
                )
              }
            >
              <Ionicons
                name={priority.icon as any}
                size={16}
                color={
                  selectedPriority === priority.id ? "white" : priority.color
                }
              />
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color:
                      selectedPriority === priority.id
                        ? "white"
                        : priority.color,
                  },
                ]}
              >
                {priority.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notesContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 100)}
            exiting={FadeOutUp}
            layout={Layout.springify()}
          >
            <TouchableOpacity
              style={styles.noteItem}
              onPress={() => editNote(item)}
              activeOpacity={0.8}
            >
              <Card style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <View style={styles.noteHeaderLeft}>
                    <View
                      style={[
                        styles.priorityIndicator,
                        {
                          backgroundColor: getPriorityConfig(item.priority)
                            .color,
                        },
                      ]}
                    >
                      <Ionicons
                        name={getPriorityConfig(item.priority).icon as any}
                        size={12}
                        color="white"
                      />
                    </View>

                    <View style={styles.noteTitleContainer}>
                      <Text
                        style={[styles.noteTitle, { color: theme.text }]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      {item.caseId && (
                        <Text
                          style={[
                            styles.noteCaseId,
                            { color: theme.textTertiary },
                          ]}
                          numberOfLines={1}
                        >
                          Case: {item.caseId}
                        </Text>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => {
                      Alert.alert("Options", "", [
                        { text: "Edit", onPress: () => editNote(item) },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => deleteNote(item.id),
                        },
                        { text: "Cancel", style: "cancel" },
                      ]);
                    }}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={16}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[styles.noteContent, { color: theme.textSecondary }]}
                  numberOfLines={3}
                >
                  {item.content}
                </Text>

                {item.tags.length > 0 && (
                  <View style={styles.tagContainer}>
                    {item.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Text
                        key={tagIndex}
                        style={[
                          styles.tag,
                          {
                            backgroundColor: theme.backgroundTertiary,
                            color: theme.textSecondary,
                          },
                        ]}
                      >
                        {tag}
                      </Text>
                    ))}
                    {item.tags.length > 3 && (
                      <Text
                        style={[styles.tagMore, { color: theme.textTertiary }]}
                      >
                        +{item.tags.length - 3}
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.noteFooter}>
                  <Text
                    style={[styles.noteDate, { color: theme.textTertiary }]}
                  >
                    Updated: {item.updatedAt.toLocaleDateString()}
                  </Text>
                  <View style={styles.encryptionBadge}>
                    <Ionicons
                      name="lock-closed"
                      size={12}
                      color={theme.success}
                    />
                    <Text
                      style={[styles.encryptionText, { color: theme.success }]}
                    >
                      Encrypted
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="document-lock"
              size={48}
              color={theme.textTertiary}
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No secure notes yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
              Your encrypted notes will appear here
            </Text>
          </View>
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: theme.border }]}
          >
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text
                style={[styles.modalButton, { color: theme.textSecondary }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editingNote ? "Edit Secure Note" : "New Secure Note"}
            </Text>
            <TouchableOpacity onPress={editingNote ? updateNote : addNote}>
              <Text style={[styles.modalButton, { color: theme.primary }]}>
                {editingNote ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Title Input */}
            <Text style={[styles.label, { color: theme.text }]}>Title *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Enter note title..."
              placeholderTextColor={theme.textTertiary}
              maxLength={100}
            />

            {/* Content Input */}
            <Text style={[styles.label, { color: theme.text }]}>Content *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={formData.content}
              onChangeText={(text) =>
                setFormData({ ...formData, content: text })
              }
              placeholder="Enter your secure note content..."
              placeholderTextColor={theme.textTertiary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            {/* Case ID Input */}
            <Text style={[styles.label, { color: theme.text }]}>
              Case ID (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={formData.caseId}
              onChangeText={(text) =>
                setFormData({ ...formData, caseId: text })
              }
              placeholder="Link to specific case..."
              placeholderTextColor={theme.textTertiary}
            />

            {/* Priority Selection */}
            <Text style={[styles.label, { color: theme.text }]}>Priority</Text>
            <View style={styles.priorityContainer}>
              {PRIORITIES.map((priority) => (
                <TouchableOpacity
                  key={priority.id}
                  style={[
                    styles.priorityButton,
                    {
                      backgroundColor:
                        formData.priority === priority.id
                          ? priority.color
                          : theme.surface,
                      borderColor: priority.color,
                    },
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, priority: priority.id })
                  }
                >
                  <Ionicons
                    name={priority.icon as any}
                    size={16}
                    color={
                      formData.priority === priority.id
                        ? "white"
                        : priority.color
                    }
                  />
                  <Text
                    style={[
                      styles.priorityButtonText,
                      {
                        color:
                          formData.priority === priority.id
                            ? "white"
                            : priority.color,
                      },
                    ]}
                  >
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tags Input */}
            <Text style={[styles.label, { color: theme.text }]}>
              Tags (comma separated)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={formData.tags}
              onChangeText={(text) => setFormData({ ...formData, tags: text })}
              placeholder="e.g. confidential, strategy, evidence"
              placeholderTextColor={theme.textTertiary}
            />

            {/* Encryption Notice */}
            <View style={styles.encryptionNotice}>
              <Ionicons
                name="information-circle"
                size={16}
                color={theme.info}
              />
              <Text
                style={[
                  styles.encryptionNoticeText,
                  { color: theme.textSecondary },
                ]}
              >
                This note will be encrypted and stored securely on your device
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  authContent: {
    alignItems: "center",
    maxWidth: 300,
  },
  authIcon: {
    marginBottom: Spacing.xl,
  },
  authTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  authDescription: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  authButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: "white",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  searchText: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  filtersContainer: {
    gap: Spacing.xs,
    paddingRight: Spacing.md,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  filterButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  notesContainer: {
    padding: Spacing.md,
  },
  noteItem: {
    marginBottom: Spacing.md,
  },
  noteCard: {
    padding: Spacing.md,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  noteHeaderLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: Spacing.sm,
  },
  priorityIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  noteTitleContainer: {
    flex: 1,
  },
  noteTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  noteCaseId: {
    fontSize: FontSizes.xs,
    fontStyle: "italic",
  },
  menuButton: {
    padding: Spacing.xs,
  },
  noteContent: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    fontSize: FontSizes.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  tagMore: {
    fontSize: FontSizes.xs,
  },
  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteDate: {
    fontSize: FontSizes.xs,
  },
  encryptionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  encryptionText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
  },
  emptyIcon: {
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  modalButton: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
  },
  textArea: {
    height: 120,
  },
  priorityContainer: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  priorityButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  priorityButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  encryptionNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.xs,
    marginTop: Spacing.md,
    padding: Spacing.sm,
  },
  encryptionNoticeText: {
    fontSize: FontSizes.sm,
    flex: 1,
    lineHeight: 18,
  },
});
