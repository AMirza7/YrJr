import { Alert } from "react-native";
import { authService } from "./auth";

export type VerificationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "documents_required";

export interface VerificationDocument {
  id: string;
  type:
    | "bar_council_card"
    | "law_degree"
    | "practice_certificate"
    | "id_proof"
    | "office_proof";
  name: string;
  url: string;
  uploadedAt: Date;
  status: "pending" | "verified" | "rejected";
  rejectionReason?: string;
}

export interface LawyerVerification {
  id: string;
  userId: string;
  status: VerificationStatus;
  appliedRole: "lawyer" | "junior_lawyer";
  currentRole: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  documents: VerificationDocument[];
  barCouncilNumber: string;
  practiceYears?: number;
  specialization: string[];
  officeAddress: string;
  rejectionReason?: string;
  statusHistory: {
    status: VerificationStatus;
    timestamp: Date;
    reviewedBy?: string;
    notes?: string;
  }[];
}

export interface VerificationBadge {
  type:
    | "verified_lawyer"
    | "verified_junior"
    | "pending_verification"
    | "rejected";
  label: string;
  color: string;
  icon: string;
  description: string;
}

class LawyerVerificationService {
  // Submit verification application
  async submitVerification(
    userId: string,
    data: {
      appliedRole: "lawyer" | "junior_lawyer";
      barCouncilNumber: string;
      practiceYears?: number;
      specialization: string[];
      officeAddress: string;
      documents: Omit<VerificationDocument, "id" | "uploadedAt" | "status">[];
    },
  ): Promise<{ success: boolean; verificationId?: string; error?: string }> {
    try {
      const verificationId = `ver_${Date.now()}`;

      const verification: LawyerVerification = {
        id: verificationId,
        userId,
        status: "pending",
        appliedRole: data.appliedRole,
        currentRole: "law_student", // Default current role
        submittedAt: new Date(),
        documents: data.documents.map((doc, index) => ({
          ...doc,
          id: `doc_${Date.now()}_${index}`,
          uploadedAt: new Date(),
          status: "pending",
        })),
        barCouncilNumber: data.barCouncilNumber,
        practiceYears: data.practiceYears,
        specialization: data.specialization,
        officeAddress: data.officeAddress,
        statusHistory: [
          {
            status: "pending",
            timestamp: new Date(),
            notes: "Application submitted for review",
          },
        ],
      };

      // In real app, save to backend
      console.log("Verification submitted:", verification);

      // Update user status to pending
      await authService.updateUserRole(userId, `pending_${data.appliedRole}`);

      return { success: true, verificationId };
    } catch (error) {
      console.error("Error submitting verification:", error);
      return { success: false, error: "Failed to submit verification" };
    }
  }

