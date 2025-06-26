import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import Voice from "react-native-voice";
import { INDIAN_LANGUAGES } from "@/constants/LegalConstants";

export interface VoiceCommand {
  text: string;
  language: string;
  confidence: number;
  intent?: string;
  entities?: Record<string, any>;
}

export interface VoiceResponse {
  text: string;
  language: string;
  audioUrl?: string;
}

export interface VoiceAssistantConfig {
  language: string;
  speechRate: number;
  speechPitch: number;
  voiceQuality: "default" | "enhanced";
  autoSpeak: boolean;
}

export class VoiceAssistantService {
  private static currentLanguage: string = "en";
  private static isListening: boolean = false;
  private static isInitialized: boolean = false;
  private static config: VoiceAssistantConfig = {
    language: "en",
    speechRate: 0.5,
    speechPitch: 1.0,
    voiceQuality: "default",
    autoSpeak: true,
  };

  // Initialize voice recognition
  static async initialize(): Promise<boolean> {
    try {
      Voice.onSpeechStart = this.onSpeechStart;
      Voice.onSpeechEnd = this.onSpeechEnd;
      Voice.onSpeechResults = this.onSpeechResults;
      Voice.onSpeechError = this.onSpeechError;
      Voice.onSpeechPartialResults = this.onSpeechPartialResults;

      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Audio permission is required for voice assistant");
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Error initializing voice assistant:", error);
      return false;
    }
  }

  // Set assistant configuration
  static setConfig(config: Partial<VoiceAssistantConfig>): void {
    this.config = { ...this.config, ...config };
    this.currentLanguage = this.config.language;
  }

  // Get available languages
  static getAvailableLanguages(): typeof INDIAN_LANGUAGES {
    return INDIAN_LANGUAGES;
  }

