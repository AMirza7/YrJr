import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
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
import { CaseTimeline as TimelineItem, UserRole } from "@/types";

interface CaseTimelineProps {
  caseId: string;
  userRole: UserRole;
  style?: any;
}

const MILESTONE_CONFIG = {
  fir: {
    title: "FIR Filed",
    icon: "document-text",
    color: "#EF4444",
    description: "First Information Report filed",
  },
  investigation: {
    title: "Investigation",
    icon: "search",
    color: "#F59E0B",
    description: "Police investigation in progress",
  },
  hearing: {
    title: "Court Hearing",
    icon: "people",
    color: "#3B82F6",
    description: "Court proceedings and hearings",
  },
  orders: {
    title: "Court Orders",
    icon: "document",
    color: "#8B5CF6",
    description: "Judicial orders and judgments",
  },
  judgment: {
    title: "Final Judgment",
    icon: "checkmark-circle",
    color: "#10B981",
    description: "Final court decision",
  },
} as const;

const STATUS_COLORS = {
  pending: "#94A3B8",
  in_progress: "#F59E0B",
  completed: "#10B981",
  cancelled: "#EF4444",
};

export function CaseTimeline({ caseId, userRole, style }: CaseTimelineProps) {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const scrollViewRef = useRef<ScrollView>(null);

  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [selectedMilestone, setSelectedMilestone] =
    useState<TimelineItem["milestone"]>("fir");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as TimelineItem["status"],
    notes: "",
  });

  const scrollProgress = useSharedValue(0);

  useEffect(() => {
    loadTimeline();
  }, [caseId]);

  const loadTimeline = async () => {
    try {
      const stored = await AsyncStorage.getItem(`case_timeline_${caseId}`);
      if (stored) {
        const parsedTimeline = JSON.parse(stored).map((item: any) => ({
          ...item,
          date: new Date(item.date),
        }));
        setTimeline(
          parsedTimeline.sort(
            (a: TimelineItem, b: TimelineItem) =>
              a.date.getTime() - b.date.getTime(),
          ),
        );
      } else {
        // Initialize with default milestones
        const defaultTimeline = Object.keys(MILESTONE_CONFIG).map(
          (milestone, index) => ({
            id: `default_${milestone}`,
            caseId,
            title:
              MILESTONE_CONFIG[milestone as keyof typeof MILESTONE_CONFIG]
                .title,
            description:
              MILESTONE_CONFIG[milestone as keyof typeof MILESTONE_CONFIG]
                .description,
            status: index === 0 ? "in_progress" : "pending",
            milestone: milestone as TimelineItem["milestone"],
            date: new Date(Date.now() + index * 7 * 24 * 60 * 60 * 1000), // Week intervals
            documents: [],
            notes: "",
          }),
        ) as TimelineItem[];

        setTimeline(defaultTimeline);
        await AsyncStorage.setItem(
          `case_timeline_${caseId}`,
          JSON.stringify(defaultTimeline),
        );
      }
    } catch (error) {
      console.error("Error loading timeline:", error);
    }
  };

  const saveTimeline = async (newTimeline: TimelineItem[]) => {
    try {
      await AsyncStorage.setItem(
        `case_timeline_${caseId}`,
        JSON.stringify(newTimeline),
      );
      setTimeline(
        newTimeline.sort((a, b) => a.date.getTime() - b.date.getTime()),
      );
    } catch (error) {
      console.error("Error saving timeline:", error);
    }
  };

  const addTimelineItem = () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    const newItem: TimelineItem = {
      id: Date.now().toString(),
      caseId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      milestone: selectedMilestone,
      date: new Date(),
      documents: [],
      notes: formData.notes.trim(),
    };

    const newTimeline = [...timeline, newItem];
    saveTimeline(newTimeline);
    resetForm();
    setShowModal(false);
  };

  const updateTimelineItem = () => {
    if (!editingItem || !formData.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    const updatedItem: TimelineItem = {
      ...editingItem,
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      milestone: selectedMilestone,
      notes: formData.notes.trim(),
    };

    const newTimeline = timeline.map((item) =>
      item.id === editingItem.id ? updatedItem : item,
    );
    saveTimeline(newTimeline);
    resetForm();
    setEditingItem(null);
    setShowModal(false);
  };

  const deleteTimelineItem = (id: string) => {
    Alert.alert(
      "Delete Timeline Item",
      "Are you sure you want to delete this timeline item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newTimeline = timeline.filter((item) => item.id !== id);
            saveTimeline(newTimeline);
          },
        },
      ],
    );
  };

  const editTimelineItem = (item: TimelineItem) => {
    setEditingItem(item);
    setSelectedMilestone(item.milestone);
    setFormData({
      title: item.title,
      description: item.description,
      status: item.status,
      notes: item.notes,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "pending",
      notes: "",
    });
    setSelectedMilestone("fir");
  };

  const openModal = () => {
    resetForm();
    setEditingItem(null);
    setShowModal(true);
  };

  const getProgressPercentage = () => {
    const completedItems = timeline.filter(
      (item) => item.status === "completed",
    ).length;
    return timeline.length > 0 ? (completedItems / timeline.length) * 100 : 0;
  };

  const canEdit = ["lawyer", "junior_lawyer", "lawyer_assistant"].includes(
    userRole,
  );

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${getProgressPercentage()}%`),
    };
  });

  const onScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const progress =
      contentOffset.x / (contentSize.width - layoutMeasurement.width);
    scrollProgress.value = Math.max(0, Math.min(1, progress));
  };

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.text }]}>
            Case Timeline
          </Text>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {Math.round(getProgressPercentage())}% Complete
          </Text>
        </View>
        {canEdit && (
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
        )}
      </View>

      {/* Progress Bar */}
      <View
        style={[
          styles.progressContainer,
          { backgroundColor: theme.backgroundTertiary },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            { backgroundColor: theme.primary },
            progressBarStyle,
          ]}
        />
      </View>

      {/* Timeline */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timelineContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {timeline.map((item, index) => {
          const milestoneConfig = MILESTONE_CONFIG[item.milestone];
          const isLast = index === timeline.length - 1;

          return (
            <View key={item.id} style={styles.timelineItemContainer}>
              {/* Connecting Line */}
              {!isLast && (
                <View
                  style={[
                    styles.connectingLine,
                    {
                      backgroundColor:
                        item.status === "completed"
                          ? theme.success
                          : theme.border,
                    },
                  ]}
                />
              )}

              {/* Timeline Item */}
              <TouchableOpacity
                style={[styles.timelineItem, canEdit && { opacity: 1 }]}
                onPress={() => canEdit && editTimelineItem(item)}
                activeOpacity={canEdit ? 0.8 : 1}
              >
                <Card style={styles.timelineCard}>
                  {/* Status Indicator */}
                  <View
                    style={[
                      styles.statusIndicator,
                      {
                        backgroundColor: STATUS_COLORS[item.status],
                      },
                    ]}
                  >
                    <Ionicons
                      name={milestoneConfig.icon as any}
                      size={20}
                      color="white"
                    />
                  </View>

                  {/* Content */}
                  <View style={styles.timelineContent}>
                    <Text
                      style={[styles.timelineTitle, { color: theme.text }]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={[
                        styles.timelineDescription,
                        { color: theme.textSecondary },
                      ]}
                      numberOfLines={3}
                    >
                      {item.description}
                    </Text>

                    <View style={styles.timelineFooter}>
                      <Text
                        style={[
                          styles.timelineDate,
                          { color: theme.textTertiary },
                        ]}
                      >
                        {item.date.toLocaleDateString()}
                      </Text>

                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: `${STATUS_COLORS[item.status]}20`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: STATUS_COLORS[item.status] },
                          ]}
                        >
                          {item.status.replace("_", " ")}
                        </Text>
                      </View>
                    </View>

                    {item.notes && (
                      <Text
                        style={[
                          styles.timelineNotes,
                          { color: theme.textTertiary },
                        ]}
                        numberOfLines={2}
                      >
                        Notes: {item.notes}
                      </Text>
                    )}
                  </View>

                  {/* Edit Menu for eligible users */}
                  {canEdit && (
                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={() => {
                        Alert.alert("Options", "", [
                          {
                            text: "Edit",
                            onPress: () => editTimelineItem(item),
                          },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => deleteTimelineItem(item.id),
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
                  )}
                </Card>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Role-based Message */}
      {!canEdit && (
        <View style={styles.roleMessage}>
          <Text
            style={[styles.roleMessageText, { color: theme.textSecondary }]}
          >
            Timeline view only. Contact your lawyer to update timeline items.
          </Text>
        </View>
      )}

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
              {editingItem ? "Edit Timeline" : "Add Timeline Item"}
            </Text>
            <TouchableOpacity
              onPress={editingItem ? updateTimelineItem : addTimelineItem}
            >
              <Text style={[styles.modalButton, { color: theme.primary }]}>
                {editingItem ? "Update" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Milestone Selection */}
            <Text style={[styles.label, { color: theme.text }]}>Milestone</Text>
            <View style={styles.milestoneContainer}>
              {Object.entries(MILESTONE_CONFIG).map(([key, config]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.milestoneButton,
                    {
                      backgroundColor:
                        selectedMilestone === key
                          ? config.color
                          : theme.surface,
                      borderColor: config.color,
                    },
                  ]}
                  onPress={() =>
                    setSelectedMilestone(key as TimelineItem["milestone"])
                  }
                >
                  <Ionicons
                    name={config.icon as any}
                    size={16}
                    color={selectedMilestone === key ? "white" : config.color}
                  />
                  <Text
                    style={[
                      styles.milestoneButtonText,
                      {
                        color: selectedMilestone === key ? "white" : theme.text,
                      },
                    ]}
                  >
                    {config.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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
            />

            {/* Description Input */}
            <Text style={[styles.label, { color: theme.text }]}>
              Description
            </Text>
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
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              placeholder="Enter description..."
              placeholderTextColor={theme.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* Status Selection */}
            <Text style={[styles.label, { color: theme.text }]}>Status</Text>
            <View style={styles.statusContainer}>
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        formData.status === status ? color : theme.surface,
                      borderColor: color,
                    },
                  ]}
                  onPress={() =>
                    setFormData({
                      ...formData,
                      status: status as TimelineItem["status"],
                    })
                  }
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      {
                        color: formData.status === status ? "white" : color,
                      },
                    ]}
                  >
                    {status.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Notes Input */}
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
              placeholder="Add any additional notes..."
              placeholderTextColor={theme.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get("window");
const timelineItemWidth = width * 0.7;

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
  progressText: {
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
  progressContainer: {
    height: 4,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: 2,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  timelineContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  timelineItemContainer: {
    position: "relative",
    marginRight: Spacing.md,
  },
  connectingLine: {
    position: "absolute",
    top: 30,
    right: -Spacing.md / 2,
    width: Spacing.md,
    height: 2,
    zIndex: 1,
  },
  timelineItem: {
    width: timelineItemWidth,
  },
  timelineCard: {
    padding: Spacing.md,
    position: "relative",
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  timelineDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  timelineFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  timelineDate: {
    fontSize: FontSizes.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    textTransform: "capitalize",
  },
  timelineNotes: {
    fontSize: FontSizes.xs,
    fontStyle: "italic",
  },
  menuButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    padding: Spacing.xs,
  },
  roleMessage: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  roleMessageText: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    fontStyle: "italic",
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
  milestoneContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  milestoneButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  milestoneButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  statusButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  statusButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textTransform: "capitalize",
  },
});
