import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";

interface Section {
  id: string;
  code: string;
  title: string;
  content: string;
  act: string;
  amendments?: Array<{
    date: string;
    description: string;
  }>;
}

interface Comparison {
  id: string;
  ipcSection: Section;
  bnsSection: Section;
  similarities: string[];
  differences: string[];
  keyChanges: string[];
  practicalImplications: string[];
  semanticSimilarity?: number;
  timestamp: string;
}

interface SectionComparatorProps {
  initialComparison?: Comparison;
}

const mockSections: Record<string, Section[]> = {
  ipc: [
    {
      id: "ipc-302",
      code: "302",
      title: "Punishment for murder",
      content:
        "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
      act: "Indian Penal Code, 1860",
    },
    {
      id: "ipc-307",
      code: "307",
      title: "Attempt to murder",
      content:
        "Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder, shall be punished with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine; and if hurt is caused to any person by such act, the offender shall be liable either to imprisonment for life, or to such punishment as is hereinbefore mentioned.",
      act: "Indian Penal Code, 1860",
    },
  ],
  bns: [
    {
      id: "bns-103",
      code: "103",
      title: "Punishment for murder",
      content:
        "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.",
      act: "Bharatiya Nyaya Sanhita, 2023",
    },
    {
      id: "bns-109",
      code: "109",
      title: "Attempt to murder",
      content:
        "Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder, shall be punished with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine; and if hurt is caused to any person by such act, the offender shall be liable either to imprisonment for life, or to such punishment as is hereinbefore mentioned.",
      act: "Bharatiya Nyaya Sanhita, 2023",
    },
  ],
  crpc: [
    {
      id: "crpc-154",
      code: "154",
      title: "Information in cognizable cases",
      content:
        "Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be signed by the person giving it, and the substance thereof shall be entered in a book to be kept by such officer in such form as the State Government may prescribe in this behalf.",
      act: "Code of Criminal Procedure, 1973",
    },
  ],
  bnss: [
    {
      id: "bnss-173",
      code: "173",
      title: "Information in cognizable cases",
      content:
        "Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be signed by the person giving it, and the substance thereof shall be entered in a book to be kept by such officer in such form as the State Government may prescribe in this behalf.",
      act: "Bharatiya Nagarik Suraksha Sanhita, 2023",
    },
  ],
};

const comparisonHistory: Comparison[] = [
  {
    id: "1",
    ipcSection: mockSections.ipc[0],
    bnsSection: mockSections.bns[0],
    similarities: [
      "Both prescribe death or life imprisonment",
      "Both include liability to fine",
    ],
    differences: ["Minor wording differences in punishment clause"],
    keyChanges: ["No substantial changes in punishment structure"],
    practicalImplications: [
      "Same legal effect in practice",
      "Punishment framework unchanged",
    ],
    semanticSimilarity: 98,
    timestamp: "2024-01-15T10:30:00Z",
  },
];

