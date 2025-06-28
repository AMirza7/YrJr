import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

export interface ScanResult {
  success: boolean;
  imageUri?: string;
  extractedText?: string;
  extractedFields?: ExtractedLegalFields;
  error?: string;
}

export interface ExtractedLegalFields {
  caseNumber?: string;
  parties?: string[];
  courtName?: string;
  judgeName?: string;
  date?: string;
  subject?: string;
  firNumber?: string;
  policeStation?: string;
  sections?: string[];
  documentType: DocumentType;
}

export type DocumentType =
  | "fir"
  | "court_order"
  | "judgment"
  | "petition"
  | "affidavit"
  | "contract"
  | "notice"
  | "unknown";

class DocumentScannerService {
  async requestPermissions(): Promise<boolean> {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      return (
        cameraPermission.status === "granted" &&
        mediaLibraryPermission.status === "granted"
      );
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  }

  async scanWithCamera(): Promise<ScanResult> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return { success: false, error: "Camera permissions not granted" };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return { success: false, error: "Scan cancelled by user" };
      }

      const imageUri = result.assets[0].uri;

      // Perform OCR and field extraction
      const extractionResult = await this.extractTextFromImage(imageUri);

      return {
        success: true,
        imageUri,
        extractedText: extractionResult.text,
        extractedFields: extractionResult.fields,
      };
    } catch (error) {
      console.error("Error scanning document:", error);
      return { success: false, error: "Failed to scan document" };
    }
  }

  async scanFromGallery(): Promise<ScanResult> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return {
          success: false,
          error: "Media library permissions not granted",
        };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return { success: false, error: "Selection cancelled by user" };
      }

      const imageUri = result.assets[0].uri;

      // Perform OCR and field extraction
      const extractionResult = await this.extractTextFromImage(imageUri);

      return {
        success: true,
        imageUri,
        extractedText: extractionResult.text,
        extractedFields: extractionResult.fields,
      };
    } catch (error) {
      console.error("Error scanning from gallery:", error);
      return { success: false, error: "Failed to scan document from gallery" };
    }
  }

  private async extractTextFromImage(imageUri: string): Promise<{
    text: string;
    fields: ExtractedLegalFields;
  }> {
    // In a real implementation, this would use a service like Google Vision API,
    // AWS Textract, or Azure Computer Vision. For demo purposes, we'll simulate OCR.

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing time

    // Mock OCR text extraction
    const mockTexts = {
      fir: `
        FIRST INFORMATION REPORT
        FIR No: 123/2024
        Police Station: Cyber Crime, Mumbai
        Date: 15/01/2025
        
        Complainant: Rahul Sharma
        Accused: Unknown
        
        Offense: Cyber fraud under IT Act 2000
        Section: 66C, 66D
        
        Details: Online fraud through fake website...
      `,
      court_order: `
        IN THE HIGH COURT OF BOMBAY
        Criminal Appeal No. 456/2024
        
        Petitioner: State of Maharashtra
        Respondent: ABC Limited
        
        Coram: Hon'ble Justice Priya Mehta
        Date: 16/01/2025
        
        ORDER:
        The matter is adjourned to 25/01/2025 for final arguments.
        
        Sections: IPC 420, 468
      `,
      contract: `
        EMPLOYMENT AGREEMENT
        
        This agreement is entered into between:
        Company: TechCorp India Pvt. Ltd.
        Employee: Amit Kumar
        
        Position: Software Engineer
        Start Date: 01/02/2025
        Salary: Rs. 8,00,000 per annum
        
        Terms and Conditions...
      `,
    };

    // Randomly select one for demo
    const documentTypes = Object.keys(mockTexts);
    const selectedType = documentTypes[
      Math.floor(Math.random() * documentTypes.length)
    ] as keyof typeof mockTexts;
    const extractedText = mockTexts[selectedType];

    // Extract fields based on document type
    const fields = this.extractFieldsFromText(
      extractedText,
      selectedType as DocumentType,
    );

    return {
      text: extractedText.trim(),
      fields,
    };
  }

  private extractFieldsFromText(
    text: string,
    documentType: DocumentType,
  ): ExtractedLegalFields {
    const fields: ExtractedLegalFields = { documentType };

    // Basic regex patterns for common legal document fields
    const patterns = {
      caseNumber: /(?:Case No\.?|Appeal No\.?|FIR No\.?)[\s:]*([A-Z0-9\/\-]+)/i,
      firNumber: /FIR No\.?[\s:]*([0-9\/\-]+)/i,
      courtName: /(?:IN THE|Court of)[\s\n]*(.*?)(?:\n|Date|Coram)/i,
      judgeName: /(?:Hon'ble Justice|Judge)[\s:]*(.*?)(?:\n|Date)/i,
      date: /Date[\s:]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4})/i,
      policeStation: /Police Station[\s:]*([^\n]*)/i,
      sections: /(?:Section|Sections)[\s:]*([0-9A-Z,\s]+)/gi,
    };

    // Extract case number
    const caseMatch = text.match(patterns.caseNumber);
    if (caseMatch) fields.caseNumber = caseMatch[1].trim();

    // Extract FIR number
    const firMatch = text.match(patterns.firNumber);
    if (firMatch) fields.firNumber = firMatch[1].trim();

    // Extract court name
    const courtMatch = text.match(patterns.courtName);
    if (courtMatch) fields.courtName = courtMatch[1].trim();

    // Extract judge name
    const judgeMatch = text.match(patterns.judgeName);
    if (judgeMatch) fields.judgeName = judgeMatch[1].trim();

    // Extract date
    const dateMatch = text.match(patterns.date);
    if (dateMatch) fields.date = dateMatch[1].trim();

    // Extract police station
    const policeMatch = text.match(patterns.policeStation);
    if (policeMatch) fields.policeStation = policeMatch[1].trim();

    // Extract sections
    const sectionMatches = [...text.matchAll(patterns.sections)];
    if (sectionMatches.length > 0) {
      fields.sections = sectionMatches
        .map((match) => match[1].trim())
        .join(", ")
        .split(/[,\s]+/)
        .filter((s) => s.length > 0);
    }

    // Extract parties (simplified - look for common patterns)
    const partyPatterns = [
      /(?:Petitioner|Complainant)[\s:]*([^\n]*)/gi,
      /(?:Respondent|Accused)[\s:]*([^\n]*)/gi,
      /(?:Plaintiff|Defendant)[\s:]*([^\n]*)/gi,
    ];

    const parties: string[] = [];
    partyPatterns.forEach((pattern) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach((match) => {
        if (match[1] && match[1].trim()) {
          parties.push(match[1].trim());
        }
      });
    });

    if (parties.length > 0) {
      fields.parties = parties;
    }

    // Extract subject/title
    const subjectPatterns = [
      /(?:Subject|Re|Matter)[\s:]*([^\n]*)/i,
      /(?:Offense|Charge)[\s:]*([^\n]*)/i,
    ];

    for (const pattern of subjectPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        fields.subject = match[1].trim();
        break;
      }
    }

    return fields;
  }

  getDocumentTypeIcon(type: DocumentType): string {
    switch (type) {
      case "fir":
        return "🚨";
      case "court_order":
        return "⚖️";
      case "judgment":
        return "📋";
      case "petition":
        return "📄";
      case "affidavit":
        return "📝";
      case "contract":
        return "📃";
      case "notice":
        return "📢";
      default:
        return "📄";
    }
  }

  getDocumentTypeName(type: DocumentType): string {
    switch (type) {
      case "fir":
        return "First Information Report";
      case "court_order":
        return "Court Order";
      case "judgment":
        return "Judgment";
      case "petition":
        return "Petition";
      case "affidavit":
        return "Affidavit";
      case "contract":
        return "Contract/Agreement";
      case "notice":
        return "Legal Notice";
      default:
        return "Unknown Document";
    }
  }

  async saveToGallery(imageUri: string): Promise<boolean> {
    try {
      const hasPermission = await MediaLibrary.requestPermissionsAsync();
      if (hasPermission.status !== "granted") {
        return false;
      }

      const asset = await MediaLibrary.createAssetAsync(imageUri);
      await MediaLibrary.createAlbumAsync("Legal Scanner", asset, false);
      return true;
    } catch (error) {
      console.error("Error saving to gallery:", error);
      return false;
    }
  }

  formatExtractedData(
    fields: ExtractedLegalFields,
  ): { label: string; value: string }[] {
    const result: { label: string; value: string }[] = [];

    if (fields.documentType) {
      result.push({
        label: "Document Type",
        value: this.getDocumentTypeName(fields.documentType),
      });
    }

    if (fields.caseNumber) {
      result.push({ label: "Case Number", value: fields.caseNumber });
    }

    if (fields.firNumber) {
      result.push({ label: "FIR Number", value: fields.firNumber });
    }

    if (fields.courtName) {
      result.push({ label: "Court", value: fields.courtName });
    }

    if (fields.judgeName) {
      result.push({ label: "Judge", value: fields.judgeName });
    }

    if (fields.date) {
      result.push({ label: "Date", value: fields.date });
    }

    if (fields.policeStation) {
      result.push({ label: "Police Station", value: fields.policeStation });
    }

    if (fields.parties && fields.parties.length > 0) {
      result.push({ label: "Parties", value: fields.parties.join(", ") });
    }

    if (fields.subject) {
      result.push({ label: "Subject", value: fields.subject });
    }

    if (fields.sections && fields.sections.length > 0) {
      result.push({
        label: "Legal Sections",
        value: fields.sections.join(", "),
      });
    }

    return result;
  }
}

export const documentScannerService = new DocumentScannerService();
