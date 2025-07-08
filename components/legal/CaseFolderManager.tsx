import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { useModal } from "@/contexts/ModalContext";

export interface CaseFolder {
  id: string;
  title: string;
  caseType:
    | "Criminal"
    | "Civil"
    | "Family"
    | "Property"
    | "Labor"
    | "Constitutional"
    | "Tax";
  courtName: string;
  opponentParty: string;
  filingDate: Date;
  status: "Active" | "Pending" | "Completed" | "Archived";
  documents: Array<{
    id: string;
    name: string;
    type: "scan" | "draft" | "note" | "attachment";
    createdAt: Date;
    size?: string;
  }>;
  timeline: Array<{
    id: string;
    title: string;
    date: Date;
    type: string;
  }>;
  linkedUsers: Array<{
    id: string;
    name: string;
    role: "Lawyer" | "Client" | "Assistant" | "Expert";
    email: string;
  }>;
  notes: Array<{
    id: string;
    content: string;
    createdAt: Date;
    createdBy: string;
  }>;
  priority: "Low" | "Medium" | "High" | "Urgent";
  tags: string[];
}

interface CaseFolderManagerProps {
  folders: CaseFolder[];
  onCreateFolder: (folder: Omit<CaseFolder, "id">) => void;
  onUpdateFolder: (folderId: string, updates: Partial<CaseFolder>) => void;
  onDeleteFolder: (folderId: string) => void;
  onAddDocument: (
    folderId: string,
    document: CaseFolder["documents"][0],
  ) => void;
  onRemoveDocument: (folderId: string, documentId: string) => void;
  onAddNote: (folderId: string, note: string) => void;
  onLinkUser: (
    folderId: string,
    userId: string,
    role: CaseFolder["linkedUsers"][0]["role"],
  ) => void;
}

