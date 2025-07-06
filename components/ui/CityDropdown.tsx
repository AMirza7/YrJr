import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { getCitiesByState } from "@/constants/locations";

interface CityDropdownProps {
  label: string;
  value?: string;
  onValueChange: (city: string) => void;
  selectedState?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
}

export default function CityDropdown({
  label,
  value,
  onValueChange,
  selectedState,
  placeholder = "Select City",
  error = false,
  errorMessage,
}: CityDropdownProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (selectedState) {
      const stateCities = getCitiesByState(selectedState);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  useEffect(() => {
    // Clear city selection when state changes
    if (value && selectedState) {
      const stateCities = getCitiesByState(selectedState);
      if (!stateCities.includes(value)) {
        onValueChange("");
      }
    }
  }, [selectedState, value, onValueChange]);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (city: string) => {
    onValueChange(city);
    setIsVisible(false);
    setSearchQuery("");
  };

  const isDisabled = !selectedState || cities.length === 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, error && styles.errorLabel]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.dropdown,
          error && styles.errorBorder,
          isDisabled && styles.disabledDropdown,
        ]}
        onPress={() => !isDisabled && setIsVisible(true)}
        disabled={isDisabled}
      >
        <Text
          style={[
            styles.dropdownText,
            !value && styles.placeholder,
            isDisabled && styles.disabledText,
          ]}
        >
          {isDisabled
            ? selectedState
              ? "No cities available"
              : "Select state first"
            : value || placeholder}
        </Text>
        <Text style={[styles.arrow, isDisabled && styles.disabledText]}>▼</Text>
      </TouchableOpacity>

      {error && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search cities..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredCities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    item === value && styles.selectedCity,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.cityText,
                      item === value && styles.selectedCityText,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === value && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No cities found</Text>
                </View>
              }
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
  errorLabel: {
    color: "#DC2626",
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
  errorBorder: {
    borderColor: "#DC2626",
  },
  disabledDropdown: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  dropdownText: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  placeholder: {
    color: "#9CA3AF",
  },
  disabledText: {
    color: "#9CA3AF",
  },
  arrow: {
    fontSize: 12,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 4,
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
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
  },
  cityItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCity: {
    backgroundColor: "#EFF6FF",
  },
  cityText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedCityText: {
    color: "#1D4ED8",
    fontWeight: "500",
  },
  checkmark: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
});
