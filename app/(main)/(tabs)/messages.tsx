import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function MessagesScreen() {
  const messages = [
    {
      id: 1,
      name: "Advocate Sharma",
      preview: "Court hearing scheduled for next week",
      time: "2h ago",
      unread: true,
    },
    {
      id: 2,
      name: "Legal Clerk",
      preview: "Documents have been filed successfully",
      time: "1d ago",
      unread: false,
    },
    {
      id: 3,
      name: "Court Registry",
      preview: "Please submit additional evidence",
      time: "3d ago",
      unread: false,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💬 Messages</Text>
        <Text style={styles.subtitle}>Stay connected with your legal team</Text>
      </View>

      <View style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageCard, message.unread && styles.unreadCard]}
          >
            <View style={styles.messageHeader}>
              <Text style={styles.messageName}>{message.name}</Text>
              <Text style={styles.messageTime}>{message.time}</Text>
            </View>
            <Text style={styles.messagePreview}>{message.preview}</Text>
            {message.unread && <View style={styles.unreadIndicator} />}
          </View>
        ))}
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
    paddingTop: 60,
    backgroundColor: "#1e40af",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#dbeafe",
  },
  messagesContainer: {
    padding: 20,
  },
  messageCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  messageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  messageTime: {
    fontSize: 12,
    color: "#6b7280",
  },
  messagePreview: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  unreadIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
});
