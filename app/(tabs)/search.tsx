import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All", icon: "🔍" },
    { id: "sections", label: "Sections", icon: "⚖️" },
    { id: "cases", label: "Cases", icon: "📋" },
    { id: "templates", label: "Templates", icon: "📄" },
  ];

  const mockResults = [
    {
      id: "1",
      title: "Section 302 IPC",
      description: "Punishment for murder",
      category: "sections",
      type: "section",
    },
    {
      id: "2",
      title: "Case Study: Theft Prevention",
      description: "Recent judgment on theft cases",
      category: "cases",
      type: "case",
    },
  ];

  const filteredResults =
    selectedCategory === "all"
      ? mockResults
      : mockResults.filter((item) => item.category === selectedCategory);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const renderResult = ({ item }: any) => (
    <TouchableOpacity style={styles.resultCard}>
      <Text style={styles.resultTitle}>{item.title}</Text>
      <Text style={styles.resultDescription}>{item.description}</Text>
      <Text style={styles.resultType}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search legal sections, cases, templates..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.activeCategoryChip,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search Results */}
      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        renderItem={renderResult}
        style={styles.resultsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>Start searching</Text>
            <Text style={styles.emptySubtext}>
              Search for legal sections, cases, and templates
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
    backgroundColor: "#f8fafc",
  },
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#1e293b",
  },
  searchButton: {
    padding: 8,
  },
  searchButtonText: {
    fontSize: 20,
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: width < 400 ? 12 : 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    minWidth: width < 400 ? 80 : 100,
  },
  activeCategoryChip: {
    backgroundColor: "#1e40af",
  },
  categoryIcon: {
    fontSize: width < 400 ? 14 : 16,
    marginRight: 4,
  },
  categoryText: {
    fontSize: width < 400 ? 12 : 14,
    fontWeight: "500",
    color: "#64748b",
  },
  activeCategoryText: {
    color: "#fff",
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: width < 400 ? 16 : 20,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: width < 400 ? 8 : 12,
    padding: width < 400 ? 10 : 16,
    marginVertical: width < 400 ? 4 : 6,
    borderLeftWidth: 3,
    borderLeftColor: "#1e40af",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultTitle: {
    fontSize: width < 400 ? 14 : 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
    lineHeight: 20,
  },
  resultDescription: {
    fontSize: width < 400 ? 13 : 14,
    color: "#64748b",
    lineHeight: width < 400 ? 18 : 20,
    marginBottom: 8,
  },
  resultType: {
    fontSize: width < 400 ? 10 : 12,
    color: "#1e40af",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
