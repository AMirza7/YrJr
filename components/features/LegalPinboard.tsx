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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import { PinnedItem } from "@/types";

interface LegalPinboardProps {
  style?: any;
}

const STORAGE_KEY = "legal_pinboard_items";

const ITEM_COLORS = [
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#84CC16", // Lime
];

const ITEM_TYPES = [
  { id: "note", label: "Note", icon: "document-text" },
  { id: "case_link", label: "Case Link", icon: "link" },
  { id: "update", label: "Update", icon: "refresh" },
  { id: "reminder", label: "Reminder", icon: "alarm" },
] as const;

export function LegalPinboard({ style }: LegalPinboardProps) {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [items, setItems] = useState<PinnedItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PinnedItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "note" as PinnedItem["type"],
    priority: "medium" as PinnedItem["priority"],
    color: ITEM_COLORS[0],
    tags: "",
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedItems = JSON.parse(stored).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
        setItems(parsedItems);
      }
    } catch (error) {
      console.error("Error loading pinboard items:", error);
    }
  };

  const saveItems = async (newItems: PinnedItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error("Error saving pinboard items:", error);
    }
  };

  const addItem = () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    const newItem: PinnedItem = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      type: formData.type,
      priority: formData.priority,
      color: formData.color,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newItems = [newItem, ...items];
    saveItems(newItems);
    resetForm();
    setShowModal(false);
  };

  const updateItem = () => {
    if (!editingItem || !formData.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    const updatedItem: PinnedItem = {
      ...editingItem,
      title: formData.title.trim(),
      content: formData.content.trim(),
      type: formData.type,
      priority: formData.priority,
      color: formData.color,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      updatedAt: new Date(),
    };

    const newItems = items.map((item) =>
      item.id === editingItem.id ? updatedItem : item,
    );
    saveItems(newItems);
    resetForm();
    setEditingItem(null);
    setShowModal(false);
  };

  const deleteItem = (id: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this pinned item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newItems = items.filter((item) => item.id !== id);
            saveItems(newItems);
          },
        },
      ],
    );
  };

  const editItem = (item: PinnedItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      priority: item.priority,
      color: item.color,
      tags: item.tags.join(", "),
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "note",
      priority: "medium",
      color: ITEM_COLORS[0],
      tags: "",
    });
  };

  const openModal = () => {
    resetForm();
    setEditingItem(null);
    setShowModal(true);
  };

  const getPriorityColor = (priority: PinnedItem["priority"]) => {
    switch (priority) {
      case "high":
        return theme.error;
      case "medium":
        return theme.warning;
      case "low":
        return theme.success;
      default:
        return theme.textSecondary;
    }
  };

  const getTypeIcon = (type: PinnedItem["type"]) => {
    const typeConfig = ITEM_TYPES.find((t) => t.id === type);
    return typeConfig?.icon || "document-text";
  };

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Legal Pinboard
        </Text>
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

      {/* Items Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="pin"
              size={48}
              color={theme.textTertiary}
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No pinned items yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
              Tap the + button to create your first pin
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {items.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(index * 100)}
                exiting={FadeOutUp}
                layout={Layout.springify()}
                style={styles.gridItem}
              >
                <Card
                  style={[
                    styles.itemCard,
                    {
                      borderLeftColor: item.color,
                      borderLeftWidth: 4,
                    },
                  ]}
                >
                  <View style={styles.itemHeader}>
                    <View style={styles.itemTypeContainer}>
                      <Ionicons
                        name={getTypeIcon(item.type)}
                        size={16}
                        color={item.color}
                      />
                      <View
                        style={[
                          styles.priorityDot,
                          { backgroundColor: getPriorityColor(item.priority) },
                        ]}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={() => {
                        Alert.alert("Options", "", [
                          { text: "Edit", onPress: () => editItem(item) },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => deleteItem(item.id),
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
                    style={[styles.itemTitle, { color: theme.text }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  {item.content && (
                    <Text
                      style={[
                        styles.itemContent,
                        { color: theme.textSecondary },
                      ]}
                      numberOfLines={3}
                    >
                      {item.content}
                    </Text>
                  )}

                  {item.tags.length > 0 && (
                    <View style={styles.tagContainer}>
                      {item.tags.slice(0, 2).map((tag, tagIndex) => (
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
                      {item.tags.length > 2 && (
                        <Text
                          style={[
                            styles.tagMore,
                            { color: theme.textTertiary },
                          ]}
                        >
                          +{item.tags.length - 2}
                        </Text>
                      )}
                    </View>
                  )}

                  <Text
                    style={[styles.itemDate, { color: theme.textTertiary }]}
                  >
                    {item.updatedAt.toLocaleDateString()}
                  </Text>
                </Card>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

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
              {editingItem ? "Edit Pin" : "New Pin"}
            </Text>
            <TouchableOpacity onPress={editingItem ? updateItem : addItem}>
              <Text style={[styles.modalButton, { color: theme.primary }]}>
                {editingItem ? "Update" : "Save"}
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
              placeholder="Enter title..."
              placeholderTextColor={theme.textTertiary}
              maxLength={100}
            />

            {/* Content Input */}
            <Text style={[styles.label, { color: theme.text }]}>Content</Text>
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
              placeholder="Enter content..."
              placeholderTextColor={theme.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Type Selection */}
            <Text style={[styles.label, { color: theme.text }]}>Type</Text>
            <View style={styles.typeContainer}>
              {ITEM_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        formData.type === type.id
                          ? theme.primary
                          : theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setFormData({ ...formData, type: type.id })}
                >
                  <Ionicons
                    name={type.icon}
                    size={16}
                    color={
                      formData.type === type.id ? "white" : theme.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      {
                        color: formData.type === type.id ? "white" : theme.text,
                      },
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Priority Selection */}
            <Text style={[styles.label, { color: theme.text }]}>Priority</Text>
            <View style={styles.priorityContainer}>
              {(["low", "medium", "high"] as const).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    {
                      backgroundColor:
                        formData.priority === priority
                          ? getPriorityColor(priority)
                          : theme.surface,
                      borderColor: getPriorityColor(priority),
                    },
                  ]}
                  onPress={() => setFormData({ ...formData, priority })}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      {
                        color:
                          formData.priority === priority
                            ? "white"
                            : getPriorityColor(priority),
                      },
                    ]}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Color Selection */}
            <Text style={[styles.label, { color: theme.text }]}>Color</Text>
            <View style={styles.colorContainer}>
              {ITEM_COLORS.map((color) => (
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
              placeholder="e.g. important, client, follow-up"
              placeholderTextColor={theme.textTertiary}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get("window");
const gridItemWidth = (width - Spacing.md * 3) / 2;

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
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: gridItemWidth,
    marginBottom: Spacing.md,
  },
  itemCard: {
    padding: Spacing.sm,
    minHeight: 140,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  itemTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  itemTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  itemContent: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
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
  itemDate: {
    fontSize: FontSizes.xs,
    marginTop: "auto",
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
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  typeButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  priorityContainer: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: "center",
  },
  priorityButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
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
