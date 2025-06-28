import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  style?: any;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionText && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Specific empty states for different screens
export const SearchEmptyState = ({
  onVoiceSearch,
}: {
  onVoiceSearch?: () => void;
}) => (
  <EmptyState
    icon="🔍"
    title="No Results Found"
    description="Try adjusting your search terms or using voice search for better results"
    actionText="🎤 Try Voice Search"
    onAction={onVoiceSearch}
  />
);

export const NotificationsEmptyState = ({
  onRefresh,
}: {
  onRefresh?: () => void;
}) => (
  <EmptyState
    icon="🔕"
    title="No Notifications"
    description="You're all caught up! No new notifications to show"
    actionText="🔄 Refresh"
    onAction={onRefresh}
  />
);

export const CasesEmptyState = ({
  onCreateCase,
}: {
  onCreateCase?: () => void;
}) => (
  <EmptyState
    icon="⚖️"
    title="No Cases Found"
    description="Start by creating your first case or use the search function to find existing cases"
    actionText="➕ Create New Case"
    onAction={onCreateCase}
  />
);

export const NotesEmptyState = ({
  onCreateNote,
}: {
  onCreateNote?: () => void;
}) => (
  <EmptyState
    icon="📝"
    title="No Notes Yet"
    description="Create your first secure note to keep track of important legal information"
    actionText="✍️ Create Note"
    onAction={onCreateNote}
  />
);

export const PinboardEmptyState = ({
  onCreatePin,
}: {
  onCreatePin?: () => void;
}) => (
  <EmptyState
    icon="📌"
    title="No Pinned Items"
    description="Pin important cases, documents, or sections for quick access"
    actionText="📌 Add Pin"
    onAction={onCreatePin}
  />
);

export const TimelineEmptyState = ({
  onAddEvent,
}: {
  onAddEvent?: () => void;
}) => (
  <EmptyState
    icon="📅"
    title="No Timeline Events"
    description="Track case progress by adding hearings, deadlines, and important milestones"
    actionText="📆 Add Event"
    onAction={onAddEvent}
  />
);

export const TemplatesEmptyState = ({
  onBrowseTemplates,
}: {
  onBrowseTemplates?: () => void;
}) => (
  <EmptyState
    icon="📄"
    title="No Templates Available"
    description="Browse our collection of legal document templates to get started"
    actionText="📚 Browse Templates"
    onAction={onBrowseTemplates}
  />
);

export const FlashcardsEmptyState = ({
  onCreateDeck,
}: {
  onCreateDeck?: () => void;
}) => (
  <EmptyState
    icon="🧠"
    title="No Flashcard Decks"
    description="Create flashcard decks to study legal concepts and improve your knowledge"
    actionText="🎯 Create Deck"
    onAction={onCreateDeck}
  />
);

export const ScannerEmptyState = ({
  onStartScan,
}: {
  onStartScan?: () => void;
}) => (
  <EmptyState
    icon="📱"
    title="No Scanned Documents"
    description="Use the camera to scan legal documents and extract important information"
    actionText="📷 Start Scanning"
    onAction={onStartScan}
  />
);

export const AIComparatorEmptyState = ({
  onStartComparison,
}: {
  onStartComparison?: () => void;
}) => (
  <EmptyState
    icon="⚖️"
    title="Ready to Compare"
    description="Compare IPC and BNS sections side-by-side to understand legal changes"
    actionText="🔄 Start Comparison"
    onAction={onStartComparison}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
