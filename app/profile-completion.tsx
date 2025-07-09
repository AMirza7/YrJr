import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import StateDropdown from "@/components/ui/StateDropdown";
import CityDropdown from "@/components/ui/CityDropdown";
import VerifyIdentity from "@/components/verification/VerifyIdentity";

export default function ProfileCompletionScreen() {
  const { theme } = useTheme();
  const { t } = useLocalization();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    barCouncilNumber: "",
    practiceYears: "",
    officeAddress: "",
    specialization: [] as string[],
    bio: "",
    state: "",
    city: "",
    postalCode: "",
    address: "",
  });

  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [showVerification, setShowVerification] = useState(false);

  const specializations = [
    "Civil Law",
    "Criminal Law",
    "Corporate Law",
    "Family Law",
    "Property Law",
    "Labour Law",
    "Tax Law",
    "Constitutional Law",
    "Environmental Law",
    "Intellectual Property",
    "International Law",
    "Banking Law",
    "Insurance Law",
    "Consumer Protection",
    "Cyber Law",
  ];

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);

      // Pre-fill existing data if available
      setFormData({
        barCouncilNumber: currentUser.barCouncilNumber || "",
        practiceYears: currentUser.practiceYears?.toString() || "",
        officeAddress: currentUser.officeAddress || "",
        specialization: currentUser.specialization || [],
        bio: currentUser.bio || "",
        state: currentUser.state || "",
        city: currentUser.city || "",
        postalCode: currentUser.postalCode || "",
        address: currentUser.address || "",
      });

      setSelectedSpecializations(currentUser.specialization || []);
    } catch (error) {
      console.error("Error loading user:", error);
      router.replace("/login");
    }
  };

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec],
    );
  };

  const handleSkip = () => {
    Alert.alert(
      "Skip Profile Completion",
      "You can complete your profile later from settings. Continue to dashboard?",
      [
        { text: "Complete Now", style: "cancel" },
        {
          text: "Skip",
          onPress: () => {
            if (user?.role === "admin") {
              router.replace("/admin");
            } else {
              router.replace("/(tabs)");
            }
          },
        },
      ],
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const updateData: Partial<User> = {
        barCouncilNumber: formData.barCouncilNumber || undefined,
        practiceYears: formData.practiceYears
          ? parseInt(formData.practiceYears)
          : undefined,
        officeAddress: formData.officeAddress || undefined,
        specialization:
          selectedSpecializations.length > 0
            ? selectedSpecializations
            : undefined,
        bio: formData.bio || undefined,
        state: formData.state || undefined,
        city: formData.city || undefined,
        postalCode: formData.postalCode || undefined,
        address: formData.address || undefined,
      };

      const success = await authService.updateUser(updateData);

      if (success) {
        Alert.alert(
          "Profile Updated!",
          "Your professional profile has been updated successfully.",
          [
            {
              text: "Continue",
              onPress: () => {
                if (user?.role === "admin") {
                  router.replace("/admin");
                } else {
                  router.replace("/(tabs)");
                }
              },
            },
          ],
        );
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 20,
      paddingTop: 50,
      backgroundColor: theme.colors.primary,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: "rgba(255,255,255,0.8)",
    },
    form: {
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
    },
    textArea: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      minHeight: 80,
      textAlignVertical: "top",
    },
    specializationsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    specializationTag: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      marginBottom: 8,
    },
    specializationTagSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    specializationText: {
      fontSize: 12,
      color: theme.colors.text,
      fontWeight: "500",
    },
    specializationTextSelected: {
      color: "#fff",
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 20,
    },
    skipButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    skipButtonText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      fontWeight: "600",
    },
    completeButton: {
      flex: 2,
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    completeButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    roleInfo: {
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    roleTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
    },
    roleDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  });

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Add professional details to unlock all features
          </Text>
        </View>

        <View style={styles.form}>
          {/* Role Information */}
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>
              Welcome, {user.role.replace("_", " ").toUpperCase()}!
            </Text>
            <Text style={styles.roleDescription}>
              Complete your professional profile to access all legal tools and
              features.
            </Text>
          </View>

          {/* Professional Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
            <Text style={styles.sectionDescription}>
              These details help verify your credentials and improve your
              experience
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bar Council Number (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Bar Council registration number"
                value={formData.barCouncilNumber}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, barCouncilNumber: text }))
                }
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Years of Practice</Text>
              <TextInput
                style={styles.input}
                placeholder="Number of years practicing law"
                value={formData.practiceYears}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, practiceYears: text }))
                }
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Office Address</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter your office/practice address"
                value={formData.officeAddress}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, officeAddress: text }))
                }
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Professional Bio</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Brief description of your legal expertise and experience"
                value={formData.bio}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, bio: text }))
                }
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Location Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Information</Text>
            <Text style={styles.sectionDescription}>
              Your location helps connect you with relevant clients and
              colleagues
            </Text>

            <StateDropdown
              label="State"
              value={formData.state}
              onValueChange={(state) => {
                setFormData((prev) => ({ ...prev, state, city: "" }));
              }}
              placeholder="Select your state"
            />

            <CityDropdown
              label="City"
              value={formData.city}
              onValueChange={(city) =>
                setFormData((prev) => ({ ...prev, city }))
              }
              selectedState={formData.state}
              placeholder="Select your city"
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit postal code"
                value={formData.postalCode}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, postalCode: text }))
                }
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Complete Address</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter your complete address"
                value={formData.address}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, address: text }))
                }
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Specializations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Areas of Specialization</Text>
            <Text style={styles.sectionDescription}>
              Select your areas of legal expertise
            </Text>

            <View style={styles.specializationsGrid}>
              {specializations.map((spec) => (
                <TouchableOpacity
                  key={spec}
                  style={[
                    styles.specializationTag,
                    selectedSpecializations.includes(spec) &&
                      styles.specializationTagSelected,
                  ]}
                  onPress={() => toggleSpecialization(spec)}
                >
                  <Text
                    style={[
                      styles.specializationText,
                      selectedSpecializations.includes(spec) &&
                        styles.specializationTextSelected,
                    ]}
                  >
                    {spec}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.completeButton, { opacity: loading ? 0.7 : 1 }]}
              onPress={handleComplete}
              disabled={loading}
            >
              <Text style={styles.completeButtonText}>
                {loading ? "Saving..." : "Complete Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
