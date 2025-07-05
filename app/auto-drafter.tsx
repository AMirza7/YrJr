import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BackButton from "@/components/navigation/BackButton";
import AutoDrafter, { ScanData } from "@/components/legal/AutoDrafter";

export default function AutoDrafterScreen() {
  const params = useLocalSearchParams();

  // Mock scan data - in real app, this would come from the scanner
  const [scanData] = useState<ScanData>({
    type: (params.scanType as any) || "fir",
    extractedFields: {
      fir_number: "123/2024",
      fir_date: "15-01-2024",
      police_station: "Civil Lines",
      ipc_sections: "379, 420",
      applicant_name: "Raj Kumar",
      state: "Delhi",
      court_name: "Sessions Court, Delhi",
      arrest_date: "18-01-2024",
      year: "2024",
    },
    fullText:
      "FIR No. 123/2024 dated 15-01-2024 registered at Police Station Civil Lines under sections 379, 420 IPC against unknown persons for theft of mobile phone from complainant Raj Kumar...",
    confidence: 0.92,
  });

  const handleSaveDraft = (draftContent: string, title: string) => {
    Alert.alert("Success", "Draft saved to your documents");
    console.log("Saving draft:", { title, content: draftContent });
  };

  const handleExportWord = (draftContent: string, title: string) => {
    Alert.alert("Success", "Document exported as Word file");
    console.log("Exporting Word:", { title, content: draftContent });
  };

  const handleExportPDF = (draftContent: string, title: string) => {
    Alert.alert("Success", "Document exported as PDF");
    console.log("Exporting PDF:", { title, content: draftContent });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Home" color="#fff" />
      </View>
      <AutoDrafter
        scanData={scanData}
        onSaveDraft={handleSaveDraft}
        onExportWord={handleExportWord}
        onExportPDF={handleExportPDF}
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
