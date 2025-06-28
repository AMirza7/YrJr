import * as Speech from "expo-speech";

export interface VoiceCommand {
  command: string;
  intent: VoiceIntent;
  entities: Record<string, string>;
  confidence: number;
}

export type VoiceIntent =
  | "search_case"
  | "search_law"
  | "open_section"
  | "create_note"
  | "set_reminder"
  | "navigate_to"
  | "compare_sections"
  | "unknown";

export interface VoiceResponse {
  text: string;
  action?: {
    type: "navigate" | "search" | "create" | "compare";
    params: Record<string, any>;
  };
}

export interface VoiceSettings {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
  enabled: boolean;
}

class VoiceAssistantService {
  private isListening = false;
  private settings: VoiceSettings = {
    language: "en-IN",
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0,
    enabled: true,
  };

  // Legal-specific commands and patterns
  private commandPatterns = {
    search_case: [
      /search (?:for )?case (?:number )?(.+)/i,
      /find case (.+)/i,
      /look up case (.+)/i,
      /show me case (.+)/i,
    ],
    search_law: [
      /search (?:for )?(?:law|section|act) (.+)/i,
      /find (?:law|section|act) (.+)/i,
      /what is (?:section|act) (.+)/i,
      /show me (?:section|act) (.+)/i,
    ],
    open_section: [
      /open section ([0-9]+[a-z]?)/i,
      /go to section ([0-9]+[a-z]?)/i,
      /show section ([0-9]+[a-z]?)/i,
    ],
    create_note: [
      /create (?:a )?note (.+)/i,
      /add (?:a )?note (.+)/i,
      /make (?:a )?note (.+)/i,
      /save note (.+)/i,
    ],
    set_reminder: [
      /set (?:a )?reminder (.+)/i,
      /remind me (.+)/i,
      /add reminder (.+)/i,
    ],
    navigate_to: [
      /go to (.+)/i,
      /open (.+)/i,
      /navigate to (.+)/i,
      /show me (.+)/i,
    ],
    compare_sections: [
      /compare section ([0-9]+[a-z]?) (?:and|with) section ([0-9]+[a-z]?)/i,
      /difference between section ([0-9]+[a-z]?) and ([0-9]+[a-z]?)/i,
    ],
  };

  // Legal entities for extraction
  private legalEntities = {
    sections: /section\s+([0-9]+[a-z]?)/gi,
    acts: /(indian penal code|ipc|bharatiya nyaya sanhita|bns|criminal procedure code|crpc|constitution)/gi,
    caseNumbers: /case\s+(?:no\.?\s*)?([a-z]{2,3}[\s\-]?[0-9]+\/[0-9]{4})/gi,
    courts:
      /(supreme court|high court|district court|sessions court|magistrate)/gi,
  };

  async speak(text: string, options?: Partial<VoiceSettings>): Promise<void> {
    if (!this.settings.enabled) return;

    const speakOptions = {
      language: options?.language || this.settings.language,
      rate: options?.rate || this.settings.rate,
      pitch: options?.pitch || this.settings.pitch,
      volume: options?.volume || this.settings.volume,
    };

    try {
      await Speech.speak(text, speakOptions);
    } catch (error) {
      console.error("Error in text-to-speech:", error);
    }
  }

