import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PanGestureHandler,
  State,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
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
import { Flashcard, FlashcardProgress, QuizSession } from "@/types";

interface FlashcardLearningProps {
  style?: any;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const CARD_WIDTH = screenWidth - Spacing.xl;
const CARD_HEIGHT = screenHeight * 0.6;
const SWIPE_THRESHOLD = screenWidth * 0.25;

// Mock flashcards data
const MOCK_FLASHCARDS: Flashcard[] = [
  {
    id: "1",
    question: "What is the punishment for murder under IPC Section 302?",
    answer:
      "Death penalty or life imprisonment with fine. This is one of the most serious offenses under Indian criminal law.",
    category: "ipc",
    difficulty: "medium",
    tags: ["murder", "punishment", "section-302"],
    examples: [
      "State vs. Rajesh Kumar (2018)",
      "Bachan Singh vs. State of Punjab",
    ],
    relatedSections: ["300", "304"],
  },
  {
    id: "2",
    question: "Define 'theft' under Section 379 of IPC",
    answer:
      "Whoever intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property, commits theft.",
    category: "ipc",
    difficulty: "easy",
    tags: ["theft", "definition", "section-379"],
    examples: ["Pyarelal vs. State of Rajasthan"],
    relatedSections: ["378", "380"],
  },
  {
    id: "3",
    question: "What is the significance of Kesavananda Bharati case?",
    answer:
      "Established the 'basic structure doctrine' - Parliament cannot amend the basic structure of the Constitution. This landmark judgment preserved the essence of constitutional democracy.",
    category: "landmark_cases",
    difficulty: "hard",
    tags: ["constitution", "basic-structure", "landmark"],
    examples: ["Article 368 amendment powers"],
    relatedSections: ["Article 368"],
  },
  {
    id: "4",
    question: "Under CrPC, what is anticipatory bail?",
    answer:
      "Bail granted in anticipation of arrest under Section 438 CrPC. Allows person to seek protection from arrest in cognizable and non-bailable offenses.",
    category: "crpc",
    difficulty: "medium",
    tags: ["bail", "anticipatory", "section-438"],
    examples: ["Gurbaksh Singh vs. State of Punjab"],
    relatedSections: ["437", "439"],
  },
  {
    id: "5",
    question: "What are the essentials of a valid contract?",
    answer:
      "1) Offer and acceptance 2) Consideration 3) Capacity to contract 4) Free consent 5) Lawful object 6) Not expressly void.",
    category: "constitution",
    difficulty: "easy",
    tags: ["contract", "essentials", "validity"],
    examples: ["Balfour vs. Balfour", "Carlill vs. Carbolic Smoke Ball Co."],
    relatedSections: ["Section 10 Contract Act"],
  },
];

const CATEGORIES = [
  { id: "all", label: "All Topics", icon: "library", color: "#8B5CF6" },
  { id: "ipc", label: "IPC", icon: "document-text", color: "#EF4444" },
  { id: "crpc", label: "CrPC", icon: "hammer", color: "#F59E0B" },
  {
    id: "landmark_cases",
    label: "Landmark Cases",
    icon: "trophy",
    color: "#10B981",
  },
  { id: "constitution", label: "Constitution", icon: "flag", color: "#3B82F6" },
  { id: "evidence_act", label: "Evidence Act", icon: "eye", color: "#EC4899" },
];

const DIFFICULTIES = [
  { id: "all", label: "All Levels", color: "#6B7280" },
  { id: "easy", label: "Easy", color: "#10B981" },
  { id: "medium", label: "Medium", color: "#F59E0B" },
  { id: "hard", label: "Hard", color: "#EF4444" },
];

export function FlashcardLearning({ style }: FlashcardLearningProps) {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const [cards, setCards] = useState<Flashcard[]>(MOCK_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState<"learn" | "quiz">("learn");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [progress, setProgress] = useState<{
    [key: string]: FlashcardProgress;
  }>({});
  const [showProgress, setShowProgress] = useState(false);

  const translateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const filteredCards = cards.filter((card) => {
    const categoryMatch =
      selectedCategory === "all" || card.category === selectedCategory;
    const difficultyMatch =
      selectedDifficulty === "all" || card.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const currentCard = filteredCards[currentIndex];

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (mode === "quiz" && !quizSession) {
      startQuizSession();
    }
  }, [mode]);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem("flashcard_progress");
      if (stored) {
        const parsedProgress = JSON.parse(stored);
        // Convert date strings back to Date objects
        Object.keys(parsedProgress).forEach((key) => {
          parsedProgress[key].lastReviewed = new Date(
            parsedProgress[key].lastReviewed,
          );
          parsedProgress[key].nextReview = new Date(
            parsedProgress[key].nextReview,
          );
        });
        setProgress(parsedProgress);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const saveProgress = async (newProgress: {
    [key: string]: FlashcardProgress;
  }) => {
    try {
      await AsyncStorage.setItem(
        "flashcard_progress",
        JSON.stringify(newProgress),
      );
      setProgress(newProgress);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const startQuizSession = () => {
    const session: QuizSession = {
      id: Date.now().toString(),
      userId: "current_user",
      cards: [...filteredCards].sort(() => Math.random() - 0.5), // Shuffle cards
      currentIndex: 0,
      score: 0,
      totalQuestions: Math.min(filteredCards.length, 10), // Max 10 questions
      startTime: new Date(),
      mode: "quiz",
      category: selectedCategory,
    };
    setQuizSession(session);
    setCurrentIndex(0);
  };

  const endQuizSession = () => {
    if (quizSession) {
      const endTime = new Date();
      const finalSession = { ...quizSession, endTime };

      Alert.alert(
        "Quiz Complete!",
        `Score: ${finalSession.score}/${finalSession.totalQuestions}\nAccuracy: ${Math.round((finalSession.score / finalSession.totalQuestions) * 100)}%`,
        [
          {
            text: "Review",
            onPress: () => setShowProgress(true),
          },
          {
            text: "New Quiz",
            onPress: () => {
              setQuizSession(null);
              startQuizSession();
            },
          },
          {
            text: "Learn Mode",
            onPress: () => {
              setQuizSession(null);
              setMode("learn");
            },
          },
        ],
      );
    }
  };

  const handleAnswer = (correct: boolean) => {
    if (mode === "quiz" && quizSession && currentCard) {
      const newSession = {
        ...quizSession,
        score: correct ? quizSession.score + 1 : quizSession.score,
        currentIndex: quizSession.currentIndex + 1,
      };
      setQuizSession(newSession);

      // Update card progress
      const cardProgress = progress[currentCard.id] || {
        cardId: currentCard.id,
        correct: 0,
        incorrect: 0,
        lastReviewed: new Date(),
        confidence: 50,
        nextReview: new Date(),
      };

      const updatedProgress = {
        ...progress,
        [currentCard.id]: {
          ...cardProgress,
          correct: correct ? cardProgress.correct + 1 : cardProgress.correct,
          incorrect: correct
            ? cardProgress.incorrect
            : cardProgress.incorrect + 1,
          lastReviewed: new Date(),
          confidence: Math.max(
            0,
            Math.min(100, cardProgress.confidence + (correct ? 10 : -15)),
          ),
          nextReview: new Date(
            Date.now() + (correct ? 7 : 1) * 24 * 60 * 60 * 1000,
          ),
        },
      };

      saveProgress(updatedProgress);

      if (newSession.currentIndex >= newSession.totalQuestions) {
        endQuizSession();
      } else {
        nextCard();
      }
    }
  };

  const flipCard = () => {
    rotateY.value = withSpring(isFlipped ? 0 : 180, {}, () => {
      runOnJS(setIsFlipped)(!isFlipped);
    });
  };

  const nextCard = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      rotateY.value = 0;
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      rotateY.value = 0;
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(0.95);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      scale.value = withSpring(1);

      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        if (event.translationX > 0) {
          runOnJS(handleAnswer)(true); // Swipe right = correct
        } else {
          runOnJS(handleAnswer)(false); // Swipe left = incorrect
        }
      }

      translateX.value = withSpring(0);
    },
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      translateX.value,
      [-screenWidth / 2, 0, screenWidth / 2],
      [-15, 0, 15],
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotateZ: `${rotateZ}deg` },
        { scale: scale.value },
      ],
    };
  });

  const flipAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value}deg` }],
  }));

  const swipeIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [0, 1],
    );

    const backgroundColor = interpolateColor(
      translateX.value,
      [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [theme.error, theme.background, theme.success],
    );

    return {
      opacity,
      backgroundColor,
    };
  });

  const getCategoryConfig = (categoryId: string) => {
    return CATEGORIES.find((cat) => cat.id === categoryId) || CATEGORIES[0];
  };

  const getDifficultyConfig = (difficultyId: string) => {
    return (
      DIFFICULTIES.find((diff) => diff.id === difficultyId) || DIFFICULTIES[0]
    );
  };

  const getProgressStats = () => {
    const totalReviewed = Object.keys(progress).length;
    const totalCorrect = Object.values(progress).reduce(
      (sum, p) => sum + p.correct,
      0,
    );
    const totalIncorrect = Object.values(progress).reduce(
      (sum, p) => sum + p.incorrect,
      0,
    );
    const avgConfidence =
      totalReviewed > 0
        ? Math.round(
            Object.values(progress).reduce((sum, p) => sum + p.confidence, 0) /
              totalReviewed,
          )
        : 0;

    return {
      totalReviewed,
      totalCorrect,
      totalIncorrect,
      accuracy:
        totalReviewed > 0
          ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
          : 0,
      avgConfidence,
    };
  };

  if (!currentCard) {
    return (
      <View
        style={[
          styles.container,
          styles.emptyContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <Ionicons name="school" size={64} color={theme.textTertiary} />
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          No cards available
        </Text>
        <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
          Try adjusting your filters
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.text }]}>Flashcards</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {currentIndex + 1} of {filteredCards.length}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              {
                backgroundColor:
                  mode === "learn" ? theme.primary : theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setMode("learn")}
          >
            <Ionicons
              name="book"
              size={16}
              color={mode === "learn" ? "white" : theme.textSecondary}
            />
            <Text
              style={[
                styles.modeButtonText,
                {
                  color: mode === "learn" ? "white" : theme.textSecondary,
                },
              ]}
            >
              Learn
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              {
                backgroundColor:
                  mode === "quiz" ? theme.secondary : theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setMode("quiz")}
          >
            <Ionicons
              name="trophy"
              size={16}
              color={mode === "quiz" ? "white" : theme.textSecondary}
            />
            <Text
              style={[
                styles.modeButtonText,
                {
                  color: mode === "quiz" ? "white" : theme.textSecondary,
                },
              ]}
            >
              Quiz
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>
            Category:
          </Text>
          <View style={styles.filterButtons}>
            {CATEGORIES.slice(0, 4).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      selectedCategory === category.id
                        ? category.color
                        : theme.surface,
                    borderColor: category.color,
                  },
                ]}
                onPress={() => {
                  setSelectedCategory(category.id);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
              >
                <Ionicons
                  name={category.icon as any}
                  size={14}
                  color={
                    selectedCategory === category.id ? "white" : category.color
                  }
                />
                <Text
                  style={[
                    styles.filterButtonText,
                    {
                      color:
                        selectedCategory === category.id
                          ? "white"
                          : category.color,
                    },
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: theme.backgroundTertiary },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor:
                  mode === "quiz" ? theme.secondary : theme.primary,
                width: `${((currentIndex + 1) / filteredCards.length) * 100}%`,
              },
            ]}
          />
        </View>

        {mode === "quiz" && quizSession && (
          <Text style={[styles.scoreText, { color: theme.textSecondary }]}>
            Score: {quizSession.score}/{quizSession.totalQuestions}
          </Text>
        )}
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        {/* Swipe Indicator */}
        <Animated.View style={[styles.swipeIndicator, swipeIndicatorStyle]} />

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.cardWrapper, cardAnimatedStyle]}>
            <TouchableOpacity onPress={flipCard} activeOpacity={0.9}>
              <Animated.View style={[flipAnimatedStyle]}>
                <Card style={[styles.flashcard, Shadows.lg]}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View
                        style={[
                          styles.categoryBadge,
                          {
                            backgroundColor: getCategoryConfig(
                              currentCard.category,
                            ).color,
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            getCategoryConfig(currentCard.category).icon as any
                          }
                          size={12}
                          color="white"
                        />
                        <Text style={styles.categoryBadgeText}>
                          {getCategoryConfig(currentCard.category).label}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.difficultyBadge,
                          {
                            backgroundColor: getDifficultyConfig(
                              currentCard.difficulty,
                            ).color,
                          },
                        ]}
                      >
                        <Text style={styles.difficultyBadgeText}>
                          {currentCard.difficulty.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity onPress={flipCard}>
                      <Ionicons
                        name="refresh"
                        size={20}
                        color={theme.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Card Content */}
                  <View style={styles.cardContent}>
                    <Text
                      style={[styles.cardContentText, { color: theme.text }]}
                    >
                      {isFlipped ? currentCard.answer : currentCard.question}
                    </Text>

                    {isFlipped && currentCard.examples && (
                      <View style={styles.examplesContainer}>
                        <Text
                          style={[
                            styles.examplesTitle,
                            { color: theme.textSecondary },
                          ]}
                        >
                          Examples:
                        </Text>
                        {currentCard.examples.map((example, index) => (
                          <Text
                            key={index}
                            style={[
                              styles.exampleText,
                              { color: theme.textTertiary },
                            ]}
                          >
                            • {example}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Card Footer */}
                  <View style={styles.cardFooter}>
                    <Text
                      style={[styles.flipHint, { color: theme.textTertiary }]}
                    >
                      {isFlipped
                        ? "Swipe or tap to continue"
                        : "Tap to reveal answer"}
                    </Text>
                  </View>
                </Card>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {mode === "learn" ? (
          <View style={styles.learnActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              onPress={previousCard}
              disabled={currentIndex === 0}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={
                  currentIndex === 0 ? theme.textTertiary : theme.textSecondary
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.flipButton,
                { backgroundColor: theme.primary },
                Shadows.md,
              ]}
              onPress={flipCard}
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.flipButtonText}>
                {isFlipped ? "Hide Answer" : "Show Answer"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              onPress={nextCard}
              disabled={currentIndex === filteredCards.length - 1}
            >
              <Ionicons
                name="chevron-forward"
                size={24}
                color={
                  currentIndex === filteredCards.length - 1
                    ? theme.textTertiary
                    : theme.textSecondary
                }
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.quizActions}>
            <TouchableOpacity
              style={[
                styles.answerButton,
                styles.incorrectButton,
                { backgroundColor: theme.error },
                Shadows.md,
              ]}
              onPress={() => handleAnswer(false)}
            >
              <Ionicons name="close" size={24} color="white" />
              <Text style={styles.answerButtonText}>Incorrect</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.answerButton,
                styles.correctButton,
                { backgroundColor: theme.success },
                Shadows.md,
              ]}
              onPress={() => handleAnswer(true)}
            >
              <Ionicons name="checkmark" size={24} color="white" />
              <Text style={styles.answerButtonText}>Correct</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Progress Stats */}
      <TouchableOpacity
        style={styles.statsContainer}
        onPress={() => setShowProgress(true)}
      >
        <Text style={[styles.statsText, { color: theme.textSecondary }]}>
          Progress: {getProgressStats().accuracy}% accuracy • Tap for details
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
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
  headerActions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  modeButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  filtersContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  filterRow: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  filterLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    gap: 4,
  },
  filterButtonText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  scoreText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  swipeIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.lg,
    zIndex: -1,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  flashcard: {
    width: "100%",
    height: "100%",
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: "white",
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  difficultyBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: "white",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardContentText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    lineHeight: 28,
    textAlign: "center",
  },
  examplesContainer: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  examplesTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  exampleText: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  cardFooter: {
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  flipHint: {
    fontSize: FontSizes.sm,
    fontStyle: "italic",
  },
  actionsContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  learnActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    flex: 1,
    justifyContent: "center",
  },
  flipButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: "white",
  },
  quizActions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  answerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  correctButton: {},
  incorrectButton: {},
  answerButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: "white",
  },
  statsContainer: {
    alignItems: "center",
    paddingBottom: Spacing.md,
  },
  statsText: {
    fontSize: FontSizes.sm,
  },
});
