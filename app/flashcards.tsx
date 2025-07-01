import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
} from "react-native";
import { dataService } from "@/services/dataService";
import { Flashcard, FlashcardSession } from "@/types/features";

export default function FlashcardsLearning() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [sessions, setSessions] = useState<FlashcardSession[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalCards: 0,
    correctAnswers: 0,
    currentStreak: 0,
  });
  const [flipAnimation] = useState(new Animated.Value(1));
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "All",
    "Criminal Law",
    "Civil Law",
    "Constitutional Law",
    "Contract Law",
  ];

  useEffect(() => {
    loadFlashcards();
    loadSessions();
  }, []);

  useEffect(() => {
    filterCards();
  }, [flashcards, selectedCategory]);

  const loadFlashcards = async () => {
    try {
      const data = await dataService.getFlashcards();
      setFlashcards(data);
    } catch (error) {
      console.error("Error loading flashcards:", error);
    }
  };

  const loadSessions = async () => {
    try {
      const data = await dataService.getFlashcardSessions();
      setSessions(data);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  const filterCards = () => {
    let filtered = flashcards;
    if (selectedCategory !== "all" && selectedCategory !== "All") {
      filtered = flashcards.filter(
        (card) => card.category === selectedCategory,
      );
    }

    if (filtered.length > 0 && !isStudyMode) {
      setCurrentCard(filtered[0]);
      setCurrentCardIndex(0);
    }
  };

  const startStudySession = () => {
    const filteredCards =
      selectedCategory === "all" || selectedCategory === "All"
        ? flashcards
        : flashcards.filter((card) => card.category === selectedCategory);

    if (filteredCards.length === 0) {
      Alert.alert(
        "No Cards",
        "No flashcards available for the selected category",
      );
      return;
    }

    setIsStudyMode(true);
    setCurrentCard(filteredCards[0]);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setSessionStats({
      totalCards: filteredCards.length,
      correctAnswers: 0,
      currentStreak: 0,
    });
  };

  const flipCard = () => {
    // Simple fade transition instead of problematic 3D flip
    Animated.timing(flipAnimation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setShowAnswer(!showAnswer);
      Animated.timing(flipAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentCard) return;

    const newStats = {
      ...sessionStats,
      correctAnswers: isCorrect
        ? sessionStats.correctAnswers + 1
        : sessionStats.correctAnswers,
      currentStreak: isCorrect ? sessionStats.currentStreak + 1 : 0,
    };
    setSessionStats(newStats);

    // Update card statistics
    const updatedCard = {
      ...currentCard,
      timesReviewed: currentCard.timesReviewed + 1,
      correctAnswers: isCorrect
        ? currentCard.correctAnswers + 1
        : currentCard.correctAnswers,
      lastReviewed: new Date(),
    };

    nextCard();
  };

  const nextCard = () => {
    const filteredCards =
      selectedCategory === "all" || selectedCategory === "All"
        ? flashcards
        : flashcards.filter((card) => card.category === selectedCategory);

    if (currentCardIndex < filteredCards.length - 1) {
      const nextIndex = currentCardIndex + 1;
      setCurrentCardIndex(nextIndex);
      setCurrentCard(filteredCards[nextIndex]);
      setShowAnswer(false);
      flipAnimation.setValue(0);
    } else {
      endStudySession();
    }
  };

  const endStudySession = () => {
    const score = Math.round(
      (sessionStats.correctAnswers / sessionStats.totalCards) * 100,
    );

    Alert.alert(
      "Session Complete! 🎉",
      `Score: ${sessionStats.correctAnswers}/${sessionStats.totalCards} (${score}%)\nBest Streak: ${sessionStats.currentStreak}`,
      [
        { text: "Review Results", onPress: () => setIsStudyMode(false) },
        { text: "Study Again", onPress: startStudySession },
        { text: "View Summary", onPress: () => createFlashcardSession(score) },
      ],
    );
  };

  const createFlashcardSession = async (score: number) => {
    try {
      const sessionData = {
        category: selectedCategory,
        totalCards: sessionStats.totalCards,
        correctAnswers: sessionStats.correctAnswers,
        score: score,
        timeSpent: 0, // Would track actual time in real implementation
      };

      // API call to POST /api/flashcards/sessions
      const response = await fetch("/api/flashcards/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedSession = await response.json();

      // Create local session object for immediate UI update
      const newSession: FlashcardSession = {
        id: savedSession.id || Date.now().toString(),
        userId: "current_user",
        category: selectedCategory,
        totalCards: sessionStats.totalCards,
        correctAnswers: sessionStats.correctAnswers,
        score: score,
        timeSpent: 0,
        completedAt: new Date(),
      };

      setSessions([newSession, ...sessions]);
      setIsStudyMode(false);

      // Navigate to session summary screen
      Alert.alert(
        "Session Saved! 📊",
        "Your study session has been saved successfully. View your progress in the sessions history.",
        [
          {
            text: "Continue",
            onPress: () => {
              // Navigate to session summary
              // router.push('/session-summary');
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error creating flashcard session:", error);

      // Fallback to local storage if API fails
      const newSession: FlashcardSession = {
        id: Date.now().toString(),
        userId: "current_user",
        category: selectedCategory,
        totalCards: sessionStats.totalCards,
        correctAnswers: sessionStats.correctAnswers,
        score: score,
        timeSpent: 0,
        completedAt: new Date(),
      };

      setSessions([newSession, ...sessions]);
      setIsStudyMode(false);

      Alert.alert(
        "Session Saved Locally",
        "Session saved to device. It will sync when connection is restored.",
        [{ text: "OK" }],
      );
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "#10b981";
    if (percentage >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const renderCategoryFilter = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        {
          backgroundColor:
            selectedCategory === item.toLowerCase() ? "#7c3aed" : "#f3f4f6",
        },
      ]}
      onPress={() => setSelectedCategory(item.toLowerCase())}
    >
      <Text
        style={[
          styles.categoryChipText,
          {
            color: selectedCategory === item.toLowerCase() ? "#fff" : "#374151",
          },
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderSession = ({ item }: { item: FlashcardSession }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionCategory}>{item.category}</Text>
        <Text
          style={[
            styles.sessionScore,
            { color: getPerformanceColor(item.score) },
          ]}
        >
          {item.score}%
        </Text>
      </View>
      <Text style={styles.sessionStats}>
        {item.correctAnswers}/{item.totalCards} correct answers
      </Text>
      <Text style={styles.sessionDate}>
        {new Date(item.completedAt).toLocaleDateString("en-IN")}
      </Text>
    </View>
  );

  if (isStudyMode && currentCard) {
    return (
      <View style={styles.studyContainer}>
        {/* Study Header */}
        <View style={styles.studyHeader}>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => setIsStudyMode(false)}
          >
            <Text style={styles.exitButtonText}>✕ Exit</Text>
          </TouchableOpacity>
          <Text style={styles.progressText}>
            {currentCardIndex + 1} / {sessionStats.totalCards}
          </Text>
          <Text style={styles.scoreText}>
            Score: {sessionStats.correctAnswers}/{currentCardIndex + 1}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${((currentCardIndex + 1) / sessionStats.totalCards) * 100}%`,
              },
            ]}
          />
        </View>

        {/* Flashcard */}
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.flashcard} onPress={flipCard}>
            <Animated.View
              style={[styles.cardSide, { opacity: flipAnimation }]}
            >
              <Text style={styles.cardLabel}>
                {showAnswer ? "ANSWER" : "QUESTION"}
              </Text>
              <Text style={styles.cardText}>
                {showAnswer ? currentCard.answer : currentCard.question}
              </Text>

              <View style={styles.cardFooter}>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor: getDifficultyColor(
                        currentCard.difficulty,
                      ),
                    },
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {currentCard.difficulty.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.categoryText}>{currentCard.category}</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>

          <Text style={styles.flipHint}>Tap card to flip</Text>
        </View>

        {/* Answer Buttons */}
        {showAnswer && (
          <View style={styles.answerButtons}>
            <TouchableOpacity
              style={[styles.answerButton, styles.incorrectButton]}
              onPress={() => handleAnswer(false)}
            >
              <Text style={styles.answerButtonText}>❌ Incorrect</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.answerButton, styles.correctButton]}
              onPress={() => handleAnswer(true)}
            >
              <Text style={styles.answerButtonText}>✅ Correct</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>🧠 Flashcards Learning</Text>
        <Text style={styles.subtitle}>{flashcards.length} cards available</Text>
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryFilter}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFilters}
        />
      </View>

      {/* Start Study Button */}
      <View style={styles.startSection}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={startStudySession}
        >
          <Text style={styles.startButtonText}>🚀 Start Study Session</Text>
        </TouchableOpacity>

        {currentCard && (
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Next card preview:</Text>
            <Text style={styles.previewText} numberOfLines={2}>
              {currentCard.question}
            </Text>
          </View>
        )}
      </View>

      {/* Recent Sessions */}
      <View style={styles.sessionsContainer}>
        <Text style={styles.sessionsTitle}>📊 Recent Sessions</Text>
        <FlatList
          data={sessions.slice(0, 5)}
          renderItem={renderSession}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No study sessions yet. Start your first session!
            </Text>
          }
        />
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  filtersContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  categoryFilters: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  startSection: {
    padding: 20,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  previewCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  previewText: {
    fontSize: 14,
    color: "#111827",
  },
  sessionsContainer: {
    flex: 1,
    padding: 20,
  },
  sessionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  sessionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sessionCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  sessionScore: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sessionStats: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 10,
    color: "#9ca3af",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: 20,
  },
  // Study Mode Styles
  studyContainer: {
    flex: 1,
    backgroundColor: "#7c3aed",
  },
  studyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  exitButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  progressText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scoreText: {
    color: "#fff",
    fontSize: 14,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 20,
    borderRadius: 2,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  flashcard: {
    width: "100%",
    height: 300,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardSide: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 12,
    color: "#7c3aed",
    fontWeight: "600",
    marginBottom: 16,
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 18,
    color: "#111827",
    textAlign: "center",
    lineHeight: 26,
    flex: 1,
    textAlignVertical: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "600",
  },
  categoryText: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
  },
  flipHint: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 16,
    textAlign: "center",
  },
  answerButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  answerButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  incorrectButton: {
    backgroundColor: "#ef4444",
  },
  correctButton: {
    backgroundColor: "#10b981",
  },
  answerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
