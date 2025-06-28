import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LEGAL_SECTIONS } from "@/constants/LegalConstants";
import { voiceAssistantService, VoiceCommand } from "@/services/voiceAssistant";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [voiceCapabilities, setVoiceCapabilities] = useState<any>(null);

  const categories = [
    { id: "all", label: "All", icon: "🔍" },
    { id: "sections", label: "Sections", icon: "⚖️" },
    { id: "cases", label: "Cases", icon: "📋" },
    { id: "templates", label: "Templates", icon: "📄" },
    { id: "guidelines", label: "Guidelines", icon: "📖" },
  ];

  const mockLegalData = [
    ...LEGAL_SECTIONS.IPC.map((section) => ({
      ...section,
      source: "IPC",
      type: "section",
      id: `ipc-${section.section}`,
    })),
    ...LEGAL_SECTIONS.BNS.map((section) => ({
      ...section,
      source: "BNS",
      type: "section",
      id: `bns-${section.section}`,
    })),
    {
      id: "case-1",
      title: "Murder Case - State vs John Doe",
      description: "Recent case involving Section 302 IPC",
      source: "Case Law",
      type: "case",
      section: "302",
    },
    {
      id: "case-2",
      title: "Property Dispute Guidelines",
      description: "Legal guidelines for property disputes",
      source: "Guidelines",
      type: "guideline",
    },
    {
      id: "template-1",
      title: "Bail Application Format",
      description: "Standard format for bail applications",
      source: "Template",
      type: "template",
    },
    {
      id: "case-3",
      title: "Cybercrime Investigation - IT Act 2000",
      description: "Case study on cyber fraud under Section 66C",
      source: "Case Law",
      type: "case",
      section: "66C",
    },
  ];

  useEffect(() => {
    checkVoiceCapabilities();
    loadSearchHistory();
  }, []);

  const checkVoiceCapabilities = async () => {
    const capabilities = await voiceAssistantService.getVoiceCapabilities();
    setVoiceCapabilities(capabilities);
  };

  const loadSearchHistory = () => {
    // Mock search history
    setSearchHistory([
      "Section 302 IPC",
      "Bail application",
      "Property dispute",
      "Section 420 BNS",
      "Murder case law",
    ]);
  };

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) return;

    const normalizedQuery = query.toLowerCase();
    let filtered = mockLegalData;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => {
        if (selectedCategory === "sections") return item.type === "section";
        if (selectedCategory === "cases") return item.type === "case";
        if (selectedCategory === "templates") return item.type === "template";
        if (selectedCategory === "guidelines") return item.type === "guideline";
        return true;
      });
    }

    // Search in title, description, and section number
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(normalizedQuery) ||
        (item.description &&
          item.description.toLowerCase().includes(normalizedQuery)) ||
        (item.section && item.section.toString().includes(normalizedQuery)) ||
        (item.source && item.source.toLowerCase().includes(normalizedQuery)),
    );

    setSearchResults(filtered);

    // Add to search history
    if (query.trim() && !searchHistory.includes(query)) {
      setSearchHistory((prev) => [query, ...prev.slice(0, 4)]);
    }
  };

  const handleVoiceSearch = async () => {
    if (!voiceCapabilities?.speechAvailable) {
      Alert.alert(
        "Voice Not Available",
        "Voice recognition is not available on this device.",
      );
      return;
    }

    setIsListening(true);

    try {
      // Start listening animation
      await voiceAssistantService.speak(
        "I'm listening. Please speak your search query.",
      );

      // Get voice input (mock)
      const speechText = await voiceAssistantService.startListening();

      // Process voice command
      const voiceCommand =
        voiceAssistantService.processVoiceCommand(speechText);
      const response = voiceAssistantService.generateResponse(voiceCommand);

      // Update search query and perform search
      setSearchQuery(speechText);
      handleSearch(speechText);

      // Provide voice feedback
      await voiceAssistantService.speak(response.text);

      // Handle any actions
      if (response.action) {
        handleVoiceAction(response.action);
      }
    } catch (error) {
      Alert.alert(
        "Voice Error",
        "Failed to process voice input. Please try again.",
      );
    } finally {
      setIsListening(false);
    }
  };

  const handleVoiceAction = (action: any) => {
    switch (action.type) {
      case "search":
        // Already handled by setting search query
        break;
      case "navigate":
        // Could implement navigation to specific routes
        Alert.alert("Navigation", `Would navigate to: ${action.params.route}`);
        break;
      case "compare":
        Alert.alert("AI Comparator", "Opening AI section comparator...");
        break;
      default:
        break;
    }
  };

  const handleQuickCommand = async (command: string) => {
    setSearchQuery(command);
    await voiceAssistantService.speak(`Searching for ${command}`);
    handleSearch(command);
  };

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() =>
        Alert.alert(
          item.title,
          item.description || "No additional details available.",
        )
      }
    >
      <View style={styles.resultHeader}>
        <View style={styles.resultTitleRow}>
          <Text style={styles.resultType}>{getTypeIcon(item.type)}</Text>
          <Text style={styles.resultTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
        <View style={styles.sourceTag}>
          <Text style={styles.sourceText}>{item.source}</Text>
        </View>
      </View>

      {item.description && (
        <Text style={styles.resultDescription} numberOfLines={3}>
          {item.description}
        </Text>
      )}

      {item.section && (
        <View style={styles.sectionInfo}>
          <Text style={styles.sectionLabel}>Section: {item.section}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "section":
        return "⚖️";
      case "case":
        return "📋";
      case "template":
        return "📄";
      case "guideline":
        return "📖";
      default:
        return "🔍";
    }
  };

  const quickCommands = voiceAssistantService.getQuickResponses();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>🔍 Legal Search</Text>
        <Text style={styles.subtitle}>AI-powered legal research</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search cases, sections, laws..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch()}
          >
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.voiceButton,
              isListening && styles.voiceButtonActive,
              !voiceCapabilities?.speechAvailable && styles.voiceButtonDisabled,
            ]}
            onPress={handleVoiceSearch}
            disabled={isListening || !voiceCapabilities?.speechAvailable}
          >
            {isListening ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.voiceButtonText}>🎤</Text>
            )}
          </TouchableOpacity>
        </View>

        {isListening && (
          <View style={styles.listeningIndicator}>
            <Text style={styles.listeningText}>🎤 Listening...</Text>
            <Text style={styles.listeningSubtext}>
              Speak your legal search query
            </Text>
          </View>
        )}
      </View>

      {/* Category Filters */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoriesList}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === category.id &&
                      styles.categoryLabelActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Voice Commands */}
      {voiceCapabilities?.speechAvailable && (
        <View style={styles.voiceCommandsContainer}>
          <Text style={styles.voiceCommandsTitle}>🎙️ Quick Voice Commands</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.voiceCommandsList}>
              {quickCommands.slice(0, 6).map((cmd, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.voiceCommandChip}
                  onPress={() => handleQuickCommand(cmd.command)}
                >
                  <Text style={styles.voiceCommandText}>{cmd.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchResults.length > 0 ? (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""} found
              </Text>
            </View>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          </>
        ) : searchQuery ? (
          <View style={styles.emptyResults}>
            <Text style={styles.emptyResultsIcon}>🔍</Text>
            <Text style={styles.emptyResultsTitle}>No Results Found</Text>
            <Text style={styles.emptyResultsText}>
              Try adjusting your search terms or using voice search
            </Text>
            <TouchableOpacity
              style={styles.tryVoiceButton}
              onPress={handleVoiceSearch}
              disabled={!voiceCapabilities?.speechAvailable}
            >
              <Text style={styles.tryVoiceButtonText}>🎤 Try Voice Search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.searchSuggestions}>
            <Text style={styles.suggestionsTitle}>Recent Searches</Text>
            {searchHistory.map((query, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => {
                  setSearchQuery(query);
                  handleSearch(query);
                }}
              >
                <Text style={styles.historyIcon}>🕒</Text>
                <Text style={styles.historyText}>{query}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.suggestionsTitle}>Popular Searches</Text>
            {[
              "Section 302 IPC",
              "Bail application format",
              "Property dispute law",
              "Section 420 BNS",
            ].map((query, index) => (
              <TouchableOpacity
                key={`popular-${index}`}
                style={styles.historyItem}
                onPress={() => {
                  setSearchQuery(query);
                  handleSearch(query);
                }}
              >
                <Text style={styles.historyIcon}>🔥</Text>
                <Text style={styles.historyText}>{query}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
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
    fontSize: 16,
    color: "#6b7280",
  },
  searchContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    padding: 12,
    minWidth: 44,
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 18,
  },
  voiceButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    padding: 12,
    minWidth: 44,
    alignItems: "center",
  },
  voiceButtonActive: {
    backgroundColor: "#ef4444",
  },
  voiceButtonDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.5,
  },
  voiceButtonText: {
    fontSize: 18,
  },
  listeningIndicator: {
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  listeningText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
  },
  listeningSubtext: {
    fontSize: 14,
    color: "#3b82f6",
    marginTop: 4,
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  categoriesList: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  categoryChipActive: {
    backgroundColor: "#3b82f6",
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  categoryLabelActive: {
    color: "#fff",
  },
  voiceCommandsContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  voiceCommandsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  voiceCommandsList: {
    flexDirection: "row",
    gap: 8,
  },
  voiceCommandChip: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  voiceCommandText: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "500",
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsHeader: {
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
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
  resultTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 8,
  },
  resultType: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  sourceTag: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sourceText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#374151",
  },
  resultDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  sectionInfo: {
    backgroundColor: "#f0f9ff",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1e40af",
  },
  emptyResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptyResultsText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  tryVoiceButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tryVoiceButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  searchSuggestions: {
    flex: 1,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    marginTop: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  historyIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  historyText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
});