  // Get supported TTS voices for a language
  static async getAvailableVoices(language?: string): Promise<Speech.Voice[]> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      if (language) {
        return voices.filter((voice) => voice.language.startsWith(language));
      }
      return voices;
    } catch (error) {
      console.error("Error getting available voices:", error);
      return [];
    }
  }

  // Start listening for voice input
  static async startListening(language?: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) return false;
      }

      if (this.isListening) {
        await this.stopListening();
      }

      const langCode = language || this.currentLanguage;
      await Voice.start(langCode);
      this.isListening = true;
      return true;
    } catch (error) {
      console.error("Error starting voice recognition:", error);
      return false;
    }
  }

  // Stop listening
  static async stopListening(): Promise<void> {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      console.error("Error stopping voice recognition:", error);
    }
  }

  // Cancel listening
  static async cancelListening(): Promise<void> {
    try {
      await Voice.cancel();
      this.isListening = false;
    } catch (error) {
      console.error("Error canceling voice recognition:", error);
    }
  }

  // Speak text using TTS
  static async speak(
    text: string,
    options?: {
      language?: string;
      rate?: number;
      pitch?: number;
      voice?: string;
    },
  ): Promise<void> {
    try {
      const speechOptions: Speech.SpeechOptions = {
        language: options?.language || this.config.language,
        pitch: options?.pitch || this.config.speechPitch,
        rate: options?.rate || this.config.speechRate,
        voice: options?.voice,
        quality:
          this.config.voiceQuality === "enhanced"
            ? Speech.VoiceQuality.Enhanced
            : Speech.VoiceQuality.Default,
      };

      await Speech.speak(text, speechOptions);
    } catch (error) {
      console.error("Error speaking text:", error);
      throw new Error("Failed to speak text");
    }
  }

  // Stop current speech
  static async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.error("Error stopping speech:", error);
    }
  }

  // Check if currently speaking
  static async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch (error) {
      console.error("Error checking speech status:", error);
      return false;
    }
  }

  // Process voice command and return response
  static async processVoiceCommand(
    command: VoiceCommand,
  ): Promise<VoiceResponse> {
    try {
      const response = await this.interpretCommand(command);

      if (this.config.autoSpeak && response.text) {
        await this.speak(response.text, { language: response.language });
      }

      return response;
    } catch (error) {
      console.error("Error processing voice command:", error);
      const errorResponse: VoiceResponse = {
        text: this.getLocalizedText("error.processing", command.language),
        language: command.language,
      };

      if (this.config.autoSpeak) {
        await this.speak(errorResponse.text, {
          language: errorResponse.language,
        });
      }

      return errorResponse;
    }
  }

  // Interpret voice command and generate appropriate response
  private static async interpretCommand(
    command: VoiceCommand,
  ): Promise<VoiceResponse> {
    const text = command.text.toLowerCase();
    const language = command.language;

    // Extract intent and entities
    const intent = this.extractIntent(text, language);
    const entities = this.extractEntities(text, language);

    let responseText = "";

    switch (intent) {
      case "search_legal":
        responseText = this.handleLegalSearch(entities, language);
        break;

      case "case_status":
        responseText = this.handleCaseStatusQuery(entities, language);
        break;

      case "court_hearing":
        responseText = this.handleCourtHearingQuery(entities, language);
        break;

      case "legal_procedure":
        responseText = this.handleLegalProcedureQuery(entities, language);
        break;

      case "ipc_section":
        responseText = this.handleIPCSectionQuery(entities, language);
        break;

      case "lawyer_search":
        responseText = this.handleLawyerSearch(entities, language);
        break;

      case "greeting":
        responseText = this.handleGreeting(language);
        break;

      case "help":
        responseText = this.handleHelp(language);
        break;

      default:
        responseText = this.handleUnknownCommand(language);
        break;
    }

    return {
      text: responseText,
      language: language,
    };
  }

  // Extract intent from user input
  private static extractIntent(text: string, language: string): string {
    const intents: Record<string, string[]> = {
      search_legal: [
        "search",
        "find",
        "look for",
        "खोज",
        "ढूंढ",
        "தேडు",
        "खोजें",
      ],
      case_status: [
        "case status",
        "my case",
        "case update",
        "केस स्थिति",
        "मामला",
        "���ழकக நிलै",
      ],
      court_hearing: [
        "hearing",
        "court date",
        "next hearing",
        "सुनवाई",
        "कोर्ट",
        "நयायालய",
      ],
      legal_procedure: [
        "how to",
        "procedure",
        "process",
        "कैसे",
        "प्रक्रिया",
        "मूलयम",
      ],
      ipc_section: ["ipc", "section", "law", "आईपीसी", "धारा", "सधारण"],
      lawyer_search: [
        "lawyer",
        "advocate",
        "attorney",
        "वकील",
        "अधिवक्ता",
        "वकील",
      ],
      greeting: ["hello", "hi", "good morning", "नमस्ते", "हैलो", "वणककम"],
      help: ["help", "assist", "guide", "मदद", "सहायता", "உधवी"],
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
        return intent;
      }
    }

    return "unknown";
  }

  // Extract entities from user input
  private static extractEntities(
    text: string,
    language: string,
  ): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract case numbers
    const caseNumberRegex =
      /(?:case|fir|petition)?\s*(?:number|no|संख्या)?\s*([a-z0-9\/\-\.]+)/gi;
    const caseMatch = caseNumberRegex.exec(text);
    if (caseMatch) {
      entities.caseNumber = caseMatch[1];
    }

    // Extract IPC sections
    const sectionRegex = /(ipc|bnss|crpc|आईपीसी|धारा)\s*(\d+[a-z]*)/gi;
    const sectionMatch = sectionRegex.exec(text);
    if (sectionMatch) {
      entities.section = `${sectionMatch[1].toUpperCase()} ${sectionMatch[2]}`;
    }

    // Extract legal terms
    const legalTerms = [
      "bail",
      "divorce",
      "fir",
      "complaint",
      "जमानत",
      "तलाक",
      "शिकायत",
    ];
    const foundTerms = legalTerms.filter((term) =>
      text.includes(term.toLowerCase()),
    );
    if (foundTerms.length > 0) {
      entities.legalTerms = foundTerms;
    }

    return entities;
  }

  // Handle different types of queries
  private static handleLegalSearch(
    entities: Record<string, any>,
    language: string,
  ): string {
    if (entities.section) {
      return this.getLocalizedText("response.section_info", language, {
        section: entities.section,
      });
    }
    if (entities.legalTerms) {
      return this.getLocalizedText("response.legal_term_info", language, {
        terms: entities.legalTerms.join(", "),
      });
    }
    return this.getLocalizedText("response.search_help", language);
  }

  private static handleCaseStatusQuery(
    entities: Record<string, any>,
    language: string,
  ): string {
    if (entities.caseNumber) {
      return this.getLocalizedText("response.case_status", language, {
        caseNumber: entities.caseNumber,
      });
    }
    return this.getLocalizedText("response.no_case_number", language);
  }

  private static handleCourtHearingQuery(
    entities: Record<string, any>,
    language: string,
  ): string {
    return this.getLocalizedText("response.court_hearing", language);
  }

  private static handleLegalProcedureQuery(
    entities: Record<string, any>,
    language: string,
  ): string {
    return this.getLocalizedText("response.legal_procedure", language);
  }

  private static handleIPCSectionQuery(
    entities: Record<string, any>,
    language: string,
  ): string {
    return this.getLocalizedText("response.ipc_section", language);
  }

  private static handleLawyerSearch(
    entities: Record<string, any>,
    language: string,
  ): string {
    return this.getLocalizedText("response.lawyer_search", language);
  }

  private static handleGreeting(language: string): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return this.getLocalizedText("greeting.morning", language);
    } else if (hour < 17) {
      return this.getLocalizedText("greeting.afternoon", language);
    } else {
      return this.getLocalizedText("greeting.evening", language);
    }
  }

  private static handleHelp(language: string): string {
    return this.getLocalizedText("help.main", language);
  }

  private static handleUnknownCommand(language: string): string {
    return this.getLocalizedText("response.unknown", language);
  }

  // Get localized text
  private static getLocalizedText(
    key: string,
    language: string,
    params?: Record<string, any>,
  ): string {
    // This would be replaced with a proper i18n solution
    const localizations: Record<string, Record<string, string>> = {
      en: {
        "greeting.morning":
          "Good morning! How can I help you with your legal questions today?",
        "greeting.afternoon":
          "Good afternoon! What legal assistance do you need?",
        "greeting.evening":
          "Good evening! How can I assist you with your legal matters?",
        "help.main":
          "I can help you with legal searches, case status, court hearings, IPC sections, and finding lawyers. What would you like to know?",
        "response.section_info":
          "Let me find information about {{section}} for you.",
        "response.legal_term_info":
          "I can help you understand {{terms}}. Let me search for relevant information.",
        "response.search_help":
          "Please specify what you want to search for - IPC sections, legal procedures, or case laws.",
        "response.case_status":
          "Let me check the status of case {{caseNumber}} for you.",
        "response.no_case_number":
          "Please provide a case number to check the status.",
        "response.court_hearing":
          "I can help you check your upcoming court hearings and set reminders.",
        "response.legal_procedure":
          "I can guide you through various legal procedures. What specific process do you need help with?",
        "response.ipc_section":
          "I can explain IPC sections and their applications. Which section would you like to know about?",
        "response.lawyer_search":
          "I can help you find verified lawyers in your area. What type of legal specialization do you need?",
        "response.unknown":
          "I didn't quite understand that. Can you please rephrase your question?",
        "error.processing":
          "Sorry, I encountered an error processing your request. Please try again.",
      },
      hi: {
        "greeting.morning":
          "सुप्रभात! आज आप���े कानूनी सवालों में मैं कैसे मदद कर सकता हूं?",
        "greeting.afternoon": "नमस्कार! आपको किस कानूनी सहायता की आवश्यकता है?",
        "greeting.evening":
          "शुभ संध्या! आपके कानूनी मामलों में मैं कैसे सहायता कर सकता हूं?",
        "help.main":
          "मैं आपको कानूनी खोज, केस की स्थिति, कोर्ट सुनवाई, आईपीसी धाराओं और वकील खोजने में मदद कर सकता हूं। आप क्या जानना चाहते हैं?",
        "response.unknown":
          "मुझे यह समझ नहीं आया। कृपया अपना प्रश्न दोबारा पूछें।",
        "error.processing":
          "खुशी, आपके अनुरोध को संसाधित करने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
      },
    };

    let text =
      localizations[language]?.[key] || localizations["en"][key] || key;

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{{${param}}}`, String(value));
      });
    }

    return text;
  }

  // Voice recognition event handlers
  private static onSpeechStart = (e: any) => {
    console.log("Speech recognition started");
  };

  private static onSpeechEnd = (e: any) => {
    console.log("Speech recognition ended");
    this.isListening = false;
  };

  private static onSpeechResults = (e: any) => {
    console.log("Speech results:", e.value);
  };

  private static onSpeechPartialResults = (e: any) => {
    console.log("Partial speech results:", e.value);
  };

  private static onSpeechError = (e: any) => {
    console.error("Speech recognition error:", e.error);
    this.isListening = false;
  };

  // Clean up resources
  static async cleanup(): Promise<void> {
    try {
      await this.stopListening();
      await this.stopSpeaking();
      Voice.destroy();
      this.isInitialized = false;
    } catch (error) {
      console.error("Error cleaning up voice assistant:", error);
    }
  }
}
