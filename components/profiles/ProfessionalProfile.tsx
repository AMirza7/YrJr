import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { useModal } from "@/contexts/ModalContext";

const { width } = Dimensions.get("window");

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: Date;
  category: "education" | "experience" | "award" | "certification" | "case";
}

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: Date;
  caseType: string;
}

interface ProfessionalDetails {
  id: string;
  name: string;
  role: "lawyer" | "junior_lawyer" | "clerk";
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  specializations: string[];
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: number;
  }[];
  achievements: Achievement[];
  reviews: Review[];
  bio: string;
  hourlyRate?: number;
  successRate: number;
  responseTime: string;
  languages: string[];
  location: string;
  availability: "available" | "busy" | "offline";
}

interface ProfessionalProfileProps {
  professionalId: string;
  onClose?: () => void;
  onHire?: (professionalId: string) => void;
  onMessage?: (professionalId: string) => void;
}

export default function ProfessionalProfile({
  professionalId,
  onClose,
  onHire,
  onMessage,
}: ProfessionalProfileProps) {
  const { showSuccess, showConfirm } = useModal();
  const [activeTab, setActiveTab] = useState<
    "overview" | "reviews" | "achievements" | "portfolio"
  >("overview");
  const [showHireModal, setShowHireModal] = useState(false);

  // Mock data - in real app, this would come from API
  const professional: ProfessionalDetails = {
    id: professionalId,
    name: "Advocate Priya Sharma",
    role: "lawyer",
    avatar: "👩‍⚖️",
    isVerified: true,
    isOnline: true,
    rating: 4.8,
    reviewCount: 127,
    experienceYears: 8,
    specializations: ["Criminal Law", "Family Law", "Property Law"],
    education: [
      {
        degree: "LLM in Criminal Law",
        institution: "Delhi University",
        year: 2018,
      },
      {
        degree: "LLB",
        institution: "National Law University",
        year: 2016,
      },
    ],
    certifications: [
      {
        name: "Certified Criminal Law Specialist",
        issuer: "Bar Council of India",
        year: 2019,
      },
      {
        name: "ADR Certified Mediator",
        issuer: "Indian Institute of Arbitration",
        year: 2020,
      },
    ],
    achievements: [
      {
        id: "1",
        title: "Won Landmark Case",
        description: "Successfully defended in a high-profile criminal case",
        icon: "🏆",
        date: new Date("2023-11-15"),
        category: "case",
      },
      {
        id: "2",
        title: "Excellence Award",
        description: "Bar Association Excellence Award for outstanding service",
        icon: "🥇",
        date: new Date("2023-08-20"),
        category: "award",
      },
    ],
    reviews: [
      {
        id: "1",
        clientName: "Rajesh Kumar",
        rating: 5,
        comment:
          "Excellent lawyer! Very professional and got great results for my case.",
        date: new Date("2024-01-10"),
        caseType: "Criminal Law",
      },
      {
        id: "2",
        clientName: "Meera Singh",
        rating: 5,
        comment:
          "Highly recommend! Clear communication and expert guidance throughout.",
        date: new Date("2023-12-28"),
        caseType: "Family Law",
      },
    ],
    bio: "Experienced criminal and family law attorney with over 8 years of practice. Specialized in complex criminal defense cases and family disputes. Known for thorough case preparation and client-focused approach.",
    hourlyRate: 2500,
    successRate: 92,
    responseTime: "< 2 hours",
    languages: ["English", "Hindi", "Punjabi"],
    location: "New Delhi, India",
    availability: "available",
  };

  const handleHire = () => {
    setShowHireModal(true);
  };

  const confirmHire = () => {
    setShowHireModal(false);
    onHire?.(professionalId);
    showSuccess("Hiring request sent! They will contact you soon.");
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, i <= rating && styles.starFilled]}>
          ★
        </Text>,
      );
    }
    return stars;
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Bio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bioText}>{professional.bio}</Text>
      </View>

      {/* Key Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{professional.successRate}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{professional.responseTime}</Text>
            <Text style={styles.statLabel}>Response Time</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{professional.reviewCount}</Text>
            <Text style={styles.statLabel}>Cases Handled</Text>
          </View>
        </View>
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {professional.education.map((edu, index) => (
          <View key={index} style={styles.educationItem}>
            <Text style={styles.educationDegree}>{edu.degree}</Text>
            <Text style={styles.educationInstitution}>{edu.institution}</Text>
            <Text style={styles.educationYear}>{edu.year}</Text>
          </View>
        ))}
      </View>

      {/* Specializations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specializations</Text>
        <View style={styles.specializationsContainer}>
          {professional.specializations.map((spec, index) => (
            <View key={index} style={styles.specializationTag}>
              <Text style={styles.specializationText}>{spec}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Languages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        <Text style={styles.languagesText}>
          {professional.languages.join(", ")}
        </Text>
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      {professional.reviews.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewerName}>{review.clientName}</Text>
            <View style={styles.reviewRating}>
              {renderStars(review.rating)}
            </View>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
          <View style={styles.reviewFooter}>
            <Text style={styles.reviewCaseType}>{review.caseType}</Text>
            <Text style={styles.reviewDate}>
              {review.date.toLocaleDateString()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.tabContent}>
      {professional.achievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementCard}>
          <Text style={styles.achievementIcon}>{achievement.icon}</Text>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
            <Text style={styles.achievementDate}>
              {achievement.date.toLocaleDateString()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderPortfolio = () => (
    <View style={styles.tabContent}>
      <View style={styles.portfolioSection}>
        <Text style={styles.sectionTitle}>Case Portfolio</Text>
        <Text style={styles.portfolioDescription}>
          Due to client confidentiality, specific case details cannot be shared.
          However, here's a summary of case types handled:
        </Text>

        <View style={styles.caseTypesList}>
          <View style={styles.caseTypeItem}>
            <Text style={styles.caseTypeIcon}>⚖️</Text>
            <View style={styles.caseTypeInfo}>
              <Text style={styles.caseTypeName}>Criminal Defense</Text>
              <Text style={styles.caseTypeCount}>45+ cases</Text>
            </View>
          </View>
          <View style={styles.caseTypeItem}>
            <Text style={styles.caseTypeIcon}>👨‍👩‍👧‍👦</Text>
            <View style={styles.caseTypeInfo}>
              <Text style={styles.caseTypeName}>Family Law</Text>
              <Text style={styles.caseTypeCount}>38+ cases</Text>
            </View>
          </View>
          <View style={styles.caseTypeItem}>
            <Text style={styles.caseTypeIcon}>🏠</Text>
            <View style={styles.caseTypeInfo}>
              <Text style={styles.caseTypeName}>Property Disputes</Text>
              <Text style={styles.caseTypeCount}>25+ cases</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Professional Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{professional.avatar}</Text>
              {professional.isOnline && <View style={styles.onlineIndicator} />}
              {professional.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
              )}
            </View>

            <View style={styles.profileDetails}>
              <Text style={styles.name}>{professional.name}</Text>
              <Text style={styles.role}>
                {professional.role === "lawyer"
                  ? "Verified Lawyer"
                  : professional.role === "junior_lawyer"
                    ? "Junior Lawyer"
                    : "Legal Clerk"}
              </Text>
              <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                  {renderStars(Math.floor(professional.rating))}
                </View>
                <Text style={styles.ratingText}>
                  {professional.rating} ({professional.reviewCount} reviews)
                </Text>
              </View>
              <Text style={styles.experience}>
                {professional.experienceYears} years experience •{" "}
                {professional.location}
              </Text>
            </View>
          </View>

          {/* Availability Status */}
          <View
            style={[
              styles.availabilityBadge,
              styles[`availability${professional.availability}`],
            ]}
          >
            <Text style={styles.availabilityText}>
              {professional.availability === "available"
                ? "🟢 Available"
                : professional.availability === "busy"
                  ? "🟡 Busy"
                  : "🔴 Offline"}
            </Text>
          </View>

          {/* Hourly Rate */}
          {professional.hourlyRate && (
            <View style={styles.rateContainer}>
              <Text style={styles.rateLabel}>Consultation Fee</Text>
              <Text style={styles.rateValue}>
                ₹{professional.hourlyRate}/hour
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.hireButton} onPress={handleHire}>
            <Text style={styles.hireButtonText}>💼 Hire Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => onMessage?.(professionalId)}
          >
            <Text style={styles.messageButtonText}>💬 Message</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "overview" && styles.tabActive]}
            onPress={() => setActiveTab("overview")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "overview" && styles.tabTextActive,
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "reviews" && styles.tabActive]}
            onPress={() => setActiveTab("reviews")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "reviews" && styles.tabTextActive,
              ]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "achievements" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("achievements")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "achievements" && styles.tabTextActive,
              ]}
            >
              Awards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "portfolio" && styles.tabActive]}
            onPress={() => setActiveTab("portfolio")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "portfolio" && styles.tabTextActive,
              ]}
            >
              Portfolio
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "reviews" && renderReviews()}
        {activeTab === "achievements" && renderAchievements()}
        {activeTab === "portfolio" && renderPortfolio()}
      </ScrollView>

      {/* Hire Modal */}
      <Modal
        visible={showHireModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHireModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hire {professional.name}?</Text>
            <Text style={styles.modalDescription}>
              This will send a hiring request to {professional.name}. They will
              contact you to discuss your case and fees.
            </Text>

            <View style={styles.modalDetails}>
              <Text style={styles.modalDetailItem}>
                💼 Service: Legal Consultation & Representation
              </Text>
              <Text style={styles.modalDetailItem}>
                💰 Fee: ₹{professional.hourlyRate}/hour
              </Text>
              <Text style={styles.modalDetailItem}>
                ⏱️ Response Time: {professional.responseTime}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowHireModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmHire}
              >
                <Text style={styles.modalConfirmText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#8b5cf6",
    paddingTop: 50,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#fff",
    marginRight: 4,
  },
  backText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  profileInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    fontSize: 48,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 12,
    height: 12,
    backgroundColor: "#10b981",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  verifiedBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedIcon: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  profileDetails: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: "#059669",
    fontWeight: "600",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  star: {
    fontSize: 16,
    color: "#d1d5db",
  },
  starFilled: {
    color: "#fbbf24",
  },
  ratingText: {
    fontSize: 14,
    color: "#6b7280",
  },
  experience: {
    fontSize: 14,
    color: "#6b7280",
  },
  availabilityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  availabilityavailable: {
    backgroundColor: "#d1fae5",
  },
  availabilitybusy: {
    backgroundColor: "#fef3c7",
  },
  availabilityoffline: {
    backgroundColor: "#fee2e2",
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  rateContainer: {
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  rateLabel: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "500",
    marginBottom: 2,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e40af",
  },
  actionButtons: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  hireButton: {
    flex: 2,
    backgroundColor: "#8b5cf6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  hireButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  messageButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8b5cf6",
  },
  messageButtonText: {
    color: "#8b5cf6",
    fontSize: 16,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#8b5cf6",
  },
  tabText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#8b5cf6",
    fontWeight: "600",
  },
  tabContent: {
    backgroundColor: "#fff",
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#8b5cf6",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  educationItem: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  educationDegree: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  educationInstitution: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  educationYear: {
    fontSize: 12,
    color: "#9ca3af",
  },
  specializationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specializationTag: {
    backgroundColor: "#ede9fe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specializationText: {
    fontSize: 14,
    color: "#7c3aed",
    fontWeight: "500",
  },
  languagesText: {
    fontSize: 16,
    color: "#374151",
  },
  reviewCard: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#fbbf24",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  reviewRating: {
    flexDirection: "row",
  },
  reviewComment: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reviewCaseType: {
    fontSize: 12,
    color: "#8b5cf6",
    fontWeight: "500",
  },
  reviewDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  achievementCard: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  portfolioSection: {
    marginBottom: 24,
  },
  portfolioDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  caseTypesList: {
    gap: 12,
  },
  caseTypeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
  },
  caseTypeIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  caseTypeInfo: {
    flex: 1,
  },
  caseTypeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  caseTypeCount: {
    fontSize: 14,
    color: "#6b7280",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  modalDetails: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalDetailItem: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalConfirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
