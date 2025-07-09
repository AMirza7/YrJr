import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import BackButton from "@/components/navigation/BackButton";
import AdvancedFlashcards from "@/components/learning/AdvancedFlashcards";

// Mock flashcard data - in real app this would come from API
const mockFlashcards = [
  {
    id: "1",
    question: "What is the punishment for murder under IPC Section 302?",
    answer:
      "Death penalty or life imprisonment. Under Section 302 of the Indian Penal Code, whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    category: "Criminal Law",
    difficulty: "medium" as const,
    tags: ["IPC", "murder", "punishment"],
    mastery: 65,
  },
  {
    id: "2",
    question: "Define 'consideration' in contract law.",
    answer:
      "Consideration is something of value given in exchange for a promise. It can be a benefit to the promisor or a detriment to the promisee. It must be real, lawful, and have some value in the eyes of law.",
    category: "Contract Law",
    difficulty: "easy" as const,
    tags: ["contract", "consideration", "definition"],
    mastery: 85,
  },
  {
    id: "3",
    question: "What are the essential elements of a valid contract?",
    answer:
      "1. Offer and Acceptance, 2. Intention to create legal relationship, 3. Lawful consideration and object, 4. Capacity of parties, 5. Free consent, 6. Certainty of terms, 7. Not expressly declared void.",
    category: "Contract Law",
    difficulty: "hard" as const,
    tags: ["contract", "elements", "validity"],
    mastery: 45,
  },
  {
    id: "4",
    question: "What is Article 21 of the Indian Constitution?",
    answer:
      "Article 21 states 'No person shall be deprived of his life or personal liberty except according to procedure established by law.' It is the most important fundamental right guaranteeing protection of life and personal liberty.",
    category: "Constitutional Law",
    difficulty: "medium" as const,
    tags: ["constitution", "fundamental rights", "Article 21"],
    mastery: 75,
  },
  {
    id: "5",
    question: "Explain the principle of 'Res Judicata'.",
    answer:
      "Res Judicata means 'a matter already judged'. It prevents the same dispute between the same parties from being litigated again. Once a court has decided a matter, it cannot be re-opened in another proceeding.",
    category: "Civil Procedure",
    difficulty: "hard" as const,
    tags: ["res judicata", "civil procedure", "principle"],
    mastery: 30,
  },
];

export default function FlashcardsLearning() {
  const handleClose = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/(tabs)/home");
      }
    } catch (error) {
      router.push("/(tabs)/home");
    }
  };

  return (
    <AdvancedFlashcards
      cards={mockFlashcards}
      onClose={handleClose}
    />
  );
}

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Back" color="#fff" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>🧠 Flashcards Learning</Text>
        <Text style={styles.subtitle}>Choose your learning experience</Text>

        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => setShowAdvancedMode(true)}
        >
          <Text style={styles.modeIcon}>🚀</Text>
          <View style={styles.modeInfo}>
            <Text style={styles.modeTitle}>Advanced Learning Mode</Text>
            <Text style={styles.modeDescription}>
              Gaming features, challenges, leaderboards, and competition mode
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockFlashcards.length}</Text>
              <Text style={styles.statLabel}>Total Cards</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(
                  mockFlashcards.reduce((acc, card) => acc + card.mastery, 0) /
                    mockFlashcards.length,
                )}
                %
              </Text>
              <Text style={styles.statLabel}>Avg Mastery</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
          </View>
        </View>

        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>📝 Next Card Preview</Text>
          <View style={styles.previewCard}>
            <Text style={styles.previewQuestion}>
              {mockFlashcards[0].question}
            </Text>
            <View style={styles.previewFooter}>
              <Text style={styles.previewCategory}>
                {mockFlashcards[0].category}
              </Text>
              <Text style={styles.previewMastery}>
                {mockFlashcards[0].mastery}% mastery
              </Text>
            </View>
          </View>
        </View>
      </View>
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
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
  },
  modeButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#8b5cf6",
  },
  modeIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  arrow: {
    fontSize: 24,
    color: "#8b5cf6",
  },
  statsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#8b5cf6",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  previewContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#8b5cf6",
  },
  previewQuestion: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 12,
  },
  previewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewCategory: {
    fontSize: 12,
    color: "#8b5cf6",
    fontWeight: "500",
  },
  previewMastery: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
  },
});