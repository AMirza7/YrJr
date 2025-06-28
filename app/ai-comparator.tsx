import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User, AIComparison } from "@/types";
import { canAccessFeature } from "@/constants/roles";
import BackButton from "@/components/navigation/BackButton";

interface IPCSection {
  section: string;
  title: string;
  description: string;
}

interface BNSSection {
  section: string;
  title: string;
  description: string;
  ipcEquivalent?: string;
}

// Mock IPC and BNS data
const IPC_SECTIONS: IPCSection[] = [
  {
    section: "302",
    title: "Murder",
    description:
      "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
  },
  {
    section: "304",
    title: "Culpable homicide not amounting to murder",
    description: "Whoever commits culpable homicide not amounting to murder...",
  },
  {
    section: "307",
    title: "Attempt to murder",
    description: "Whoever does any act with such intention or knowledge...",
  },
  {
    section: "376",
    title: "Rape",
    description: "A man is said to commit rape if he...",
  },
  {
    section: "420",
    title: "Cheating and dishonestly inducing delivery of property",
    description: "Whoever cheats and thereby dishonestly induces...",
  },
  {
    section: "498A",
    title: "Cruelty by husband or relatives of husband",
    description: "Whoever, being the husband or the relative of the husband...",
  },
];

const BNS_SECTIONS: BNSSection[] = [
  {
    section: "103",
    title: "Murder",
    description:
      "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.",
    ipcEquivalent: "302",
  },
  {
    section: "105",
    title: "Culpable homicide not amounting to murder",
    description: "Whoever commits culpable homicide not amounting to murder...",
    ipcEquivalent: "304",
  },
  {
    section: "109",
    title: "Attempt to murder",
    description:
      "Whoever does any act with such intention or knowledge and under such circumstances...",
    ipcEquivalent: "307",
  },
  {
    section: "63",
    title: "Rape",
    description: "A man is said to commit rape if he...",
    ipcEquivalent: "376",
  },
  {
    section: "318",
    title: "Cheating",
    description:
      "Whoever cheats and thereby dishonestly induces the person deceived...",
    ipcEquivalent: "420",
  },
  {
    section: "84",
    title: "Cruelty by husband or relatives of husband",
    description:
      "Whoever, being the husband or the relative of the husband of a woman...",
    ipcEquivalent: "498A",
  },
];

