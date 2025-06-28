import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { LEGAL_SECTIONS } from "@/constants/LegalConstants";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const mockLegalData = [
    ...LEGAL_SECTIONS.IPC.map((section) => ({
      ...section,
      source: "IPC",
      type: "section",
    })),
    ...LEGAL_SECTIONS.BNS.map((section) => ({
      ...section,
      source: "BNS",
      type: "section",
    })),
    {
      title: "Murder Case - State vs John Doe",
      description: "Recent case involving Section 302 IPC",
      source: "Case Law",
      type: "case",
    },
    {
      title: "Property Dispute Guidelines",
      description: "Legal guidelines for property disputes",
      source: "Guidelines",
      type: "guideline",
    },
    {
      title: "Bail Application Format",
      description: "Standard format for bail applications",
      source: "Template",
      type: "template",
    },
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = () => {
    const results = mockLegalData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.section && item.section.includes(searchQuery)),
    );
    setSearchResults(results);
  };

  const handleVoiceSearch = () => {
    setIsVoiceActive(true);
    Alert.alert(
      "Voice Search",
      "Voice search would activate the device microphone to listen for legal queries in multiple languages.",
      [
        { text: "Cancel", onPress: () => setIsVoiceActive(false) },
        {
          text: "Start Listening",
          onPress: () => {
            setTimeout(() => {
              setSearchQuery("Section 302 IPC murder");
              setIsVoiceActive(false);
            }, 2000);
          },
        },
      ],
    );
  };

  const handleSearchSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSearchHistory([
      suggestion,
      ...searchHistory.filter((h) => h !== suggestion).slice(0, 4),
    ]);
  };

  const searchSuggestions = [
    "Section 302 IPC",
    "Bail application",
    "Property dispute",
    "Criminal procedure",
    "Contract law",
    "Divorce procedure",
  ];

  const getSourceColor = (source: string) => {
    switch (source) {
      case "IPC":
        return "#3b82f6";
      case "BNS":
        return "#059669";
      case "Case Law":
        return "#7c3aed";
      case "Guidelines":
        return "#f59e0b";
      case "Template":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <View
          style={[
            styles.sourceBadge,
            { backgroundColor: getSourceColor(item.source) },
          ]}
        >
          <Text style={styles.sourceText}>{item.source}</Text>
        </View>
      </View>
      <Text style={styles.resultDescription}>{item.description}</Text>
      {item.section && (
        <Text style={styles.sectionText}>Section {item.section}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>🔍 Legal Search</Text>
        <Text style={styles.subtitle}>AI-powered legal research</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search legal topics, cases, sections..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={[
              styles.voiceButton,
              { backgroundColor: isVoiceActive ? "#ef4444" : "#7c3aed" },
            ]}
            onPress={handleVoiceSearch}
          >
            <Text style={styles.voiceIcon}>{isVoiceActive ? "🔴" : "🎤"}</Text>
          </TouchableOpacity>
        </View>

        {searchQuery.length === 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Quick Search:</Text>
            <View style={styles.suggestionsList}>
              {searchSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSearchSuggestion(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}{" "}
            found
          </Text>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : searchQuery.length > 2 ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsIcon}>🔍</Text>
          <Text style={styles.noResultsText}>
            No results found for "{searchQuery}"
          </Text>
          <Text style={styles.noResultsHint}>
            Try different keywords or check spelling
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.featureIcon}>🤖</Text>
          <Text style={styles.featureTitle}>AI-Powered Legal Search</Text>
          <Text style={styles.featureDescription}>
            Search through comprehensive legal database with AI assistance
          </Text>

          <View style={styles.featureList}>
            <Text style={styles.featureItem}>
              🎯 Smart legal search across IPC & BNS
            </Text>
            <Text style={styles.featureItem}>
              🎤 Voice search in multiple languages
            </Text>
            <Text style={styles.featureItem}>
              📚 Case law and precedent references
            </Text>
            <Text style={styles.featureItem}>
              📝 Legal templates and formats
            </Text>
            <Text style={styles.featureItem}>⚖️ AI-powered result ranking</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#ea580c",
    fontWeight: "500",
  },
  searchSection: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    marginRight: 12,
  },
  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceIcon: {
    fontSize: 20,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  suggestionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  suggestionChip: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sourceText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  resultDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 10,
    color: "#7c3aed",
    fontWeight: "500",
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  noResultsHint: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  featureIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  featureList: {
    alignSelf: "flex-start",
  },
  featureItem: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
});
