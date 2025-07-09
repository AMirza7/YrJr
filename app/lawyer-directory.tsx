import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import BackButton from "@/components/navigation/BackButton";
import StateDropdown from "@/components/ui/StateDropdown";
import CityDropdown from "@/components/ui/CityDropdown";
import RatingDropdown from "@/components/ui/RatingDropdown";
import ProfessionalProfile from "@/components/profiles/ProfessionalProfile";

const { width } = Dimensions.get("window");

interface LawyerProfile extends User {
  specialization?: string[];
  practiceYears?: number;
  barCouncilNumber?: string;
  officeAddress?: string;
  rating?: number;
  totalCases?: number;
  successRate?: number;
}

export default function LawyerDirectoryScreen() {
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<LawyerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [minRating, setMinRating] = useState(0);

  const specializations = [
    "All",
    "Criminal Law",
    "Civil Law",
    "Corporate Law",
    "Family Law",
    "Property Law",
    "Constitutional Law",
  ];

  useEffect(() => {
    loadLawyers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    lawyers,
    searchQuery,
    selectedSpecialization,
    selectedState,
    selectedCity,
    minRating,
  ]);

  const loadLawyers = async () => {
    try {
      // Get public lawyer profiles (no admin access required)
      const verifiedLawyers = (await authService.getPublicLawyers()).map(
        (lawyer) => ({
          ...lawyer,
          rating: 4.2 + Math.random() * 0.8, // Mock rating 4.2-5.0
          totalCases: Math.floor(Math.random() * 200) + 50,
          successRate: Math.floor(Math.random() * 20) + 80, // 80-100%
          specialization: lawyer.specialization || ["General Practice"],
          practiceYears:
            lawyer.practiceYears || Math.floor(Math.random() * 15) + 2,
        }),
      );

      setLawyers(verifiedLawyers);
    } catch (error) {
      console.error("Error loading lawyers:", error);

      // If unauthorized (not admin), use mock lawyer data instead

      // Fallback to mock data
      const mockLawyers: LawyerProfile[] = [
        {
          id: "lawyer_1",
          name: "Advocate Rajesh Kumar",
          email: "lawyer@yrjr.app",
          role: "lawyer",
          isVerified: true,
          isApproved: true,
          hasVerificationBadge: true,
          subscriptionTier: "premium",
          specialization: ["Criminal Law", "Civil Law"],
          practiceYears: 12,
          barCouncilNumber: "D/12345/2012",
          officeAddress: "Supreme Court Bar Association, New Delhi",
          state: "Delhi",
          city: "New Delhi",
          rating: 4.8,
          totalCases: 180,
          successRate: 94,
          createdAt: "2020-01-01",
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
          id: "lawyer_2",
          name: "Priya Sharma",
          email: "jr.lawyer@yrjr.app",
          role: "junior_lawyer",
          isVerified: true,
          isApproved: true,
          hasVerificationBadge: true,
          subscriptionTier: "pro",
          specialization: ["Family Law", "Property Law"],
          practiceYears: 5,
          barCouncilNumber: "D/67890/2019",
          officeAddress: "Delhi High Court Bar Association",
          state: "Delhi",
          city: "New Delhi",
          rating: 4.5,
          totalCases: 85,
          successRate: 89,
          createdAt: "2019-01-01",
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

      setLawyers(mockLawyers);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = lawyers;

    // Apply specialization filter
    if (selectedSpecialization !== "all" && selectedSpecialization !== "All") {
      filtered = filtered.filter((lawyer) =>
        lawyer.specialization?.some((spec) =>
          spec.toLowerCase().includes(selectedSpecialization.toLowerCase()),
        ),
      );
    }

    // Apply location filters
    if (selectedState) {
      filtered = filtered.filter(
        (lawyer) =>
          lawyer.state === selectedState ||
          lawyer.officeAddress
            ?.toLowerCase()
            .includes(selectedState.toLowerCase()),
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(
        (lawyer) =>
          lawyer.city === selectedCity ||
          lawyer.officeAddress
            ?.toLowerCase()
            .includes(selectedCity.toLowerCase()),
      );
    }

    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter((lawyer) => (lawyer.rating || 0) >= minRating);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lawyer) =>
          lawyer.name.toLowerCase().includes(query) ||
          lawyer.specialization?.some((spec) =>
            spec.toLowerCase().includes(query),
          ) ||
          lawyer.officeAddress?.toLowerCase().includes(query) ||
          lawyer.state?.toLowerCase().includes(query) ||
          lawyer.city?.toLowerCase().includes(query),
      );
    }

    setFilteredLawyers(filtered);
  };

  const handleContactLawyer = (lawyer: LawyerProfile) => {
    Alert.alert("Contact Lawyer", `Would you like to contact ${lawyer.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send Message",
        onPress: () => {
          // Navigate to messaging or contact form
          Alert.alert(
            "Feature Coming Soon",
            "Direct messaging will be available soon!",
          );
        },
      },
      {
        text: "View Profile",
        onPress: () => {
          Alert.alert(
            `${lawyer.name} - ${lawyer.role === "lawyer" ? "Senior Lawyer" : "Junior Lawyer"}`,
            `Specialization: ${lawyer.specialization?.join(", ")}\nExperience: ${lawyer.practiceYears} years\nSuccess Rate: ${lawyer.successRate}%\nRating: ${lawyer.rating?.toFixed(1)}/5.0\n\nBar Council: ${lawyer.barCouncilNumber}\nOffice: ${lawyer.officeAddress}`,
            [{ text: "Close" }],
          );
        },
      },
    ]);
  };

  const getRoleIcon = (role: string) => {
    return role === "lawyer" ? "⚖️" : "👨‍💼";
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return "⭐".repeat(fullStars) + (hasHalfStar ? "✨" : "");
  };

  const renderLawyer = ({ item }: { item: LawyerProfile }) => (
    <TouchableOpacity
      style={styles.lawyerCard}
      onPress={() => handleContactLawyer(item)}
    >
      <View style={styles.lawyerHeader}>
        <View style={styles.lawyerInfo}>
          <Text style={styles.lawyerIcon}>{getRoleIcon(item.role)}</Text>
          <View style={styles.lawyerDetails}>
            <View style={styles.nameContainer}>
              <Text style={styles.lawyerName}>{item.name}</Text>
              {item.hasVerificationBadge && (
                <Text style={styles.verifiedBadge}>✓</Text>
              )}
            </View>
            <Text style={styles.lawyerRole}>
              {item.role === "lawyer" ? "Senior Lawyer" : "Junior Lawyer"}
            </Text>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingStars}>
            {getRatingStars(item.rating || 0)}
          </Text>
          <Text style={styles.ratingText}>{item.rating?.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.specializationContainer}>
        {item.specialization?.slice(0, 3).map((spec, index) => (
          <View key={index} style={styles.specializationTag}>
            <Text style={styles.specializationText}>{spec}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.practiceYears}+</Text>
          <Text style={styles.statLabel}>Years</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.totalCases}</Text>
          <Text style={styles.statLabel}>Cases</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.successRate}%</Text>
          <Text style={styles.statLabel}>Success</Text>
        </View>
      </View>

      {item.officeAddress && (
        <Text style={styles.location} numberOfLines={1}>
          📍 {item.officeAddress}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton color="#fff" />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Lawyer Directory</Text>
          <Text style={styles.headerSubtitle}>
            {filteredLawyers.length} verified lawyer
            {filteredLawyers.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search lawyers by name, specialization..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={specializations}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.specializationFilter,
                selectedSpecialization === item.toLowerCase() &&
                  styles.activeFilter,
              ]}
              onPress={() => setSelectedSpecialization(item.toLowerCase())}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedSpecialization === item.toLowerCase() &&
                    styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filtersList}
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

        <RatingDropdown
          label="Minimum Rating"
          value={minRating}
          onValueChange={setMinRating}
          placeholder="Any rating"
        />
      </View>

      <FlatList
        data={filteredLawyers}
        renderItem={renderLawyer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lawyersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⚖️</Text>
            <Text style={styles.emptyTitle}>No Lawyers Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filters to find more lawyers.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#1e40af",
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
    marginBottom: 12,
  },
  filtersList: {
    paddingVertical: 4,
  },
  locationFilters: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  filterRow: {
    flex: 1,
  },
  specializationFilter: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: "#1e40af",
  },
  filterText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#fff",
  },
  lawyersList: {
    padding: 16,
  },
  lawyerCard: {
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
  lawyerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  lawyerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  lawyerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  lawyerDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lawyerName: {
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
  lawyerRole: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  ratingContainer: {
    alignItems: "flex-end",
  },
  ratingStars: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginTop: 2,
  },
  specializationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 6,
  },
  specializationTag: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specializationText: {
    fontSize: 11,
    color: "#1e40af",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
    paddingVertical: 8,
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
  location: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
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
});
