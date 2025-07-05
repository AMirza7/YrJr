// Legacy document scanner service - now integrated with new scanner system
import { scannerService } from "./scanner";

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
    // Mock scan result for backwards compatibility
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

  // Legacy methods for backward compatibility
  async scanWithCamera(): Promise<any> {
    try {
      const fileUri = await scannerService.pickDocument();
      if (!fileUri) {
        return { success: false, error: "No file selected" };
      }

      const result = await scannerService.scanDocument(fileUri);
      return {
        success: true,
        imageUri: result.imageUri,
        extractedText: result.extractedText,
        extractedFields: {
          documentType: result.data.documentType,
          ...result.data.keyFields,
        },
      };
    } catch (error) {
      return { success: false, error: "Failed to scan document" };
    }
  }

  async scanFromGallery(): Promise<any> {
    return this.scanWithCamera(); // Same implementation
  }

  async saveToGallery(imageUri: string): Promise<boolean> {
    // Mock save to gallery
    return true;
  }

  formatExtractedData(fields: any): Array<{ label: string; value: string }> {
    const data = [];
    if (fields.caseNumber)
      data.push({ label: "Case Number", value: fields.caseNumber });
    if (fields.court) data.push({ label: "Court", value: fields.court });
    if (fields.petitioner)
      data.push({ label: "Petitioner", value: fields.petitioner });
    if (fields.propertyAddress)
      data.push({ label: "Property Address", value: fields.propertyAddress });
    return data;
  }

  getDocumentTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      petition: "📄",
      fir: "🚔",
      notice: "📋",
      contract: "📝",
      court_order: "⚖️",
      affidavit: "✍️",
    };
    return icons[type] || "📄";
  }

  getDocumentTypeName(type: string): string {
    const names: Record<string, string> = {
      petition: "Petition",
      fir: "FIR",
      notice: "Legal Notice",
      contract: "Contract",
      court_order: "Court Order",
      affidavit: "Affidavit",
    };
    return names[type] || "Legal Document";
  }
}

export const documentScannerService = new DocumentScannerService();
