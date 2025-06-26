import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as DocumentPicker from "expo-document-picker";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface UploadedFile {
  name: string;
  uri: string;
  type: string;
  size: number;
}

export default function DocumentUploadScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [barCouncilId, setBarCouncilId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map((asset) => ({
          name: asset.name || "Unknown file",
          uri: asset.uri,
          type: asset.mimeType || "unknown",
          size: asset.size || 0,
        }));

        setUploadedFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document. Please try again.");
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    if (!barCouncilId.trim()) {
      Alert.alert("Error", "Please enter your Bar Council ID");
      return;
    }

    if (uploadedFiles.length === 0) {
      Alert.alert("Error", "Please upload at least one document");
      return;
    }

    setLoading(true);
    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert("Success", "Documents uploaded successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/(onboarding)/subscription"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to upload documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      "Skip Verification",
      "You can upload documents later from your profile. Some features may be limited until verification.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Skip",
          onPress: () => router.push("/(onboarding)/subscription"),
        },
      ],
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return "image";
    if (type.includes("pdf")) return "document-text";
    return "document";
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          Document Upload
        </Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.primary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <View
            style={[styles.icon, { backgroundColor: theme.primary + "20" }]}
          >
            <Ionicons name="document-attach" size={48} color={theme.primary} />
          </View>
        </View>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Upload your Bar Council ID and related documents for verification
        </Text>

        <View style={styles.formContainer}>
          <Input
            label="Bar Council ID *"
            placeholder="Enter your Bar Council ID"
            value={barCouncilId}
            onChangeText={setBarCouncilId}
            leftIcon="card"
          />

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Upload Documents *
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
          >
            Please upload clear photos or scans of the following documents:
          </Text>

          <View style={styles.requiredDocs}>
            <Text style={[styles.docItem, { color: theme.textSecondary }]}>
              • Bar Council Registration Certificate
            </Text>
            <Text style={[styles.docItem, { color: theme.textSecondary }]}>
              • Law Degree Certificate
            </Text>
            <Text style={[styles.docItem, { color: theme.textSecondary }]}>
              • Government Issued ID (Aadhaar/PAN)
            </Text>
          </View>

          <TouchableOpacity onPress={handleDocumentPick}>
            <Card
              style={[
                styles.uploadCard,
                { borderColor: theme.primary, borderStyle: "dashed" },
              ]}
              padding="large"
            >
              <View style={styles.uploadContent}>
                <Ionicons name="cloud-upload" size={32} color={theme.primary} />
                <Text style={[styles.uploadTitle, { color: theme.text }]}>
                  Tap to upload documents
                </Text>
                <Text
                  style={[
                    styles.uploadSubtitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  PDF, JPG, PNG files up to 10MB each
                </Text>
              </View>
            </Card>
          </TouchableOpacity>

          {uploadedFiles.length > 0 && (
            <View style={styles.filesContainer}>
              <Text style={[styles.filesTitle, { color: theme.text }]}>
                Uploaded Files ({uploadedFiles.length})
              </Text>
              {uploadedFiles.map((file, index) => (
                <Card key={index} style={styles.fileCard} padding="medium">
                  <View style={styles.fileContent}>
                    <View
                      style={[
                        styles.fileIcon,
                        { backgroundColor: theme.success + "20" },
                      ]}
                    >
                      <Ionicons
                        name={getFileIcon(file.type) as any}
                        size={20}
                        color={theme.success}
                      />
                    </View>
                    <View style={styles.fileInfo}>
                      <Text
                        style={[styles.fileName, { color: theme.text }]}
                        numberOfLines={1}
                      >
                        {file.name}
                      </Text>
                      <Text
                        style={[
                          styles.fileSize,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {formatFileSize(file.size)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveFile(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={theme.error}
                      />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>

        <View style={styles.noteContainer}>
          <Ionicons name="information-circle" size={20} color={theme.info} />
          <Text style={[styles.noteText, { color: theme.textSecondary }]}>
            Document verification may take 24-48 hours. You'll be notified once
            approved.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.surface }]}>
        <Button
          title="Upload & Continue"
          onPress={handleContinue}
          variant="primary"
          size="large"
          fullWidth
          gradient
          loading={loading}
          disabled={!barCouncilId.trim() || uploadedFiles.length === 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    padding: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
  },
  skipText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  formContainer: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  requiredDocs: {
    marginBottom: Spacing.lg,
  },
  docItem: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  uploadCard: {
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  uploadContent: {
    alignItems: "center",
  },
  uploadTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  uploadSubtitle: {
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
  filesContainer: {
    marginTop: Spacing.lg,
  },
  filesTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.md,
  },
  fileCard: {
    marginBottom: Spacing.sm,
  },
  fileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  fileSize: {
    fontSize: FontSizes.xs,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  noteText: {
    flex: 1,
    fontSize: FontSizes.sm,
    lineHeight: 18,
    marginLeft: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
});
