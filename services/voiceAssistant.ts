// Simple mock for voice assistant service
export interface VoiceCommand {
  command: string;
  intent: string;
  entities: Record<string, string>;
  confidence: number;
}

class VoiceAssistantService {
  async startListening(): Promise<string> {
    // Mock voice input
    return "search for section 302";
  }

  processVoiceCommand(speechText: string): VoiceCommand {
    return {
      command: speechText,
      intent: "search",
      entities: { query: speechText },
      confidence: 0.8,
    };
  }

  async speak(text: string): Promise<void> {
    console.log("Speaking:", text);
  }

  getQuickResponses() {
    return [
      { text: "Search cases", command: "search cases" },
      { text: "Find sections", command: "find sections" },
    ];
  }
}

export const voiceAssistantService = new VoiceAssistantService();