export default function CaseFolderManager({
  folders,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onAddDocument,
  onRemoveDocument,
  onAddNote,
  onLinkUser,
}: CaseFolderManagerProps) {
  const [selectedFolder, setSelectedFolder] = useState<CaseFolder | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFolderDetails, setShowFolderDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const { showSuccess, showError } = useModal();
  const { width: screenWidth } = Dimensions.get("window");
  const [newFolder, setNewFolder] = useState<Partial<CaseFolder>>({
    title: "",
    caseType: "Civil",
    courtName: "",
    opponentParty: "",
    filingDate: new Date(),
    status: "Active",
    priority: "Medium",
    documents: [],
    timeline: [],
    linkedUsers: [],
    notes: [],
    tags: [],
  });

  const caseTypes = [
    "All",
    "Criminal",
    "Civil",
    "Family",
    "Property",
    "Labor",
    "Constitutional",
    "Tax",
  ];

  const getCaseTypeIcon = (type: string) => {
    const icons = {
      Criminal: "⚖️",
      Civil: "📋",
      Family: "👨‍👩‍👧‍👦",
      Property: "🏠",
      Labor: "👷",
      Constitutional: "🏛️",
      Tax: "💰",
    };
    return icons[type as keyof typeof icons] || "📁";
  };

  const getCaseTypeColor = (type: string) => {
    const colors = {
      Criminal: "#ef4444",
      Civil: "#3b82f6",
      Family: "#10b981",
      Property: "#8b5cf6",
      Labor: "#06b6d4",
      Constitutional: "#f59e0b",
      Tax: "#84cc16",
    };
    return colors[type as keyof typeof colors] || "#64748b";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Active: "#10b981",
      Pending: "#f59e0b",
      Completed: "#3b82f6",
      Archived: "#64748b",
    };
    return colors[status as keyof typeof colors] || "#64748b";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      Low: "#10b981",
      Medium: "#f59e0b",
      High: "#f97316",
      Urgent: "#ef4444",
    };
    return colors[priority as keyof typeof colors] || "#64748b";
  };

  const filteredFolders = folders.filter((folder) => {
    const matchesSearch =
      folder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.opponentParty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.courtName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "All" || folder.caseType === filterType;

    return matchesSearch && matchesType;
  });

  const handleCreateFolder = () => {
    if (newFolder.title && newFolder.courtName && newFolder.opponentParty) {
      onCreateFolder({
        ...newFolder,
        documents: [],
        timeline: [],
        linkedUsers: [],
        notes: [],
        tags: [],
      } as Omit<CaseFolder, "id">);

      setNewFolder({
        title: "",
        caseType: "Civil",
        courtName: "",
        opponentParty: "",
        filingDate: new Date(),
        status: "Active",
        priority: "Medium",
        documents: [],
        timeline: [],
        linkedUsers: [],
        notes: [],
        tags: [],
      });
      setShowCreateModal(false);
      showSuccess("Success", "Case folder created successfully");
    } else {
      showError("Error", "Please fill in all required fields");
    }
  };

  const handleFolderSelect = (folder: CaseFolder) => {
    setSelectedFolder(folder);
    setShowFolderDetails(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const FolderCard = ({ folder }: { folder: CaseFolder }) => (
    <TouchableOpacity
      style={styles.folderCard}
      onPress={() => handleFolderSelect(folder)}
    >
      <View style={styles.folderHeader}>
        <View style={styles.folderTypeContainer}>
          <Text style={styles.folderIcon}>
            {getCaseTypeIcon(folder.caseType)}
          </Text>
          <View style={styles.folderInfo}>
            <Text style={styles.folderTitle}>{folder.title}</Text>
            <Text style={styles.folderSubtitle}>{folder.opponentParty}</Text>
          </View>
        </View>

        <View style={styles.folderMeta}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(folder.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(folder.status) },
              ]}
            >
              {folder.status}
            </Text>
          </View>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(folder.priority) + "20" },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                { color: getPriorityColor(folder.priority) },
              ]}
            >
              {folder.priority}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.folderDetails}>
        <Text style={styles.courtName}>🏛️ {folder.courtName}</Text>
        <Text style={styles.filingDate}>
          📅 Filed: {formatDate(folder.filingDate)}
        </Text>
      </View>

      <View style={styles.folderStats}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>📄</Text>
          <Text style={styles.statText}>{folder.documents.length} docs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>👥</Text>
          <Text style={styles.statText}>{folder.linkedUsers.length} users</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>📝</Text>
          <Text style={styles.statText}>{folder.notes.length} notes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statText}>{folder.timeline.length} events</Text>
        </View>
      </View>

      {folder.tags.length > 0 && (
        <View style={styles.folderTags}>
          {folder.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {folder.tags.length > 3 && (
            <Text style={styles.moreTagsText}>
              +{folder.tags.length - 3} more
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📁 Case Folder Manager</Text>
        <Text style={styles.subtitle}>Organize your legal cases</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search cases, parties, or courts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>➕ New Case</Text>
        </TouchableOpacity>
      </View>

      {/* Type Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          data={caseTypes}
          numColumns={4}
          keyExtractor={(item) => item}
          renderItem={({ item: type }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === type && styles.filterButtonSelected,
                { borderColor: getCaseTypeColor(type) },
              ]}
              onPress={() => setFilterType(type)}
            >
              <Text style={styles.filterIcon}>{getCaseTypeIcon(type)}</Text>
              <Text
                style={[
                  styles.filterText,
                  filterType === type && { color: getCaseTypeColor(type) },
                ]}
                numberOfLines={1}
              >
                {type}
              </Text>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.filterGrid}
        />
      </View>

      {/* Folders List */}
      <FlatList
        data={filteredFolders}
        renderItem={({ item }) => <FolderCard folder={item} />}
        keyExtractor={(item) => item.id}
        style={styles.foldersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📁</Text>
            <Text style={styles.emptyTitle}>No case folders yet</Text>
            <Text style={styles.emptyMessage}>
              Create your first case folder to organize documents and track
              progress
            </Text>
            <TouchableOpacity
              style={styles.emptyCreateButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.emptyCreateButtonText}>
                Create First Case
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Create Folder Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Case Folder</Text>

            <ScrollView style={styles.formContainer}>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Case Title *</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter case title"
                  value={newFolder.title || ""}
                  onChangeText={(text) =>
                    setNewFolder((prev) => ({ ...prev, title: text }))
                  }
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Case Type *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {caseTypes.slice(1).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        newFolder.caseType === type &&
                          styles.typeOptionSelected,
                        { borderColor: getCaseTypeColor(type) },
                      ]}
                      onPress={() =>
                        setNewFolder((prev) => ({
                          ...prev,
                          caseType: type as any,
                        }))
                      }
                    >
                      <Text style={styles.typeOptionIcon}>
                        {getCaseTypeIcon(type)}
                      </Text>
                      <Text style={styles.typeOptionText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Court Name *</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter court name"
                  value={newFolder.courtName || ""}
                  onChangeText={(text) =>
                    setNewFolder((prev) => ({ ...prev, courtName: text }))
                  }
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Opponent Party *</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter opponent party name"
                  value={newFolder.opponentParty || ""}
                  onChangeText={(text) =>
                    setNewFolder((prev) => ({ ...prev, opponentParty: text }))
                  }
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Priority</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {["Low", "Medium", "High", "Urgent"].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityOption,
                        newFolder.priority === priority &&
                          styles.priorityOptionSelected,
                        { borderColor: getPriorityColor(priority) },
                      ]}
                      onPress={() =>
                        setNewFolder((prev) => ({
                          ...prev,
                          priority: priority as any,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.priorityOptionText,
                          { color: getPriorityColor(priority) },
                        ]}
                      >
                        {priority}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createFolderButton}
                onPress={handleCreateFolder}
              >
                <Text style={styles.createFolderButtonText}>Create Folder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Folder Details Modal */}
      <Modal
        visible={showFolderDetails}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowFolderDetails(false)}
      >
        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowFolderDetails(false)}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.detailsTitle}>{selectedFolder?.title}</Text>
          </View>

          <ScrollView style={styles.detailsContent}>
            {selectedFolder && (
              <>
                {/* Case Info */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>📋 Case Information</Text>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Type:</Text>
                      <Text style={styles.infoValue}>
                        {selectedFolder.caseType}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Status:</Text>
                      <Text
                        style={[
                          styles.infoValue,
                          { color: getStatusColor(selectedFolder.status) },
                        ]}
                      >
                        {selectedFolder.status}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Priority:</Text>
                      <Text
                        style={[
                          styles.infoValue,
                          { color: getPriorityColor(selectedFolder.priority) },
                        ]}
                      >
                        {selectedFolder.priority}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Court:</Text>
                      <Text style={styles.infoValue}>
                        {selectedFolder.courtName}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Opponent:</Text>
                      <Text style={styles.infoValue}>
                        {selectedFolder.opponentParty}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Filed:</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(selectedFolder.filingDate)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Documents */}
                <View style={styles.documentsSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                      📄 Documents ({selectedFolder.documents.length})
                    </Text>
                    <TouchableOpacity style={styles.addButton}>
                      <Text style={styles.addButtonText}>+ Add</Text>
                    </TouchableOpacity>
                  </View>
                  {selectedFolder.documents.map((doc) => (
                    <View key={doc.id} style={styles.documentItem}>
                      <Text style={styles.documentIcon}>📄</Text>
                      <View style={styles.documentInfo}>
                        <Text style={styles.documentName}>{doc.name}</Text>
                        <Text style={styles.documentMeta}>
                          {doc.type} • {formatDate(doc.createdAt)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Timeline */}
                <View style={styles.timelineSection}>
                  <Text style={styles.sectionTitle}>
                    ⏱️ Timeline ({selectedFolder.timeline.length})
                  </Text>
                  {selectedFolder.timeline.map((event) => (
                    <View key={event.id} style={styles.timelineItem}>
                      <Text style={styles.timelineDate}>
                        {formatDate(event.date)}
                      </Text>
                      <Text style={styles.timelineTitle}>{event.title}</Text>
                      <Text style={styles.timelineType}>{event.type}</Text>
                    </View>
                  ))}
                </View>

                {/* Linked Users */}
                <View style={styles.usersSection}>
                  <Text style={styles.sectionTitle}>
                    👥 Linked Users ({selectedFolder.linkedUsers.length})
                  </Text>
                  {selectedFolder.linkedUsers.map((user) => (
                    <View key={user.id} style={styles.userItem}>
                      <Text style={styles.userIcon}>👤</Text>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userRole}>{user.role}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
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
  searchSection: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  createButton: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterGrid: {
    justifyContent: "space-between",
  },
  filterButton: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 12,
    margin: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    width: (screenWidth - 48) / 4,
    minHeight: 80,
  },
  filterButtonSelected: {
    backgroundColor: "#f0f9ff",
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  foldersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  folderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  folderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  folderTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  folderIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  folderInfo: {
    flex: 1,
  },
  folderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  folderSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  folderMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "700",
  },
  folderDetails: {
    marginBottom: 12,
  },
  courtName: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  filingDate: {
    fontSize: 14,
    color: "#64748b",
  },
  folderStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  folderTags: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "500",
  },
  moreTagsText: {
    fontSize: 10,
    color: "#94a3b8",
    fontStyle: "italic",
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
    marginBottom: 24,
  },
  emptyCreateButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyCreateButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    maxHeight: 400,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
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
  priorityOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginRight: 8,
  },
  priorityOptionSelected: {
    backgroundColor: "#f0f9ff",
  },
  priorityOptionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
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
  createFolderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#8b5cf6",
  },
  createFolderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  detailsHeader: {
    backgroundColor: "#8b5cf6",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
  },
  detailsContent: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#10b981",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  infoItem: {
    width: "48%",
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "600",
  },
  documentsSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  documentIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 2,
  },
  documentMeta: {
    fontSize: 12,
    color: "#64748b",
  },
  timelineSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  timelineItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  timelineDate: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
    marginVertical: 2,
  },
  timelineType: {
    fontSize: 12,
    color: "#94a3b8",
  },
  usersSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  userIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: "#64748b",
  },
});
