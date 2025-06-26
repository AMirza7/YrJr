import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export interface RatingData {
  rating: number;
  comment?: string;
  category?: string;
  userId?: string;
  entityId: string;
  entityType: "lawyer" | "message" | "document" | "service";
}

interface RatingProps {
  initialRating?: number;
  maxRating?: number;
  size?: number;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  style?: ViewStyle;
  showText?: boolean;
  color?: string;
}

interface RatingModalProps {
  visible: boolean;
  entityType: RatingData["entityType"];
  entityId: string;
  entityName?: string;
  onClose: () => void;
  onSubmit: (ratingData: RatingData) => void;
  initialRating?: number;
  initialComment?: string;
}

export const Rating: React.FC<RatingProps> = ({
  initialRating = 0,
  maxRating = 5,
  size = 24,
  readonly = false,
  onRatingChange,
  style,
  showText = false,
  color,
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [rating, setRating] = useState(initialRating);

  const starColor = color || theme.warning;
  const inactiveColor = theme.textTertiary;

  const handleStarPress = (newRating: number) => {
    if (readonly) return;

    setRating(newRating);
    onRatingChange?.(newRating);
  };

  const getRatingText = (rating: number): string => {
    if (rating === 0) return "No rating";
    if (rating <= 1) return "Poor";
    if (rating <= 2) return "Fair";
    if (rating <= 3) return "Good";
    if (rating <= 4) return "Very Good";
    return "Excellent";
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>
        {Array.from({ length: maxRating }, (_, index) => {
          const starIndex = index + 1;
          const isFilled = starIndex <= rating;
          const isHalfFilled = starIndex - 0.5 === rating;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleStarPress(starIndex)}
              disabled={readonly}
              style={styles.starButton}
            >
              <Ionicons
                name={
                  isFilled
                    ? "star"
                    : isHalfFilled
                      ? "star-half"
                      : "star-outline"
                }
                size={size}
                color={isFilled || isHalfFilled ? starColor : inactiveColor}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {showText && (
        <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
          {getRatingText(rating)}
        </Text>
      )}
    </View>
  );
};

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  entityType,
  entityId,
  entityName,
  onClose,
  onSubmit,
  initialRating = 0,
  initialComment = "",
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [submitting, setSubmitting] = useState(false);

  const getEntityTypeLabel = (type: RatingData["entityType"]): string => {
    const labels = {
      lawyer: "Lawyer",
      message: "Message",
      document: "Document",
      service: "Service",
    };
    return labels[type];
  };

  const getPlaceholderText = (type: RatingData["entityType"]): string => {
    const placeholders = {
      lawyer: "Share your experience with this lawyer...",
      message: "How was the communication quality?",
      document: "How helpful was this document?",
      service: "How was your experience with this service?",
    };
    return placeholders[type];
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert(
        "Rating Required",
        "Please select a rating before submitting.",
      );
      return;
    }

    try {
      setSubmitting(true);

      const ratingData: RatingData = {
        rating,
        comment: comment.trim() || undefined,
        entityId,
        entityType,
      };

      await onSubmit(ratingData);
      onClose();

      // Reset form
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting rating:", error);
      Alert.alert("Error", "Failed to submit rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(initialRating);
    setComment(initialComment);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View
        style={[styles.modalContainer, { backgroundColor: theme.background }]}
      >
        <View
          style={[
            styles.modalHeader,
            { backgroundColor: theme.surface, borderBottomColor: theme.border },
          ]}
        >
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Rate {getEntityTypeLabel(entityType)}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.modalContent}>
          <Card style={styles.ratingCard} padding="large">
            {entityName && (
              <Text style={[styles.entityName, { color: theme.text }]}>
                {entityName}
              </Text>
            )}

            <Text style={[styles.ratingLabel, { color: theme.textSecondary }]}>
              How would you rate your experience?
            </Text>

            <Rating
              initialRating={rating}
              size={40}
              onRatingChange={setRating}
              showText
              style={styles.ratingInput}
            />

            <Text style={[styles.commentLabel, { color: theme.textSecondary }]}>
              Share your feedback (optional)
            </Text>

            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder={getPlaceholderText(entityType)}
              placeholderTextColor={theme.textTertiary}
              multiline
              numberOfLines={4}
              style={[
                styles.commentInput,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={handleClose}
                style={styles.actionButton}
              />
              <Button
                title="Submit Rating"
                onPress={handleSubmit}
                loading={submitting}
                disabled={rating === 0}
                style={styles.actionButton}
                gradient
              />
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
};

// Aggregated rating display component
interface AggregatedRatingProps {
  averageRating: number;
  totalRatings: number;
  showDistribution?: boolean;
  ratingDistribution?: number[]; // Array of 5 numbers representing count for each star
  style?: ViewStyle;
}

export const AggregatedRating: React.FC<AggregatedRatingProps> = ({
  averageRating,
  totalRatings,
  showDistribution = false,
  ratingDistribution = [0, 0, 0, 0, 0],
  style,
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const renderDistribution = () => {
    if (!showDistribution) return null;

    const maxCount = Math.max(...ratingDistribution);

    return (
      <View style={styles.distributionContainer}>
        {ratingDistribution.map((count, index) => {
          const starNumber = 5 - index; // 5 stars to 1 star
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <View key={index} style={styles.distributionRow}>
              <Text
                style={[
                  styles.distributionLabel,
                  { color: theme.textSecondary },
                ]}
              >
                {starNumber}
              </Text>
              <Ionicons name="star" size={12} color={theme.warning} />
              <View
                style={[
                  styles.distributionBar,
                  { backgroundColor: theme.border },
                ]}
              >
                <View
                  style={[
                    styles.distributionFill,
                    {
                      backgroundColor: theme.warning,
                      width: `${percentage}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.distributionCount,
                  { color: theme.textTertiary },
                ]}
              >
                {count}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.aggregatedContainer, style]}>
      <View style={styles.summaryRow}>
        <Text style={[styles.averageRating, { color: theme.text }]}>
          {averageRating.toFixed(1)}
        </Text>
        <View style={styles.summaryInfo}>
          <Rating initialRating={averageRating} readonly size={16} />
          <Text style={[styles.totalRatings, { color: theme.textSecondary }]}>
            ({totalRatings} review{totalRatings !== 1 ? "s" : ""})
          </Text>
        </View>
      </View>

      {renderDistribution()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starButton: {
    padding: 2,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
    fontWeight: FontWeights.medium,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  headerRight: {
    width: 32,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  ratingCard: {
    alignItems: "center",
  },
  entityName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  ratingLabel: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  ratingInput: {
    marginBottom: Spacing.xl,
  },
  commentLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
    alignSelf: "flex-start",
  },
  commentInput: {
    width: "100%",
    minHeight: 100,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    marginBottom: Spacing.xl,
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  actionButton: {
    flex: 1,
  },
  aggregatedContainer: {
    padding: Spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  averageRating: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    marginRight: Spacing.md,
  },
  summaryInfo: {
    flex: 1,
  },
  totalRatings: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  distributionContainer: {
    marginTop: Spacing.md,
  },
  distributionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  distributionLabel: {
    fontSize: FontSizes.sm,
    width: 16,
    marginRight: Spacing.xs,
  },
  distributionBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginHorizontal: Spacing.sm,
    overflow: "hidden",
  },
  distributionFill: {
    height: "100%",
    borderRadius: 4,
  },
  distributionCount: {
    fontSize: FontSizes.sm,
    width: 24,
    textAlign: "right",
  },
});
