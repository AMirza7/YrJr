import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import {
  ScanResult,
  ScannerType,
  DocumentScanResult,
  BarcodeScanResult,
  IDCardScanResult,
  ReceiptScanResult,
  SignatureScanResult,
  TextScanResult,
  ScannerAnalytics,
  ExportOptions,
} from "@/types/scanner";

const STORAGE_KEY = "scanner_history";
const ANALYTICS_KEY = "scanner_analytics";

class ScannerService {
  // Document Scanner
  async scanDocument(fileUri: string): Promise<DocumentScanResult> {
    try {
      // Simulate API call to /api/scan-document
      const response = await this.mockApiCall("/api/scan-document", {
        fileUri,
        type: "document",
      });

      const result: DocumentScanResult = {
        id: `doc_${Date.now()}`,
        type: "document",
        timestamp: new Date(),
        imageUri: fileUri,
        extractedText: response.text,
        confidence: response.confidence || 0.95,
        data: {
          fullText: response.text,
          keyFields: {
            petitioner: this.extractField(response.text, "petitioner"),
            propertyAddress: this.extractField(response.text, "address"),
            ipcSections: this.extractIPCSections(response.text),
            dates: this.extractDates(response.text),
            caseNumber: this.extractField(response.text, "case"),
            court: this.extractField(response.text, "court"),
          },
          documentType: response.documentType || "legal_document",
        },
      };

      await this.saveToHistory(result);
      await this.updateAnalytics("document");

      return result;
    } catch (error) {
      throw new Error("Failed to scan document");
    }
  }

  // Barcode/QR Scanner
  async processBarcodeData(
    data: string,
    format: string,
  ): Promise<BarcodeScanResult> {
    await Haptics.selectionAsync();

    const result: BarcodeScanResult = {
      id: `barcode_${Date.now()}`,
      type: format.toLowerCase().includes("qr") ? "qr" : "barcode",
      timestamp: new Date(),
      data: {
        text: data,
        format,
        isCourtFile: this.isCourtFileBarcode(data),
        caseInfo: this.parseCourtFileInfo(data),
      },
    };

    await this.saveToHistory(result);
    await this.updateAnalytics(result.type);

    return result;
  }

  // ID Card Scanner
  async scanIDCard(fileUri: string): Promise<IDCardScanResult> {
    try {
      const response = await this.mockApiCall("/api/scan-id-card", {
        fileUri,
        type: "id_card",
      });

      const result: IDCardScanResult = {
        id: `id_${Date.now()}`,
        type: "id_card",
        timestamp: new Date(),
        imageUri: fileUri,
        data: {
          name: response.name || "Unknown",
          idNumber: response.idNumber || "",
          dateOfBirth: response.dateOfBirth,
          address: response.address,
          idType: this.detectIDType(response.idNumber),
          masked: false,
        },
      };

      await this.saveToHistory(result);
      await this.updateAnalytics("id_card");

      return result;
    } catch (error) {
      throw new Error("Failed to scan ID card");
    }
  }

  // Receipt Scanner
  async scanReceipt(fileUri: string): Promise<ReceiptScanResult> {
    try {
      const response = await this.mockApiCall("/api/scan-receipt", {
        fileUri,
        type: "receipt",
      });

      const result: ReceiptScanResult = {
        id: `receipt_${Date.now()}`,
        type: "receipt",
        timestamp: new Date(),
        imageUri: fileUri,
        data: {
          invoiceNumber: response.invoiceNumber,
          sellerName: response.sellerName,
          date: response.date,
          gstin: response.gstin,
          amount: response.amount,
          items: response.items || [],
        },
      };

      await this.saveToHistory(result);
      await this.updateAnalytics("receipt");

      return result;
    } catch (error) {
      throw new Error("Failed to scan receipt");
    }
  }

  // Signature Capture
  async saveSignature(
    signatureData: string,
    fileName: string,
  ): Promise<SignatureScanResult> {
    const result: SignatureScanResult = {
      id: `signature_${Date.now()}`,
      type: "signature",
      timestamp: new Date(),
      data: {
        signatureData,
        width: 300,
        height: 150,
        fileName,
      },
    };

    await this.saveToHistory(result);
    await this.updateAnalytics("signature");

    return result;
  }