export default function SectionComparator({
  initialComparison,
}: SectionComparatorProps) {
  const { theme } = useTheme();
  const { t, language } = useLocalization();

  const [selectedCode1, setSelectedCode1] = useState("ipc");
  const [selectedCode2, setSelectedCode2] = useState("bns");
  const [section1, setSection1] = useState<Section | null>(null);
  const [section2, setSection2] = useState<Section | null>(null);
  const [comparison, setComparison] = useState<Comparison | null>(
    initialComparison || null,
  );
  const [semanticMode, setSemanticMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLanguageView, setShowLanguageView] = useState(false);
  const [searchTerm1, setSearchTerm1] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [showSectionPicker1, setShowSectionPicker1] = useState(false);
  const [showSectionPicker2, setShowSectionPicker2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const codeOptions = [
    { key: "ipc", label: "IPC (Indian Penal Code)" },
    { key: "bns", label: "BNS (Bharatiya Nyaya Sanhita)" },
    { key: "crpc", label: "CrPC (Criminal Procedure Code)" },
    { key: "bnss", label: "BNSS (Bharatiya Nagarik Suraksha Sanhita)" },
    { key: "cpc", label: "CPC (Civil Procedure Code)" },
    { key: "evidence", label: "Evidence Act" },
  ];

  const performComparison = async () => {
    if (!section1 || !section2) {
      Alert.alert("Error", "Please select sections from both codes");
      return;
    }

    setIsLoading(true);

    // Mock AI comparison
    setTimeout(() => {
      const newComparison: Comparison = {
        id: Date.now().toString(),
        ipcSection: section1,
        bnsSection: section2,
        similarities: [
          "Both sections address the same fundamental legal principle",
          "Similar penalty structure maintained",
          "Core elements of the offense remain unchanged",
        ],
        differences: [
          "Terminology updated in newer code",
          "Some procedural clarifications added",
          "Gender-neutral language adopted",
        ],
        keyChanges: [
          "Enhanced clarity in language",
          "Removal of archaic terms",
          "Addition of contemporary legal concepts",
        ],
        practicalImplications: [
          "No major impact on existing precedents",
          "Easier interpretation for modern courts",
          "Improved accessibility for legal practitioners",
        ],
        semanticSimilarity: Math.floor(Math.random() * 20) + 80,
        timestamp: new Date().toISOString(),
      };

      setComparison(newComparison);
      setIsLoading(false);
    }, 2000);
  };

  const saveComparison = () => {
    if (comparison) {
      // Save to history - in real app, this would be an API call
      Alert.alert("Success", "Comparison saved to history");
    }
  };

  const getSectionsList = (code: string) => {
    return mockSections[code] || [];
  };

  const filteredSections1 = getSectionsList(selectedCode1).filter(
    (section) =>
      section.code.includes(searchTerm1) ||
      section.title.toLowerCase().includes(searchTerm1.toLowerCase()),
  );

  const filteredSections2 = getSectionsList(selectedCode2).filter(
    (section) =>
      section.code.includes(searchTerm2) ||
      section.title.toLowerCase().includes(searchTerm2.toLowerCase()),
  );

  const renderSectionPicker = (
    show: boolean,
    setShow: (show: boolean) => void,
    sections: Section[],
    onSelect: (section: Section) => void,
    searchTerm: string,
    setSearchTerm: (term: string) => void,
  ) => (
    <Modal visible={show} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Select Section
            </Text>
            <TouchableOpacity onPress={() => setShow(false)}>
              <Text
                style={[styles.closeButton, { color: theme.colors.primary }]}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Search sections..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={theme.colors.textSecondary}
          />

          <ScrollView style={styles.sectionsList}>
            {sections.map((section) => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.sectionItem,
                  { borderBottomColor: theme.colors.border },
                ]}
                onPress={() => {
                  onSelect(section);
                  setShow(false);
                }}
              >
                <Text
                  style={[styles.sectionCode, { color: theme.colors.primary }]}
                >
                  Section {section.code}
                </Text>
                <Text
                  style={[styles.sectionTitle, { color: theme.colors.text }]}
                >
                  {section.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderComparison = () => {
    if (!comparison) return null;

    return (
      <View style={styles.comparisonContainer}>
        {/* Semantic Similarity Score */}
        {semanticMode && comparison.semanticSimilarity && (
          <View
            style={[
              styles.similarityCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              style={[styles.similarityTitle, { color: theme.colors.text }]}
            >
              Semantic Similarity
            </Text>
            <View style={styles.similarityBar}>
              <View
                style={[
                  styles.similarityFill,
                  {
                    width: `${comparison.semanticSimilarity}%`,
                    backgroundColor:
                      comparison.semanticSimilarity > 90
                        ? theme.colors.success
                        : comparison.semanticSimilarity > 70
                          ? theme.colors.warning
                          : theme.colors.error,
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.similarityScore, { color: theme.colors.text }]}
            >
              {comparison.semanticSimilarity}% Similar
            </Text>
          </View>
        )}

        {/* Comparison Results */}
        <View
          style={[
            styles.comparisonCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.comparisonTitle, { color: theme.colors.text }]}>
            🔍 Similarities
          </Text>
          {comparison.similarities.map((item, index) => (
            <Text
              key={index}
              style={[
                styles.comparisonItem,
                { color: theme.colors.textSecondary },
              ]}
            >
              • {item}
            </Text>
          ))}
        </View>

        <View
          style={[
            styles.comparisonCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.comparisonTitle, { color: theme.colors.text }]}>
            🔄 Differences
          </Text>
          {comparison.differences.map((item, index) => (
            <Text
              key={index}
              style={[
                styles.comparisonItem,
                { color: theme.colors.textSecondary },
              ]}
            >
              • {item}
            </Text>
          ))}
        </View>

        <View
          style={[
            styles.comparisonCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.comparisonTitle, { color: theme.colors.text }]}>
            🔑 Key Changes
          </Text>
          {comparison.keyChanges.map((item, index) => (
            <Text
              key={index}
              style={[
                styles.comparisonItem,
                { color: theme.colors.textSecondary },
              ]}
            >
              • {item}
            </Text>
          ))}
        </View>

        <View
          style={[
            styles.comparisonCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.comparisonTitle, { color: theme.colors.text }]}>
            ⚖️ Practical Implications
          </Text>
          {comparison.practicalImplications.map((item, index) => (
            <Text
              key={index}
              style={[
                styles.comparisonItem,
                { color: theme.colors.textSecondary },
              ]}
            >
              • {item}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header Controls */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Section Comparator
        </Text>

        <View style={styles.headerControls}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              semanticMode && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setSemanticMode(!semanticMode)}
          >
            <Text
              style={[
                styles.controlButtonText,
                { color: semanticMode ? "#fff" : theme.colors.text },
              ]}
            >
              🧠 Semantic
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { borderColor: theme.colors.border }]}
            onPress={() => setShowHistory(true)}
          >
            <Text
              style={[styles.controlButtonText, { color: theme.colors.text }]}
            >
              📚 History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { borderColor: theme.colors.border }]}
            onPress={() => setShowLanguageView(!showLanguageView)}
          >
            <Text
              style={[styles.controlButtonText, { color: theme.colors.text }]}
            >
              🌐 {language.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Code Selection */}
      <View
        style={[
          styles.selectionContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.selectionRow}>
          <View style={styles.codeSelector}>
            <Text style={[styles.selectorLabel, { color: theme.colors.text }]}>
              First Code
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {codeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.codeOption,
                    selectedCode1 === option.key && {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => setSelectedCode1(option.key)}
                >
                  <Text
                    style={[
                      styles.codeOptionText,
                      {
                        color:
                          selectedCode1 === option.key
                            ? "#fff"
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {option.key.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.sectionButton,
                { borderColor: theme.colors.border },
              ]}
              onPress={() => setShowSectionPicker1(true)}
            >
              <Text
                style={[styles.sectionButtonText, { color: theme.colors.text }]}
              >
                {section1
                  ? `Section ${section1.code}: ${section1.title}`
                  : "Select Section"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.codeSelector}>
            <Text style={[styles.selectorLabel, { color: theme.colors.text }]}>
              Second Code
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {codeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.codeOption,
                    selectedCode2 === option.key && {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => setSelectedCode2(option.key)}
                >
                  <Text
                    style={[
                      styles.codeOptionText,
                      {
                        color:
                          selectedCode2 === option.key
                            ? "#fff"
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {option.key.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.sectionButton,
                { borderColor: theme.colors.border },
              ]}
              onPress={() => setShowSectionPicker2(true)}
            >
              <Text
                style={[styles.sectionButtonText, { color: theme.colors.text }]}
              >
                {section2
                  ? `Section ${section2.code}: ${section2.title}`
                  : "Select Section"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.compareButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={performComparison}
          disabled={!section1 || !section2 || isLoading}
        >
          <Text style={styles.compareButtonText}>
            {isLoading ? "Comparing..." : "🔄 Compare Sections"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section Content Display */}
      {(section1 || section2) && (
        <View
          style={[
            styles.sectionsDisplay,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          {section1 && (
            <View style={styles.sectionContent}>
              <Text
                style={[styles.sectionHeader, { color: theme.colors.primary }]}
              >
                {section1.act} - Section {section1.code}
              </Text>
              <Text
                style={[
                  styles.sectionContentTitle,
                  { color: theme.colors.text },
                ]}
              >
                {section1.title}
              </Text>
              <Text
                style={[
                  styles.sectionContentText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {section1.content}
              </Text>
            </View>
          )}

          {section2 && (
            <View style={styles.sectionContent}>
              <Text
                style={[styles.sectionHeader, { color: theme.colors.primary }]}
              >
                {section2.act} - Section {section2.code}
              </Text>
              <Text
                style={[
                  styles.sectionContentTitle,
                  { color: theme.colors.text },
                ]}
              >
                {section2.title}
              </Text>
              <Text
                style={[
                  styles.sectionContentText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {section2.content}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Comparison Results */}
      {renderComparison()}

      {/* Action Buttons */}
      {comparison && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.success },
            ]}
            onPress={saveComparison}
          >
            <Text style={styles.actionButtonText}>💾 Save Comparison</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.info },
            ]}
            onPress={() => {
              /* Export functionality */
            }}
          >
            <Text style={styles.actionButtonText}>📤 Export</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Section Picker Modals */}
      {renderSectionPicker(
        showSectionPicker1,
        setShowSectionPicker1,
        filteredSections1,
        setSection1,
        searchTerm1,
        setSearchTerm1,
      )}

      {renderSectionPicker(
        showSectionPicker2,
        setShowSectionPicker2,
        filteredSections2,
        setSection2,
        searchTerm2,
        setSearchTerm2,
      )}

      {/* History Modal */}
      <Modal visible={showHistory} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.historyModal,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Comparison History
              </Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <Text
                  style={[styles.closeButton, { color: theme.colors.primary }]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {comparisonHistory.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.historyItem,
                    { borderBottomColor: theme.colors.border },
                  ]}
                  onPress={() => {
                    setComparison(item);
                    setShowHistory(false);
                  }}
                >
                  <Text
                    style={[styles.historyTitle, { color: theme.colors.text }]}
                  >
                    {item.ipcSection.act} {item.ipcSection.code} vs{" "}
                    {item.bnsSection.act} {item.bnsSection.code}
                  </Text>
                  <Text
                    style={[
                      styles.historyDate,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  headerControls: {
    flexDirection: "row",
    gap: 12,
  },
  controlButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  selectionContainer: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  selectionRow: {
    gap: 16,
  },
  codeSelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  codeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#f3f4f6",
  },
  codeOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  sectionButtonText: {
    fontSize: 14,
  },
  compareButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  compareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionsDisplay: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    gap: 20,
  },
  sectionContent: {
    gap: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionContentTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  sectionContentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  comparisonContainer: {
    padding: 16,
    gap: 16,
  },
  similarityCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  similarityTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  similarityBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  similarityFill: {
    height: "100%",
    borderRadius: 4,
  },
  similarityScore: {
    fontSize: 18,
    fontWeight: "700",
  },
  comparisonCard: {
    padding: 16,
    borderRadius: 12,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  comparisonItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 12,
    padding: 20,
  },
  historyModal: {
    width: "90%",
    maxHeight: "70%",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    fontSize: 24,
    fontWeight: "700",
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  sectionsList: {
    maxHeight: 300,
  },
  sectionItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  sectionCode: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 14,
    marginTop: 4,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  historyDate: {
    fontSize: 12,
    marginTop: 4,
  },
});
