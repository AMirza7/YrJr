import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";

interface RatingDropdownProps {
  label: string;
  value: number;
  onValueChange: (rating: number) => void;
  placeholder?: string;
}

const RATING_OPTIONS = [
  { value: 0, label: "Any Rating" },
  { value: 2.5, label: "< 2.5 ⭐" },
  { value: 3.5, label: "3.5+ ⭐⭐⭐✨" },
  { value: 3.6, label: "3.6+ ⭐⭐⭐✨" },
  { value: 3.7, label: "3.7+ ⭐⭐⭐✨" },
  { value: 3.8, label: "3.8+ ⭐⭐⭐✨" },
  { value: 3.9, label: "3.9+ ⭐⭐⭐✨" },
  { value: 4.0, label: "4.0+ ⭐⭐⭐⭐" },
  { value: 4.1, label: "4.1+ ⭐⭐⭐⭐" },
  { value: 4.2, label: "4.2+ ⭐���⭐⭐" },
  { value: 4.3, label: "4.3+ ⭐⭐⭐⭐" },
  { value: 4.4, label: "4.4+ ⭐⭐⭐⭐" },
  { value: 4.5, label: "4.5+ ⭐⭐⭐⭐✨" },
  { value: 4.6, label: "4.6+ ⭐⭐⭐⭐✨" },
  { value: 4.7, label: "4.7+ ⭐⭐⭐⭐✨" },
  { value: 4.8, label: "4.8+ ⭐⭐⭐⭐✨" },
  { value: 4.9, label: "4.9+ ⭐⭐⭐⭐✨" },
  { value: 5.0, label: "5.0 ⭐⭐⭐⭐⭐" },
];

export default function RatingDropdown({
  label,
  value,
  onValueChange,
  placeholder = "Select minimum rating",
}: RatingDropdownProps) {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = RATING_OPTIONS.find(
    (option) => option.value === value,
  );

  const handleSelect = (rating: number) => {
    onValueChange(rating);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsVisible(true)}
      >
        <Text
          style={[styles.dropdownText, !selectedOption && styles.placeholder]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Minimum Rating</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={RATING_OPTIONS}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  placeholder: {
    color: "#9CA3AF",
  },
  arrow: {
    fontSize: 12,
    color: "#6B7280",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#6B7280",
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#EFF6FF",
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedOptionText: {
    color: "#1D4ED8",
    fontWeight: "500",
  },
  checkmark: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "bold",
  },
});