  // Text Extractor
  async extractText(fileUri: string): Promise<TextScanResult> {
    try {
      const response = await this.mockApiCall("/api/extract-text", {
        fileUri,
        type: "text",
      });

      const result: TextScanResult = {
        id: `text_${Date.now()}`,
        type: "text",
        timestamp: new Date(),
        imageUri: fileUri,
        extractedText: response.text,
        data: {
          fullText: response.text,
          keywords: this.extractKeywords(response.text),
          summary: response.summary,
        },
      };

      await this.saveToHistory(result);
      await this.updateAnalytics("text");

      return result;
    } catch (error) {
      throw new Error("Failed to extract text");
    }
  }

  // History Management
  async getHistory(): Promise<ScanResult[]> {
    try {
      const historyJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (!historyJson) return [];

      const history = JSON.parse(historyJson);
      return history.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch (error) {
      return [];
    }
  }

  async saveToHistory(scan: ScanResult): Promise<void> {
    try {
      const history = await this.getHistory();
      const newHistory = [scan, ...history.slice(0, 99)]; // Keep last 100 scans
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save to history:", error);
    }
  }

  async deleteScanFromHistory(scanId: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const filtered = history.filter((scan) => scan.id !== scanId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Failed to delete scan:", error);
    }
  }

  // Analytics
  async getAnalytics(): Promise<ScannerAnalytics> {
    try {
      const analyticsJson = await AsyncStorage.getItem(ANALYTICS_KEY);
      const analytics = analyticsJson
        ? JSON.parse(analyticsJson)
        : this.getDefaultAnalytics();

      // Update with recent data
      const history = await this.getHistory();
      analytics.totalScans = history.length;

      // Count by type
      const scansByType: Record<ScannerType, number> = {
        document: 0,
        barcode: 0,
        qr: 0,
        id_card: 0,
        receipt: 0,
        signature: 0,
        text: 0,
      };

      history.forEach((scan) => {
        scansByType[scan.type]++;
      });

      analytics.scansByType = scansByType;
      analytics.mostUsedTool = this.getMostUsedTool(scansByType);

      return analytics;
    } catch (error) {
      return this.getDefaultAnalytics();
    }
  }

  private async updateAnalytics(type: ScannerType): Promise<void> {
    try {
      const analytics = await this.getAnalytics();
      analytics.scansByType[type]++;
      analytics.totalScans++;
      await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error("Failed to update analytics:", error);
    }
  }

  // Export functionality
  async exportScans(options: ExportOptions): Promise<string> {
    try {
      const history = await this.getHistory();
      let filteredHistory = history;

      // Apply filters
      if (options.types && options.types.length > 0) {
        filteredHistory = history.filter((scan) =>
          options.types!.includes(scan.type),
        );
      }

      if (options.dateRange) {
        filteredHistory = filteredHistory.filter(
          (scan) =>
            scan.timestamp >= options.dateRange!.start &&
            scan.timestamp <= options.dateRange!.end,
        );
      }

      // Format based on export type
      switch (options.format) {
        case "JSON":
          return JSON.stringify(filteredHistory, null, 2);
        case "CSV":
          return this.convertToCSV(filteredHistory);
        default:
          return JSON.stringify(filteredHistory, null, 2);
      }
    } catch (error) {
      throw new Error("Failed to export scans");
    }
  }

  // File picker utilities
  async pickDocument(): Promise<string | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error("Document picker error:", error);
      return null;
    }
  }

  // Private helper methods
  private async mockApiCall(endpoint: string, data: any): Promise<any> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock different responses based on endpoint
    switch (endpoint) {
      case "/api/scan-document":
        return {
          text: `CRIMINAL PETITION NO. 123/2024

IN THE COURT OF SESSIONS JUDGE, NEW DELHI

PETITIONER: Rajesh Kumar
vs
RESPONDENT: State of Delhi

Property Address: House No. 123, Sector 15, Dwarka, New Delhi

IPC Sections: 420, 406, 320

Date of Filing: ${new Date().toLocaleDateString()}
Court: Sessions Court, New Delhi
Case Status: Pending`,
          confidence: 0.95,
          documentType: "petition",
        };

      case "/api/scan-id-card":
        return {
          name: "RAJESH KUMAR SHARMA",
          idNumber: "ABCDE1234F",
          dateOfBirth: "15/08/1985",
          address: "H.No. 123, Sector 15, Dwarka, New Delhi - 110075",
        };

      case "/api/scan-receipt":
        return {
          invoiceNumber: "INV-2024-001",
          sellerName: "Legal Services Pvt Ltd",
          date: new Date().toLocaleDateString(),
          gstin: "07AABCS1234A1Z5",
          amount: "₹5,000.00",
          items: [
            {
              description: "Legal Consultation",
              quantity: 1,
              rate: 3000,
              amount: 3000,
            },
            {
              description: "Document Preparation",
              quantity: 1,
              rate: 2000,
              amount: 2000,
            },
          ],
        };

      case "/api/extract-text":
        return {
          text: "This is extracted text from the uploaded image. It contains various legal terms and information that has been processed by OCR technology.",
          summary:
            "Legal document containing case information and procedural details.",
        };

      default:
        return { text: "Processed successfully", confidence: 0.9 };
    }
  }

  private extractField(text: string, fieldType: string): string | undefined {
    const patterns: Record<string, RegExp> = {
      petitioner: /petitioner[:\s]*([^\n\r]+)/i,
      address: /address[:\s]*([^\n\r]+)/i,
      case: /(?:case|petition)\s*(?:no|number)[:\s]*([A-Z0-9\/\-]+)/i,
      court: /court[:\s]*([^\n\r]+)/i,
    };

    const match = text.match(patterns[fieldType]);
    return match ? match[1].trim() : undefined;
  }

  private extractIPCSections(text: string): string[] {
    const matches = text.match(/(?:section|ipc)[:\s]*([0-9,\s]+)/gi);
    if (!matches) return [];

    return matches
      .flatMap((match) =>
        match.replace(/(?:section|ipc)[:\s]*/gi, "").split(","),
      )
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  private extractDates(text: string): string[] {
    const datePattern = /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g;
    return text.match(datePattern) || [];
  }

  private extractKeywords(text: string): string[] {
    const legalKeywords = [
      "petition",
      "case",
      "court",
      "judge",
      "hearing",
      "order",
      "appeal",
      "defendant",
      "plaintiff",
      "evidence",
      "witness",
      "trial",
      "verdict",
    ];

    const words = text.toLowerCase().split(/\s+/);
    return legalKeywords.filter((keyword) =>
      words.some((word) => word.includes(keyword)),
    );
  }

  private detectIDType(idNumber: string): IDCardScanResult["data"]["idType"] {
    if (/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(idNumber)) return "PAN";
    if (/^\d{12}$/.test(idNumber)) return "Aadhaar";
    if (/^[A-Z]{2}[0-9]{2}[0-9]{11}$/.test(idNumber)) return "Driver License";
    return "Other";
  }

  private isCourtFileBarcode(data: string): boolean {
    return /^(COURT|CASE|FILE|CRL|CIV)/i.test(data);
  }

  private parseCourtFileInfo(
    data: string,
  ): BarcodeScanResult["data"]["caseInfo"] | undefined {
    if (!this.isCourtFileBarcode(data)) return undefined;

    return {
      caseNumber: data,
      court: "District Court",
      status: "Active",
    };
  }

  private getDefaultAnalytics(): ScannerAnalytics {
    return {
      totalScans: 0,
      scansByType: {
        document: 0,
        barcode: 0,
        qr: 0,
        id_card: 0,
        receipt: 0,
        signature: 0,
        text: 0,
      },
      topDocumentTypes: ["petition", "fir", "notice"],
      mostUsedTool: "document",
      averageEntitiesDetected: 4.2,
      recentActivity: [],
    };
  }

  private getMostUsedTool(
    scansByType: Record<ScannerType, number>,
  ): ScannerType {
    return Object.entries(scansByType).reduce((a, b) =>
      scansByType[a[0] as ScannerType] > scansByType[b[0] as ScannerType]
        ? a
        : b,
    )[0] as ScannerType;
  }

  private convertToCSV(data: ScanResult[]): string {
    if (data.length === 0) return "";

    const headers = ["ID", "Type", "Timestamp", "Extracted Text", "Confidence"];
    const rows = data.map((scan) => [
      scan.id,
      scan.type,
      scan.timestamp.toISOString(),
      scan.extractedText || "",
      scan.confidence || "",
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }
}

export const scannerService = new ScannerService();
