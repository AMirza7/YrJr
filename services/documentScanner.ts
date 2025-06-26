import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";

export interface ScannedDocument {
  id: string;
  name: string;
  uri: string;
  type: string;
  size: number;
  extractedText?: string;
  extractedFields?: LegalDocumentFields;
  scanDate: Date;
}

export interface LegalDocumentFields {
  documentType?:
    | "FIR"
    | "COURT_ORDER"
    | "AFFIDAVIT"
    | "POWER_OF_ATTORNEY"
    | "COMPLAINT"
    | "OTHER";
  caseNumber?: string;
  courtName?: string;
  judgeName?: string;
  date?: string;
  parties?: string[];
  sections?: string[];
  policeFirNumber?: string;
  policeStation?: string;
  complainantName?: string;
  accusedName?: string;
  offences?: string[];
}

export class DocumentScannerService {
  // Request camera permissions
  static async requestCameraPermissions(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting camera permissions:", error);
      return false;
    }
  }

  // Request media library permissions
  static async requestMediaPermissions(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting media permissions:", error);
      return false;
    }
  }

  // Scan document using camera
  static async scanWithCamera(): Promise<ScannedDocument | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) {
        throw new Error("Camera permission is required to scan documents");
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      const document: ScannedDocument = {
        id: Date.now().toString(),
        name: `Scanned_${new Date().toISOString().split("T")[0]}.jpg`,
        uri: asset.uri,
        type: "image/jpeg",
        size: asset.fileSize || 0,
        scanDate: new Date(),
      };

      // Extract text using OCR (mock implementation)
      document.extractedText = await this.extractTextFromImage(asset.uri);

      // Extract legal fields from text
      document.extractedFields = await this.extractLegalFields(
        document.extractedText,
      );

      return document;
    } catch (error) {
      console.error("Error scanning document with camera:", error);
      throw new Error("Failed to scan document");
    }
  }

  // Select document from device
  static async selectFromDevice(): Promise<ScannedDocument | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      const document: ScannedDocument = {
        id: Date.now().toString(),
        name: asset.name,
        uri: asset.uri,
        type: asset.mimeType || "application/octet-stream",
        size: asset.size || 0,
        scanDate: new Date(),
      };

      // Extract text if it's an image
      if (asset.mimeType?.startsWith("image/")) {
        document.extractedText = await this.extractTextFromImage(asset.uri);
        document.extractedFields = await this.extractLegalFields(
          document.extractedText,
        );
      }

      return document;
    } catch (error) {
      console.error("Error selecting document:", error);
      throw new Error("Failed to select document");
    }
  }

  // Mock OCR implementation (in production, use Google Vision API, AWS Textract, etc.)
  private static async extractTextFromImage(imageUri: string): Promise<string> {
    // Simulate OCR processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock extracted text based on document type
    const mockTexts = [
      // FIR Mock Text
      `FIRST INFORMATION REPORT
      Case No: FIR 123/2024
      Police Station: Civil Lines
      Date: ${new Date().toLocaleDateString("en-IN")}
      
      Complainant: Ramesh Kumar
      Address: 123 MG Road, Delhi
      
      Accused: Unknown person
      
      Sections: IPC 380 (Theft in dwelling house)
      
      Brief facts: On ${new Date().toLocaleDateString("en-IN")}, complainant found that his mobile phone worth Rs. 25,000 was stolen from his house.`,

      // Court Order Mock Text
      `HIGH COURT OF DELHI
      Case No: CRL.M.C. 456/2024
      
      Before: Hon'ble Mr. Justice Rajesh Sharma
      Date: ${new Date().toLocaleDateString("en-IN")}
      
      Petitioner: ABC Pvt. Ltd.
      Respondent: State of Delhi
      
      ORDER
      
      This petition is filed under Section 482 of CrPC seeking quashing of FIR No. 123/2024.
      
      After hearing both parties, this court is of the opinion that the case requires further investigation.
      
      The petition is dismissed.`,

      // Affidavit Mock Text
      `AFFIDAVIT
      
      I, Rajesh Kumar, S/o Mohan Kumar, aged 35 years, residing at 456 Janpath, New Delhi, do hereby solemnly affirm and state as under:
      
      1. That I am the deponent herein and I know the facts and circumstances of the case.
      
      2. That the facts stated hereinafter are true to the best of my knowledge and belief.
      
      Deponent
      Rajesh Kumar
      
      Verification: I, the above named deponent do hereby verify that the contents of my above affidavit are true and correct to the best of my knowledge and belief.`,
    ];

    // Return random mock text
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  }

  // Extract legal fields from text using pattern matching
  private static async extractLegalFields(
    text: string,
  ): Promise<LegalDocumentFields> {
    const fields: LegalDocumentFields = {};

    // Determine document type
    if (
      text.toLowerCase().includes("first information report") ||
      text.toLowerCase().includes("fir")
    ) {
      fields.documentType = "FIR";
    } else if (
      text.toLowerCase().includes("order") &&
      text.toLowerCase().includes("court")
    ) {
      fields.documentType = "COURT_ORDER";
    } else if (text.toLowerCase().includes("affidavit")) {
      fields.documentType = "AFFIDAVIT";
    } else if (text.toLowerCase().includes("power of attorney")) {
      fields.documentType = "POWER_OF_ATTORNEY";
    } else if (text.toLowerCase().includes("complaint")) {
      fields.documentType = "COMPLAINT";
    } else {
      fields.documentType = "OTHER";
    }

    // Extract case numbers
    const caseNumberRegex =
      /(?:case no|fir no|petition no)[\s:]*([a-z0-9\/\-\.]+)/gi;
    const caseMatch = caseNumberRegex.exec(text);
    if (caseMatch) {
      fields.caseNumber = caseMatch[1].trim();
    }

    // Extract court name
    const courtRegex =
      /(high court|supreme court|district court|sessions court)[^,\n]*/gi;
    const courtMatch = courtRegex.exec(text);
    if (courtMatch) {
      fields.courtName = courtMatch[0].trim();
    }

    // Extract judge name
    const judgeRegex = /(?:hon'ble|justice|judge)[\s]*([a-z\s\.]+)/gi;
    const judgeMatch = judgeRegex.exec(text);
    if (judgeMatch) {
      fields.judgeName = judgeMatch[1].trim();
    }

    // Extract dates
    const dateRegex = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/g;
    const dateMatch = dateRegex.exec(text);
    if (dateMatch) {
      fields.date = dateMatch[1];
    }

    // Extract IPC/legal sections
    const sectionRegex = /(ipc|bnss|crpc|cpc)\s*(\d+[a-z]*)/gi;
    const sections: string[] = [];
    let sectionMatch;
    while ((sectionMatch = sectionRegex.exec(text)) !== null) {
      sections.push(`${sectionMatch[1].toUpperCase()} ${sectionMatch[2]}`);
    }
    if (sections.length > 0) {
      fields.sections = sections;
    }

    // Extract police station (for FIR)
    if (fields.documentType === "FIR") {
      const stationRegex = /police station[\s:]*([a-z\s]+)/gi;
      const stationMatch = stationRegex.exec(text);
      if (stationMatch) {
        fields.policeStation = stationMatch[1].trim();
      }

      // Extract complainant
      const complainantRegex = /complainant[\s:]*([a-z\s]+)/gi;
      const complainantMatch = complainantRegex.exec(text);
      if (complainantMatch) {
        fields.complainantName = complainantMatch[1].trim();
      }

      // Extract accused
      const accusedRegex = /accused[\s:]*([a-z\s]+)/gi;
      const accusedMatch = accusedRegex.exec(text);
      if (accusedMatch) {
        fields.accusedName = accusedMatch[1].trim();
      }
    }

    return fields;
  }

  // Process multiple documents
  static async processDocuments(
    documents: ScannedDocument[],
  ): Promise<ScannedDocument[]> {
    const processedDocuments: ScannedDocument[] = [];

    for (const doc of documents) {
      try {
        if (doc.type.startsWith("image/") && !doc.extractedText) {
          doc.extractedText = await this.extractTextFromImage(doc.uri);
          doc.extractedFields = await this.extractLegalFields(
            doc.extractedText,
          );
        }
        processedDocuments.push(doc);
      } catch (error) {
        console.error(`Error processing document ${doc.name}:`, error);
        processedDocuments.push(doc); // Add even if processing failed
      }
    }

    return processedDocuments;
  }

  // Save document to device
  static async saveToDevice(document: ScannedDocument): Promise<boolean> {
    try {
      const hasPermission = await this.requestMediaPermissions();
      if (!hasPermission) {
        throw new Error(
          "Media library permission is required to save documents",
        );
      }

      if (Platform.OS === "ios") {
        // On iOS, the document is already saved to the device when picked
        return true;
      } else {
        // On Android, save to media library
        const asset = await MediaLibrary.createAssetAsync(document.uri);
        return !!asset;
      }
    } catch (error) {
      console.error("Error saving document to device:", error);
      return false;
    }
  }
}
