import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { ClientFolder, Case, Message, Document, UserRole } from "@/types";

interface ClientFolderViewProps {
  userRole: UserRole;
  style?: any;
}

const STORAGE_KEY = "client_folders";

const FOLDER_COLORS = [
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#84CC16", // Lime
];

const TAB_ITEMS = [
  { id: "cases", label: "Cases", icon: "briefcase" },
  { id: "messages", label: "Messages", icon: "mail" },
  { id: "documents", label: "Documents", icon: "document" },
  { id: "notes", label: "Notes", icon: "clipboard" },
] as const;

// Mock data
const MOCK_FOLDERS: ClientFolder[] = [
  {
    id: "1",
    clientName: "Rajesh Kumar",
    clientEmail: "rajesh@email.com",
    clientPhone: "+91 98765 43210",
    cases: [
      {
        id: "case1",
        title: "Property Dispute Case",
        clientName: "Rajesh Kumar",
        courtName: "Delhi High Court",
        judgeName: "Justice Sharma",
        caseNumber: "CS 123/2024",
        nextHearing: new Date("2024-02-15"),
        status: "ongoing",
        notes: "Property documentation review pending",
        documents: [],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
    ],
    totalValue: 500000,
    status: "active",
    createdAt: new Date("2024-01-01"),
    lastActivity: new Date("2024-01-15"),
    notes: "High-priority client. Regular follow-ups required.",
    color: FOLDER_COLORS[0],
  },
  {
    id: "2",
    clientName: "Priya Singh",
    clientEmail: "priya@email.com",
    clientPhone: "+91 87654 32109",
    cases: [
      {
        id: "case2",
        title: "Divorce Proceedings",
        clientName: "Priya Singh",
        courtName: "Family Court",
        judgeName: "Justice Mishra",
        caseNumber: "FC 456/2024",
        nextHearing: new Date("2024-02-20"),
        status: "ongoing",
        notes: "Custody arrangement discussions",
        documents: [],
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-20"),
      },
    ],
    totalValue: 200000,
    status: "active",
    createdAt: new Date("2024-01-10"),
    lastActivity: new Date("2024-01-20"),
    notes: "Sensitive case. Handle with confidentiality.",
    color: FOLDER_COLORS[1],
  },
];

export function ClientFolderView({ userRole, style }: ClientFolderViewProps) {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const [folders, setFolders] = useState<ClientFolder[]>(MOCK_FOLDERS);
  const [selectedFolder, setSelectedFolder] = useState<ClientFolder | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<
    "cases" | "messages" | "documents" | "notes"
  >("cases");
  const [showModal, setShowModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<ClientFolder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
    color: FOLDER_COLORS[0],
  });

  const canEdit = ["lawyer", "junior_lawyer", "lawyer_assistant"].includes(
    userRole,
  );

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedFolders = JSON.parse(stored).map((folder: any) => ({
          ...folder,
          cases: folder.cases.map((caseItem: any) => ({
            ...caseItem,
            nextHearing: new Date(caseItem.nextHearing),
            createdAt: new Date(caseItem.createdAt),
            updatedAt: new Date(caseItem.updatedAt),
          })),
          createdAt: new Date(folder.createdAt),
          lastActivity: new Date(folder.lastActivity),
        }));
        setFolders(parsedFolders);
      }
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const saveFolders = async (newFolders: ClientFolder[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFolders));
      setFolders(newFolders);
    } catch (error) {
      console.error("Error saving folders:", error);
    }
  };

  const addFolder = () => {
    if (!formData.clientName.trim()) {
      Alert.alert("Error", "Client name is required");
      return;
    }

    const newFolder: ClientFolder = {
      id: Date.now().toString(),
      clientName: formData.clientName.trim(),
      clientEmail: formData.clientEmail.trim(),
      clientPhone: formData.clientPhone.trim(),
      cases: [],
      totalValue: 0,
      status: "active",
      createdAt: new Date(),
      lastActivity: new Date(),
      notes: formData.notes.trim(),
      color: formData.color,
    };

    const newFolders = [newFolder, ...folders];
    saveFolders(newFolders);
    resetForm();
    setShowFolderModal(false);
  };

  const updateFolder = () => {
    if (!editingFolder || !formData.clientName.trim()) {
      Alert.alert("Error", "Client name is required");
      return;
    }

    const updatedFolder: ClientFolder = {
      ...editingFolder,
      clientName: formData.clientName.trim(),
      clientEmail: formData.clientEmail.trim(),
      clientPhone: formData.clientPhone.trim(),
      notes: formData.notes.trim(),
      color: formData.color,
      lastActivity: new Date(),
    };

    const newFolders = folders.map((folder) =>
      folder.id === editingFolder.id ? updatedFolder : folder,
    );
    saveFolders(newFolders);
    resetForm();
    setEditingFolder(null);
    setShowFolderModal(false);

    if (selectedFolder?.id === editingFolder.id) {
      setSelectedFolder(updatedFolder);
    }
  };

  const deleteFolder = (id: string) => {
    Alert.alert(
      "Delete Folder",
      "Are you sure you want to delete this client folder? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newFolders = folders.filter((folder) => folder.id !== id);
            saveFolders(newFolders);
            if (selectedFolder?.id === id) {
              setSelectedFolder(null);
            }
          },
        },
      ],
    );
  };

  const editFolder = (folder: ClientFolder) => {
    setEditingFolder(folder);
    setFormData({
      clientName: folder.clientName,
      clientEmail: folder.clientEmail,
      clientPhone: folder.clientPhone,
      notes: folder.notes,
      color: folder.color,
    });
    setShowFolderModal(true);
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: "",
      color: FOLDER_COLORS[0],
    });
  };

  const openFolderModal = () => {
    resetForm();
    setEditingFolder(null);
    setShowFolderModal(true);
  };

  const exportFolder = (folder: ClientFolder) => {
    Alert.alert(
      "Export Folder",
      `Export ${folder.clientName}'s folder as ZIP file?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
          onPress: () => {
            // Mock export functionality
            Alert.alert("Success", "Folder exported successfully!");
          },
        },
      ],
    );
  };

  const filteredFolders = folders.filter(
    (folder) =>
      folder.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderFolderCard = ({
    item: folder,
    index,
  }: {
    item: ClientFolder;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      exiting={FadeOutUp}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        style={styles.folderCard}
        onPress={() => setSelectedFolder(folder)}
        activeOpacity={0.8}
      >
        <Card
          style={[
            styles.folderCardContent,
            { borderLeftColor: folder.color, borderLeftWidth: 4 },
          ]}
        >
          <View style={styles.folderHeader}>
            <View style={styles.folderHeaderLeft}>
              <View
                style={[styles.folderIcon, { backgroundColor: folder.color }]}
              >
                <Ionicons name="folder" size={24} color="white" />
              </View>
              <View style={styles.folderInfo}>
                <Text
                  style={[styles.folderName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {folder.clientName}
                </Text>
                <Text
                  style={[styles.folderEmail, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  {folder.clientEmail}
                </Text>
              </View>
            </View>

            {canEdit && (
              <TouchableOpacity
                style={styles.folderMenuButton}
                onPress={() => {
                  Alert.alert("Options", "", [
                    { text: "Edit", onPress: () => editFolder(folder) },
                    { text: "Export", onPress: () => exportFolder(folder) },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => deleteFolder(folder.id),
                    },
                    { text: "Cancel", style: "cancel" },
                  ]);
                }}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.folderStats}>
            <View style={styles.statItem}>
              <Ionicons
                name="briefcase"
                size={16}
                color={theme.textSecondary}
              />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {folder.cases.length} cases
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="calendar" size={16} color={theme.textSecondary} />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {folder.lastActivity.toLocaleDateString()}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    folder.status === "active"
                      ? `${theme.success}20`
                      : `${theme.textTertiary}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      folder.status === "active"
                        ? theme.success
                        : theme.textTertiary,
                  },
                ]}
              >
                {folder.status}
              </Text>
            </View>
          </View>

          {folder.totalValue > 0 && (
            <Text style={[styles.folderValue, { color: theme.primary }]}>
              ₹{folder.totalValue.toLocaleString()}
            </Text>
          )}
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderTabContent = () => {
    if (!selectedFolder) return null;

    switch (activeTab) {
      case "cases":
        return (
          <View style={styles.tabContent}>
            {selectedFolder.cases.length === 0 ? (
              <View style={styles.emptyTabContent}>
                <Ionicons
                  name="briefcase"
                  size={48}
                  color={theme.textTertiary}
                />
                <Text
                  style={[styles.emptyTabText, { color: theme.textSecondary }]}
                >
                  No cases yet
                </Text>
              </View>
            ) : (
              selectedFolder.cases.map((caseItem) => (
                <Card key={caseItem.id} style={styles.caseCard}>
                  <View style={styles.caseHeader}>
                    <Text style={[styles.caseTitle, { color: theme.text }]}>
                      {caseItem.title}
                    </Text>
                    <View
                      style={[
                        styles.caseStatusBadge,
                        {
                          backgroundColor:
                            caseItem.status === "ongoing"
                              ? `${theme.warning}20`
                              : caseItem.status === "completed"
                                ? `${theme.success}20`
                                : `${theme.textTertiary}20`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.caseStatusText,
                          {
                            color:
                              caseItem.status === "ongoing"
                                ? theme.warning
                                : caseItem.status === "completed"
                                  ? theme.success
                                  : theme.textTertiary,
                          },
                        ]}
                      >
                        {caseItem.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.caseDetails}>
                    <View style={styles.caseDetailRow}>
                      <Text
                        style={[
                          styles.caseDetailLabel,
                          { color: theme.textTertiary },
                        ]}
                      >
                        Case No:
                      </Text>
                      <Text
                        style={[styles.caseDetailValue, { color: theme.text }]}
                      >
                        {caseItem.caseNumber}
                      </Text>
                    </View>

                    <View style={styles.caseDetailRow}>
                      <Text
                        style={[
                          styles.caseDetailLabel,
                          { color: theme.textTertiary },
                        ]}
                      >
                        Court:
                      </Text>
                      <Text
                        style={[styles.caseDetailValue, { color: theme.text }]}
                      >
                        {caseItem.courtName}
                      </Text>
                    </View>

                    <View style={styles.caseDetailRow}>
                      <Text
                        style={[
                          styles.caseDetailLabel,
                          { color: theme.textTertiary },
                        ]}
                      >
                        Next Hearing:
                      </Text>
                      <Text
                        style={[
                          styles.caseDetailValue,
                          { color: theme.primary },
                        ]}
                      >
                        {caseItem.nextHearing.toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  {caseItem.notes && (
                    <Text
                      style={[styles.caseNotes, { color: theme.textSecondary }]}
                    >
                      Notes: {caseItem.notes}
                    </Text>
                  )}
                </Card>
              ))
            )}
          </View>
        );

      case "messages":
        return (
          <View style={styles.tabContent}>
            <View style={styles.emptyTabContent}>
              <Ionicons name="mail" size={48} color={theme.textTertiary} />
              <Text
                style={[styles.emptyTabText, { color: theme.textSecondary }]}
              >
                No messages yet
              </Text>
              <Text
                style={[styles.emptyTabSubtext, { color: theme.textTertiary }]}
              >
                Messages with {selectedFolder.clientName} will appear here
              </Text>
            </View>
          </View>
        );

      case "documents":
        return (
          <View style={styles.tabContent}>
            <View style={styles.emptyTabContent}>
              <Ionicons name="document" size={48} color={theme.textTertiary} />
              <Text
                style={[styles.emptyTabText, { color: theme.textSecondary }]}
              >
                No documents yet
              </Text>
              <Text
                style={[styles.emptyTabSubtext, { color: theme.textTertiary }]}
              >
                Upload documents for {selectedFolder.clientName}
              </Text>
            </View>
          </View>
        );

      case "notes":
        return (
          <View style={styles.tabContent}>
            <Card style={styles.notesCard}>
              <Text style={[styles.notesTitle, { color: theme.text }]}>
                Client Notes
              </Text>
              <Text
                style={[styles.notesContent, { color: theme.textSecondary }]}
              >
                {selectedFolder.notes || "No notes added yet."}
              </Text>

              {canEdit && (
                <TouchableOpacity
                  style={[
                    styles.editNotesButton,
                    { backgroundColor: theme.primary },
                    Shadows.sm,
                  ]}
                  onPress={() => editFolder(selectedFolder)}
                >
                  <Ionicons name="create" size={16} color="white" />
                  <Text style={styles.editNotesText}>Edit Notes</Text>
                </TouchableOpacity>
              )}
            </Card>
          </View>
        );

      default:
        return null;
    }
  };

  // Folder Detail View
  if (selectedFolder) {
    return (
      <View style={[styles.container, style]}>
        {/* Detail Header */}
        <View style={[styles.detailHeader, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedFolder(null)}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.detailHeaderContent}>
            <View
              style={[
                styles.clientIcon,
                { backgroundColor: selectedFolder.color },
              ]}
            >
              <Ionicons name="person" size={20} color="white" />
            </View>
            <View style={styles.clientDetails}>
              <Text style={[styles.clientName, { color: theme.text }]}>
                {selectedFolder.clientName}
              </Text>
              <Text
                style={[styles.clientContact, { color: theme.textSecondary }]}
              >
                {selectedFolder.clientPhone}
              </Text>
            </View>
          </View>

          {canEdit && (
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => exportFolder(selectedFolder)}
            >
              <Ionicons name="download" size={20} color={theme.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View
          style={[
            styles.tabsContainer,
            { backgroundColor: theme.surface, borderBottomColor: theme.border },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {TAB_ITEMS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  {
                    borderBottomColor:
                      activeTab === tab.id ? theme.primary : "transparent",
                  },
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={18}
                  color={
                    activeTab === tab.id ? theme.primary : theme.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === tab.id
                          ? theme.primary
                          : theme.textSecondary,
                      fontWeight:
                        activeTab === tab.id
                          ? FontWeights.semibold
                          : FontWeights.normal,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <ScrollView
          style={styles.tabContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
        </ScrollView>
      </View>
    );
  }

  // Main Folder List View
  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.text }]}>
            Client Folders
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {folders.length} clients
          </Text>
        </View>

        {canEdit && (
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: theme.primary },
              Shadows.sm,
            ]}
            onPress={openFolderModal}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search */}
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
            placeholder="Search clients..."
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
      </View>

      {/* Folders List */}
      <FlatList
        data={filteredFolders}
        keyExtractor={(item) => item.id}
        renderItem={renderFolderCard}
        contentContainerStyle={styles.foldersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="folder-open" size={64} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No client folders yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
              {canEdit
                ? "Tap the + button to create your first client folder"
                : "Client folders will appear here"}
            </Text>
          </View>
        }
      />

      {/* Add/Edit Folder Modal */}
      <Modal
        visible={showFolderModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: theme.border }]}
          >
            <TouchableOpacity onPress={() => setShowFolderModal(false)}>
              <Text
                style={[styles.modalButton, { color: theme.textSecondary }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editingFolder ? "Edit Client" : "New Client Folder"}
            </Text>
            <TouchableOpacity
              onPress={editingFolder ? updateFolder : addFolder}
            >
              <Text style={[styles.modalButton, { color: theme.primary }]}>
                {editingFolder ? "Update" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Client Name */}
            <Text style={[styles.label, { color: theme.text }]}>
              Client Name *
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
              value={formData.clientName}
              onChangeText={(text) =>
                setFormData({ ...formData, clientName: text })
              }
              placeholder="Enter client name..."
              placeholderTextColor={theme.textTertiary}
            />

            {/* Client Email */}
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={formData.clientEmail}
              onChangeText={(text) =>
                setFormData({ ...formData, clientEmail: text })
              }
              placeholder="Enter email address..."
              placeholderTextColor={theme.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Client Phone */}
            <Text style={[styles.label, { color: theme.text }]}>Phone</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={formData.clientPhone}
              onChangeText={(text) =>
                setFormData({ ...formData, clientPhone: text })
              }
              placeholder="Enter phone number..."
              placeholderTextColor={theme.textTertiary}
              keyboardType="phone-pad"
            />

            {/* Notes */}
            <Text style={[styles.label, { color: theme.text }]}>Notes</Text>
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
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Add notes about this client..."
              placeholderTextColor={theme.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Folder Color */}
            <Text style={[styles.label, { color: theme.text }]}>
              Folder Color
            </Text>
            <View style={styles.colorContainer}>
              {FOLDER_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    formData.color === color && styles.selectedColor,
                  ]}
                  onPress={() => setFormData({ ...formData, color })}
                >
                  {formData.color === color && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
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
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
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
    gap: Spacing.sm,
  },
  searchText: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  foldersList: {
    padding: Spacing.md,
  },
  folderCard: {
    marginBottom: Spacing.md,
  },
  folderCardContent: {
    padding: Spacing.md,
  },
  folderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  folderHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.sm,
  },
  folderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  folderEmail: {
    fontSize: FontSizes.sm,
  },
  folderMenuButton: {
    padding: Spacing.xs,
  },
  folderStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  statText: {
    fontSize: FontSizes.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginLeft: "auto",
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    textTransform: "capitalize",
  },
  folderValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
  },
  detailHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.sm,
  },
  clientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  clientContact: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  exportButton: {
    padding: Spacing.xs,
  },
  tabsContainer: {
    borderBottomWidth: 1,
  },
  tabsScroll: {
    paddingHorizontal: Spacing.md,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginRight: Spacing.md,
    borderBottomWidth: 2,
    gap: Spacing.xs,
  },
  tabText: {
    fontSize: FontSizes.sm,
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    padding: Spacing.md,
  },
  emptyTabContent: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyTabText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  emptyTabSubtext: {
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
  caseCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  caseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  caseTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    flex: 1,
    marginRight: Spacing.sm,
  },
  caseStatusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  caseStatusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    textTransform: "capitalize",
  },
  caseDetails: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  caseDetailRow: {
    flexDirection: "row",
  },
  caseDetailLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.xs,
    minWidth: 100,
  },
  caseDetailValue: {
    fontSize: FontSizes.sm,
    flex: 1,
  },
  caseNotes: {
    fontSize: FontSizes.sm,
    fontStyle: "italic",
  },
  notesCard: {
    padding: Spacing.md,
  },
  notesTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  notesContent: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  editNotesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  editNotesText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: "white",
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
    height: 80,
  },
  colorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
});
