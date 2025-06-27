import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { styles } from "@/constants/AppStyles";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: "ipc" | "crpc" | "landmark_cases" | "constitution" | "evidence_act";
  difficulty: "easy" | "medium" | "hard";
}

const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: "1",
    question: "What is the definition of 'Murder' under IPC?",
    answer:
      "Murder is defined under Section 300 of IPC as culpable homicide with the intention of causing death, or with knowledge that the act is likely to cause death.",
    category: "ipc",
    difficulty: "medium",
  },
  {
    id: "2",
    question: "Under which section of CrPC can police arrest without warrant?",
    answer:
      "Section 154 of CrPC empowers police to arrest without warrant in cognizable offenses.",
    category: "crpc",
    difficulty: "easy",
  },
  {
    id: "3",
    question: "What was the landmark judgment in Kesavananda Bharati case?",
    answer:
      "The Supreme Court established the 'Basic Structure Doctrine' which limits Parliament's power to amend the Constitution.",
    category: "landmark_cases",
    difficulty: "hard",
  },
  {
    id: "4",
    question: "Which Article of Constitution deals with Right to Equality?",
    answer:
      "Article 14 of the Indian Constitution guarantees the Right to Equality before law.",
    category: "constitution",
    difficulty: "easy",
  },
];

export default function FlashcardsScreen() {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Categories", icon: "📚" },
    { id: "ipc", name: "IPC", icon: "⚖️" },
    { id: "crpc", name: "CrPC", icon: "🏛️" },
    { id: "landmark_cases", name: "Landmark Cases", icon: "🏆" },
    { id: "constitution", name: "Constitution", icon: "📜" },
    { id: "evidence_act", name: "Evidence Act", icon: "🔍" },
  ];

  const filteredCards =
    selectedCategory === "all"
      ? SAMPLE_FLASHCARDS
      : SAMPLE_FLASHCARDS.filter((card) => card.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const handleNext = () => {
    if (currentCard < filteredCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      Alert.alert(
        "Completed!",
        "You've finished all flashcards in this category.",
      );
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  const resetCards = () => {
    setCurrentCard(0);
    setShowAnswer(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={styles.title}>🎯 Legal Flashcards</Text>
            <Text style={styles.subtitle}>
              Learn legal concepts interactively
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "#64748b",
                paddingHorizontal: 12,
                paddingVertical: 8,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { fontSize: 14 }]}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Category Selector */}
        <Text
          style={[
            styles.text,
            { fontSize: 16, fontWeight: "600", marginBottom: 12 },
          ]}
        >
          Select Category
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
        >
          <View style={{ flexDirection: "row", gap: 8 }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      selectedCategory === category.id ? "#1e40af" : "#f1f5f9",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                  },
                ]}
                onPress={() => {
                  setSelectedCategory(category.id);
                  resetCards();
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color:
                        selectedCategory === category.id
                          ? "#ffffff"
                          : "#64748b",
                      fontSize: 14,
                    },
                  ]}
                >
                  {category.icon} {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {filteredCards.length > 0 ? (
          <>
            {/* Progress */}
            <View style={[styles.card, { marginBottom: 16 }]}>
              <Text
                style={[
                  styles.text,
                  { textAlign: "center", fontSize: 16, fontWeight: "600" },
                ]}
              >
                Card {currentCard + 1} of {filteredCards.length}
              </Text>
              <View
                style={{
                  backgroundColor: "#e2e8f0",
                  height: 8,
                  borderRadius: 4,
                  marginTop: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#1e40af",
                    height: 8,
                    borderRadius: 4,
                    width: `${((currentCard + 1) / filteredCards.length) * 100}%`,
                  }}
                />
              </View>
            </View>

            {/* Flashcard */}
            <TouchableOpacity
              style={[
                styles.card,
                {
                  minHeight: 200,
                  justifyContent: "center",
                  backgroundColor: showAnswer ? "#f0f9ff" : "#ffffff",
                  marginBottom: 20,
                },
              ]}
              onPress={() => setShowAnswer(!showAnswer)}
            >
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: getDifficultyColor(
                      filteredCards[currentCard].difficulty,
                    ),
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {filteredCards[currentCard].difficulty.toUpperCase()}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.text,
                    {
                      textAlign: "center",
                      fontSize: 18,
                      fontWeight: "600",
                      marginBottom: 16,
                    },
                  ]}
                >
                  {showAnswer ? "Answer" : "Question"}
                </Text>

                <Text
                  style={[styles.text, { textAlign: "center", fontSize: 16 }]}
                >
                  {showAnswer
                    ? filteredCards[currentCard].answer
                    : filteredCards[currentCard].question}
                </Text>

                {!showAnswer && (
                  <Text
                    style={[
                      styles.text,
                      {
                        textAlign: "center",
                        fontSize: 14,
                        color: "#64748b",
                        marginTop: 16,
                      },
                    ]}
                  >
                    Tap to reveal answer
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Navigation Controls */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    flex: 1,
                    backgroundColor: currentCard === 0 ? "#e2e8f0" : "#64748b",
                  },
                ]}
                onPress={handlePrevious}
                disabled={currentCard === 0}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: currentCard === 0 ? "#64748b" : "#ffffff" },
                  ]}
                >
                  ← Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: "#1e40af" }]}
                onPress={() => setShowAnswer(!showAnswer)}
              >
                <Text style={styles.buttonText}>
                  {showAnswer ? "Show Question" : "Show Answer"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: "#10b981" }]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Next →</Text>
              </TouchableOpacity>
            </View>

            {/* Restart Button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#f59e0b" }]}
              onPress={resetCards}
            >
              <Text style={styles.buttonText}>🔄 Restart Category</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.card}>
            <Text
              style={[styles.text, { textAlign: "center", color: "#64748b" }]}
            >
              No flashcards available in this category
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
