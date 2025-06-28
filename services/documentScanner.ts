// Simple mock for document scanner service
export interface DocumentScanResult {
  id: string;
  text: string;
  confidence: number;
  type: string;
}

export interface ExtractedLegalFields {
  caseNumber?: string;
  court?: string;
  date?: string;
  parties?: string[];
  sections?: string[];
}

class DocumentScannerService {
  async scanDocument(): Promise<DocumentScanResult> {
    // Mock scan result
    return {
      id: "mock-scan-" + Date.now(),
      text: "Sample scanned legal document text",
      confidence: 0.95,
      type: "legal_document",
    };
  }

  async extractLegalFields(text: string): Promise<ExtractedLegalFields> {
    // Mock extraction
    return {
      caseNumber: "CRL-123/2024",
      court: "District Court",
      date: new Date().toISOString(),
      parties: ["Party A", "Party B"],
      sections: ["Section 302", "Section 420"],
    };
  }
}

export const documentScannerService = new DocumentScannerService();
