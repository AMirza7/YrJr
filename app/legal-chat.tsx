import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import BackButton from "@/components/navigation/BackButton";
import LegalChatAssistant, {
  ChatMessage,
  ScannedDocument,
} from "@/components/legal/LegalChatAssistant";
import { useModal } from "@/contexts/ModalContext";

export default function LegalChatScreen() {
  const { showConfirm, showSuccess } = useModal();
  const [scannedDocuments] = useState<ScannedDocument[]>([
    {
      id: "doc1",
      name: "FIR Document - Theft Case",
      type: "FIR",
      extractedFields: {
        fir_number: "123/2024",
        police_station: "Civil Lines",
        ipc_sections: "379, 420",
        complainant: "Raj Kumar",
        accused: "Unknown",
        date: "15-01-2024",
      },
      fullText:
        "FIR No. 123/2024 dated 15-01-2024 registered at Police Station Civil Lines under sections 379, 420 IPC...",
      timestamp: new Date("2024-01-15"),
    },
    {
      id: "doc2",
      name: "Sale Deed - Property Transaction",
      type: "Sale Deed",
      extractedFields: {
        seller_name: "Ram Singh",
        buyer_name: "Shyam Kumar",
        property_address: "Plot No. 123, Sector 15, Gurgaon",
        sale_amount: "50,00,000",
        registration_date: "10-01-2024",
      },
      fullText:
        "This Sale Deed executed on 10-01-2024 between Ram Singh (Seller) and Shyam Kumar (Buyer) for property located at Plot No. 123...",
      timestamp: new Date("2024-01-10"),
    },
    {
      id: "doc3",
      name: "Affidavit - Identity Proof",
      type: "Affidavit",
      extractedFields: {
        deponent_name: "Mohan Lal",
        father_name: "Late Sohan Lal",
        address: "House No. 45, Green Park, Delhi",
        purpose: "Name correction in documents",
      },
      fullText:
        "I, Mohan Lal, son of Late Sohan Lal, resident of House No. 45, Green Park, Delhi do hereby solemnly affirm...",
      timestamp: new Date("2024-01-05"),
    },
  ]);

  const handleDocumentSelect = (documentId: string) => {
    console.log("Selected document:", documentId);
  };

  const handleChatOutputAttach = (
    message: ChatMessage,
    documentId?: string,
  ) => {
    showConfirm(
      "Attach Chat Output",
      `Do you want to attach this AI response to ${documentId ? "the selected document" : "a new document"}?`,
      () => {
        showSuccess("Success", "Chat output attached successfully");
      },
      undefined,
      {
        confirmText: "Attach",
        cancelText: "Cancel",
        icon: "📎",
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Home" color="#fff" />
      </View>
      <LegalChatAssistant
        scannedDocuments={scannedDocuments}
        onDocumentSelect={handleDocumentSelect}
        onChatOutputAttach={handleChatOutputAttach}
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
