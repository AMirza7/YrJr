import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { useModal } from "@/contexts/ModalContext";

const { width, height } = Dimensions.get("window");

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  mastery: number; // 0-100
}

interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  cardsStudied: number;
  correctAnswers: number;
  score: number;
  streak: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  prize: string;
  endDate: Date;
  type: "speed" | "accuracy" | "endurance" | "daily";
  isActive: boolean;
}

interface Competitor {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatar: string;
  isOnline: boolean;
}

interface AdvancedFlashcardsProps {
  cards: Flashcard[];
  onClose?: () => void;
}

export default function AdvancedFlashcards({
  cards,
  onClose,
}: AdvancedFlashcardsProps) {
  const { showSuccess, showError, showConfirm } = useModal();
  const [currentMode, setCurrentMode] = useState<
    "study" | "challenge" | "leaderboard" | "achievements"
  >("study");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [studyMode, setStudyMode] = useState<"normal" | "timed" | "infinite">(
    "normal",
  );
  const [difficulty, setDifficulty] = useState<
    "all" | "easy" | "medium" | "hard"
  >("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");

  // Animation values
  const [flipAnimation] = useState(new Animated.Value(0));
  const [slideAnimation] = useState(new Animated.Value(0));

  const filteredCards = cards.filter(
    (card) => difficulty === "all" || card.difficulty === difficulty,
  );

  const currentCard = filteredCards[currentCardIndex];

  const challenges: Challenge[] = [
    {
      id: "1",
      title: "⚡ Speed Master",
      description: "Answer 50 cards in under 5 minutes",
      participants: 234,
      prize: "Gold Badge + 1000 XP",
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      type: "speed",
      isActive: true,
    },
    {
      id: "2",
      title: "🎯 Accuracy Champion",
      description: "Achieve 95% accuracy in 30 cards",
      participants: 156,
      prize: "Platinum Badge + 2000 XP",
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      type: "accuracy",
      isActive: true,
    },
    {
      id: "3",
      title: "🔥 Daily Streak",
      description: "Study for 7 consecutive days",
      participants: 89,
      prize: "Diamond Badge + 5000 XP",
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      type: "daily",
      isActive: true,
    },
  ];

  const leaderboard: Competitor[] = [
    {
      id: "1",
      name: "Legal Eagle",
      score: 12450,
      rank: 1,
      avatar: "🦅",
      isOnline: true,
    },
    {
      id: "2",
      name: "Court Master",
      score: 11200,
      rank: 2,
      avatar: "⚖️",
      isOnline: true,
    },
    {
      id: "3",
      name: "Law Genius",
      score: 10800,
      rank: 3,
      avatar: "🧠",
      isOnline: false,
    },
    {
      id: "4",
      name: "Justice Seeker",
      score: 9500,
      rank: 4,
      avatar: "🏛️",
      isOnline: true,
    },
    {
      id: "5",
      name: "Legal Scholar",
      score: 8900,
      rank: 5,
      avatar: "📚",
      isOnline: false,
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const startTimedMode = () => {
    setStudyMode("timed");
    setTimeLeft(60);
    setIsTimerActive(true);
    setScore(0);
    setStreak(0);
    showSuccess("⏱️ Timed mode started! 60 seconds on the clock");
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    showSuccess(`⏰ Time's up! Final score: ${score} points`);
  };

  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const nextCard = (isCorrect?: boolean) => {
    if (isCorrect !== undefined) {
      if (isCorrect) {
        setStreak(streak + 1);
        setScore(score + 10 * (streak + 1));
        showSuccess(`🎉 Correct! +${10 * (streak + 1)} points`);
      } else {
        setStreak(0);
        showError("❌ Incorrect. Streak reset!");
      }
    }

    if (currentCardIndex < filteredCards.length - 1) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
        flipAnimation.setValue(0);
        slideAnimation.setValue(0);
      });
    } else {
      // Session complete
      setIsTimerActive(false);
      showSuccess(`🏆 Session complete! Final score: ${score}`);
    }
  };

  const inviteFriend = () => {
    if (!friendEmail) {
      showError("Please enter a valid email address");
      return;
    }

    showSuccess(
      `Invitation sent to ${friendEmail}! They'll receive a challenge link.`,
    );
    setFriendEmail("");
    setShowInviteModal(false);
  };

  const joinChallenge = (challenge: Challenge) => {
    showConfirm(
      `Join ${challenge.title}?`,
      `${challenge.description}\n\nPrize: ${challenge.prize}\nParticipants: ${challenge.participants}`,
      () => {
        showSuccess("🎮 Challenge joined! Good luck!");
        setCurrentMode("study");
        startTimedMode();
      },
      "primary",
      "Join Challenge",
    );
  };

  const renderStudyMode = () => {
    const frontInterpolate = flipAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });

    const backInterpolate = flipAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["180deg", "360deg"],
    });

    const slideTranslate = slideAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -width],
    });

    return (
      <View style={styles.studyContainer}>
        {/* Study Mode Controls */}
        <View style={styles.modeControls}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              studyMode === "normal" && styles.modeButtonActive,
            ]}
            onPress={() => setStudyMode("normal")}
          >
            <Text
              style={[
                styles.modeButtonText,
                studyMode === "normal" && styles.modeButtonTextActive,
              ]}
            >
              📚 Normal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              studyMode === "timed" && styles.modeButtonActive,
            ]}
            onPress={startTimedMode}
          >
            <Text
              style={[
                styles.modeButtonText,
                studyMode === "timed" && styles.modeButtonTextActive,
              ]}
            >
              ⏱️ Timed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              studyMode === "infinite" && styles.modeButtonActive,
            ]}
            onPress={() => setStudyMode("infinite")}
          >
            <Text
              style={[
                styles.modeButtonText,
                studyMode === "infinite" && styles.modeButtonTextActive,
              ]}
            >
              ♾️ Infinite
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>🔥 {streak}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Progress</Text>
            <Text style={styles.statValue}>
              {currentCardIndex + 1}/{filteredCards.length}
            </Text>
          </View>
          {isTimerActive && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Time</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: timeLeft <= 10 ? "#dc2626" : "#059669" },
                ]}
              >
                {timeLeft}s
              </Text>
            </View>
          )}
        </View>

        {/* Flashcard */}
        <View style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.card,
              { transform: [{ translateX: slideTranslate }] },
            ]}
          >
            <TouchableOpacity style={styles.cardTouchable} onPress={flipCard}>
              <Animated.View
                style={[
                  styles.cardFace,
                  styles.cardFront,
                  { transform: [{ rotateY: frontInterpolate }] },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardCategory}>
                    {currentCard?.category}
                  </Text>
                  <View
                    style={[
                      styles.difficultyBadge,
                      styles[`difficulty${currentCard?.difficulty}`],
                    ]}
                  >
                    <Text style={styles.difficultyText}>
                      {currentCard?.difficulty}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardQuestion}>{currentCard?.question}</Text>
                <Text style={styles.tapHint}>Tap to reveal answer</Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.cardFace,
                  styles.cardBack,
                  { transform: [{ rotateY: backInterpolate }] },
                ]}
              >
                <Text style={styles.cardAnswer}>{currentCard?.answer}</Text>
                <View style={styles.masteryBar}>
                  <Text style={styles.masteryLabel}>
                    Mastery: {currentCard?.mastery}%
                  </Text>
                  <View style={styles.masteryProgress}>
                    <View
                      style={[
                        styles.masteryFill,
                        { width: `${currentCard?.mastery}%` },
                      ]}
                    />
                  </View>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Action Buttons */}
        {isFlipped && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.incorrectButton]}
              onPress={() => nextCard(false)}
            >
              <Text style={styles.actionButtonText}>❌ Incorrect</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.correctButton]}
              onPress={() => nextCard(true)}
            >
              <Text style={styles.actionButtonText}>✅ Correct</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Skip Button */}
        {!isFlipped && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => nextCard()}
          >
            <Text style={styles.skipButtonText}>Skip ⏭️</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderChallenges = () => (
    <ScrollView style={styles.challengesContainer}>
      <View style={styles.challengesHeader}>
        <Text style={styles.challengesTitle}>🎮 Active Challenges</Text>
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => setShowInviteModal(true)}
        >
          <Text style={styles.inviteButtonText}>Invite Friends</Text>
        </TouchableOpacity>
      </View>

      {challenges.map((challenge) => (
        <View key={challenge.id} style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <View style={styles.challengeStatus}>
              <Text style={styles.participantsText}>
                {challenge.participants} players
              </Text>
            </View>
          </View>

          <Text style={styles.challengeDescription}>
            {challenge.description}
          </Text>

          <View style={styles.challengeFooter}>
            <View>
              <Text style={styles.challengePrize}>🏆 {challenge.prize}</Text>
              <Text style={styles.challengeTime}>
                Ends: {challenge.endDate.toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => joinChallenge(challenge)}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.createChallengeCard}>
        <Text style={styles.createChallengeTitle}>
          🎯 Create Custom Challenge
        </Text>
        <Text style={styles.createChallengeDescription}>
          Challenge your friends to a custom study session
        </Text>
        <TouchableOpacity
          style={styles.createChallengeButton}
          onPress={() => showSuccess("Custom challenge creator coming soon!")}
        >
          <Text style={styles.createChallengeButtonText}>Create Challenge</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderLeaderboard = () => (
    <ScrollView style={styles.leaderboardContainer}>
      <Text style={styles.leaderboardTitle}>🏆 Global Leaderboard</Text>
      <Text style={styles.leaderboardSubtitle}>Top performers this week</Text>

      {leaderboard.map((competitor, index) => (
        <View key={competitor.id} style={styles.leaderboardItem}>
          <View style={styles.rankContainer}>
            <Text style={styles.rankNumber}>#{competitor.rank}</Text>
            {index < 3 && (
              <Text style={styles.medalIcon}>
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
              </Text>
            )}
          </View>

          <View style={styles.competitorInfo}>
            <View style={styles.competitorHeader}>
              <Text style={styles.competitorAvatar}>{competitor.avatar}</Text>
              <View>
                <Text style={styles.competitorName}>{competitor.name}</Text>
                <View style={styles.onlineStatus}>
                  <View
                    style={[
                      styles.onlineIndicator,
                      competitor.isOnline && styles.onlineIndicatorActive,
                    ]}
                  />
                  <Text style={styles.onlineText}>
                    {competitor.isOnline ? "Online" : "Offline"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.competitorScore}>
            {competitor.score.toLocaleString()}
          </Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.challengePlayerButton}
        onPress={() => showSuccess("Friend challenge feature coming soon!")}
      >
        <Text style={styles.challengePlayerButtonText}>
          🎯 Challenge a Friend
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderAchievements = () => (
    <ScrollView style={styles.achievementsContainer}>
      <Text style={styles.achievementsTitle}>🏅 Achievements</Text>

      <View style={styles.achievementCard}>
        <Text style={styles.achievementIcon}>🔥</Text>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementName}>Study Streak</Text>
          <Text style={styles.achievementDescription}>
            Study for 7 consecutive days
          </Text>
          <View style={styles.achievementProgress}>
            <View style={[styles.achievementFill, { width: "57%" }]} />
          </View>
          <Text style={styles.achievementProgressText}>4/7 days</Text>
        </View>
      </View>

      <View style={styles.achievementCard}>
        <Text style={styles.achievementIcon}>⚡</Text>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementName}>Speed Demon</Text>
          <Text style={styles.achievementDescription}>
            Answer 100 cards in under 10 minutes
          </Text>
          <View style={styles.achievementProgress}>
            <View style={[styles.achievementFill, { width: "80%" }]} />
          </View>
          <Text style={styles.achievementProgressText}>80/100 cards</Text>
        </View>
      </View>

      <View style={styles.achievementCard}>
        <Text style={styles.achievementIcon}>🎯</Text>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementName}>Perfect Score</Text>
          <Text style={styles.achievementDescription}>
            Get 100% accuracy in 20 cards
          </Text>
          <View style={styles.achievementProgress}>
            <View style={[styles.achievementFill, { width: "100%" }]} />
          </View>
          <Text style={styles.achievementProgressText}>Completed! 🎉</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Learning</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentMode === "study" && styles.tabActive]}
          onPress={() => setCurrentMode("study")}
        >
          <Text
            style={[
              styles.tabText,
              currentMode === "study" && styles.tabTextActive,
            ]}
          >
            📚 Study
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentMode === "challenge" && styles.tabActive]}
          onPress={() => setCurrentMode("challenge")}
        >
          <Text
            style={[
              styles.tabText,
              currentMode === "challenge" && styles.tabTextActive,
            ]}
          >
            🎮 Challenges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            currentMode === "leaderboard" && styles.tabActive,
          ]}
          onPress={() => setCurrentMode("leaderboard")}
        >
          <Text
            style={[
              styles.tabText,
              currentMode === "leaderboard" && styles.tabTextActive,
            ]}
          >
            🏆 Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            currentMode === "achievements" && styles.tabActive,
          ]}
          onPress={() => setCurrentMode("achievements")}
        >
          <Text
            style={[
              styles.tabText,
              currentMode === "achievements" && styles.tabTextActive,
            ]}
          >
            🏅 Rewards
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {currentMode === "study" && renderStudyMode()}
        {currentMode === "challenge" && renderChallenges()}
        {currentMode === "leaderboard" && renderLeaderboard()}
        {currentMode === "achievements" && renderAchievements()}
      </View>

      {/* Invite Friends Modal */}
      <Modal
        visible={showInviteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎮 Invite Friends</Text>
            <Text style={styles.modalDescription}>
              Challenge your friends to a study session!
            </Text>

            <TextInput
              style={styles.modalInput}
              value={friendEmail}
              onChangeText={setFriendEmail}
              placeholder="Enter friend's email address"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowInviteModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSendButton}
                onPress={inviteFriend}
              >
                <Text style={styles.modalSendText}>Send Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#8b5cf6",
    paddingTop: 50,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#fff",
    marginRight: 4,
  },
  backText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  headerSpacer: {
    width: 60,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#8b5cf6",
  },
  tabText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#8b5cf6",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  studyContainer: {
    flex: 1,
    padding: 16,
  },
  modeControls: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  modeButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  modeButtonTextActive: {
    color: "#fff",
  },
  statsBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    width: width - 32,
    height: height * 0.4,
    position: "relative",
  },
  cardTouchable: {
    flex: 1,
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 16,
    padding: 24,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  cardFront: {
    backgroundColor: "#fff",
  },
  cardBack: {
    backgroundColor: "#8b5cf6",
    transform: [{ rotateY: "180deg" }],
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardCategory: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyeasy: {
    backgroundColor: "#d1fae5",
  },
  difficultymedium: {
    backgroundColor: "#fef3c7",
  },
  difficultyhard: {
    backgroundColor: "#fee2e2",
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardQuestion: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 20,
  },
  tapHint: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    fontStyle: "italic",
  },
  cardAnswer: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 20,
  },
  masteryBar: {
    marginTop: 20,
  },
  masteryLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
  },
  masteryProgress: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  masteryFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  incorrectButton: {
    backgroundColor: "#dc2626",
  },
  correctButton: {
    backgroundColor: "#059669",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  skipButtonText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  challengesContainer: {
    flex: 1,
    padding: 16,
  },
  challengesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  challengesTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  inviteButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inviteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  challengeCard: {
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
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  challengeStatus: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  participantsText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  challengeDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  challengeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  challengePrize: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "600",
    marginBottom: 4,
  },
  challengeTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  joinButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  createChallengeCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#bfdbfe",
    borderStyle: "dashed",
  },
  createChallengeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 8,
  },
  createChallengeDescription: {
    fontSize: 14,
    color: "#3730a3",
    textAlign: "center",
    marginBottom: 16,
  },
  createChallengeButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createChallengeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  leaderboardContainer: {
    flex: 1,
    padding: 16,
  },
  leaderboardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  leaderboardSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 60,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },
  medalIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  competitorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  competitorHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  competitorAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  competitorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  onlineStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9ca3af",
    marginRight: 6,
  },
  onlineIndicatorActive: {
    backgroundColor: "#10b981",
  },
  onlineText: {
    fontSize: 12,
    color: "#6b7280",
  },
  competitorScore: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8b5cf6",
  },
  challengePlayerButton: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  challengePlayerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  achievementsContainer: {
    flex: 1,
    padding: 16,
  },
  achievementsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 24,
  },
  achievementCard: {
    flexDirection: "row",
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
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  achievementProgress: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  achievementFill: {
    height: "100%",
    backgroundColor: "#8b5cf6",
    borderRadius: 3,
  },
  achievementProgressText: {
    fontSize: 12,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },
  modalSendButton: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalSendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
