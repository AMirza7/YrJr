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
import { PinboardItem } from "@/types/features";
import { PRIORITY_LEVELS, PINBOARD_TAGS } from "@/constants/LegalConstants";

export default function PinboardScreen() {
  const [items, setItems] = useState<PinboardItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PinboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Create modal state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">(
    "medium",
  );
  const [newTags, setNewTags] = useState<string[]>([]);

  useEffect(() => {
    loadPinboardItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, selectedPriority, selectedTag, searchQuery]);

  const loadPinboardItems = async () => {
    try {
      const data = await dataService.getPinboardItems();
      setItems(data);
    } catch (error) {
      console.error("Error loading pinboard items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (selectedPriority !== "all") {
      filtered = filtered.filter((item) => item.priority === selectedPriority);
    }

    if (selectedTag !== "all") {
      filtered = filtered.filter((item) => item.tags.includes(selectedTag));
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredItems(filtered);
  };

  const handleCreateItem = async () => {
    if (!newTitle.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    try {
      const newItem = await dataService.savePinboardItem({
        title: newTitle,
        description: newDescription,
        priority: newPriority,
        tags: newTags,
        createdBy: "current_user",
        completed: false,
      });

      setItems([newItem, ...items]);
      resetCreateForm();
      setShowCreateModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to create item");
    }
  };

  const handleToggleComplete = async (item: PinboardItem) => {
    try {
      await dataService.updatePinboardItem(item.id, {
        completed: !item.completed,
      });
      const updatedItems = items.map((i) =>
        i.id === item.id ? { ...i, completed: !i.completed } : i,
      );
      setItems(updatedItems);
    } catch (error) {
      Alert.alert("Error", "Failed to update item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await dataService.deletePinboardItem(id);
            setItems(items.filter((item) => item.id !== id));
          } catch (error) {
            Alert.alert("Error", "Failed to delete item");
          }
        },
      },
    ]);
  };

  const resetCreateForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewPriority("medium");
    setNewTags([]);
  };

  const toggleTag = (tag: string) => {
    if (newTags.includes(tag)) {
      setNewTags(newTags.filter((t) => t !== tag));
    } else {
      setNewTags([...newTags, tag]);
    }
  };

  const getPriorityColor = (priority: string) => {
    return (
      PRIORITY_LEVELS.find((p) => p.value === priority)?.color || "#6b7280"
    );
  };

  const renderPinboardItem = ({ item }: { item: PinboardItem }) => (
    <View style={[styles.itemCard, { opacity: item.completed ? 0.6 : 1 }]}>
      <View style={styles.itemHeader}>
        <View style={styles.priorityIndicator}>
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          />
          <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteItem(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.itemTitle,
          { textDecorationLine: item.completed ? "line-through" : "none" },
        ]}
      >
        {item.title}
      </Text>
      <Text style={styles.itemDescription}>{item.description}</Text>

      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.itemFooter}>
        <Text style={styles.itemDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          onPress={() => handleToggleComplete(item)}
          style={[
            styles.completeButton,
            { backgroundColor: item.completed ? "#10b981" : "#e5e7eb" },
          ]}
        >
          <Text
            style={[
              styles.completeText,
              { color: item.completed ? "#fff" : "#374151" },
            ]}
          >
            {item.completed ? "✓ Done" : "Mark Done"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>📌 Legal Pinboard</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search pinboard items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedPriority === "all" ? "#7c3aed" : "#f3f4f6",
              },
            ]}
            onPress={() => setSelectedPriority("all")}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: selectedPriority === "all" ? "#fff" : "#374151" },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {PRIORITY_LEVELS.map((priority) => (
            <TouchableOpacity
              key={priority.value}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedPriority === priority.value
                      ? priority.color
                      : "#f3f4f6",
                },
              ]}
              onPress={() => setSelectedPriority(priority.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color:
                      selectedPriority === priority.value ? "#fff" : "#374151",
                  },
                ]}
              >
                {priority.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedTag === "all" ? "#7c3aed" : "#f3f4f6",
              },
            ]}
            onPress={() => setSelectedTag("all")}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: selectedTag === "all" ? "#fff" : "#374151" },
              ]}
            >
              All Tags
            </Text>
          </TouchableOpacity>
          {PINBOARD_TAGS.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedTag === tag ? "#059669" : "#f3f4f6",
                },
              ]}
              onPress={() => setSelectedTag(tag)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: selectedTag === tag ? "#fff" : "#374151" },
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Pinboard Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderPinboardItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={loadPinboardItems}
      />

      {/* Create Modal */}
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
            <Text style={styles.modalTitle}>New Pinboard Item</Text>
            <TouchableOpacity onPress={handleCreateItem}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Enter item title"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newDescription}
              onChangeText={setNewDescription}
              placeholder="Enter item description"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.inputLabel}>Priority</Text>
            <View style={styles.prioritySelector}>
              {PRIORITY_LEVELS.map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={[
                    styles.priorityOption,
                    {
                      backgroundColor:
                        newPriority === priority.value
                          ? priority.color
                          : "#f3f4f6",
                    },
                  ]}
                  onPress={() =>
                    setNewPriority(priority.value as "high" | "medium" | "low")
                  }
                >
                  <Text
                    style={[
                      styles.priorityOptionText,
                      {
                        color:
                          newPriority === priority.value ? "#fff" : "#374151",
                      },
                    ]}
                  >
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Tags</Text>
            <View style={styles.tagsSelector}>
              {PINBOARD_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagOption,
                    {
                      backgroundColor: newTags.includes(tag)
                        ? "#7c3aed"
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
  addButton: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  filtersContainer: {
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
    marginBottom: 12,
    backgroundColor: "#f9fafb",
  },
  filterRow: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
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
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priorityIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6b7280",
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: "#374151",
    fontWeight: "500",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  completeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completeText: {
    fontSize: 12,
    fontWeight: "500",
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
    color: "#7c3aed",
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
    height: 100,
    textAlignVertical: "top",
  },
  prioritySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: "500",
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
});
