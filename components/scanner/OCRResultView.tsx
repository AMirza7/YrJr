import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";

interface ParsedField {
  label: string;
  value: string;
  key: string;
  editable?: boolean;
}

interface OCRResultViewProps {
  rawText: string;
  parsedFields: ParsedField[];
  onFieldUpdate: (key: string, value: string) => void;
  documentType?: string;
}

export default function OCRResultView({
  rawText,
  parsedFields,
  onFieldUpdate,
  documentType = "Document",
}: OCRResultViewProps) {
  const [viewMode, setViewMode] = useState<"parsed" | "raw">("parsed");
  const [editingField, setEditingField] = useState<ParsedField | null>(null);
  const [editValue, setEditValue] = useState("");

  const openFieldEditor = (field: ParsedField) => {
    if (field.editable !== false) {
      setEditingField(field);
      setEditValue(field.value);
    }
  };

  const saveFieldEdit = () => {
    if (editingField) {
      onFieldUpdate(editingField.key, editValue);
      setEditingField(null);
      setEditValue("");
    }
  };

  const cancelFieldEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  return (
    <View style={styles.container}>
      {/* View Mode Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "parsed" && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode("parsed")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "parsed" && styles.toggleTextActive,
            ]}
          >
            🧠 Smart Parsed View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "raw" && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode("raw")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "raw" && styles.toggleTextActive,
            ]}
          >
            📄 Raw OCR Output
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {viewMode === "parsed" ? (
          <View style={styles.parsedView}>
            <Text style={styles.sectionTitle}>📋 {documentType} Fields</Text>
            <Text style={styles.sectionSubtitle}>
              Tap any field to edit its value
            </Text>

            <View style={styles.fieldsContainer}>
              {parsedFields.map((field) => (
                <TouchableOpacity
                  key={field.key}
                  style={[
                    styles.fieldCard,
                    field.editable === false && styles.fieldCardReadonly,
                  ]}
                  onPress={() => openFieldEditor(field)}
                  disabled={field.editable === false}
                >
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text
                    style={[
                      styles.fieldValue,
                      !field.value && styles.fieldValueEmpty,
                      field.editable === false && styles.fieldValueReadonly,
                    ]}
                  >
                    {field.value || "Not detected"}
                  </Text>
                  {field.editable !== false && (
                    <Text style={styles.editIcon}>✏️</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {parsedFields.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No Fields Detected</Text>
                <Text style={styles.emptyMessage}>
                  This document type doesn't have structured field parsing
                  available. Check the raw OCR output for extracted text.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.rawView}>
            <Text style={styles.sectionTitle}>📄 Raw OCR Output</Text>
            <Text style={styles.sectionSubtitle}>
              Complete unprocessed text from the document
            </Text>

            <View style={styles.rawTextContainer}>
              <ScrollView style={styles.rawTextScroll} nestedScrollEnabled>
                <Text style={styles.rawText}>{rawText}</Text>
              </ScrollView>
            </View>

            <View style={styles.rawStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Characters</Text>
                <Text style={styles.statValue}>{rawText.length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Words</Text>
                <Text style={styles.statValue}>
                  {rawText.trim().split(/\s+/).length}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Lines</Text>
                <Text style={styles.statValue}>
                  {rawText.split("\n").length}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Field Editor Modal */}
      <Modal
        visible={editingField !== null}
        transparent
        animationType="slide"
        onRequestClose={cancelFieldEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit {editingField?.label}</Text>

            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editingField?.label.toLowerCase()}`}
              multiline
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={cancelFieldEdit}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={saveFieldEdit}
              >
                <Text style={styles.modalButtonTextPrimary}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    padding: 4,
    margin: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  toggleTextActive: {
    color: "#1e293b",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  parsedView: {
    padding: 16,
  },
  rawView: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },
  fieldsContainer: {
    gap: 12,
  },
  fieldCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  fieldCardReadonly: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: "#1e293b",
    lineHeight: 22,
    paddingRight: 32,
  },
  fieldValueEmpty: {
    color: "#94a3b8",
    fontStyle: "italic",
  },
  fieldValueReadonly: {
    color: "#64748b",
  },
  editIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  rawTextContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    height: 300,
    marginBottom: 16,
  },
  rawTextScroll: {
    padding: 16,
  },
  rawText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
    fontFamily: "monospace",
  },
  rawStats: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  modalButtonPrimary: {
    backgroundColor: "#3b82f6",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  modalButtonTextPrimary: {
    color: "#fff",
  },
});
