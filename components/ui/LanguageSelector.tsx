import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Language } from "@/types";

interface LanguageSelectorProps {
  showTitle?: boolean;
  compact?: boolean;
  style?: any;
}

export default function LanguageSelector({
  showTitle = true,
  compact = false,
  style,
}: LanguageSelectorProps) {
  const { theme } = useTheme();
  const { language, setLanguage, t, supportedLanguages, isRTL } =
    useLocalization();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = supportedLanguages.find(
    (lang) => lang.code === language,
  );

  const handleLanguageChange = async (newLanguage: Language) => {
    try {
      await setLanguage(newLanguage);
      setModalVisible(false);

      Alert.alert(
        t("success"),
        `Language changed to ${supportedLanguages.find((l) => l.code === newLanguage)?.nativeName}`,
        [{ text: t("done"), style: "default" }],
      );
    } catch (error) {
      Alert.alert(t("error"), t("somethingWentWrong"));
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: compact ? 8 : 16,
    },
    title: {
      fontSize: compact ? 14 : 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    selector: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: compact ? (width < 400 ? 6 : 8) : 12,
      minHeight: compact ? (width < 400 ? 32 : 36) : 44,
    },
    languageInfo: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    flag: {
      fontSize: compact ? 16 : 20,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    languageText: {
      fontSize: compact ? (width < 400 ? 10 : 12) : 14,
      color: theme.colors.text,
      fontWeight: "500",
    },
    languageSubtext: {
      fontSize: compact ? (width < 400 ? 8 : 10) : 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    arrow: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      transform: [{ rotate: isRTL ? "180deg" : "0deg" }],
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      width: "80%",
      maxHeight: "70%",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
      textAlign: "center",
    },
    languageOption: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    selectedLanguage: {
      backgroundColor: theme.colors.primary + "20",
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    optionFlag: {
      fontSize: 20,
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    optionText: {
      flex: 1,
    },
    optionName: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
    },
    optionNative: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    selectedIndicator: {
      fontSize: 16,
      color: theme.colors.primary,
    },
    closeButton: {
      backgroundColor: theme.colors.border,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 16,
    },
    closeButtonText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: "500",
    },
  });

  if (compact) {
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.languageInfo}>
            <Text style={styles.flag}>{currentLanguage?.flag}</Text>
            <Text style={styles.languageText}>
              {currentLanguage?.nativeName}
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t("selectLanguage")}</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {supportedLanguages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageOption,
                      language === lang.code && styles.selectedLanguage,
                    ]}
                    onPress={() => handleLanguageChange(lang.code)}
                  >
                    <Text style={styles.optionFlag}>{lang.flag}</Text>
                    <View style={styles.optionText}>
                      <Text style={styles.optionName}>{lang.name}</Text>
                      <Text style={styles.optionNative}>{lang.nativeName}</Text>
                    </View>
                    {language === lang.code && (
                      <Text style={styles.selectedIndicator}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>{t("close")}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {showTitle && <Text style={styles.title}>{t("languageSettings")}</Text>}

      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.languageInfo}>
          <Text style={styles.flag}>{currentLanguage?.flag}</Text>
          <View>
            <Text style={styles.languageText}>{currentLanguage?.name}</Text>
            <Text style={styles.languageSubtext}>
              {currentLanguage?.nativeName}
            </Text>
          </View>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("selectLanguage")}</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {supportedLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    language === lang.code && styles.selectedLanguage,
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <Text style={styles.optionFlag}>{lang.flag}</Text>
                  <View style={styles.optionText}>
                    <Text style={styles.optionName}>{lang.name}</Text>
                    <Text style={styles.optionNative}>{lang.nativeName}</Text>
                  </View>
                  {language === lang.code && (
                    <Text style={styles.selectedIndicator}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t("close")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
