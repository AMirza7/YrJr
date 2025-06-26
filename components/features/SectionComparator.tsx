import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import Animated, {
  FadeInLeft,
  FadeInRight,
  Layout,
} from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LegalSection, SectionComparison } from "@/types";

interface SectionComparatorProps {
  style?: any;
}

// Mock data for IPC sections
const IPC_SECTIONS: LegalSection[] = [
  {
    number: "302",
    title: "Punishment for murder",
    description:
      "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    punishment: "Death or life imprisonment and fine",
    bail: "Non-bailable",
    cognizable: true,
    compoundable: false,
    category: "Offences against the human body",
  },
  {
    number: "304",
    title: "Punishment for culpable homicide not amounting to murder",
    description:
      "Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine, if the act by which the death is caused is done with the intention of causing death, or of causing such bodily injury as is likely to cause death.",
    punishment: "Life imprisonment or up to 10 years imprisonment and fine",
    bail: "Non-bailable",
    cognizable: true,
    compoundable: false,
    category: "Offences against the human body",
  },
  {
    number: "379",
    title: "Punishment for theft",
    description:
      "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
    punishment: "Up to 3 years imprisonment or fine or both",
    bail: "Bailable",
    cognizable: true,
    compoundable: false,
    category: "Of theft",
  },
  {
    number: "420",
    title: "Cheating and dishonestly inducing delivery of property",
    description:
      "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    punishment: "Up to 7 years imprisonment and fine",
    bail: "Non-bailable",
    cognizable: true,
    compoundable: false,
    category: "Of cheating",
  },
];

// Mock data for BNS sections (corresponding to IPC)
const BNS_SECTIONS: LegalSection[] = [
  {
    number: "103",
    title: "Punishment for murder",
    description:
      "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.",
    punishment: "Death or life imprisonment and fine",
    bail: "Non-bailable",
    cognizable: true,
    compoundable: false,
    category: "Offences against the human body",
  },
  {
    number: "105",
    title: "Punishment for culpable homicide not amounting to murder",
    description:
      "Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine, if the act by which death is caused is done with the intention of causing death, or of causing such bodily injury as is likely to cause death.",
    punishment: "Life imprisonment or up to 10 years imprisonment and fine",
    bail: "Non-bailable",
    cognizable: true,
    compoundable: false,
    category: "Offences against the human body",
  },
  {
    number: "303",
    title: "Punishment for theft",
    description:
      "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
    punishment: "Up to 3 years imprisonment or fine or both",
    bail: "Bailable",
    cognizable: true,
    compoundable: false,
    category: "Of theft",
  },
  {
    number: "318",
    title: "Cheating and dishonestly inducing delivery of property",
    description:
      "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    punishment: "Up to 7 years imprisonment and fine",
    bail: "Non-bailable",
    cognizable: true,
    compoundable: false,
    category: "Of cheating",
  },
];

// Mock comparisons data
const MOCK_COMPARISONS: { [key: string]: SectionComparison } = {
  "302-103": {
    ipcSection: IPC_SECTIONS[0],
    bnsSection: BNS_SECTIONS[0],
    differences: [
      "Section numbering changed from IPC 302 to BNS 103",
      "Minor textual improvements for clarity",
    ],
    similarities: [
      "Punishment remains the same - death or life imprisonment",
      "Offense nature and gravity unchanged",
      "Non-bailable and cognizable status maintained",
    ],
    migrationNotes:
      "Direct replacement with minimal changes. All case law precedents remain applicable.",
  },
  "304-105": {
    ipcSection: IPC_SECTIONS[1],
    bnsSection: BNS_SECTIONS[1],
    differences: [
      "Section numbering changed from IPC 304 to BNS 105",
      "Simplified language structure",
    ],
    similarities: [
      "Punishment structure remains identical",
      "All conditions and exceptions preserved",
      "Cognizable and non-bailable nature unchanged",
    ],
    migrationNotes:
      "Seamless transition with improved readability. All existing jurisprudence applicable.",
  },
  "379-303": {
    ipcSection: IPC_SECTIONS[2],
    bnsSection: BNS_SECTIONS[2],
    differences: [
      "Section number changed from IPC 379 to BNS 303",
      "Enhanced definition clarity",
    ],
    similarities: [
      "Maximum punishment of 3 years unchanged",
      "Bailable nature preserved",
      "Fine provisions remain same",
    ],
    migrationNotes:
      "Direct migration with enhanced clarity. All precedents remain valid.",
  },
  "420-318": {
    ipcSection: IPC_SECTIONS[3],
    bnsSection: BNS_SECTIONS[3],
    differences: [
      "Section number changed from IPC 420 to BNS 318",
      "Modernized language for digital age crimes",
    ],
    similarities: [
      "7-year imprisonment ceiling maintained",
      "Non-bailable classification unchanged",
      "Fine liability preserved",
    ],
    migrationNotes:
      "Enhanced scope to cover modern fraud methods while maintaining core principles.",
  },
};

