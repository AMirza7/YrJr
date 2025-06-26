import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { SearchBar } from "@/components/ui/SearchBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SPECIALIZATIONS, INDIAN_STATES } from "@/constants/LegalConstants";
import { Lawyer } from "@/types";

export default function DirectoryScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("All");

  useEffect(() => {
    loadLawyers();
  }, []);

  useEffect(() => {
    filterLawyers();
  }, [searchQuery, selectedSpecialization, lawyers]);

  const loadLawyers = async () => {
    // Mock data for demonstration
    const mockLawyers: Lawyer[] = [
      {
        id: "1",
        name: "Adv. Rajesh Kumar",
        specialization: ["Criminal Law", "Constitutional Law"],
        location: "Delhi",
        experience: 15,
        rating: 4.8,
        reviewCount: 124,
        isVerified: true,
        barCouncilId: "D/1234/2008",
        contactEnabled: true,
        bio: "Senior advocate specializing in criminal and constitutional law with 15+ years of experience.",
      },
      {
        id: "2",
        name: "Adv. Priya Sharma",
        specialization: ["Family Law", "Civil Law"],
        location: "Mumbai",
        experience: 8,
        rating: 4.6,
        reviewCount: 87,
        isVerified: true,
        barCouncilId: "M/5678/2015",
        contactEnabled: true,
        bio: "Experienced family law practitioner with focus on custody and matrimonial cases.",
      },
      {
        id: "3",
        name: "Adv. Suresh Patel",
        specialization: ["Corporate Law", "Tax Law"],
        location: "Bangalore",
        experience: 12,
        rating: 4.9,
        reviewCount: 156,
        isVerified: true,
        barCouncilId: "B/9012/2011",
        contactEnabled: true,
        bio: "Corporate law expert handling mergers, acquisitions, and tax compliance matters.",
      },
      {
        id: "4",
        name: "Adv. Meera Singh",
        specialization: ["Consumer Protection", "Civil Law"],
        location: "Chennai",
        experience: 6,
        rating: 4.4,
        reviewCount: 52,
        isVerified: true,
        barCouncilId: "C/3456/2017",
        contactEnabled: false,
        bio: "Young advocate focusing on consumer rights and civil litigation.",
      },
      {
        id: "5",
        name: "Adv. Ankit Gupta",
        specialization: ["Cyber Law", "Intellectual Property"],
        location: "Pune",
        experience: 7,
        rating: 4.7,
        reviewCount: 73,
        isVerified: true,
        barCouncilId: "P/7890/2016",
        contactEnabled: true,
        bio: "Technology law specialist handling cybercrime and IP matters.",
      },
    ];

    setLawyers(mockLawyers);
  };

  const filterLawyers = () => {
    let filtered = lawyers;

    if (selectedSpecialization !== "All") {
      filtered = filtered.filter((lawyer) =>
        lawyer.specialization.includes(selectedSpecialization),
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (lawyer) =>
          lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lawyer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lawyer.specialization.some((spec) =>
            spec.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    setFilteredLawyers(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLawyers();
    setRefreshing(false);
  };

  const handleLawyerPress = (lawyer: Lawyer) => {
    router.push(`/(main)/lawyer-profile/${lawyer.id}`);
  };

  const handleContact = (lawyer: Lawyer) => {
    if (lawyer.contactEnabled) {
      Alert.alert("Contact", `Contacting ${lawyer.name}...`);
    } else {
      Alert.alert(
        "Contact Disabled",
        "This lawyer has disabled direct contact.",
      );
    }
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={12} color={theme.warning} />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={12} color={theme.warning} />,
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="star-outline"
            size={12}
            color={theme.textTertiary}
          />,
        );
      }
    }

    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderLawyer = ({ item }: { item: Lawyer }) => (
    <TouchableOpacity onPress={() => handleLawyerPress(item)}>
      <Card style={styles.lawyerCard} padding="medium">
        <View style={styles.lawyerHeader}>
          <View style={styles.lawyerInfo}>
            <View style={styles.nameContainer}>
              <Text style={[styles.lawyerName, { color: theme.text }]}>
                {item.name}
              </Text>
              {item.isVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.success}
                />
              )}
            </View>

            <View style={styles.ratingContainer}>
              {renderStarRating(item.rating)}
              <Text style={[styles.rating, { color: theme.textSecondary }]}>
                {item.rating} ({item.reviewCount})
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.lawyerDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={theme.textSecondary} />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>
              {item.location}
            </Text>
            <Ionicons
              name="briefcase"
              size={16}
              color={theme.textSecondary}
              style={{ marginLeft: Spacing.md }}
            />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>
              {item.experience} years
            </Text>
          </View>
        </View>

        <View style={styles.specializationContainer}>
          {item.specialization.slice(0, 2).map((spec, index) => (
            <View
              key={index}
              style={[
                styles.specializationTag,
                { backgroundColor: theme.primary + "15" },
              ]}
            >
              <Text
                style={[styles.specializationText, { color: theme.primary }]}
              >
                {spec}
              </Text>
            </View>
          ))}
          {item.specialization.length > 2 && (
            <Text
              style={[
                styles.moreSpecializations,
                { color: theme.textTertiary },
              ]}
            >
              +{item.specialization.length - 2} more
            </Text>
          )}
        </View>

        <Text
          style={[styles.bio, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {item.bio}
        </Text>

        <View style={styles.actionContainer}>
          <Button
            title="View Profile"
            onPress={() => handleLawyerPress(item)}
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
          <Button
            title={item.contactEnabled ? "Contact" : "Unavailable"}
            onPress={() => handleContact(item)}
            variant={item.contactEnabled ? "primary" : "ghost"}
            size="small"
            disabled={!item.contactEnabled}
            style={styles.actionButton}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderSpecializationChip = (specialization: string) => {
    const isSelected = selectedSpecialization === specialization;
    return (
      <TouchableOpacity
        key={specialization}
        onPress={() => setSelectedSpecialization(specialization)}
        style={[
          styles.filterChip,
          {
            backgroundColor: isSelected ? theme.primary : theme.surface,
            borderColor: isSelected ? theme.primary : theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.filterChipText,
            { color: isSelected ? theme.textInverse : theme.text },
          ]}
        >
          {specialization}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Lawyer Directory
        </Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search lawyers by name, location..."
          style={styles.searchBar}
          showVoice={false}
        />
      </View>

      <View
        style={[styles.filtersContainer, { backgroundColor: theme.surface }]}
      >
        <FlatList
          data={["All", ...SPECIALIZATIONS.slice(0, 5)]}
          renderItem={({ item }) => renderSpecializationChip(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      <FlatList
        data={filteredLawyers}
        renderItem={renderLawyer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lawyersList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="people-outline"
              size={64}
              color={theme.textTertiary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No lawyers found
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
  },
  searchBar: {
    marginBottom: Spacing.sm,
  },
  filtersContainer: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  filtersList: {
    paddingHorizontal: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  filterChipText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  lawyersList: {
    padding: Spacing.lg,
  },
  lawyerCard: {
    marginBottom: Spacing.md,
  },
  lawyerHeader: {
    marginBottom: Spacing.md,
  },
  lawyerInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  lawyerName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginRight: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: Spacing.sm,
  },
  rating: {
    fontSize: FontSizes.sm,
  },
  lawyerDetails: {
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: FontSizes.sm,
    marginLeft: Spacing.xs,
  },
  specializationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: Spacing.md,
  },
  specializationTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  specializationText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  moreSpecializations: {
    fontSize: FontSizes.xs,
    marginLeft: Spacing.xs,
  },
  bio: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 0.48,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
});