export default function AIComparator() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ipcQuery, setIpcQuery] = useState("");
  const [bnsQuery, setBnsQuery] = useState("");
  const [ipcSuggestions, setIpcSuggestions] = useState<IPCSection[]>([]);
  const [bnsSuggestions, setBnsSuggestions] = useState<BNSSection[]>([]);
  const [selectedIPC, setSelectedIPC] = useState<IPCSection | null>(null);
  const [selectedBNS, setSelectedBNS] = useState<BNSSection | null>(null);
  const [comparison, setComparison] = useState<AIComparison | null>(null);
  const [comparing, setComparing] = useState(false);
  const [showIpcSuggestions, setShowIpcSuggestions] = useState(false);
  const [showBnsSuggestions, setShowBnsSuggestions] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    if (ipcQuery.length > 0) {
      const filtered = IPC_SECTIONS.filter(
        (section) =>
          section.section.includes(ipcQuery) ||
          section.title.toLowerCase().includes(ipcQuery.toLowerCase()) ||
          section.description.toLowerCase().includes(ipcQuery.toLowerCase()),
      );
      setIpcSuggestions(filtered);
      setShowIpcSuggestions(filtered.length > 0);
    } else {
      setIpcSuggestions([]);
      setShowIpcSuggestions(false);
    }
  }, [ipcQuery]);

  useEffect(() => {
    if (bnsQuery.length > 0) {
      const filtered = BNS_SECTIONS.filter(
        (section) =>
          section.section.includes(bnsQuery) ||
          section.title.toLowerCase().includes(bnsQuery.toLowerCase()) ||
          section.description.toLowerCase().includes(bnsQuery.toLowerCase()),
      );
      setBnsSuggestions(filtered);
      setShowBnsSuggestions(filtered.length > 0);
    } else {
      setBnsSuggestions([]);
      setShowBnsSuggestions(false);
    }
  }, [bnsQuery]);

  const checkAccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      if (
        !canAccessFeature(
          currentUser.role,
          currentUser.subscriptionTier,
          "aiComparator",
        )
      ) {
        Alert.alert(
          "Access Restricted",
          "AI Comparator is available for Lawyers, Junior Lawyers, and Law Students only.",
          [{ text: "OK", onPress: () => router.back() }],
        );
        return;
      }

      setUser(currentUser);
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const selectIPC = (section: IPCSection) => {
    setSelectedIPC(section);
    setIpcQuery(`Section ${section.section} - ${section.title}`);
    setShowIpcSuggestions(false);

    // Auto-suggest equivalent BNS section
    const equivalentBNS = BNS_SECTIONS.find(
      (bns) => bns.ipcEquivalent === section.section,
    );
    if (equivalentBNS) {
      setSelectedBNS(equivalentBNS);
      setBnsQuery(`Section ${equivalentBNS.section} - ${equivalentBNS.title}`);
    }
  };

  const selectBNS = (section: BNSSection) => {
    setSelectedBNS(section);
    setBnsQuery(`Section ${section.section} - ${section.title}`);
    setShowBnsSuggestions(false);

    // Auto-suggest equivalent IPC section
    if (section.ipcEquivalent) {
      const equivalentIPC = IPC_SECTIONS.find(
        (ipc) => ipc.section === section.ipcEquivalent,
      );
      if (equivalentIPC) {
        setSelectedIPC(equivalentIPC);
        setIpcQuery(
          `Section ${equivalentIPC.section} - ${equivalentIPC.title}`,
        );
      }
    }
  };

  const performComparison = async () => {
    if (!selectedIPC || !selectedBNS) {
      Alert.alert(
        "Error",
        "Please select both IPC and BNS sections to compare",
      );
      return;
    }

    setComparing(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockComparison: AIComparison = {
      id: `comparison_${Date.now()}`,
      ipcSection: selectedIPC.section,
      bnsSection: selectedBNS.section,
      comparison: {
        similarities: [
          "Both sections deal with the same fundamental offense",
          "The core elements of the crime remain unchanged",
          "Similar punishment framework maintained",
          "Intent and mens rea requirements are consistent",
        ],
        differences: [
          "BNS uses more contemporary legal language",
          "Procedural aspects have been streamlined in BNS",
          "Some penalty structures have been updated",
          "Gender-neutral language adopted in BNS",
        ],
        keyChanges: [
          "Section numbering has been reorganized",
          "Definitions have been clarified and modernized",
          "Some archaic terms have been replaced",
          "Cross-references updated to new numbering system",
        ],
        practicalImplications: [
          "Lawyers need to update their legal references",
          "Case citations will need dual referencing during transition",
          "Training required for law enforcement personnel",
          "Legal precedents remain valid but with new section references",
        ],
      },
      timestamp: new Date().toISOString(),
    };

    setComparison(mockComparison);
    setComparing(false);
  };

  const clearComparison = () => {
    setSelectedIPC(null);
    setSelectedBNS(null);
    setIpcQuery("");
    setBnsQuery("");
    setComparison(null);
    setIpcSuggestions([]);
    setBnsSuggestions([]);
    setShowIpcSuggestions(false);
    setShowBnsSuggestions(false);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading AI Comparator...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Home" color="#fff" />
        <Text style={styles.title}>AI Section Comparator</Text>
        <Text style={styles.subtitle}>Compare IPC vs BNS Sections</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Inputs */}
        <View style={styles.searchSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>IPC Section</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search IPC sections (e.g., 302, murder, attempt)"
              value={ipcQuery}
              onChangeText={setIpcQuery}
              onFocus={() => setShowIpcSuggestions(ipcSuggestions.length > 0)}
            />

            {showIpcSuggestions && (
              <View style={styles.suggestions}>
                <FlatList
                  data={ipcSuggestions}
                  keyExtractor={(item) => item.section}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => selectIPC(item)}
                    >
                      <Text style={styles.suggestionSection}>
                        Section {item.section}
                      </Text>
                      <Text style={styles.suggestionTitle}>{item.title}</Text>
                      <Text
                        style={styles.suggestionDescription}
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                  )}
                  maxHeight={200}
                />
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>BNS Section</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search BNS sections (e.g., 103, murder, attempt)"
              value={bnsQuery}
              onChangeText={setBnsQuery}
              onFocus={() => setShowBnsSuggestions(bnsSuggestions.length > 0)}
            />

            {showBnsSuggestions && (
              <View style={styles.suggestions}>
                <FlatList
                  data={bnsSuggestions}
                  keyExtractor={(item) => item.section}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => selectBNS(item)}
                    >
                      <Text style={styles.suggestionSection}>
                        Section {item.section}
                      </Text>
                      <Text style={styles.suggestionTitle}>{item.title}</Text>
                      <Text
                        style={styles.suggestionDescription}
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                      {item.ipcEquivalent && (
                        <Text style={styles.equivalentText}>
                          IPC Equivalent: Section {item.ipcEquivalent}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                  maxHeight={200}
                />
              </View>
            )}
          </View>
        </View>

        {/* Selected Sections */}
        {(selectedIPC || selectedBNS) && (
          <View style={styles.selectedSections}>
            <Text style={styles.sectionTitle}>Selected Sections</Text>

            {selectedIPC && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionType}>
                  IPC Section {selectedIPC.section}
                </Text>
                <Text style={styles.sectionName}>{selectedIPC.title}</Text>
                <Text style={styles.sectionDesc}>
                  {selectedIPC.description}
                </Text>
              </View>
            )}

            {selectedBNS && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionType}>
                  BNS Section {selectedBNS.section}
                </Text>
                <Text style={styles.sectionName}>{selectedBNS.title}</Text>
                <Text style={styles.sectionDesc}>
                  {selectedBNS.description}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.compareButton,
              { opacity: !selectedIPC || !selectedBNS || comparing ? 0.5 : 1 },
            ]}
            onPress={performComparison}
            disabled={!selectedIPC || !selectedBNS || comparing}
          >
            <Text style={styles.compareButtonText}>
              {comparing ? "Analyzing..." : "🧠 Compare Sections"}
            </Text>
          </TouchableOpacity>

          {(selectedIPC || selectedBNS || comparison) && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearComparison}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Comparison Results */}
        {comparison && (
          <View style={styles.comparisonResults}>
            <Text style={styles.resultsTitle}>AI Comparison Results</Text>

            <View style={styles.comparisonCard}>
              <Text style={styles.comparisonHeader}>
                IPC {comparison.ipcSection} vs BNS {comparison.bnsSection}
              </Text>

              <View style={styles.comparisonSection}>
                <Text style={styles.comparisonSubtitle}>✅ Similarities</Text>
                {comparison.comparison.similarities.map((item, index) => (
                  <Text key={index} style={styles.comparisonItem}>
                    • {item}
                  </Text>
                ))}
              </View>

              <View style={styles.comparisonSection}>
                <Text style={styles.comparisonSubtitle}>
                  🔄 Key Differences
                </Text>
                {comparison.comparison.differences.map((item, index) => (
                  <Text key={index} style={styles.comparisonItem}>
                    • {item}
                  </Text>
                ))}
              </View>

              <View style={styles.comparisonSection}>
                <Text style={styles.comparisonSubtitle}>🔥 Major Changes</Text>
                {comparison.comparison.keyChanges.map((item, index) => (
                  <Text key={index} style={styles.comparisonItem}>
                    • {item}
                  </Text>
                ))}
              </View>

              <View style={styles.comparisonSection}>
                <Text style={styles.comparisonSubtitle}>
                  ⚖️ Practical Implications
                </Text>
                {comparison.comparison.practicalImplications.map(
                  (item, index) => (
                    <Text key={index} style={styles.comparisonItem}>
                      • {item}
                    </Text>
                  ),
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#7c3aed",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchSection: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    position: "relative",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestions: {
    position: "absolute",
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  suggestionSection: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7c3aed",
    marginBottom: 4,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  suggestionDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  equivalentText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
    fontStyle: "italic",
  },
  selectedSections: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#7c3aed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7c3aed",
    marginBottom: 4,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  compareButton: {
    flex: 1,
    backgroundColor: "#7c3aed",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  compareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  comparisonResults: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  comparisonCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comparisonHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7c3aed",
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  comparisonSection: {
    marginBottom: 20,
  },
  comparisonSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  comparisonItem: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 8,
  },
});
