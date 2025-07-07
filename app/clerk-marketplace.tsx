import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import BackButton from "@/components/navigation/BackButton";
import * as DocumentPicker from "expo-document-picker";

interface ClerkMessage {
  id: string;
  fromName: string;
  fromRole: string;
  subject: string;
  message: string;
  amount?: number;
  status: "pending" | "accepted" | "declined" | "completed";
  createdAt: string;
  isRead: boolean;
}

interface ClerkTemplate {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  downloads: number;
  earnings: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (templateData: any) => void;
}

function UploadModal({ visible, onClose, onSubmit }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const categories = [
    "Legal Documents",
    "Court Applications",
    "Contracts",
    "Agreements",
    "Notices",
    "Petitions",
    "Forms",
    "Other",
  ];

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select file");
    }
  };

  const handleSubmit = () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !price ||
      !category ||
      !selectedFile
    ) {
      Alert.alert("Error", "Please fill all required fields and select a file");
      return;
    }

    const templateData = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      file: selectedFile,
    };

    onSubmit(templateData);

    // Reset form
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setSelectedFile(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Upload New Template</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Template Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter template title"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe what this template is for..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category *</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryTag,
                      category === cat && styles.categoryTagSelected,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        category === cat && styles.categoryTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Upload File *</Text>
              <TouchableOpacity
                style={styles.fileButton}
                onPress={handleFileSelect}
              >
                <Text style={styles.fileButtonText}>
                  {selectedFile
                    ? selectedFile.name
                    : "Select Document (PDF, DOC, DOCX)"}
                </Text>
                <Text style={styles.fileButtonIcon}>📎</Text>
              </TouchableOpacity>
              {selectedFile && (
                <Text style={styles.fileInfo}>
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(1)} KB)
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit for Review</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Your template will be reviewed by our team before being made
            available to lawyers. This process usually takes 1-2 business days.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function ClerkMarketplaceScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "messages" | "templates"
  >("dashboard");
  const [messages, setMessages] = useState<ClerkMessage[]>([]);
  const [templates, setTemplates] = useState<ClerkTemplate[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      if (currentUser.role !== "legal_clerk_typist") {
        Alert.alert(
          "Access Restricted",
          "This area is only for legal clerks and typists.",
          [
            {
              text: "OK",
              onPress: () => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/home");
                }
              },
            },
          ],
        );
        return;
      }

      setUser(currentUser);
      loadData();
    } catch (error) {
      router.replace("/login");
    }
  };

  const loadData = async () => {
    try {
      // Mock data - in production, these would come from API
      const mockMessages: ClerkMessage[] = [
        {
          id: "msg_1",
          fromName: "Advocate Rajesh Kumar",
          fromRole: "Senior Lawyer",
          subject: "Urgent Typing Work - Bail Application",
          message:
            "I need help typing a bail application. The work needs to be completed by tomorrow. Payment: ₹500",
          amount: 500,
          status: "pending",
          createdAt: "2024-01-20",
          isRead: false,
        },
        {
          id: "msg_2",
          fromName: "Priya Sharma",
          fromRole: "Junior Lawyer",
          subject: "Regular Client Document Typing",
          message:
            "Looking for a reliable typist for ongoing document work. 10-15 documents per month.",
          amount: 2000,
          status: "pending",
          createdAt: "2024-01-19",
          isRead: true,
        },
        {
          id: "msg_3",
          fromName: "Legal Associates LLP",
          fromRole: "Law Firm",
          subject: "Contract Drafting Work - Completed",
          message:
            "Thank you for the excellent work on the contract drafting. Payment has been processed.",
          amount: 800,
          status: "completed",
          createdAt: "2024-01-18",
          isRead: true,
        },
      ];

      const mockTemplates: ClerkTemplate[] = [
        {
          id: "template_1",
          title: "Bail Application Template",
          description:
            "Professional bail application format with all necessary sections",
          price: 150,
          category: "Court Applications",
          downloads: 45,
          earnings: 6750,
          status: "approved",
          createdAt: "2024-01-10",
        },
        {
          id: "template_2",
          title: "Legal Notice Format",
          description: "Standard legal notice template with proper formatting",
          price: 100,
          category: "Notices",
          downloads: 67,
          earnings: 6700,
          status: "approved",
          createdAt: "2024-01-05",
        },
        {
          id: "template_3",
          title: "Service Agreement Draft",
          description: "Comprehensive service agreement template",
          price: 200,
          category: "Agreements",
          downloads: 0,
          earnings: 0,
          status: "pending",
          createdAt: "2024-01-20",
        },
      ];

      setMessages(mockMessages);
      setTemplates(mockTemplates);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleUploadTemplate = (templateData: any) => {
    setShowUploadModal(false);

    // Add new template to list
    const newTemplate: ClerkTemplate = {
      id: `template_${Date.now()}`,
      title: templateData.title,
      description: templateData.description,
      price: templateData.price,
      category: templateData.category,
      downloads: 0,
      earnings: 0,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTemplates((prev) => [newTemplate, ...prev]);

    Alert.alert(
      "Template Submitted",
      "Your template has been submitted for review. We'll notify you once it's approved and available for purchase.",
      [{ text: "OK" }],
    );
  };

  const handleMessageAction = (
    messageId: string,
    action: "accept" | "decline",
  ) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    if (action === "accept") {
      Alert.alert(
        "Accept Job",
        `Accept this job from ${message.fromName} for ₹${message.amount}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Accept",
            onPress: () => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === messageId ? { ...m, status: "accepted" } : m,
                ),
              );
              Alert.alert(
                "Success",
                "Job accepted! You can now start working on it.",
              );
            },
          },
        ],
      );
    } else {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: "declined" } : m,
        ),
      );
      Alert.alert("Job Declined", "You have declined this job offer.");
    }
  };

  const getTotalEarnings = () => {
    return templates.reduce((sum, template) => sum + template.earnings, 0);
  };

  const getTotalDownloads = () => {
    return templates.reduce((sum, template) => sum + template.downloads, 0);
  };

  const getUnreadCount = () => {
    return messages.filter((m) => !m.isRead && m.status === "pending").length;
  };

  const renderDashboard = () => (
    <ScrollView
      style={styles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            ₹{getTotalEarnings().toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{getTotalDownloads()}</Text>
          <Text style={styles.statLabel}>Template Downloads</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {templates.filter((t) => t.status === "approved").length}
          </Text>
          <Text style={styles.statLabel}>Active Templates</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{getUnreadCount()}</Text>
          <Text style={styles.statLabel}>New Messages</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowUploadModal(true)}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Upload Template</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setActiveTab("messages")}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>View Messages</Text>
            {getUnreadCount() > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getUnreadCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setActiveTab("templates")}
          >
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionText}>My Templates</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/clerk-templates")}
          >
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionText}>Browse Market</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {messages.slice(0, 3).map((message) => (
          <View key={message.id} style={styles.activityItem}>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{message.subject}</Text>
              <Text style={styles.activitySubtitle}>
                from {message.fromName}
              </Text>
              <Text style={styles.activityDate}>{message.createdAt}</Text>
            </View>
            <View
              style={[
                styles.activityStatus,
                {
                  backgroundColor:
                    message.status === "completed"
                      ? "#10B981"
                      : message.status === "accepted"
                        ? "#3B82F6"
                        : message.status === "declined"
                          ? "#EF4444"
                          : "#F59E0B",
                },
              ]}
            >
              <Text style={styles.activityStatusText}>
                {message.status.charAt(0).toUpperCase() +
                  message.status.slice(1)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderMessages = () => (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.messagesList}
      renderItem={({ item }) => (
        <View
          style={[styles.messageCard, !item.isRead && styles.unreadMessage]}
        >
          <View style={styles.messageHeader}>
            <View style={styles.messageInfo}>
              <Text style={styles.messageSender}>{item.fromName}</Text>
              <Text style={styles.messageRole}>{item.fromRole}</Text>
            </View>
            <View style={styles.messageStatus}>
              <Text
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      item.status === "completed"
                        ? "#10B981"
                        : item.status === "accepted"
                          ? "#3B82F6"
                          : item.status === "declined"
                            ? "#EF4444"
                            : "#F59E0B",
                  },
                ]}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.messageSubject}>{item.subject}</Text>
          <Text style={styles.messageText}>{item.message}</Text>

          {item.amount && (
            <Text style={styles.messageAmount}>Payment: ₹{item.amount}</Text>
          )}

          <Text style={styles.messageDate}>{item.createdAt}</Text>

          {item.status === "pending" && (
            <View style={styles.messageActions}>
              <TouchableOpacity
                style={[styles.messageActionButton, styles.acceptButton]}
                onPress={() => handleMessageAction(item.id, "accept")}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.messageActionButton, styles.declineButton]}
                onPress={() => handleMessageAction(item.id, "decline")}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );

  const renderTemplates = () => (
    <FlatList
      data={templates}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.templatesList}
      renderItem={({ item }) => (
        <View style={styles.templateCard}>
          <View style={styles.templateHeader}>
            <Text style={styles.templateTitle}>{item.title}</Text>
            <View
              style={[
                styles.templateStatus,
                {
                  backgroundColor:
                    item.status === "approved"
                      ? "#10B981"
                      : item.status === "rejected"
                        ? "#EF4444"
                        : "#F59E0B",
                },
              ]}
            >
              <Text style={styles.templateStatusText}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.templateDescription}>{item.description}</Text>
          <Text style={styles.templateCategory}>{item.category}</Text>

          <View style={styles.templateStats}>
            <View style={styles.templateStat}>
              <Text style={styles.templateStatValue}>₹{item.price}</Text>
              <Text style={styles.templateStatLabel}>Price</Text>
            </View>
            <View style={styles.templateStat}>
              <Text style={styles.templateStatValue}>{item.downloads}</Text>
              <Text style={styles.templateStatLabel}>Downloads</Text>
            </View>
            <View style={styles.templateStat}>
              <Text style={styles.templateStatValue}>₹{item.earnings}</Text>
              <Text style={styles.templateStatLabel}>Earned</Text>
            </View>
          </View>

          <Text style={styles.templateDate}>Created: {item.createdAt}</Text>
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => setShowUploadModal(true)}
        >
          <Text style={styles.uploadButtonIcon}>+</Text>
          <Text style={styles.uploadButtonText}>Upload New Template</Text>
        </TouchableOpacity>
      }
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton color="#fff" />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Clerk Marketplace</Text>
          <Text style={styles.headerSubtitle}>Manage your typing business</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "dashboard" && styles.activeTab]}
          onPress={() => setActiveTab("dashboard")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "dashboard" && styles.activeTabText,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "messages" && styles.activeTab]}
          onPress={() => setActiveTab("messages")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "messages" && styles.activeTabText,
            ]}
          >
            Messages
            {getUnreadCount() > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{getUnreadCount()}</Text>
              </View>
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "templates" && styles.activeTab]}
          onPress={() => setActiveTab("templates")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "templates" && styles.activeTabText,
            ]}
          >
            Templates ({templates.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "messages" && renderMessages()}
      {activeTab === "templates" && renderTemplates()}

      <UploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUploadTemplate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    backgroundColor: "#8B5A3F",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
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
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#8B5A3F",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#8B5A3F",
    fontWeight: "600",
  },
  tabBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  tabBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
  },
  // Dashboard styles
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B5A3F",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  recentActivity: {
    padding: 16,
  },
  activityItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  activitySubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  activityDate: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 2,
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityStatusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  // Messages styles
  messagesList: {
    padding: 16,
  },
  messageCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadMessage: {
    borderLeftWidth: 4,
    borderLeftColor: "#8B5A3F",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  messageInfo: {
    flex: 1,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  messageRole: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  messageStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  messageSubject: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 8,
  },
  messageAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 8,
  },
  messageDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 12,
  },
  messageActions: {
    flexDirection: "row",
    gap: 12,
  },
  messageActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#059669",
  },
  declineButton: {
    backgroundColor: "#EF4444",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  declineButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  // Templates styles
  templatesList: {
    padding: 16,
  },
  uploadButton: {
    backgroundColor: "#8B5A3F",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadButtonIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  templateCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  templateStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  templateStatusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  templateDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  templateCategory: {
    fontSize: 12,
    color: "#8B5A3F",
    fontWeight: "500",
    marginBottom: 12,
  },
  templateStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  templateStat: {
    alignItems: "center",
  },
  templateStatValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  templateStatLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
  templateDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  // Modal styles (reusing from the existing upload modal)
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#8B5A3F",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  placeholder: {
    width: 26,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  categoryTagSelected: {
    backgroundColor: "#8B5A3F",
    borderColor: "#8B5A3F",
  },
  categoryText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  categoryTextSelected: {
    color: "#fff",
  },
  fileButton: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  fileButtonText: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
  fileButtonIcon: {
    fontSize: 16,
  },
  fileInfo: {
    fontSize: 12,
    color: "#059669",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#8B5A3F",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
    fontStyle: "italic",
  },
});
