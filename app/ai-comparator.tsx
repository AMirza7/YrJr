import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { LEGAL_SECTIONS } from "@/constants/LegalConstants";
import { LegalSection, SectionComparison } from "@/types/features";

export default function AISectionComparator() {
  const [selectedIPCSection, setSelectedIPCSection] =
    useState<LegalSection | null>(null);
  const [selectedBNSSection, setSelectedBNSSection] =
    useState<LegalSection | null>(null);
  const [comparison, setComparison] = useState<SectionComparison | null>(null);
  const [searchIPC, setSearchIPC] = useState("");
  const [searchBNS, setSearchBNS] = useState("");
  const [loading, setLoading] = useState(false);

  const generateComparison = async (
    ipcSection: LegalSection,
    bnsSection: LegalSection,
  ) => {
    setLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const mockComparison: SectionComparison = {
        ipcSection,
        bnsSection,
        similarities: [
          "Both sections deal with the same category of offense",
          "Punishment structures are largely similar",
          "Core legal principles remain unchanged",
          "Evidence requirements are consistent",
        ],
        differences: [
          "BNS uses updated legal terminology",
          "Penalty amounts have been revised in BNS",
          "BNS includes additional clarifications",
          "Procedural aspects have been modernized",
        ],
        notes:
          "The transition from IPC to BNS represents a modernization of legal language while preserving core legal principles. Key changes focus on clarity and contemporary legal practice.",
      };

      setComparison(mockComparison);
      setLoading(false);
    }, 2000);
  };

  const handleCompare = () => {
    if (!selectedIPCSection || !selectedBNSSection) {
      Alert.alert(
        "Selection Required",
        "Please select sections from both IPC and BNS to compare",
      );
      return;
    }

    generateComparison(selectedIPCSection, selectedBNSSection);
  };

  const filteredIPCSections = LEGAL_SECTIONS.IPC.filter(
    (section) =>
      section.section.includes(searchIPC) ||
      section.title.toLowerCase().includes(searchIPC.toLowerCase()),
  );

  const filteredBNSSections = LEGAL_SECTIONS.BNS.filter(
    (section) =>
      section.section.includes(searchBNS) ||
      section.title.toLowerCase().includes(searchBNS.toLowerCase()),
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⚖️ AI Section Comparator</Text>
        <Text style={styles.subtitle}>Compare IPC vs BNS Sections</Text>
      </View>

      {/* Section Selectors */}
      <View style={styles.selectorsContainer}>
        {/* IPC Selector */}
        <View style={styles.selectorColumn}>
          <Text style={styles.selectorTitle}>🇮🇳 Indian Penal Code (IPC)</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search IPC sections..."
            value={searchIPC}
            onChangeText={setSearchIPC}
          />
          <ScrollView style={styles.sectionsList} nestedScrollEnabled>
            {filteredIPCSections.map((section) => (
              <TouchableOpacity
                key={section.section}
                style={[
                  styles.sectionItem,
                  {
                    backgroundColor:
                      selectedIPCSection?.section === section.section
                        ? "#3b82f6"
                        : "#fff",
                  },
                ]}
                onPress={() => setSelectedIPCSection(section)}
              >
                <Text
                  style={[
                    styles.sectionNumber,
                    {
                      color:
                        selectedIPCSection?.section === section.section
                          ? "#fff"
                          : "#3b82f6",
                    },
                  ]}
                >
                  Section {section.section}
                </Text>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color:
                        selectedIPCSection?.section === section.section
                          ? "#fff"
                          : "#111827",
                    },
                  ]}
                >
                  {section.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* BNS Selector */}
        <View style={styles.selectorColumn}>
          <Text style={styles.selectorTitle}>
            📋 Bharatiya Nyaya Sanhita (BNS)
          </Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search BNS sections..."
            value={searchBNS}
            onChangeText={setSearchBNS}
          />
          <ScrollView style={styles.sectionsList} nestedScrollEnabled>
            {filteredBNSSections.map((section) => (
              <TouchableOpacity
                key={section.section}
                style={[
                  styles.sectionItem,
                  {
                    backgroundColor:
                      selectedBNSSection?.section === section.section
                        ? "#059669"
                        : "#fff",
                  },
                ]}
                onPress={() => setSelectedBNSSection(section)}
              >
                <Text
                  style={[
                    styles.sectionNumber,
                    {
                      color:
                        selectedBNSSection?.section === section.section
                          ? "#fff"
                          : "#059669",
                    },
                  ]}
                >
                  Section {section.section}
                </Text>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color:
                        selectedBNSSection?.section === section.section
                          ? "#fff"
                          : "#111827",
                    },
                  ]}
                >
                  {section.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Compare Button */}
      <View style={styles.compareSection}>
        <TouchableOpacity
          style={[styles.compareButton, { opacity: loading ? 0.7 : 1 }]}
          onPress={handleCompare}
          disabled={loading}
        >
          <Text style={styles.compareButtonText}>
            {loading ? "🤖 AI Analyzing..." : "🔍 Compare Sections"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comparison Results */}
      {comparison && (
        <View style={styles.comparisonResults}>
          <Text style={styles.comparisonTitle}>📊 AI Analysis Results</Text>

          {/* Selected Sections */}
          <View style={styles.selectedSections}>
            <View style={styles.selectedSection}>
              <Text style={styles.selectedSectionTitle}>
                IPC Section {comparison.ipcSection.section}
              </Text>
              <Text style={styles.selectedSectionDesc}>
                {comparison.ipcSection.title}
              </Text>
            </View>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.selectedSection}>
              <Text style={styles.selectedSectionTitle}>
                BNS Section {comparison.bnsSection.section}
              </Text>
              <Text style={styles.selectedSectionDesc}>
                {comparison.bnsSection.title}
              </Text>
            </View>
          </View>

          {/* Similarities */}
          <View style={styles.comparisonCategory}>
            <Text style={styles.categoryTitle}>✅ Similarities</Text>
            {comparison.similarities.map((similarity, index) => (
              <View key={index} style={styles.comparisonPoint}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.pointText}>{similarity}</Text>
              </View>
            ))}
          </View>

          {/* Differences */}
          <View style={styles.comparisonCategory}>
            <Text style={styles.categoryTitle}>🔄 Key Differences</Text>
            {comparison.differences.map((difference, index) => (
              <View key={index} style={styles.comparisonPoint}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.pointText}>{difference}</Text>
              </View>
            ))}
          </View>

          {/* AI Notes */}
          <View style={styles.aiNotes}>
            <Text style={styles.aiNotesTitle}>🤖 AI Legal Analysis</Text>
            <Text style={styles.aiNotesText}>{comparison.notes}</Text>
          </View>
        </View>
      )}
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  selectorsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  selectorColumn: {
    flex: 1,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    fontSize: 12,
    backgroundColor: "#fff",
  },
  sectionsList: {
    maxHeight: 300,
    borderRadius: 8,
  },
  sectionItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  sectionNumber: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    lineHeight: 14,
  },
  compareSection: {
    padding: 16,
    alignItems: "center",
  },
  compareButton: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  compareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  comparisonResults: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  selectedSections: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  selectedSection: {
    flex: 1,
    alignItems: "center",
  },
  selectedSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  selectedSectionDesc: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  vsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7c3aed",
    marginHorizontal: 16,
  },
  comparisonCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  comparisonPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#059669",
    marginRight: 8,
    marginTop: 2,
  },
  pointText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  aiNotes: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  aiNotesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  aiNotesText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
});