  // Get verification status for user
  async getVerificationStatus(
    userId: string,
  ): Promise<LawyerVerification | null> {
    try {
      // In real app, fetch from backend
      // For demo, return mock data
      return {
        id: "ver_demo_123",
        userId,
        status: "under_review",
        appliedRole: "lawyer",
        currentRole: "pending_lawyer",
        submittedAt: new Date("2024-01-14T10:30:00Z"),
        reviewedAt: new Date("2024-01-15T14:20:00Z"),
        reviewedBy: "admin_001",
        documents: [
          {
            id: "doc_1",
            type: "bar_council_card",
            name: "Bar Council Registration Card",
            url: "mock_url_1",
            uploadedAt: new Date("2024-01-14T10:30:00Z"),
            status: "verified",
          },
          {
            id: "doc_2",
            type: "law_degree",
            name: "Law Degree Certificate",
            url: "mock_url_2",
            uploadedAt: new Date("2024-01-14T10:31:00Z"),
            status: "verified",
          },
          {
            id: "doc_3",
            type: "practice_certificate",
            name: "Practice Certificate",
            url: "mock_url_3",
            uploadedAt: new Date("2024-01-14T10:32:00Z"),
            status: "pending",
          },
        ],
        barCouncilNumber: "DL/2023/12345",
        practiceYears: 5,
        specialization: ["Criminal Law", "Family Law"],
        officeAddress: "Court Complex, Delhi",
        statusHistory: [
          {
            status: "pending",
            timestamp: new Date("2024-01-14T10:30:00Z"),
            notes: "Application submitted for review",
          },
          {
            status: "under_review",
            timestamp: new Date("2024-01-15T14:20:00Z"),
            reviewedBy: "admin_001",
            notes: "Documents verification in progress",
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching verification status:", error);
      return null;
    }
  }

  // Get all pending verifications (for admin)
  async getPendingVerifications(): Promise<LawyerVerification[]> {
    try {
      // Mock data for demo
      return [
        {
          id: "ver_123",
          userId: "user_123",
          status: "pending",
          appliedRole: "lawyer",
          currentRole: "pending_lawyer",
          submittedAt: new Date("2024-01-14T10:30:00Z"),
          documents: [
            {
              id: "doc_1",
              type: "bar_council_card",
              name: "Bar Council Card",
              url: "mock_url",
              uploadedAt: new Date(),
              status: "pending",
            },
          ],
          barCouncilNumber: "DL/2023/12345",
          practiceYears: 5,
          specialization: ["Criminal Law"],
          officeAddress: "Delhi",
          statusHistory: [
            {
              status: "pending",
              timestamp: new Date("2024-01-14T10:30:00Z"),
            },
          ],
        },
      ];
    } catch (error) {
      console.error("Error fetching pending verifications:", error);
      return [];
    }
  }

  // Approve verification (admin action)
  async approveVerification(
    verificationId: string,
    adminId: string,
    notes?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // In real app, update backend
      const verification = await this.getVerificationById(verificationId);
      if (!verification) {
        return { success: false, error: "Verification not found" };
      }

      // Update user role to approved role
      await authService.updateUserRole(
        verification.userId,
        verification.appliedRole,
      );

      // Update verification status
      const updatedVerification: Partial<LawyerVerification> = {
        status: "approved",
        reviewedAt: new Date(),
        reviewedBy: adminId,
        statusHistory: [
          ...(verification.statusHistory || []),
          {
            status: "approved",
            timestamp: new Date(),
            reviewedBy: adminId,
            notes: notes || "Application approved after document verification",
          },
        ],
      };

      console.log("Verification approved:", updatedVerification);

      // Send notification to user
      await this.sendVerificationNotification(
        verification.userId,
        "approved",
        `Your application for ${verification.appliedRole} has been approved!`,
      );

      return { success: true };
    } catch (error) {
      console.error("Error approving verification:", error);
      return { success: false, error: "Failed to approve verification" };
    }
  }

  // Reject verification (admin action)
  async rejectVerification(
    verificationId: string,
    adminId: string,
    reason: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const verification = await this.getVerificationById(verificationId);
      if (!verification) {
        return { success: false, error: "Verification not found" };
      }

      // Update verification status
      const updatedVerification: Partial<LawyerVerification> = {
        status: "rejected",
        reviewedAt: new Date(),
        reviewedBy: adminId,
        rejectionReason: reason,
        statusHistory: [
          ...(verification.statusHistory || []),
          {
            status: "rejected",
            timestamp: new Date(),
            reviewedBy: adminId,
            notes: `Application rejected: ${reason}`,
          },
        ],
      };

      console.log("Verification rejected:", updatedVerification);

      // Send notification to user
      await this.sendVerificationNotification(
        verification.userId,
        "rejected",
        `Your application was rejected: ${reason}`,
      );

      return { success: true };
    } catch (error) {
      console.error("Error rejecting verification:", error);
      return { success: false, error: "Failed to reject verification" };
    }
  }

  // Get verification badge for user
  getVerificationBadge(
    userRole: string,
    verificationStatus?: VerificationStatus,
  ): VerificationBadge {
    if (userRole === "lawyer") {
      return {
        type: "verified_lawyer",
        label: "Verified Lawyer",
        color: "#059669",
        icon: "⚖️",
        description: "Verified practicing lawyer with valid credentials",
      };
    }

    if (userRole === "junior_lawyer") {
      return {
        type: "verified_junior",
        label: "Verified Junior Lawyer",
        color: "#0ea5e9",
        icon: "👨‍⚖️",
        description: "Verified junior lawyer with valid credentials",
      };
    }

    if (userRole.startsWith("pending_")) {
      const status = verificationStatus || "pending";

      if (status === "rejected") {
        return {
          type: "rejected",
          label: "Verification Rejected",
          color: "#dc2626",
          icon: "❌",
          description: "Verification application was rejected",
        };
      }

      return {
        type: "pending_verification",
        label: "Verification Pending",
        color: "#f59e0b",
        icon: "⏳",
        description: "Verification application under review",
      };
    }

    // Default for non-lawyer roles
    return {
      type: "pending_verification",
      label: "Not Verified",
      color: "#6b7280",
      icon: "👤",
      description: "General user account",
    };
  }

  // Request additional documents
  async requestDocuments(
    verificationId: string,
    adminId: string,
    requiredDocuments: string[],
    notes: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const verification = await this.getVerificationById(verificationId);
      if (!verification) {
        return { success: false, error: "Verification not found" };
      }

      // Update status to documents_required
      const updatedVerification: Partial<LawyerVerification> = {
        status: "documents_required",
        reviewedAt: new Date(),
        reviewedBy: adminId,
        statusHistory: [
          ...(verification.statusHistory || []),
          {
            status: "documents_required",
            timestamp: new Date(),
            reviewedBy: adminId,
            notes: `Additional documents required: ${requiredDocuments.join(", ")}. ${notes}`,
          },
        ],
      };

      console.log("Additional documents requested:", updatedVerification);

      // Send notification to user
      await this.sendVerificationNotification(
        verification.userId,
        "documents_required",
        `Please upload additional documents: ${requiredDocuments.join(", ")}`,
      );

      return { success: true };
    } catch (error) {
      console.error("Error requesting documents:", error);
      return { success: false, error: "Failed to request documents" };
    }
  }

