import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Language } from "@/types";

interface LanguageSelectorProps {
  showLabel?: boolean;
  compact?: boolean;
}

export default function LanguageSelector({
  showLabel = true,
  compact = false,
}: LanguageSelectorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { language, setLanguage, t, supportedLanguages } = useLocalization();
  const { theme } = useTheme();

  const currentLanguage = supportedLanguages.find(
    (lang) => lang.code === language,
  );

  const handleLanguageSelect = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsVisible(false);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    selector: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: compact ? 8 : 12,
      paddingVertical: compact ? 6 : 8,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    selectorText: {
      fontSize: compact ? theme.typography.sizes.sm : theme.typography.sizes.md,
      color: theme.colors.text,
      marginLeft: 4,
      fontWeight: theme.typography.weights.medium,
    },
    label: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginRight: 8,
    },
    modal: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      margin: 20,
      maxHeight: "80%",
      minWidth: 280,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    modalHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text,
      textAlign: "center",
    },
    languageList: {
      maxHeight: 400,
    },
    languageItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    languageItemSelected: {
      backgroundColor: theme.colors.primary + "10",
    },
    languageFlag: {
      fontSize: 20,
      marginRight: 12,
    },
    languageInfo: {
      flex: 1,
    },
    languageName: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.text,
    },
    languageNative: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    selectedIndicator: {
      color: theme.colors.primary,
      fontSize: 18,
    },
    closeButton: {
      padding: 20,
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    closeButtonText: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.weights.medium,
    },
  });

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>{t("selectLanguage")}</Text>}

      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.selectorText}>
          {currentLanguage?.flag}{" "}
          {compact
            ? currentLanguage?.code.toUpperCase()
            : currentLanguage?.name}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("selectLanguage")}</Text>
            </View>

            <ScrollView style={styles.languageList}>
              {supportedLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    language === lang.code && styles.languageItemSelected,
                  ]}
                  onPress={() => handleLanguageSelect(lang.code)}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{lang.name}</Text>
                    <Text style={styles.languageNative}>{lang.nativeName}</Text>
                  </View>
                  {language === lang.code && (
                    <Text style={styles.selectedIndicator}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
