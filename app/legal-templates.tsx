import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import BackButton from "@/components/navigation/BackButton";
import LegalTemplatesLibrary, {
  LegalTemplate,
} from "@/components/legal/LegalTemplatesLibrary";

export default function LegalTemplatesScreen() {
  const [templates] = useState<LegalTemplate[]>([]);

  const mockScannedData = {
    applicant_name: "Raj Kumar",
    fir_number: "123/2024",
    police_station: "Civil Lines",
    ipc_sections: "379, 420",
    state: "Delhi",
    court_name: "Sessions Court, Delhi",
  };

  const mockUserProfile = {
    name: "Advocate Sharma",
    address: "Chamber No. 123, District Courts, Delhi",
    phone: "+91-9876543210",
    email: "advocate.sharma@legal.com",
  };

  const handleTemplateSelect = (template: LegalTemplate) => {
    console.log("Selected template:", template.title);
  };

  const handleSaveDraft = (
    templateId: string,
    filledData: Record<string, any>,
  ) => {
    Alert.alert("Success", "Draft saved successfully to your documents");
    console.log("Saving draft:", { templateId, filledData });
  };

  const handleDownloadWord = (
    templateId: string,
    filledData: Record<string, any>,
  ) => {
    Alert.alert("Success", "Document downloaded as Word file");
    console.log("Downloading Word:", { templateId, filledData });
  };

  const handleAttachToFolder = (
    templateId: string,
    filledData: Record<string, any>,
    folderId: string,
  ) => {
    Alert.alert("Success", `Document attached to case folder`);
    console.log("Attaching to folder:", { templateId, filledData, folderId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Home" color="#fff" />
      </View>
      <LegalTemplatesLibrary
        templates={templates}
        scannedData={mockScannedData}
        userProfile={mockUserProfile}
        onTemplateSelect={handleTemplateSelect}
        onSaveDraft={handleSaveDraft}
        onDownloadWord={handleDownloadWord}
        onAttachToFolder={handleAttachToFolder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#8b5cf6",
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
});
