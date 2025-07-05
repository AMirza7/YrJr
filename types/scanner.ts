export interface ScanResult {
  id: string;
  type: ScannerType;
  timestamp: Date;
  data: any;
  imageUri?: string;
  extractedText?: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

export type ScannerType =
  | "document"
  | "barcode"
  | "qr"
  | "id_card"
  | "receipt"
  | "signature"
  | "text";

export interface DocumentScanResult extends ScanResult {
  type: "document";
  data: {
    fullText: string;
    keyFields: {
      petitioner?: string;
      propertyAddress?: string;
      ipcSections?: string[];
      dates?: string[];
      caseNumber?: string;
      court?: string;
    };
    documentType?: string;
  };
}

export interface BarcodeScanResult extends ScanResult {
  type: "barcode" | "qr";
  data: {
    text: string;
    format: string;
    isCourtFile?: boolean;
    caseInfo?: {
      caseNumber: string;
      court: string;
      status: string;
    };
  };
}

export interface IDCardScanResult extends ScanResult {
  type: "id_card";
  data: {
    name: string;
    idNumber: string;
    dateOfBirth?: string;
    address?: string;
    idType: "PAN" | "Aadhaar" | "Voter ID" | "Driver License" | "Other";
    masked?: boolean;
  };
}

export interface ReceiptScanResult extends ScanResult {
  type: "receipt";
  data: {
    invoiceNumber?: string;
    sellerName?: string;
    date?: string;
    gstin?: string;
    amount?: string;
    items?: Array<{
      description: string;
      quantity?: number;
      rate?: number;
      amount?: number;
    }>;
  };
}

export interface SignatureScanResult extends ScanResult {
  type: "signature";
  data: {
    signatureData: string; // Base64 encoded signature
    width: number;
    height: number;
    fileName: string;
  };
}

export interface TextScanResult extends ScanResult {
  type: "text";
  data: {
    fullText: string;
    keywords?: string[];
    summary?: string;
  };
}

export interface ScannerAnalytics {
  totalScans: number;
  scansByType: Record<ScannerType, number>;
  topDocumentTypes: string[];
  mostUsedTool: ScannerType;
  averageEntitiesDetected: number;
  recentActivity: Array<{
    date: Date;
    type: ScannerType;
    count: number;
  }>;
}

export interface ExportOptions {
  format: "JSON" | "CSV" | "PDF" | "DOCX";
  includeImages: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  types?: ScannerType[];
}
