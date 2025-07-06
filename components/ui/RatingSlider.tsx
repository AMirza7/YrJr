import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface RatingSliderProps {
  label?: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
}

export default function RatingSlider({
  label = "Minimum Rating",
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 5,
  step = 0.5,
}: RatingSliderProps) {
  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = "⭐".repeat(fullStars);
    if (hasHalfStar) stars += "✨";
    return stars || "☆";
  };

  const generateOptions = () => {
    const options = [];
    for (let i = minimumValue; i <= maximumValue; i += step) {
      options.push(Number(i.toFixed(1)));
    }
    return options;
  };

  const options = generateOptions();

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{value.toFixed(1)}</Text>
          <Text style={styles.starsText}>{getRatingStars(value)}</Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              value === option && styles.selectedOption,
            ]}
            onPress={() => onValueChange(option)}
          >
            <Text
              style={[
                styles.optionText,
                value === option && styles.selectedOptionText,
              ]}
            >
              {option.toFixed(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>Min: {minimumValue.toFixed(1)}</Text>
        <Text style={styles.rangeLabel}>Max: {maximumValue.toFixed(1)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginRight: 8,
  },
  starsText: {
    fontSize: 14,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    minWidth: 50,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },
  optionText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#fff",
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  rangeLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
});
