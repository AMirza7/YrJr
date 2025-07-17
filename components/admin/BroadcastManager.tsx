import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { UserRole } from "@/types";

interface BroadcastTarget {
  roles: UserRole[];
  regions: string[];
  lastSeenDays: number;
  subscriptionTiers: string[];
}

interface BroadcastMessage {
  title: string;
  content: string;
  ctaText?: string;
  ctaLink?: string;
  priority: "low" | "normal" | "high" | "urgent";
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
  };
}

interface BroadcastManagerProps {
  onSendBroadcast: (message: BroadcastMessage, target: BroadcastTarget) => void;
}

export default function BroadcastManager({
  onSendBroadcast,
}: BroadcastManagerProps) {
  const [message, setMessage] = useState<BroadcastMessage>({
    title: "",
    content: "",
    ctaText: "",
    ctaLink: "",
    priority: "normal",
    channels: {
      inApp: true,
      email: false,
      push: false,
    },
  });

  const [target, setTarget] = useState<BroadcastTarget>({
    roles: [],
    regions: [],
    lastSeenDays: 30,
    subscriptionTiers: [],
  });

  const [showPreview, setShowPreview] = useState(false);

  const availableRoles: UserRole[] = [
    "lawyer",
    "junior_lawyer",
    "lawyer_assistant",
    "law_office_helper",
    "law_student",
    "admin",
  ];

  const availableRegions = [
    "Delhi NCR",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Other Cities",
  ];

  const subscriptionTiers = ["free", "pro", "premium"];

  const priorityColors = {
    low: "#10b981",
    normal: "#3b82f6",
    high: "#f59e0b",
    urgent: "#ef4444",
  };

  const getRoleName = (role: UserRole) => {
    const names: Record<UserRole, string> = {
      lawyer: "Senior Lawyer",
      junior_lawyer: "Junior Lawyer",
      lawyer_assistant: "Assistant",
      law_office_helper: "Office Helper",
      law_student: "Law Student",
      admin: "Administrator",
    };
    return names[role];
  };

  const toggleRole = (role: UserRole) => {
    setTarget((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const toggleRegion = (region: string) => {
    setTarget((prev) => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter((r) => r !== region)
        : [...prev.regions, region],
    }));
  };

  const toggleSubscriptionTier = (tier: string) => {
    setTarget((prev) => ({
      ...prev,
      subscriptionTiers: prev.subscriptionTiers.includes(tier)
        ? prev.subscriptionTiers.filter((t) => t !== tier)
        : [...prev.subscriptionTiers, tier],
    }));
  };

  const getEstimatedReach = () => {
    // Mock calculation based on filters
    let baseUsers = 1247;

    if (target.roles.length > 0) {
      baseUsers = Math.floor(baseUsers * 0.7); // Reduce by role filtering
    }

    if (target.regions.length > 0) {
      baseUsers = Math.floor(baseUsers * 0.6); // Reduce by region filtering
    }

    if (target.subscriptionTiers.length > 0) {
      baseUsers = Math.floor(baseUsers * 0.8); // Reduce by subscription filtering
    }

    if (target.lastSeenDays < 30) {
      baseUsers = Math.floor(baseUsers * 0.9); // Recent users only
    }

    return Math.max(1, baseUsers);
  };

  const validateMessage = () => {
    if (!message.title.trim()) {
      Alert.alert("Error", "Please enter a message title");
      return false;
    }

    if (!message.content.trim()) {
      Alert.alert("Error", "Please enter message content");
      return false;
    }

    if (
      !message.channels.inApp &&
      !message.channels.email &&
      !message.channels.push
    ) {
      Alert.alert("Error", "Please select at least one delivery channel");
      return false;
    }

    return true;
  };

  const handleSendBroadcast = () => {
    if (!validateMessage()) return;

    const estimatedReach = getEstimatedReach();

    Alert.alert(
      "Send Broadcast",
      `Send this message to approximately ${estimatedReach} users?\n\nThis action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          style: "default",
          onPress: () => {
            onSendBroadcast(message, target);
            Alert.alert("Success", "Broadcast message sent successfully!");
            // Reset form
            setMessage({
              title: "",
              content: "",
              ctaText: "",
              ctaLink: "",
              priority: "normal",
              channels: { inApp: true, email: false, push: false },
            });
            setTarget({
              roles: [],
              regions: [],
              lastSeenDays: 30,
              subscriptionTiers: [],
            });
          },
        },
      ],
    );
  };

  const MessagePreview = () => (
    <View style={styles.previewContainer}>
      <Text style={styles.previewTitle}>📱 Message Preview</Text>

      <View
        style={[
          styles.previewCard,
          { borderLeftColor: priorityColors[message.priority] },
        ]}
      >
        <View style={styles.previewHeader}>
          <Text style={styles.previewMessageTitle}>
            {message.title || "Message Title"}
          </Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: priorityColors[message.priority] + "20" },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                { color: priorityColors[message.priority] },
              ]}
            >
              {message.priority.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.previewContent}>
          {message.content || "Message content will appear here..."}
        </Text>

        {message.ctaText && (
          <TouchableOpacity
            style={[
              styles.previewCTA,
              { backgroundColor: priorityColors[message.priority] },
            ]}
          >
            <Text style={styles.previewCTAText}>{message.ctaText}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.previewChannels}>
          {message.channels.inApp && (
            <Text style={styles.channelBadge}>📱 In-App</Text>
          )}
          {message.channels.email && (
            <Text style={styles.channelBadge}>📧 Email</Text>
          )}
          {message.channels.push && (
            <Text style={styles.channelBadge}>🔔 Push</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>📢 Broadcast Manager</Text>
        <Text style={styles.subtitle}>
          Send messages to targeted user groups
        </Text>
      </View>

      {/* Message Composition */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✍️ Compose Message</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Message Title *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter message title"
            value={message.title}
            onChangeText={(text) =>
              setMessage((prev) => ({ ...prev, title: text }))
            }
            maxLength={100}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Message Content *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Enter your message content..."
            value={message.content}
            onChangeText={(text) =>
              setMessage((prev) => ({ ...prev, content: text }))
            }
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {message.content.length}/500 characters
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Call-to-Action Button (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 'Learn More', 'Get Started'"
            value={message.ctaText}
            onChangeText={(text) =>
              setMessage((prev) => ({ ...prev, ctaText: text }))
            }
            maxLength={30}
          />
        </View>

        {message.ctaText && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>CTA Link</Text>
            <TextInput
              style={styles.textInput}
              placeholder="https://example.com or /app-route"
              value={message.ctaLink}
              onChangeText={(text) =>
                setMessage((prev) => ({ ...prev, ctaLink: text }))
              }
            />
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Priority Level</Text>
          <View style={styles.priorityOptions}>
            {(["low", "normal", "high", "urgent"] as const).map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityOption,
                  message.priority === priority &&
                    styles.priorityOptionSelected,
                  { borderColor: priorityColors[priority] },
                ]}
                onPress={() => setMessage((prev) => ({ ...prev, priority }))}
              >
                <Text
                  style={[
                    styles.priorityOptionText,
                    message.priority === priority && {
                      color: priorityColors[priority],
                    },
                  ]}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Delivery Channels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📡 Delivery Channels</Text>

        <View style={styles.channelOption}>
          <View style={styles.channelInfo}>
            <Text style={styles.channelName}>📱 In-App Notification</Text>
            <Text style={styles.channelDescription}>
              Show in app notification center
            </Text>
          </View>
          <Switch
            value={message.channels.inApp}
            onValueChange={(value) =>
              setMessage((prev) => ({
                ...prev,
                channels: { ...prev.channels, inApp: value },
              }))
            }
          />
        </View>

        <View style={styles.channelOption}>
          <View style={styles.channelInfo}>
            <Text style={styles.channelName}>📧 Email</Text>
            <Text style={styles.channelDescription}>
              Send via email to user's registered address
            </Text>
          </View>
          <Switch
            value={message.channels.email}
            onValueChange={(value) =>
              setMessage((prev) => ({
                ...prev,
                channels: { ...prev.channels, email: value },
              }))
            }
          />
        </View>

        <View style={styles.channelOption}>
          <View style={styles.channelInfo}>
            <Text style={styles.channelName}>🔔 Push Notification</Text>
            <Text style={styles.channelDescription}>
              Send push notification to mobile devices
            </Text>
          </View>
          <Switch
            value={message.channels.push}
            onValueChange={(value) =>
              setMessage((prev) => ({
                ...prev,
                channels: { ...prev.channels, push: value },
              }))
            }
          />
        </View>
      </View>

      {/* Target Audience */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Target Audience</Text>

        <View style={styles.targetGroup}>
          <Text style={styles.targetLabel}>
            User Roles (Leave empty for all)
          </Text>
          <View style={styles.checkboxGroup}>
            {availableRoles.map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.checkbox,
                  target.roles.includes(role) && styles.checkboxSelected,
                ]}
                onPress={() => toggleRole(role)}
              >
                <Text style={styles.checkboxText}>
                  {target.roles.includes(role) ? "☑️" : "☐"} {getRoleName(role)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.targetGroup}>
          <Text style={styles.targetLabel}>
            Geographic Regions (Leave empty for all)
          </Text>
          <View style={styles.checkboxGroup}>
            {availableRegions.map((region) => (
              <TouchableOpacity
                key={region}
                style={[
                  styles.checkbox,
                  target.regions.includes(region) && styles.checkboxSelected,
                ]}
                onPress={() => toggleRegion(region)}
              >
                <Text style={styles.checkboxText}>
                  {target.regions.includes(region) ? "☑️" : "☐"} {region}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.targetGroup}>
          <Text style={styles.targetLabel}>
            Subscription Tiers (Leave empty for all)
          </Text>
          <View style={styles.checkboxGroup}>
            {subscriptionTiers.map((tier) => (
              <TouchableOpacity
                key={tier}
                style={[
                  styles.checkbox,
                  target.subscriptionTiers.includes(tier) &&
                    styles.checkboxSelected,
                ]}
                onPress={() => toggleSubscriptionTier(tier)}
              >
                <Text style={styles.checkboxText}>
                  {target.subscriptionTiers.includes(tier) ? "☑️" : "☐"}{" "}
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.targetGroup}>
          <Text style={styles.targetLabel}>Last Seen Within</Text>
          <View style={styles.lastSeenOptions}>
            {[7, 30, 90, 365].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.lastSeenOption,
                  target.lastSeenDays === days && styles.lastSeenOptionSelected,
                ]}
                onPress={() =>
                  setTarget((prev) => ({ ...prev, lastSeenDays: days }))
                }
              >
                <Text
                  style={[
                    styles.lastSeenOptionText,
                    target.lastSeenDays === days &&
                      styles.lastSeenOptionTextSelected,
                  ]}
                >
                  {days} days
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Estimated Reach */}
      <View style={styles.reachContainer}>
        <Text style={styles.reachTitle}>📊 Estimated Reach</Text>
        <Text style={styles.reachCount}>
          ~{getEstimatedReach().toLocaleString()} users
        </Text>
        <Text style={styles.reachDescription}>
          Based on your targeting criteria
        </Text>
      </View>

      {/* Preview */}
      <MessagePreview />

      {/* Send Button */}
      <View style={styles.sendContainer}>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => setShowPreview(!showPreview)}
        >
          <Text style={styles.previewButtonText}>
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendBroadcast}
        >
          <Text style={styles.sendButtonText}>📢 Send Broadcast</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "right",
    marginTop: 4,
  },
  priorityOptions: {
    flexDirection: "row",
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
  },
  priorityOptionSelected: {
    backgroundColor: "#f0f9ff",
  },
  priorityOptionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  channelOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 2,
  },
  channelDescription: {
    fontSize: 12,
    color: "#64748b",
  },
  targetGroup: {
    marginBottom: 16,
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  checkboxGroup: {
    gap: 8,
  },
  checkbox: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  checkboxSelected: {
    backgroundColor: "#f0f9ff",
  },
  checkboxText: {
    fontSize: 14,
    color: "#64748b",
  },
  lastSeenOptions: {
    flexDirection: "row",
    gap: 8,
  },
  lastSeenOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  lastSeenOptionSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  lastSeenOptionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  lastSeenOptionTextSelected: {
    color: "#fff",
  },
  reachContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reachTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  reachCount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#3b82f6",
    marginBottom: 4,
  },
  reachDescription: {
    fontSize: 12,
    color: "#64748b",
  },
  previewContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  previewMessageTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "700",
  },
  previewContent: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 12,
  },
  previewCTA: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  previewCTAText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  previewChannels: {
    flexDirection: "row",
    gap: 8,
  },
  channelBadge: {
    fontSize: 10,
    color: "#64748b",
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sendContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  previewButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  previewButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
  sendButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
