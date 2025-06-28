import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";

interface RatingProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string, category: string) => void;
  title?: string;
  item?: string;
}

export default function Rating({
  visible,
  onClose,
  onSubmit,
  title = "Rate Your Experience",
  item = "this feature",
}: RatingProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("general");

  const categories = [
    { id: "general", label: "General", icon: "💬" },
    { id: "feature", label: "Feature Request", icon: "💡" },
    { id: "bug", label: "Bug Report", icon: "🐛" },
    { id: "usability", label: "Usability", icon: "🎯" },
    { id: "performance", label: "Performance", icon: "⚡" },
  ];

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert(
        "Rating Required",
        "Please select a rating before submitting.",
      );
      return;
    }

    onSubmit(rating, feedback, category);

    // Reset form
    setRating(0);
    setFeedback("");
    setCategory("general");

    onClose();

    Alert.alert(
      "Thank You!",
      "Your feedback has been submitted and will help us improve the app.",
    );
  };

  const handleCancel = () => {
    setRating(0);
    setFeedback("");
    setCategory("general");
    onClose();
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Text style={[styles.star, star <= rating && styles.starFilled]}>
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return "Poor - Needs significant improvement";
      case 2:
        return "Fair - Some issues to address";
      case 3:
        return "Good - Meets expectations";
      case 4:
        return "Very Good - Exceeds expectations";
      case 5:
        return "Excellent - Outstanding experience";
      default:
        return "Select a rating";
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>How would you rate {item}?</Text>

            {renderStars()}

            <Text style={styles.ratingText}>{getRatingText()}</Text>

            {/* Category Selection */}
            <Text style={styles.sectionLabel}>Feedback Category</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    category === cat.id && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      category === cat.id && styles.categoryLabelActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback Text */}
            <Text style={styles.sectionLabel}>
              Additional Comments (Optional)
            </Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Share your thoughts, suggestions, or report issues..."
              multiline
              numberOfLines={4}
              value={feedback}
              onChangeText={setFeedback}
              textAlignVertical="top"
            />

            {/* Quick Feedback Buttons */}
            {rating > 0 && (
              <View style={styles.quickFeedbackContainer}>
                <Text style={styles.sectionLabel}>Quick Feedback</Text>
                <View style={styles.quickButtons}>
                  {getQuickFeedbackOptions().map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickButton}
                      onPress={() =>
                        setFeedback((prev) =>
                          prev ? `${prev}\n• ${option}` : `• ${option}`,
                        )
                      }
                    >
                      <Text style={styles.quickButtonText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  rating === 0 && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={rating === 0}
              >
                <Text style={styles.submitButtonText}>Submit Rating</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  function getQuickFeedbackOptions() {
    if (rating >= 4) {
      return [
        "Easy to use",
        "Helpful features",
        "Good performance",
        "Great design",
        "Would recommend",
      ];
    } else if (rating === 3) {
      return [
        "Could be improved",
        "Missing features",
        "Average experience",
        "Some confusing parts",
      ];
    } else {
      return [
        "Difficult to use",
        "Slow performance",
        "Frequent crashes",
        "Confusing interface",
        "Missing key features",
      ];
    }
  }
}

// Specific rating components for different contexts
export const FeatureRating = ({
  visible,
  onClose,
  featureName,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  featureName: string;
  onSubmit: (rating: number, feedback: string, category: string) => void;
}) => (
  <Rating
    visible={visible}
    onClose={onClose}
    onSubmit={onSubmit}
    title={`Rate ${featureName}`}
    item={featureName.toLowerCase()}
  />
);

export const AppRating = ({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string, category: string) => void;
}) => (
  <Rating
    visible={visible}
    onClose={onClose}
    onSubmit={onSubmit}
    title="Rate YRJR Legal Assistant"
    item="our legal assistant app"
  />
);

export const TemplateRating = ({
  visible,
  onClose,
  templateName,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  templateName: string;
  onSubmit: (rating: number, feedback: string, category: string) => void;
}) => (
  <Rating
    visible={visible}
    onClose={onClose}
    onSubmit={onSubmit}
    title={`Rate Template`}
    item={`the ${templateName} template`}
  />
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 450,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 20,
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 32,
    opacity: 0.3,
  },
  starFilled: {
    opacity: 1,
  },
  ratingText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    fontStyle: "italic",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 12,
    marginTop: 8,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
  },
  categoryChipActive: {
    backgroundColor: "#3b82f6",
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  categoryLabelActive: {
    color: "#fff",
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    marginBottom: 16,
  },
  quickFeedbackContainer: {
    marginBottom: 20,
  },
  quickButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickButton: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  quickButtonText: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
