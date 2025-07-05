import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
  Clipboard,
} from "react-native";
import { scannerService } from "@/services/scanner";
import { TextScanResult } from "@/types/scanner";

interface TextExtractorProps {
  onScanComplete?: (result: TextScanResult) => void;
  onClose?: () => void;
}

export default function TextExtractor({
  onScanComplete,
  onClose,
}: TextExtractorProps) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<TextScanResult | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const handleFileUpload = async () => {
    try {
      setLoading(true);
      const fileUri = await scannerService.pickDocument();

      if (!fileUri) {
        setLoading(false);
        return;
      }

      const result = await scannerService.extractText(fileUri);
      setScanResult(result);
      onScanComplete?.(result);
    } catch (error) {
      Alert.alert("Error", "Failed to extract text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!scanResult?.data.fullText) return;

    try {
      await Clipboard.setString(scanResult.data.fullText);
      Alert.alert("Copied", "Text has been copied to clipboard.");
    } catch (error) {
      Alert.alert("Error", "Failed to copy text to clipboard.");
    }
  };

  const handleSummarizeWithAI = async () => {
    if (!scanResult?.data.fullText) return;

    setSummarizing(true);

    // Simulate AI summarization
    setTimeout(() => {
      setSummarizing(false);
      Alert.alert(
        "AI Summary",
        "This document appears to be a legal petition containing case details, party information, and procedural requirements. Key entities include court jurisdiction, case numbers, and legal sections cited.",
        [{ text: "OK" }],
      );
    }, 2000);
  };

  const renderKeywords = () => {
    if (!scanResult?.data.keywords || scanResult.data.keywords.length === 0) {
      return null;
    }

    return (
      <View style={styles.keywordsContainer}>
        <Text style={styles.keywordsTitle}>🔍 Detected Keywords</Text>
        <View style={styles.keywordsList}>
          {scanResult.data.keywords.map((keyword, index) => (
            <View key={index} style={styles.keywordChip}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const highlightKeywords = (text: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return text;

    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      highlightedText = highlightedText.replace(regex, `**${keyword}**`);
    });

    return highlightedText;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0891b2" />
        <Text style={styles.loadingText}>Extracting text...</Text>
        <Text style={styles.loadingSubtext}>
          Processing image with OCR technology
        </Text>
      </View>
    );
  }

  if (scanResult) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>📝 Text Extraction Results</Text>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Preview Image */}
        {scanResult.imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: scanResult.imageUri }}
              style={styles.previewImage}
            />
          </View>
        )}

        {/* Text Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {scanResult.data.fullText.split(" ").length}
            </Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {scanResult.data.fullText.length}
            </Text>
            <Text style={styles.statLabel}>Characters</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {scanResult.confidence
                ? Math.round(scanResult.confidence * 100)
                : 95}
              %
            </Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        {/* Keywords */}
        {renderKeywords()}

        {/* Extracted Text */}
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>📄 Extracted Text</Text>

          <ScrollView style={styles.textScrollView} nestedScrollEnabled>
            <Text style={styles.extractedText}>
              {highlightKeywords(
                scanResult.data.fullText,
                scanResult.data.keywords || [],
              )}
            </Text>
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCopyToClipboard}
          >
            <Text style={styles.actionButtonText}>📋 Copy to Clipboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleSummarizeWithAI}
            disabled={summarizing}
          >
            {summarizing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>🤖 Summarize with AI</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Summary */}
        {scanResult.data.summary && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>📋 AI Summary</Text>
            <Text style={styles.summaryText}>{scanResult.data.summary}</Text>
          </View>
        )}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.uploadContainer}>
        <Text style={styles.title}>📝 Text Extractor</Text>
        <Text style={styles.subtitle}>
          Extract text from any image or document
        </Text>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleFileUpload}
        >
          <Text style={styles.uploadIcon}>🖼️</Text>
          <Text style={styles.uploadText}>Choose Image</Text>
          <Text style={styles.uploadSubtext}>JPG, PNG, PDF supported</Text>
        </TouchableOpacity>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>⚡ OCR Features</Text>
          <Text style={styles.featureItem}>
            • High-accuracy text recognition
          </Text>
          <Text style={styles.featureItem}>• Multi-language support</Text>
          <Text style={styles.featureItem}>• Legal keyword detection</Text>
          <Text style={styles.featureItem}>• Instant text highlighting</Text>
          <Text style={styles.featureItem}>• AI-powered summarization</Text>
          <Text style={styles.featureItem}>
            • Copy-to-clipboard functionality
          </Text>
        </View>

        {/* Use Cases */}
        <View style={styles.useCasesContainer}>
          <Text style={styles.useCasesTitle}>📚 Perfect For</Text>

          <View style={styles.useCaseItem}>
            <Text style={styles.useCaseIcon}>📄</Text>
            <View style={styles.useCaseContent}>
              <Text style={styles.useCaseTitle}>Legal Documents</Text>
              <Text style={styles.useCaseDescription}>
                Extract text from court orders, petitions, and legal notices
              </Text>
            </View>
          </View>

          <View style={styles.useCaseItem}>
            <Text style={styles.useCaseIcon}>📖</Text>
            <View style={styles.useCaseContent}>
              <Text style={styles.useCaseTitle}>Research Materials</Text>
              <Text style={styles.useCaseDescription}>
                Digitize books, articles, and research papers
              </Text>
            </View>
          </View>

          <View style={styles.useCaseItem}>
            <Text style={styles.useCaseIcon}>📝</Text>
            <View style={styles.useCaseContent}>
              <Text style={styles.useCaseTitle}>Handwritten Notes</Text>
              <Text style={styles.useCaseDescription}>
                Convert handwritten notes to digital text
              </Text>
            </View>
          </View>

          <View style={styles.useCaseItem}>
            <Text style={styles.useCaseIcon}>🌐</Text>
            <View style={styles.useCaseContent}>
              <Text style={styles.useCaseTitle}>Multi-language Content</Text>
              <Text style={styles.useCaseDescription}>
                Support for Hindi, English, and regional languages
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0891b2",
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
  },
  uploadContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#0891b2",
    borderStyle: "dashed",
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0891b2",
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: "#64748b",
  },
  imageContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0891b2",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  keywordsContainer: {
    backgroundColor: "#fff",
    marginTop: 1,
    padding: 20,
  },
  keywordsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  keywordsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  keywordChip: {
    backgroundColor: "#dcfce7",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  keywordText: {
    fontSize: 12,
    color: "#15803d",
    fontWeight: "500",
  },
  textContainer: {
    backgroundColor: "#fff",
    marginTop: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  textScrollView: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  extractedText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    fontFamily: "monospace",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#0891b2",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  summaryContainer: {
    backgroundColor: "#f0f9ff",
    marginTop: 1,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#0891b2",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#075985",
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: "#0c4a6e",
    lineHeight: 20,
  },
  featuresContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 6,
    lineHeight: 20,
  },
  useCasesContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  useCasesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  useCaseItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  useCaseIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  useCaseContent: {
    flex: 1,
  },
  useCaseTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  useCaseDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
  },
});
