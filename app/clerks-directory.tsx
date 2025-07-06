import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import BackButton from "@/components/navigation/BackButton";
import StateDropdown from "@/components/ui/StateDropdown";
import CityDropdown from "@/components/ui/CityDropdown";
// import RatingSlider from "@/components/ui/RatingSlider";

interface ClerkProfile extends User {
  hourlyRate?: number;
  completedJobs?: number;
  responseTime?: string;
  availability?: "available" | "busy" | "offline";
}

interface HireModalProps {
  visible: boolean;
  clerk: ClerkProfile | null;
  onClose: () => void;
  onHire: (amount: number) => void;
}

function HireModal({ visible, clerk, onClose, onHire }: HireModalProps) {
  const [amount, setAmount] = useState("500");
  const [description, setDescription] = useState("");
  const commissionRate = 0.15; // 15% commission
  const commissionAmount = parseFloat(amount || "0") * commissionRate;
  const totalAmount = parseFloat(amount || "0") + commissionAmount;

  const handleHire = () => {
    if (!amount || parseFloat(amount) < 100) {
      Alert.alert("Error", "Minimum amount is ₹100");
      return;
    }

    Alert.alert(
      "Confirm Hire",
      `You are about to hire ${clerk?.name} for ₹${amount}.\n\nPlatform fee: ₹${commissionAmount.toFixed(2)}\nTotal: ₹${totalAmount.toFixed(2)}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed to Payment",
          onPress: () => {
            onClose();
            router.push({
              pathname: "/payment-options",
              params: {
                amount: totalAmount.toFixed(0),
                plan: `Hire ${clerk?.name}`,
              },
            });
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Hire {clerk?.name}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Clerk Info */}
          <View style={styles.clerkInfo}>
            <Text style={styles.clerkName}>{clerk?.name}</Text>
            <Text style={styles.clerkRole}>Legal Clerk/Typist</Text>
            <Text style={styles.clerkLocation}>
              📍 {clerk?.city}, {clerk?.state}
            </Text>
            <Text style={styles.clerkRating}>
              ⭐ {clerk?.rating?.toFixed(1) || "4.5"} •{" "}
              {clerk?.completedJobs || 25} jobs completed
            </Text>
          </View>

          {/* Job Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Payment Amount (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Job Description (Optional)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe the work required..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Payment Breakdown */}
          <View style={styles.paymentBreakdown}>
            <Text style={styles.breakdownTitle}>Payment Breakdown</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Job Payment</Text>
              <Text style={styles.breakdownValue}>₹{amount || "0"}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Platform Fee (15%)</Text>
              <Text style={styles.breakdownValue}>
                ₹{commissionAmount.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.breakdownRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.hireButton} onPress={handleHire}>
            <Text style={styles.hireButtonText}>
              Proceed to Payment (₹{totalAmount.toFixed(0)})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function ClerksDirectoryScreen() {
  const [clerks, setClerks] = useState<ClerkProfile[]>([]);
  const [filteredClerks, setFilteredClerks] = useState<ClerkProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectedClerk, setSelectedClerk] = useState<ClerkProfile | null>(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"clerks" | "templates">("clerks");

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [clerks, searchQuery, selectedState, selectedCity, minRating]);

  const checkAccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);

      // Check if user is subscribed lawyer
      if (
        currentUser.role !== "lawyer" &&
        currentUser.role !== "junior_lawyer" &&
        currentUser.role !== "admin"
      ) {
        Alert.alert(
          "Access Restricted",
          "Only subscribed lawyers can access the clerks directory.",
          [
            {
              text: "OK",
              onPress: () => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/home");
                }
              },
            },
          ],
        );
        return;
      }

      if (currentUser.subscriptionTier === "free") {
        Alert.alert(
          "Subscription Required",
          "Please upgrade your subscription to access the clerks directory.",
          [
            {
              text: "Cancel",
              onPress: () => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/home");
                }
              },
            },
            {
              text: "Upgrade",
              onPress: () => router.push("/subscription"),
            },
          ],
        );
        return;
      }

      loadClerks();
    } catch (error) {
      router.replace("/login");
    }
  };

  const loadClerks = async () => {
    try {
      // Mock clerk data - in production this would come from API
      const mockClerks: ClerkProfile[] = [
        {
          id: "clerk_1",
          name: "Ravi Kumar",
          email: "ravi.clerk@yrjr.app",
          role: "legal_clerk_typist",
          isVerified: true,
          isApproved: true,
          hasVerificationBadge: true,
          subscriptionTier: "pro",
          state: "Delhi",
          city: "New Delhi",
          rating: 4.8,
          hourlyRate: 200,
          completedJobs: 145,
          responseTime: "2 hours",
          availability: "available",
          createdAt: "2022-01-01",
          lastActiveAt: "2024-01-20",
          preferences: {
            theme: "light",
            language: "en",
            notifications: {
              push: true,
              email: true,
              caseUpdates: true,
              reminders: true,
              marketing: false,
            },
            privacy: {
              profileVisible: true,
              contactInfoVisible: true,
              showOnlineStatus: true,
            },
          },
        },
        {
          id: "clerk_2",
          name: "Priya Sharma",
          email: "priya.typist@yrjr.app",
          role: "legal_clerk_typist",
          isVerified: true,
          isApproved: true,
          hasVerificationBadge: true,
          subscriptionTier: "pro",
          state: "Maharashtra",
          city: "Mumbai",
          rating: 4.6,
          hourlyRate: 180,
          completedJobs: 98,
          responseTime: "1 hour",
          availability: "available",
          createdAt: "2022-06-01",
          lastActiveAt: "2024-01-20",
          preferences: {
            theme: "light",
            language: "en",
            notifications: {
              push: true,
              email: true,
              caseUpdates: true,
              reminders: true,
              marketing: false,
            },
            privacy: {
              profileVisible: true,
              contactInfoVisible: true,
              showOnlineStatus: true,
            },
          },
        },
      ];

      setClerks(mockClerks);
    } catch (error) {
      console.error("Error loading clerks:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = clerks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (clerk) =>
          clerk.name.toLowerCase().includes(query) ||
          clerk.city?.toLowerCase().includes(query) ||
          clerk.state?.toLowerCase().includes(query),
      );
    }

    // Apply location filters
    if (selectedState) {
      filtered = filtered.filter((clerk) => clerk.state === selectedState);
    }

    if (selectedCity) {
      filtered = filtered.filter((clerk) => clerk.city === selectedCity);
    }

    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter((clerk) => (clerk.rating || 0) >= minRating);
    }

    setFilteredClerks(filtered);
  };

  const handleHireClerk = (clerk: ClerkProfile) => {
    setSelectedClerk(clerk);
    setShowHireModal(true);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "#10B981";
      case "busy":
        return "#F59E0B";
      case "offline":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available":
        return "Available";
      case "busy":
        return "Busy";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const renderClerk = ({ item }: { item: ClerkProfile }) => (
    <View style={styles.clerkCard}>
      <View style={styles.clerkHeader}>
        <View style={styles.clerkInfo}>
          <Text style={styles.clerkIcon}>⌨️</Text>
          <View style={styles.clerkDetails}>
            <View style={styles.nameContainer}>
              <Text style={styles.clerkName}>{item.name}</Text>
              {item.hasVerificationBadge && (
                <Text style={styles.verifiedBadge}>✓</Text>
              )}
            </View>
            <Text style={styles.clerkTitle}>Legal Clerk/Typist</Text>
            <Text style={styles.clerkLocation}>
              📍 {item.city}, {item.state}
            </Text>
          </View>
        </View>

        <View style={styles.availabilityContainer}>
          <View
            style={[
              styles.availabilityDot,
              {
                backgroundColor: getAvailabilityColor(
                  item.availability || "available",
                ),
              },
            ]}
          />
          <Text style={styles.availabilityText}>
            {getAvailabilityText(item.availability || "available")}
          </Text>
        </View>
      </View>

      <View style={styles.clerkStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            ⭐ {item.rating?.toFixed(1) || "4.5"}
          </Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.completedJobs || 25}</Text>
          <Text style={styles.statLabel}>Jobs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{item.hourlyRate || 150}/hr</Text>
          <Text style={styles.statLabel}>Rate</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.responseTime || "2h"}</Text>
          <Text style={styles.statLabel}>Response</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.hireButton,
          item.availability === "offline" && styles.hireButtonDisabled,
        ]}
        onPress={() => handleHireClerk(item)}
        disabled={item.availability === "offline"}
      >
        <Text
          style={[
            styles.hireButtonText,
            item.availability === "offline" && styles.hireButtonTextDisabled,
          ]}
        >
          {item.availability === "offline" ? "Currently Offline" : "Hire Now"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading clerks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton color="#fff" />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Legal Clerks Hub</Text>
          <Text style={styles.headerSubtitle}>
            Find clerks and professional templates
          </Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "clerks" && styles.activeTab]}
          onPress={() => setActiveTab("clerks")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "clerks" && styles.activeTabText,
            ]}
          >
            Clerks ({filteredClerks.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "templates" && styles.activeTab]}
          onPress={() => setActiveTab("templates")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "templates" && styles.activeTabText,
            ]}
          >
            Templates
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search clerks by name or location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.locationFilters}>
          <View style={styles.filterRow}>
            <StateDropdown
              label="Filter by State"
              value={selectedState}
              onValueChange={(state) => {
                setSelectedState(state);
                setSelectedCity("");
              }}
              placeholder="All States"
            />
          </View>

          <View style={styles.filterRow}>
            <CityDropdown
              label="Filter by City"
              value={selectedCity}
              onValueChange={setSelectedCity}
              selectedState={selectedState}
              placeholder="All Cities"
            />
          </View>
        </View>

        {/* <RatingSlider
          label="Minimum Rating"
          value={minRating}
          onValueChange={setMinRating}
          minimumValue={0}
          maximumValue={5}
          step={0.1}
        /> */}
        <View style={styles.ratingFilterContainer}>
          <Text style={styles.ratingLabel}>Minimum Rating</Text>
          <View style={styles.ratingOptions}>
            {[0, 1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingButton,
                  minRating === rating && styles.selectedRatingButton,
                ]}
                onPress={() => setMinRating(rating)}
              >
                <Text
                  style={[
                    styles.ratingButtonText,
                    minRating === rating && styles.selectedRatingButtonText,
                  ]}
                >
                  {rating}⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {activeTab === "clerks" ? (
        <FlatList
          data={filteredClerks}
          renderItem={renderClerk}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.clerksList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>⌨️</Text>
              <Text style={styles.emptyTitle}>No Clerks Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filters to find more clerks.
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.templatesContainer}>
          <TouchableOpacity
            style={styles.templatesRedirectButton}
            onPress={() => router.push("/clerk-templates")}
          >
            <Text style={styles.templatesRedirectIcon}>📄</Text>
            <View style={styles.templatesRedirectContent}>
              <Text style={styles.templatesRedirectTitle}>
                Browse Templates
              </Text>
              <Text style={styles.templatesRedirectSubtitle}>
                Professional legal document templates created by verified clerks
              </Text>
            </View>
            <Text style={styles.templatesRedirectArrow}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      <HireModal
        visible={showHireModal}
        clerk={selectedClerk}
        onClose={() => setShowHireModal(false)}
        onHire={(amount) => {
          setShowHireModal(false);
          Alert.alert("Success", `Hired ${selectedClerk?.name} for ₹${amount}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    backgroundColor: "#8B5A3F",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  filtersContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  locationFilters: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  filterRow: {
    flex: 1,
  },
  clerksList: {
    padding: 16,
  },
  clerkCard: {
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
  clerkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  clerkInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  clerkIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  clerkDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  clerkName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  verifiedBadge: {
    fontSize: 14,
    color: "#10b981",
    marginLeft: 4,
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
  },
  clerkTitle: {
    fontSize: 12,
    color: "#8B5A3F",
    marginTop: 2,
    fontWeight: "500",
  },
  clerkLocation: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  clerkStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
  hireButton: {
    backgroundColor: "#8B5A3F",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  hireButtonDisabled: {
    backgroundColor: "#e5e7eb",
  },
  hireButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  hireButtonTextDisabled: {
    color: "#9ca3af",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#8B5A3F",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  placeholder: {
    width: 26,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
  },
  paymentBreakdown: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  breakdownValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    color: "#8B5A3F",
    fontWeight: "bold",
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
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#8B5A3F",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#8B5A3F",
    fontWeight: "600",
  },
  templatesContainer: {
    flex: 1,
    padding: 16,
  },
  templatesRedirectButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templatesRedirectIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  templatesRedirectContent: {
    flex: 1,
  },
  templatesRedirectTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  templatesRedirectSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  templatesRedirectArrow: {
    fontSize: 24,
    color: "#9ca3af",
  },
  ratingFilterContainer: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  ratingOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ratingButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedRatingButton: {
    backgroundColor: "#8B5A3F",
    borderColor: "#8B5A3F",
  },
  ratingButtonText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  selectedRatingButtonText: {
    color: "#fff",
  },
});