export function SectionComparator({ style }: SectionComparatorProps) {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const [selectedIPC, setSelectedIPC] = useState<string>("");
  const [selectedBNS, setSelectedBNS] = useState<string>("");
  const [comparison, setComparison] = useState<SectionComparison | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(false);

  const ipcDropdownData = IPC_SECTIONS.map((section) => ({
    label: `Section ${section.number} - ${section.title}`,
    value: section.number,
  }));

  const bnsDropdownData = BNS_SECTIONS.map((section) => ({
    label: `Section ${section.number} - ${section.title}`,
    value: section.number,
  }));

  useEffect(() => {
    if (selectedIPC && selectedBNS) {
      generateComparison();
    }
  }, [selectedIPC, selectedBNS]);

  const generateComparison = () => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const comparisonKey = `${selectedIPC}-${selectedBNS}`;
      const mockComparison = MOCK_COMPARISONS[comparisonKey];

      if (mockComparison) {
        setComparison(mockComparison);
        setShowComparison(true);
      } else {
        Alert.alert(
          "No Comparison Available",
          "This combination doesn't have a direct comparison available. Please select corresponding sections.",
        );
      }

      setLoading(false);
    }, 1000);
  };

  const clearComparison = () => {
    setSelectedIPC("");
    setSelectedBNS("");
    setComparison(null);
    setShowComparison(false);
  };

  const getQuickSuggestions = () => {
    return [
      { ipc: "302", bns: "103", label: "Murder" },
      { ipc: "304", bns: "105", label: "Culpable Homicide" },
      { ipc: "379", bns: "303", label: "Theft" },
      { ipc: "420", bns: "318", label: "Cheating" },
    ];
  };

  const selectSuggestion = (suggestion: { ipc: string; bns: string }) => {
    setSelectedIPC(suggestion.ipc);
    setSelectedBNS(suggestion.bns);
  };

  const renderSectionCard = (
    section: LegalSection,
    title: string,
    color: string,
    animationDirection: "left" | "right",
  ) => (
    <Animated.View
      entering={animationDirection === "left" ? FadeInLeft : FadeInRight}
      layout={Layout.springify()}
      style={styles.sectionCardContainer}
    >
      <Card style={styles.sectionCard}>
        <View
          style={[styles.sectionHeader, { borderBottomColor: theme.border }]}
        >
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.sectionBadge, { backgroundColor: color }]}>
              <Text style={styles.sectionBadgeText}>{title}</Text>
            </View>
            <Text style={[styles.sectionNumber, { color: theme.text }]}>
              Section {section.number}
            </Text>
          </View>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: section.cognizable
                  ? theme.success
                  : theme.warning,
              },
            ]}
          >
            <Text style={styles.statusText}>
              {section.cognizable ? "Cognizable" : "Non-cognizable"}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {section.title}
        </Text>

        <Text
          style={[styles.sectionDescription, { color: theme.textSecondary }]}
        >
          {section.description}
        </Text>

        <View style={styles.sectionDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>
              Punishment:
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {section.punishment}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>
              Bail:
            </Text>
            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    section.bail === "Bailable" ? theme.success : theme.error,
                },
              ]}
            >
              {section.bail}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>
              Category:
            </Text>
            <Text style={[styles.detailValue, { color: theme.textSecondary }]}>
              {section.category}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          IPC vs BNS Comparator
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Compare corresponding sections side by side
        </Text>
      </View>

      {/* Section Selectors */}
      <View style={styles.selectorContainer}>
        <View style={styles.selectorRow}>
          <View style={styles.dropdownContainer}>
            <Text style={[styles.dropdownLabel, { color: theme.text }]}>
              IPC Section
            </Text>
            <Dropdown
              style={[
                styles.dropdown,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              placeholderStyle={[
                styles.placeholderStyle,
                { color: theme.textTertiary },
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { color: theme.text },
              ]}
              inputSearchStyle={[
                styles.inputSearchStyle,
                { color: theme.text },
              ]}
              iconStyle={styles.iconStyle}
              data={ipcDropdownData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select IPC section"
              searchPlaceholder="Search sections..."
              value={selectedIPC}
              onChange={(item) => setSelectedIPC(item.value)}
              renderLeftIcon={() => (
                <Ionicons
                  name="document-text"
                  size={20}
                  color={theme.primary}
                  style={styles.dropdownIcon}
                />
              )}
            />
          </View>

          <View style={styles.vsContainer}>
            <Text style={[styles.vsText, { color: theme.textSecondary }]}>
              VS
            </Text>
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={[styles.dropdownLabel, { color: theme.text }]}>
              BNS Section
            </Text>
            <Dropdown
              style={[
                styles.dropdown,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              placeholderStyle={[
                styles.placeholderStyle,
                { color: theme.textTertiary },
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { color: theme.text },
              ]}
              inputSearchStyle={[
                styles.inputSearchStyle,
                { color: theme.text },
              ]}
              iconStyle={styles.iconStyle}
              data={bnsDropdownData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select BNS section"
              searchPlaceholder="Search sections..."
              value={selectedBNS}
              onChange={(item) => setSelectedBNS(item.value)}
              renderLeftIcon={() => (
                <Ionicons
                  name="document"
                  size={20}
                  color={theme.secondary}
                  style={styles.dropdownIcon}
                />
              )}
            />
          </View>
        </View>

        {/* Quick Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text
            style={[styles.suggestionsTitle, { color: theme.textSecondary }]}
          >
            Quick comparisons:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
          >
            {getQuickSuggestions().map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionButton,
                  {
                    backgroundColor: theme.backgroundTertiary,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => selectSuggestion(suggestion)}
              >
                <Text style={[styles.suggestionText, { color: theme.text }]}>
                  {suggestion.label}
                </Text>
                <Text
                  style={[
                    styles.suggestionSections,
                    { color: theme.textTertiary },
                  ]}
                >
                  IPC {suggestion.ipc} → BNS {suggestion.bns}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Clear Button */}
        {(selectedIPC || selectedBNS) && (
          <TouchableOpacity
            style={[
              styles.clearButton,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={clearComparison}
          >
            <Ionicons name="refresh" size={16} color={theme.textSecondary} />
            <Text
              style={[styles.clearButtonText, { color: theme.textSecondary }]}
            >
              Clear Selection
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Ionicons
            name="sync"
            size={32}
            color={theme.primary}
            style={styles.loadingIcon}
          />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Generating comparison...
          </Text>
        </View>
      )}

      {/* Comparison Results */}
      {showComparison && comparison && (
        <ScrollView
          style={styles.comparisonContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Side-by-side sections */}
          <View style={styles.sectionsRow}>
            {renderSectionCard(
              comparison.ipcSection,
              "IPC",
              theme.primary,
              "left",
            )}
            {renderSectionCard(
              comparison.bnsSection,
              "BNS",
              theme.secondary,
              "right",
            )}
          </View>

          {/* Differences and Similarities */}
          <Animated.View
            entering={FadeInLeft.delay(400)}
            layout={Layout.springify()}
          >
            <Card style={styles.analysisCard}>
              <View style={styles.analysisHeader}>
                <Ionicons name="analytics" size={24} color={theme.info} />
                <Text style={[styles.analysisTitle, { color: theme.text }]}>
                  Comparative Analysis
                </Text>
              </View>

              {/* Differences */}
              <View style={styles.analysisSection}>
                <View style={styles.analysisSectionHeader}>
                  <Ionicons
                    name="remove-circle"
                    size={20}
                    color={theme.error}
                  />
                  <Text
                    style={[styles.analysisSectionTitle, { color: theme.text }]}
                  >
                    Key Differences
                  </Text>
                </View>
                {comparison.differences.map((diff, index) => (
                  <View key={index} style={styles.analysisItem}>
                    <View
                      style={[
                        styles.analysisBullet,
                        { backgroundColor: theme.error },
                      ]}
                    />
                    <Text
                      style={[
                        styles.analysisText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {diff}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Similarities */}
              <View style={styles.analysisSection}>
                <View style={styles.analysisSectionHeader}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={theme.success}
                  />
                  <Text
                    style={[styles.analysisSectionTitle, { color: theme.text }]}
                  >
                    Similarities
                  </Text>
                </View>
                {comparison.similarities.map((sim, index) => (
                  <View key={index} style={styles.analysisItem}>
                    <View
                      style={[
                        styles.analysisBullet,
                        { backgroundColor: theme.success },
                      ]}
                    />
                    <Text
                      style={[
                        styles.analysisText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {sim}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Migration Notes */}
              <View style={styles.analysisSection}>
                <View style={styles.analysisSectionHeader}>
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color={theme.info}
                  />
                  <Text
                    style={[styles.analysisSectionTitle, { color: theme.text }]}
                  >
                    Migration Notes
                  </Text>
                </View>
                <View
                  style={[
                    styles.migrationNotesContainer,
                    { backgroundColor: theme.backgroundTertiary },
                  ]}
                >
                  <Text
                    style={[
                      styles.migrationNotesText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {comparison.migrationNotes}
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        </ScrollView>
      )}

      {/* Empty State */}
      {!loading && !showComparison && (
        <View style={styles.emptyState}>
          <Ionicons
            name="git-compare"
            size={64}
            color={theme.textTertiary}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Select IPC and BNS sections to compare
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
            Use the dropdowns above or try a quick comparison
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  selectorContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  selectorRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
  },
  dropdownIcon: {
    marginRight: Spacing.xs,
  },
  placeholderStyle: {
    fontSize: FontSizes.sm,
  },
  selectedTextStyle: {
    fontSize: FontSizes.sm,
  },
  inputSearchStyle: {
    fontSize: FontSizes.sm,
    height: 40,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  vsContainer: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  vsText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  suggestionsContainer: {
    marginTop: Spacing.md,
  },
  suggestionsTitle: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  suggestionsScroll: {
    gap: Spacing.xs,
    paddingRight: Spacing.md,
  },
  suggestionButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    minWidth: 120,
  },
  suggestionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textAlign: "center",
  },
  suggestionSections: {
    fontSize: FontSizes.xs,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  clearButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
  },
  loadingIcon: {
    marginBottom: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.md,
  },
  comparisonContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  sectionsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionCardContainer: {
    flex: 1,
  },
  sectionCard: {
    padding: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  sectionHeaderLeft: {
    flex: 1,
  },
  sectionBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    alignSelf: "flex-start",
    marginBottom: Spacing.xs,
  },
  sectionBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: "white",
  },
  sectionNumber: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  statusIndicator: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: "white",
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  sectionDetails: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.xs,
  },
  detailValue: {
    fontSize: FontSizes.sm,
    flex: 1,
  },
  analysisCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  analysisHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  analysisTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  analysisSection: {
    marginBottom: Spacing.md,
  },
  analysisSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  analysisSectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  analysisItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  analysisBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  analysisText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    flex: 1,
  },
  migrationNotesContainer: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.lg,
  },
  migrationNotesText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
});
