import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "@/types";
import {
  getTranslation,
  formatTranslation,
  SUPPORTED_LANGUAGES,
} from "@/constants/languages";

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined,
);

const LANGUAGE_STORAGE_KEY = "app_language";

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (
        savedLanguage &&
        SUPPORTED_LANGUAGES.find((lang) => lang.code === savedLanguage)
      ) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error("Error loading language preference:", error);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    try {
      setLanguageState(newLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    if (params) {
      return formatTranslation(key, language, params);
    }
    return getTranslation(key, language);
  };

  const currentLanguageConfig = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === language,
  );
  const isRTL = currentLanguageConfig?.rtl || false;

  return (
    <LocalizationContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider",
    );
  }
  return context;
};