  async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.error("Error stopping speech:", error);
    }
  }

  // Mock voice recognition - in real app would use expo-speech-recognition or similar
  async startListening(): Promise<string> {
    this.isListening = true;

    // Simulate voice recognition with common legal queries
    const mockCommands = [
      "search for case number CRL 123/2024",
      "find section 302 IPC",
      "what is section 420 BNS",
      "compare section 302 and section 304",
      "create a note about bail application",
      "set reminder for hearing tomorrow",
      "go to notifications",
      "search for theft cases",
      "open AI comparator",
      "show me legal templates",
    ];

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.isListening = false;

    // Return a random mock command for demo
    return mockCommands[Math.floor(Math.random() * mockCommands.length)];
  }

  processVoiceCommand(speechText: string): VoiceCommand {
    const cleanText = speechText.toLowerCase().trim();

    // Find matching intent
    for (const [intent, patterns] of Object.entries(this.commandPatterns)) {
      for (const pattern of patterns) {
        const match = cleanText.match(pattern);
        if (match) {
          const entities = this.extractEntities(speechText);
          return {
            command: speechText,
            intent: intent as VoiceIntent,
            entities: { ...entities, match: match[1] || "" },
            confidence: 0.85,
          };
        }
      }
    }

    return {
      command: speechText,
      intent: "unknown",
      entities: this.extractEntities(speechText),
      confidence: 0.1,
    };
  }

  private extractEntities(text: string): Record<string, string> {
    const entities: Record<string, string> = {};

    // Extract sections
    const sectionMatches = [...text.matchAll(this.legalEntities.sections)];
    if (sectionMatches.length > 0) {
      entities.sections = sectionMatches.map((m) => m[1]).join(", ");
    }

    // Extract acts
    const actMatches = [...text.matchAll(this.legalEntities.acts)];
    if (actMatches.length > 0) {
      entities.acts = actMatches.map((m) => m[1]).join(", ");
    }

    // Extract case numbers
    const caseMatches = [...text.matchAll(this.legalEntities.caseNumbers)];
    if (caseMatches.length > 0) {
      entities.caseNumbers = caseMatches.map((m) => m[1]).join(", ");
    }

    // Extract courts
    const courtMatches = [...text.matchAll(this.legalEntities.courts)];
    if (courtMatches.length > 0) {
      entities.courts = courtMatches.map((m) => m[1]).join(", ");
    }

    return entities;
  }

  generateResponse(command: VoiceCommand): VoiceResponse {
    switch (command.intent) {
      case "search_case":
        return {
          text: `Searching for case ${command.entities.match}. I found relevant case information in your legal database.`,
          action: {
            type: "search",
            params: { query: command.entities.match, type: "case" },
          },
        };

      case "search_law":
        return {
          text: `Looking up ${command.entities.match}. Here's what I found in the legal database.`,
          action: {
            type: "search",
            params: { query: command.entities.match, type: "law" },
          },
        };

      case "open_section":
        return {
          text: `Opening section ${command.entities.match}. This section deals with specific legal provisions.`,
          action: {
            type: "navigate",
            params: {
              route: "/ai-comparator",
              section: command.entities.match,
            },
          },
        };

      case "create_note":
        return {
          text: `Creating a new note: ${command.entities.match}. Your note has been saved to the secure notes section.`,
          action: {
            type: "create",
            params: { type: "note", content: command.entities.match },
          },
        };

      case "set_reminder":
        return {
          text: `Setting reminder: ${command.entities.match}. I'll notify you at the appropriate time.`,
          action: {
            type: "create",
            params: { type: "reminder", content: command.entities.match },
          },
        };

      case "navigate_to":
        const route = this.getRouteFromText(command.entities.match);
        return {
          text: `Navigating to ${command.entities.match}.`,
          action: {
            type: "navigate",
            params: { route },
          },
        };

      case "compare_sections":
        return {
          text: `Comparing legal sections. Opening the AI comparator to show you the differences.`,
          action: {
            type: "compare",
            params: {
              section1: command.entities.match,
              tool: "ai-comparator",
            },
          },
        };

      default:
        return {
          text: "I didn't understand that command. Try asking me to search for cases, find legal sections, create notes, or navigate to different parts of the app.",
        };
    }
  }

  private getRouteFromText(text: string): string {
    const routeMap: Record<string, string> = {
      home: "/(tabs)/home",
      dashboard: "/(tabs)/home",
      pinboard: "/(tabs)/pinboard",
      timeline: "/(tabs)/timeline",
      notes: "/(tabs)/notes",
      search: "/(tabs)/search",
      profile: "/(tabs)/profile",
      settings: "/settings",
      notifications: "/notifications",
      templates: "/templates",
      scanner: "/scanner",
      flashcards: "/flashcards",
      "ai comparator": "/ai-comparator",
      subscription: "/subscription",
      help: "/help-support",
    };

    const normalized = text.toLowerCase().trim();
    return routeMap[normalized] || "/(tabs)/home";
  }

  async getVoiceCapabilities(): Promise<{
    speechAvailable: boolean;
    languages: string[];
    maxSpeechInputTime: number;
  }> {
    try {
      const isSpeakingAvailable = await Speech.isSpeakingAsync();

      // Common languages supported for Indian legal system
      const supportedLanguages = [
        "en-IN", // English (India)
        "hi-IN", // Hindi
        "bn-IN", // Bengali
        "te-IN", // Telugu
        "mr-IN", // Marathi
        "ta-IN", // Tamil
        "gu-IN", // Gujarati
        "kn-IN", // Kannada
        "ml-IN", // Malayalam
        "ur-IN", // Urdu
      ];

      return {
        speechAvailable: true,
        languages: supportedLanguages,
        maxSpeechInputTime: 60000, // 60 seconds
      };
    } catch (error) {
      console.error("Error checking voice capabilities:", error);
      return {
        speechAvailable: false,
        languages: ["en-IN"],
        maxSpeechInputTime: 30000,
      };
    }
  }

  getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<VoiceSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Legal-specific quick responses
  getQuickResponses(): { text: string; command: string }[] {
    return [
      { text: "Search cases", command: "search for recent cases" },
      { text: "Find IPC section", command: "find section 302 IPC" },
      { text: "Open AI comparator", command: "open AI comparator" },
      { text: "Create note", command: "create a note about today's hearing" },
      { text: "Set reminder", command: "set reminder for filing tomorrow" },
      { text: "Go to templates", command: "go to legal templates" },
      { text: "Check notifications", command: "go to notifications" },
      { text: "Compare sections", command: "compare section 302 and 304" },
    ];
  }

  // Get contextual help based on current screen
  getContextualHelp(currentRoute: string): string[] {
    const helpMap: Record<string, string[]> = {
      "/(tabs)/home": [
        "Say 'search for cases' to find legal cases",
        "Say 'open notifications' to check updates",
        "Say 'go to templates' for legal documents",
      ],
      "/(tabs)/search": [
        "Say 'search for section 420 IPC' to find laws",
        "Say 'find case number CRL 123/2024' to search cases",
        "Say 'what is section 302 BNS' for legal information",
      ],
      "/ai-comparator": [
        "Say 'compare section 302 and 304' to analyze differences",
        "Say 'find section 420 IPC' to lookup specific laws",
        "Say 'what changed in BNS' for legal updates",
      ],
      "/(tabs)/notes": [
        "Say 'create a note about bail application' to add notes",
        "Say 'remind me to file petition' to set reminders",
        "Say 'save note about witness testimony' to create entries",
      ],
    };

    return (
      helpMap[currentRoute] || [
        "Say 'go to home' to return to dashboard",
        "Say 'help' for available voice commands",
        "Say 'search for [query]' to find information",
      ]
    );
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // Language-specific legal terms
  getLegalTermsForLanguage(language: string): Record<string, string> {
    const terms: Record<string, Record<string, string>> = {
      "hi-IN": {
        case: "मामला",
        section: "धारा",
        court: "न्यायालय",
        judge: "न्यायाधीश",
        lawyer: "वकील",
        hearing: "सुनवाई",
        petition: "याचिका",
        bail: "जमानत",
      },
      "bn-IN": {
        case: "মামলা",
        section: "ধারা",
        court: "আদালত",
        judge: "বিচারক",
        lawyer: "আইনজীবী",
        hearing: "শুনানি",
        petition: "আবেদন",
        bail: "জামিন",
      },
    };

    return terms[language] || {};
  }
}

export const voiceAssistantService = new VoiceAssistantService();