  // Helper method to get verification by ID
  private async getVerificationById(
    verificationId: string,
  ): Promise<LawyerVerification | null> {
    // In real app, fetch from backend
    // For demo, return mock data
    return {
      id: verificationId,
      userId: "user_123",
      status: "under_review",
      appliedRole: "lawyer",
      currentRole: "pending_lawyer",
      submittedAt: new Date(),
      documents: [],
      barCouncilNumber: "DL/2023/12345",
      specialization: ["Criminal Law"],
      officeAddress: "Delhi",
      statusHistory: [],
    };
  }

  // Send notification to user about verification status
  private async sendVerificationNotification(
    userId: string,
    status: VerificationStatus | "approved" | "rejected",
    message: string,
  ): Promise<void> {
    try {
      // In real app, send push notification or email
      console.log(`Notification to user ${userId}: ${message}`);

      // You could integrate with your notification service here
      /*
      await notificationService.sendNotification({
        userId,
        title: "Verification Status Update",
        message,
        type: "verification",
        data: { status },
      });
      */
    } catch (error) {
      console.error("Error sending verification notification:", error);
    }
  }

  // Get verification statistics (for admin dashboard)
  async getVerificationStats(): Promise<{
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
    total: number;
  }> {
    try {
      // In real app, fetch from backend
      return {
        pending: 5,
        underReview: 3,
        approved: 127,
        rejected: 8,
        total: 143,
      };
    } catch (error) {
      console.error("Error fetching verification stats:", error);
      return {
        pending: 0,
        underReview: 0,
        approved: 0,
        rejected: 0,
        total: 0,
      };
    }
  }

  // Upload verification document
  async uploadDocument(
    verificationId: string,
    documentType: VerificationDocument["type"],
    file: any, // File object or URI
  ): Promise<{ success: boolean; documentId?: string; error?: string }> {
    try {
      // In real app, upload to cloud storage (AWS S3, Cloudinary, etc.)
      const documentId = `doc_${Date.now()}`;

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(
        `Document uploaded: ${documentType} for verification ${verificationId}`,
      );

      return { success: true, documentId };
    } catch (error) {
      console.error("Error uploading document:", error);
      return { success: false, error: "Failed to upload document" };
    }
  }
}

export const lawyerVerificationService = new LawyerVerificationService();
